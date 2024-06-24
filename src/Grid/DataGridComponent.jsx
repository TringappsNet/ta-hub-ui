"use client";
import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
  GridActionsCellItem,
  GridEventListener,
  
} from '@mui/x-data-grid';

import EditToolbar from './EditToolbar';
// import { useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
// import { setRows } from '../GlobalRedux/Features/dataSlice';
import fetchDataFromAPI from './fetchApi';
interface DataGridComponentProps {
  apiEndpoint: string;
}

const DataGridComponent: React.FC<DataGridComponentProps> = (props) => {
//   const dispatch = useDispatch();
  const { apiEndpoint } = props;
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromAPI(apiEndpoint);
      setRows(data);
    }
    fetchData();
  }, [apiEndpoint]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  let columns: GridColDef[] = [];
  if (apiEndpoint === 'http://localhost:8090/api/users/') {
    columns = [
      { field: 'userId', headerName: 'User ID', width: 180, editable: true },
      { field: 'firstName', headerName: 'First Name', width: 180, editable: true },
      { field: 'lastName', headerName: 'Last Name', width: 180, editable: true },
      { field: 'username', headerName: 'Username', width: 180, editable: true },
      { field: 'email', headerName: 'Email', width: 180, editable: true },
      { field: 'phone', headerName: 'Phone', width: 180, editable: true },
      { field: 'resetToken', headerName: 'Reset Token', width: 180, editable: true },
      { field: 'password', headerName: 'Password', width: 180, editable: true },
      { field: 'isActive', headerName: 'Active', width: 180, editable: true },
      { field: 'currentSessionId', headerName: 'Current Session ID', width: 180, editable: true },
      { field: 'lastLoginTime', headerName: 'Last Login Time', width: 180, editable: true },
      { field: 'createdDate', headerName: 'Created Date', width: 180, editable: true },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="first"
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="second"
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          } else {
            return [
              <GridActionsCellItem
                key="third"
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                key="fourth"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          }
        },
      },
    ];
  }  else if (apiEndpoint === 'http://localhost:8090/api/candidates/') {
    columns = [
      { field: 'candidateId', headerName: 'CandidateId', width: 180, editable: true },
      { field: 'candidateName', headerName: 'CandidateName', width: 180, editable: true },
      { field: 'candidateEmail', headerName: 'CandidateEmail', width: 180, editable: true },
      { field: 'candidateContact', headerName: 'CandidateContact', width: 180, editable: true },
      { field: 'technology', headerName: 'Technology', width: 180, editable: true },
      { field: 'totalExperience', headerName: 'TotalExperience', width: 180, editable: true },
      { field: 'currentCtc', headerName: 'CurrentCtc', width: 180, editable: true },
      { field: 'expectedCtc', headerName: 'ExpectedCtc', width: 180, editable: true },
      { field: 'noticePeriod', headerName: 'NoticePeriod', width: 180, editable: true },
      { field: 'modeOfWork', headerName: 'ModeOfWork', width: 180, editable: true },
      { field: 'currentLocation', headerName: 'CurrentLocation', width: 180, editable: true },
      { field: 'candidateStatus', headerName: 'CandidateStatus', width: 180, editable: true },
      { field: 'comments', headerName: 'Comments', width: 180, editable: true },
      { field: 'remarks', headerName: 'Remarks', width: 180, editable: true },
      { field: 'recruiter', headerName: 'Recruiter', width: 180, editable: true },
      { field: 'recruitedSource', headerName: 'RecruitedSource', width: 180, editable: true },
      { field: 'createdDate', headerName: 'CreatedDate', width: 180, editable: true },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="first"
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="second"
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          } else {
            return [
              <GridActionsCellItem
                key="third"
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                key="fourth"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          }
        },
      },
    ];
  } 
  else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
    columns = [
      { field: 'clientId', headerName: 'clientId', width: 180, editable: true },
      { field: 'clientName', headerName: 'clientName', width: 180, editable: true },
      { field: 'clientSpocName', headerName: 'clientSpocName', width: 180, editable: true },
      { field: 'clientSpocContact', headerName: 'clientSpocContact', width: 180, editable: true },
      { field: 'clientLocation', headerName: 'clientLocation', width: 180, editable: true },
      { field: 'createdAt', headerName: 'createdAt', width: 180, editable: true },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
         
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="first"
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="second"
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          } else {
            return [
              <GridActionsCellItem
                key="third"
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                key="fourth"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          }
        },
      },
    ];
  } 


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
            Toolbar: () => (
              <EditToolbar
                setRows={setRows}
                setRowModesModel={setRowModesModel}
                
              />
            ),
          }}
        />
    </div>
  );
};

export default DataGridComponent;