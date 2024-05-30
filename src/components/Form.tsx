"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/Form.css';
import { FaTimes } from 'react-icons/fa'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitForm } from '../GlobalRedux/Features/formSlice';
import SimplePopup from './popUp';
import { Select, MenuItem, Button, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRowId, GridRowModel, GridRowEditStopReasons, GridRowModesModel, GridRowModes } from '@mui/x-data-grid';
import CustomSnackbar from "../components/CustomSnackbar";
import { Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';




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

function Form() {      
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [reqStartDate, setReqStartDate] = useState<Date | null>(null);
    const [projectStartDate, setProjectStartDate] = useState('');
    const [primarySkill, setPrimarySkill] = useState('');
    const [secondarySkill, setSecondarySkill] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [clientName, setClientName] = useState('');
    const [clientSpocName, setClientSpocName] = useState('');
    const [clientSpocContact, setClientSpocContact] = useState('');
    const [accountManager, setAccountManager] = useState('');
    const [accountManagerEmail, setAccountManagerEmail] = useState('');
    const [salaryBudget, setSalaryBudget] = useState('');
    const [modeOfInterviews, setModeOfInterviews] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [yearsOfExperienceRequired, setYearsOfExperienceRequired] = useState('');
    const [noOfOpenings, setNoOfOpenings] = useState<number>(0);
    const [positions, setPositions] = useState<Position[]>([]);
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [errors, setErrors] = useState({
        clientName: '',
        clientSpocName: '',
        reqStartDate: '',
        clientSpocContact: '',
        accountManager: '',
        accountManagerEmail: '',
        salaryBudget: '',
        modeOfInterviews: '',
        startDate: '',
        projectStartDate: '',
        approvedBy: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState('success');
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        const totalOpenings = positions.reduce((sum, position) => sum + parseInt(position.noOfOpenings, 10), 0);
        setNoOfOpenings(totalOpenings);
      }, [positions]);
      

      const submitFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormSubmitted(true); 
     if (
        !clientName ||
        !clientSpocName ||
        !reqStartDate ||
        !clientSpocContact ||
        !accountManager ||
        !accountManagerEmail ||
        !salaryBudget ||
        !modeOfInterviews ||
        !projectStartDate ||
        !approvedBy ||
        !noOfOpenings
    ) {
        setSnackbarOpen(true);
        setSnackbarMessage("Please fill all fields!");
        setSnackbarVariant("error");
        return;
    }
    
        const formData = [{
            requirementStartDate: reqStartDate?.toISOString(),
            clientName,
            clientSpocName,
            clientSpocContact,
            accountManager,
            accountManagerEmail,
            totalNoOfOpenings: positions.reduce((sum, position) => sum + parseInt(position.noOfOpenings, 10), 0),
            positions: positions.map((position) => ({
                jobTitle: position.jobTitle,
                noOfOpenings: position.noOfOpenings.toString(),
                roleType: position.roleType,
                modeOfWork: position.modeOfWork,
                workLocation: position.workLocation,
                yearsOfExperienceRequired: position.yearsOfExperienceRequired,
                primarySkillSet: position.primarySkillSet,
                secondarySkillSet: position.secondarySkillSet
            })),
            salaryBudget: parseFloat(salaryBudget as string),
            modeOfInterviews,
            tentativeStartDate: startDate?.toISOString(),
            tentativeDuration: projectStartDate,
            approvedBy,
        }];
        console.log("Form Data:", formData);
    
        try {
            const response = await fetch('http://localhost:8080/api/requirement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                console.log('Form data submitted successfully!');
                setSnackbarOpen(true);
                setSnackbarMessage("Form data submitted successfully!");
                setSnackbarVariant("success");
                setReqStartDate(null);
                setStartDate(null);
                setProjectStartDate('');
                setPrimarySkill('');
                setSecondarySkill('');
                setClientName('');
                setClientSpocName('');
                setClientSpocContact('');
                setAccountManager('');
                setAccountManagerEmail('');
                setSalaryBudget('');
                setModeOfInterviews('');
                setApprovedBy('');
                setYearsOfExperienceRequired('');
                setPositions([]);
                dispatch(submitForm(formData));

                setTimeout(() => {
                  setIsOpen(false);
                }, 3000);
    
                const approvalPayload = {
                    approvedBy,
                    clientName,
                    requirementStartDate: reqStartDate?.toISOString(),
                    positions: positions.map((position) => ({
                        jobTitle: position.jobTitle,
                        noOfOpenings: parseInt(position.noOfOpenings, 10)
                    }))
                };
    
                const emailResponse = await fetch('http://localhost:8080/api/job-approval', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(approvalPayload)
                });
    
                if (emailResponse.ok) {
                    console.log('Approval email sent successfully!');
                } else {
                    const errorData = await emailResponse.json();
                    console.error('Failed to send approval email.', errorData);
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to submit form data.', errorData);
            }
        } catch (error) {
            console.error('An error occurred while submitting form data:', error);
        }
    };
    

  const handleAddField = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleClose = () => {
    setIsOpen(false);
};
const handleAddPosition = () => {
  const newPosition: Position = {
      id: positions.length ? positions[positions.length - 1].id + 1 : 0,
      jobTitle: '',
      noOfOpenings: '',
      roleType: '',
      modeOfWork: '',
      workLocation: '',
      yearsOfExperienceRequired: '',
      primarySkillSet: '',
      secondarySkillSet: '',
  };
  setPositions([...positions, newPosition]);
  setRowModesModel((prevModel) => ({
      ...prevModel,
      [newPosition.id]: { mode: GridRowModes.Edit, fieldToFocus: 'jobTitle' },
  }));
};


  const handleSavePosition = (id: GridRowId) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View }
    }));
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
        sx={{ width: '100%' }}
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
    const isEmptyField = Object.values(newRow).some(value => value === '');

    if (isEmptyField) {
        setSnackbarOpen(true);
        setSnackbarMessage("Please fill all fields before saving.");
        setSnackbarVariant("error");
        return oldRow; 
    }

    const updatedPositions = positions.map((position) => {
        if (position.id === newRow.id) {
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
    { field: 'noOfOpenings', headerName: 'No. of Openings', width: 150, editable: true },
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
    { field: 'yearsOfExperienceRequired', headerName: 'Years of Experience', width: 150, editable: true },
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

    return (
        isOpen && (
            <div className='position'>
                <div className='container'>
                    <form className='form-req' onSubmit={submitFormHandler}>
                        <div className='header-form'>
                            <h3>Client Requirement Form</h3>
                            <FaTimes className="close-icon pl-2" onClick={handleClose} />
                        </div>
                        <div className="scrollable-area">
                            <div className='fields'>
                                <div className="form-group p-2">
                                    <label htmlFor="cname" className="form-label">Client Name</label>
                                    <input 
                                        type="text" 
                                        style={{ borderColor: (formSubmitted && clientName.trim() === '') ? 'red' : '' }} 
                                        className="input-box" 
                                        name="cname"  
                                        value={clientName} 
                                        onChange={(e) => setClientName(e.target.value)}  
                                    />
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="spocname" className="form-label">Client SPOC Name</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        name="spocname" 
                                        value={clientSpocName} 
                                        onChange={(e) => setClientSpocName(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group pt-3 p-2">
                                    <label htmlFor="date" className="form-label">Requirement Start Date</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            selected={reqStartDate}
                                            onChange={(date) => setReqStartDate(date)}
                                            className="calender"
                                            name="date"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="contact" className="form-label">Client Contact Details</label>
                                    <input 
                                        type="number" 
                                        className="input-box" 
                                        name="contact" 
                                        value={clientSpocContact} 
                                        onChange={(e) => setClientSpocContact(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="manager" className="form-label">Account Manager Name</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        name="manager" value={accountManager} 
                                        onChange={(e) => setAccountManager(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="email" className="form-label">Account Manager E-mail</label>
                                    <input 
                                        type="email" 
                                        className="input-box" 
                                        name="email" 
                                        value={accountManagerEmail} 
                                        onChange={(e) => setAccountManagerEmail(e.target.value)} 
                                        aria-describedby="emailHelp" 
                                    />
                                </div>

                                <div className="form-group p-2 pb-0 mt-0 position-relative">
                                <label htmlFor="openings" className="form-label">No. of Openings</label>
                                <div className="input-container">
                                    <input
                                        type="number"
                                        className="input-box"
                                        name="openings"
                                        value={noOfOpenings}
                                        readOnly
                                        aria-describedby="emailHelp"
                                    />
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
                                        <a href="#" className="add-icon" onClick={(e) => { e.preventDefault(); handleAddField(); }}> Add/View Positions</a>
                                    </Tooltip>
                                </div>
                            </div>

                                {showPopup && (
                                <SimplePopup onClose={handleClosePopup}>
                                    <Button onClick={handleAddPosition}>Add Position</Button>
                                    <div style={{ height: '89%', width: '100%' }}>
                                    <DataGrid
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
                                <div className="form-group row p-2">
                                    <div className="col">
                                        <label htmlFor="buget" className="form-label">Salary Budget</label>
                                        <input 
                                            type="text" 
                                            className="input-box" 
                                            name='budget' 
                                            value={salaryBudget} 
                                            onChange={(e) => setSalaryBudget(e.target.value)} 
                                            aria-describedby="mobileHelp" 
                                        />
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="modeOfInterview" className="form-label">Mode of Interview</label>
                                            <select 
                                                className="input-box" 
                                                name="modeOfInterview" 
                                                value={modeOfInterviews} 
                                                onChange={(e) => setModeOfInterviews(e.target.value)}                                                                                            >
                                                <option value="">Select an option</option>
                                                <option value="option1">Offline</option>
                                                <option value="option2">Virtual</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group p-2" style={{ display: showPopup ? 'none' : 'block' }}>
                                <label htmlFor="proj-duration" className="form-label">Project Duration</label>
                                <div className="input-with-label">
                                    <input 
                                        type="number" 
                                        id='proj-duration'
                                        className="input-box-duration" 
                                        name="contact" 
                                        value={projectStartDate} 
                                        onChange={(e) => setProjectStartDate(e.target.value)} 
                                        min="1"
                                    />
                                    <span className="input-months">Months</span>
                                </div>
                            </div>

                            <div className="form-group p-2 mb-2" style={{ display: showPopup ? 'none' : 'block' }}>
                                <label htmlFor="email" className="form-label">Approval Request</label>
                                <input 
                                    type="email" 
                                    className="input-box-request" 
                                    name="email" 
                                    value={approvedBy} 
                                    onChange={(e) => setApprovedBy(e.target.value)} 
                                />
                            </div>
                            </div>
                        </div>
                        <div className='footer'>
                            <button type="submit" className="btn-save">Submit</button>
                        </div>
                    </form>
                </div>
                <CustomSnackbar
                    message={snackbarMessage}
                    variant={snackbarVariant}
                    onClose={handleCloseSnackbar}
                    open={snackbarOpen}
                />
            </div>
        )
    );
}
export default Form;
