'use client';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/Dnd.css";

import ConfirmDialog from "../Grid/ConfirmationDialog";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tasks/');
        if (response.ok) {
          const data = await response.json();
          setRows(data);
          console.log("Rows", data);
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    console.log("Edit clicked");
  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log("Save clicked");

    const updatedRow = rows.find(row => row.taskId === id);
    
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/task/${id}`, {
        method: 'PUT', // Using PUT for update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRow),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setRows(rows.map(row => (row.taskId === id ? updatedTask : row)));
        handleOpenSnackbar('Record updated successfully!', 'success');
      } else {
        console.error('Failed to update task:', response.statusText);
        handleOpenSnackbar('Failed to update record!', 'error');
      }
    } catch (error) {
      console.error('An error occurred while updating task:', error);
      handleOpenSnackbar('An error occurred while updating record!', 'error');
    }
  };

  const handleDeleteClick = (id) => () => {
    setDeleteId(id);
    setOpenConfirmDialog(true);
    console.log("Delete clicked");
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/task/${deleteId}`, { method: 'DELETE' });
      if (response.ok) {
        setRows(rows.filter((row) => row.taskId !== deleteId));
        handleOpenSnackbar('Record deleted successfully!', 'success');
      } else {
        console.error('Failed to delete task:', response.statusText);
        handleOpenSnackbar('Failed to delete record!', 'error');
      }
    } catch (error) {
      console.error('An error occurred while deleting task:', error);
      handleOpenSnackbar('An error occurred while deleting record!', 'error');
    }
    setOpenConfirmDialog(false);
    setDeleteId(null);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const columns = [
    { field: 'taskId', headerName: 'TaskId', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'jobId', headerName: 'JobId', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'jobTitle', headerName: 'JobTitle', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'roleType', headerName: 'RoleType', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'modeOfWork', headerName: 'ModeOfWork', width: 140, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'workLocation', headerName: 'WorkLocation', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'clientBudget', headerName: 'ClientBudget', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'assignedBudget', headerName: 'AssignedBudget', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'primaryAssignee', headerName: 'PrimaryAssignee', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'taskStatus', headerName: 'TaskStatus', width: 100, editable: true, headerAlign: 'center', align: 'center', cellClassName: 'super-app-theme--cell' },
    { field: 'secondaryAssignee', headerName: 'SecondaryAssignee', width: 100, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'backlogs', headerName: 'Backlogs', width: 200, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'description', headerName: 'Description', width: 200, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'createdAt', headerName: 'CreatedAt', width: 200, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'lastUpdated', headerName: 'LastUpdated', width: 200, editable: true, headerAlign: 'center', align: 'center' },
    {
      headerAlign: 'center',
      align: 'center',
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      position: 'relative',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
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
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key="delete"
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

  const processRowUpdate = (rowUpdate, row) => {
    const newRow = { ...row, ...rowUpdate };
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box
      sx={{
        height: 700,
        width: '94%',
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom:10,
      
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <DataGrid
        rowHeight={35}
        checkboxSelection
        disableRowSelectionOnClick
        rows={rows}
        columns={columns}
        getRowId={(r) => r.taskId}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        content="Are you sure you want to delete this record?"
      />
    </Box>
  );
};

export default List;
