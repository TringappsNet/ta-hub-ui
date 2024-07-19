import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import '../styles/Form.css';
import { FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import SimplePopup from "./popUp";
import { Select, MenuItem, Button, IconButton } from "@mui/material";
import {DataGrid,GridColDef,GridRowId,GridRowModel,GridRowEditStopReasons,GridRowModesModel,GridRowModes,} from "@mui/x-data-grid";
import CustomSnackbar from "../components/CustomSnackbar";
import { Tooltip } from "@mui/material";
import {Delete as DeleteIcon,Edit as EditIcon,Save as SaveIcon,} from "@mui/icons-material";
import { AddCircleOutline as AddIcon } from "@mui/icons-material"; // Import AddCircleOutlineIcon
import { SelectChangeEvent } from "@mui/material";


// Interface for Position object
interface Position {
  id: number;
  jobTitle: string;
  noOfOpenings: string;
  roleType: string;
  modeOfWork: string;
  workLocation: string;
  yearsOfExperienceRequired: string;
  primarySkillSet: string;
  secondarySkillSet: string;
}

interface AddViewPositionProps {
    onClose: () => void; // Example of onClose prop
  }

const AddViewPosition: React.FC<AddViewPositionProps> = ({ onClose }) => {
  // State management
  const [positions, setPositions] = useState<Position[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [showPopup, setShowPopup] = useState(false);
  const [noOfOpenings, setNoOfOpenings] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState("");

  // Effect to update total openings when positions change
  useEffect(() => {
    const totalOpenings = positions.reduce(
      (sum, position) => sum + parseInt(position.noOfOpenings, 10),
      0
    );
    setNoOfOpenings(totalOpenings);
  }, [positions]);

  // Handlers
  const handleClosePositionsPopup = () => {
    setShowPopup(false);
  };

  const handleAddPosition = () => {
    const newPosition = {
      id: positions.length > 0 ? positions[positions.length - 1].id + 1 : 0,
      jobTitle: "",
      noOfOpenings: "",
      roleType: "",
      modeOfWork: "",
      workLocation: "",
      yearsOfExperienceRequired: "",
      primarySkillSet: "",
      secondarySkillSet: "",
    };

    setPositions([newPosition, ...positions]);
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [newPosition.id]: { mode: GridRowModes.Edit, fieldToFocus: "jobTitle" },
    }));
  };
  const handleSavePosition = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View }
    }));
  
    setPositions((prevPositions) => {
      const index = prevPositions.findIndex((position) => position.id === id);
      if (index === -1) return prevPositions;
  
      const updatedPositions = [...prevPositions];
      const [savedPosition] = updatedPositions.splice(index, 1);
      updatedPositions.push(savedPosition);
  
      return updatedPositions;
    });
  };
  
  
    const handleDeletePosition = (id: GridRowId) => () => {
      setPositions((prevPositions) => prevPositions.filter((pos) => pos.id !== id));
      setRowModesModel((prevModel) => {
        const newModel = { ...prevModel };
        delete newModel[id];
        return newModel;
      });
    };
  
    const roleTypeOptions = [
      { value: 'Full-Time', label: 'Full-Time' },
      { value: 'Part-Time', label: 'Part-Time' },
      { value: 'Contract', label: 'Contract' },
    ];
  
    const modeOfWorkOptions = [
      { value: 'Onsite', label: 'Onsite' },
      { value: 'Remote', label: 'Remote' },
      { value: 'Hybrid', label: 'Hybrid' },
    ];
  
    const DropdownEditCell = (props) => {
      const { id, field, value, api } = props;
      const handleChange = (event) => {
        api.setEditCellValue({ id, field, value: event.target.value });
      };
  
      const options = field === 'roleType' ? roleTypeOptions : modeOfWorkOptions;
  
      return (
        <Select
          value={value}
          onChange={handleChange}
          sx={{ width: '100%'}}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      );
    };
    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
      // Check if any field in the new row is empty
      const isEmptyField = Object.keys(newRow).some(key => {
        if (key === 'secondarySkillSet') {
          return false;
      }
        if (newRow[key] === '') {
            
            setSnackbarOpen(true);
            setSnackbarMessage(`Please fill ${key} before saving.`);
            setSnackbarVariant("error");
            return true; 
        }
       
        return false;
        
    });
      // Update the row in the positions state
      const updatedPositions = positions.map((position) => {
          if (position.id === newRow.id) {
              // Update only the fields that are not empty in the new row
              const updatedPosition = { ...position, ...newRow };
              return updatedPosition;
          } else {
              return position;
          }
      });
  
      setPositions(updatedPositions);
      return newRow;
  };
  
    const columns: GridColDef[] = [
      { field: 'jobTitle', headerName: 'Job Title', width: 150, editable: true },
      { field: 'noOfOpenings', headerName: 'No. of Openings', width: 150, editable: true, valueParser: (value) => (isNaN(value) || !Number.isInteger(Number(value)) ? null : Number(value)) },
      {
        field: 'roleType',
        headerName: 'Role Type',
        width: 150,
        editable: true,
        renderEditCell: (params) => <DropdownEditCell {...params} />,
      },
      {
        field: 'modeOfWork',
        headerName: 'Mode of Work',
        width: 150,
        editable: true,
        renderEditCell: (params) => <DropdownEditCell {...params} />,
      },
      { field: 'workLocation', headerName: 'Work Location', width: 150, editable: true },
      { field: 'yearsOfExperienceRequired', headerName: 'Years of Experience', width: 150, editable: true, valueParser: (value) => (isNaN(value) || !Number.isInteger(Number(value)) ? null : Number(value)) },
      { field: 'primarySkillSet', headerName: 'Primary Skill set', width: 150, editable: true },
      { field: 'secondarySkillSet', headerName: 'Secondary Skill set', width: 150, editable: true },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <>
            {rowModesModel[params.id]?.mode === GridRowModes.Edit ? (
              <IconButton onClick={handleSavePosition(params.id)} color="primary" size="small">
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setRowModesModel((prevModel) => ({
                    ...prevModel,
                    [params.id]: { mode: GridRowModes.Edit, fieldToFocus: 'jobTitle' },
                  }));
                }}
                color="primary"
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={handleDeletePosition(params.id)} color="secondary" size="small">
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ];

  return (
    <>
      <Tooltip
        title={
          <div>
            {positions.map((position, index) => (
              <div key={index}>
                {position.jobTitle}: {position.noOfOpenings} openings
              </div>
            ))}
            <div>Total: {noOfOpenings}</div>
          </div>
        }
        placement="right"
        arrow
      >
        <a
          href="#"
          className="add-icon"
          onClick={(e) => {
            e.preventDefault();
            setShowPopup(true);
          }}
        >
          {" "}
          Add/View Positions
        </a>
      </Tooltip>

      {showPopup && (
        <SimplePopup onClose={handleClosePositionsPopup}>
          <FaTimes
            className="close-icon"
            onClick={handleClosePositionsPopup}
            style={{
              marginLeft: "auto",
              marginRight: "-8px",
              marginTop: "-10",
              display: "flex",
              alignItems: "center",
            }}
          />
          <Button
            onClick={handleAddPosition}
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            Add Position
          </Button>
          <div style={{ height: "89%", width: "100%" }}>
            <DataGrid
              className="custom-data-grid"
              rows={positions}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowEditStop={(params: any, event: any) => {
                const editEvent = event as { reason: string };
                if (editEvent.reason === GridRowEditStopReasons.escapeKeyDown) {
                  setRowModesModel((prevModel: any) => ({
                    ...prevModel,
                    [params.id]: { mode: GridRowModes.View },
                  }));
                }
              }}
              processRowUpdate={processRowUpdate}
              onRowModesModelChange={setRowModesModel}
            />
          </div>
        </SimplePopup>
      )}

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        variant={snackbarVariant}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default AddViewPosition;