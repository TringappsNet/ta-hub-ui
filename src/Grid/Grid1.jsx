import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { useDispatch } from 'react-redux';
import { setUsers } from '../GlobalRedux/Features/usersSlice';
import { setClients } from '../GlobalRedux/Features/clientsSlice';

import { setCandidates } from '../GlobalRedux/Features/candidatesSlice';

import { updateUser, deleteUser,addNewUser } from '../GlobalRedux/Features/usersSlice';
import { updateCandidate, deleteCandidate,addNewCandidate } from '../GlobalRedux/Features/candidatesSlice';
import { updateClient, deleteClient,addNewClient } from '../GlobalRedux/Features/clientsSlice';
import { updateUserOnServer, deleteUserOnServer } from '../GlobalRedux/Features/usersSlice';
import { updateCandidateOnServer, deleteCandidateOnServer } from '../GlobalRedux/Features/candidatesSlice';
import { updateClientOnServer, deleteClientOnServer } from '../GlobalRedux/Features/clientsSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



import '../styles/Grid1.css';

import ConfirmDialog from '../Grid/ConfirmationDialog';


    async function fetchDataFromAPI(apiEndpoint) {
        try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
    
        const rowsWithIds = data.map((row, index) => ({
            ...row,
            id: index + 1,
        }));
    
        return rowsWithIds;
        } catch (error) {
        console.error('Error fetching data:', error);
        return [];
        }
    }
    function EditToolbar(props) {
        
        const { setRows, apiEndpoint } = props;
        const dispatch = useDispatch();

        const handleClick = async () => {
            const id = randomId();
            const newEmptyRow = { id, name: '', age: '', isNew: true };
    
            try {
                // Update local state
                setRows((oldRows) => [...oldRows, newEmptyRow]);
    
                // Dispatch action to add new row to Redux store
                if (apiEndpoint === 'http://localhost:8090/api/users/') {
                    dispatch(addNewUser(newEmptyRow));
                } else if (apiEndpoint === 'http://localhost:8090/api/candidates/') {
                    dispatch(addNewCandidate(newEmptyRow));
                } else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
                    dispatch(addNewClient(newEmptyRow));
                }
    
                // Add new row to the server
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEmptyRow),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to add new record on the server');
                }
    
                console.log('New record added successfully');
            } catch (error) {
                console.error('Error adding new record:', error);
                // Handle error, if needed
            }
        };
    
        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add record
                </Button>
            </GridToolbarContainer>
        );
    }
    
    export default function FullFeaturedCrudGrid(props) {
        // eslint-disable-next-line react/prop-types
        const { apiEndpoint } = props;
        const [rows, setRows] = useState([]);
        const [rowModesModel, setRowModesModel] = useState({});
        const [deleteId, setDeleteId] = useState(null);
        const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
        const dispatch = useDispatch();
    
        const [snackbarOpen, setSnackbarOpen] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState('');
        const [snackbarSeverity, setSnackbarSeverity] = useState('success');
        
        const handleOpenSnackbar = (message, severity) => {
            setSnackbarMessage(message);
            setSnackbarSeverity(severity);
            setSnackbarOpen(true);
        };
        

    useEffect(() => {
        async function fetchData() {
            const data = await fetchDataFromAPI(apiEndpoint);
            if (apiEndpoint === 'http://localhost:8090/api/users/') {
                dispatch(setUsers(data));
                
                console.log("datas",data);
            } else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
                dispatch(setClients(data));
            } else if (apiEndpoint === 'http://localhost:8090/api/candidates/') {
                dispatch(setCandidates(data));
            }
            setRows(data);
        }

        fetchData();

    }, [dispatch, apiEndpoint]);


   
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    
      
      
    };

    const handleDeleteClick = (id) => () => {
        setDeleteId(id);
        setOpenConfirmDialog(true);
    };


    const handleConfirmDelete = async () => {
        try {
            const rowData = rows.find(row => row.id === deleteId);
            if (!rowData) {
                console.error('Row data not found for ID:', deleteId);
                return;
            }
    
            if (apiEndpoint === 'http://localhost:8090/api/users/') {
                const userId = rowData.userId;
                dispatch(deleteUserOnServer(userId));
                dispatch(deleteUser(userId));
                handleOpenSnackbar('Record deleted successfully!', 'success');

            } else if (apiEndpoint === 'http://localhost:8090/api/candidates/') {
                const candidateId = rowData.candidateId;
                dispatch(deleteCandidateOnServer(candidateId));
                dispatch(deleteCandidate(candidateId));
                handleOpenSnackbar('Record deleted successfully!', 'success');

            } else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
                const clientId = rowData.clientId;
                dispatch(deleteClientOnServer(clientId));
                dispatch(deleteClient(clientId));
                handleOpenSnackbar('Record deleted successfully!', 'success');

            }
    
            // Remove the deleted row from the local state
            setRows(rows.filter(row => row.id !== deleteId));
        } catch (error) {
            console.error('Error deleting record:', error);
          handleOpenSnackbar('Error deleting record. Please try again.', 'error');

        }
        setOpenConfirmDialog(false);
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

    const handleCloseDialog = () => {
        setOpenConfirmDialog(false);
    };


    const processRowUpdate = (rowUpdate, row) => {
        const newRow = { ...row, ...rowUpdate };
            if (apiEndpoint === 'http://localhost:8090/api/users/') {
            dispatch(updateUser(newRow));

            dispatch(updateUserOnServer(newRow));
            handleOpenSnackbar('Record Updated successfully!', 'success');

            console.log("User updated successfully:", newRow);
        } else if (apiEndpoint === 'http://localhost:8090/api/candidates/') {
            console.log("newcandiaterow",newRow);
   
        dispatch(updateCandidate(newRow));
            dispatch(updateCandidateOnServer(newRow));
            handleOpenSnackbar('Record Updated successfully!', 'success');

            console.log("Candidate updated successfully:", newRow);
        } else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
            dispatch(updateClient(newRow));
            dispatch(updateClientOnServer(newRow));
            handleOpenSnackbar('Record Updated successfully!', 'success');

            console.log("Client updated successfully:", newRow);
        }
    
        return newRow;
    };
    
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    let columns= [];

    if (apiEndpoint === 'http://localhost:8090/api/users/') {
        columns = [
        { field: 'userId', headerName: 'User ID', width:100, editable: true , headerAlign: 'center', align:'center'} ,
        { field: 'firstName', headerName: 'First Name', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'lastName', headerName: 'Last Name', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'username', headerName: 'Username', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'email', headerName: 'Email', width: 140, editable: true, headerAlign: 'center', align:'center' },
        { field: 'phone', headerName: 'Phone', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'resetToken', headerName: 'Reset Token', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'password', headerName: 'Password', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'isActive', headerName: 'Active', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'currentSessionId', headerName: 'Current Session ID', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'lastLoginTime', headerName: 'Last Login Time', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'createdDate', headerName: 'Created Date', width: 200, editable: true, headerAlign: 'center', align:'center' },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
             headerAlign: 'center', 
             align:'center',
          
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
        { field: 'candidateId', headerName: 'CandidateId', width: 100, editable: true, headerAlign: 'center', align:'center'},
        { field: 'candidateName', headerName: 'CandidateName', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'candidateEmail', headerName: 'CandidateEmail', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'candidateContact', headerName: 'CandidateContact', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'technology', headerName: 'Technology', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'totalExperience', headerName: 'TotalExperience', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'currentCtc', headerName: 'CurrentCtc', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'expectedCtc', headerName: 'ExpectedCtc', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'noticePeriod', headerName: 'NoticePeriod', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'modeOfWork', headerName: 'ModeOfWork', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'currentLocation', headerName: 'CurrentLocation', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'candidateStatus', headerName: 'CandidateStatus', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'comments', headerName: 'Comments', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'remarks', headerName: 'Remarks', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'recruiter', headerName: 'Recruiter', width: 100, editable: true, headerAlign: 'center', align:'center' },
        { field: 'recruitedSource', headerName: 'RecruitedSource', width: 100, editable: true , headerAlign: 'center', align:'center'},
        { field: 'createdDate', headerName: 'CreatedDate', width: 100, editable: true , headerAlign: 'center', align:'center'},
        {
             headerAlign: 'center', align:'center',
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            position:'sticky',
            right:0,
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
        { field: 'clientId', align:'center', headerName: 'clientId', width: 100, editable: true,    headerAlign: 'center',
 },
        { field: 'clientName', align:'center',headerName: 'clientName', width: 100, editable: true ,    headerAlign: 'center',
    },
        { field: 'clientSpocName', align:'center',headerName: 'clientSpocName', width: 100, editable: true,    headerAlign: 'center',
    },
        { field: 'clientSpocContact', align:'center',headerName: 'clientSpocContact', width: 100, editable: true ,    headerAlign: 'center',
    },
        { field: 'clientLocation', align:'center',headerName: 'clientLocation', width: 100, editable: true,    headerAlign: 'center',
    },
        { field: 'createdAt', align:'center',headerName: 'createdAt', width: 100, editable: true,    headerAlign: 'center',
    },
        {
            headerAlign: 'center',
             align:'center',
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            position:'relative',
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
            
            <Box
            

            
            sx={{
                boxShadow: 2,
              
                
                height: 600,
                width: '94%',
                paddingLeft:10,
                marginTop:5,
                background:'none',
                "& .MuiDataGrid-row--editing .MuiDataGrid-cell": {
                    // border: "none",
                    height: 39,
                    // border:"1px solid black",

                  },
                  
                lineHeight:2,
                '& .actions': {
                    color: 'text.secondary',
                    position: 'sticky',
                    right: 0,
                    background: 'white',
                    zIndex: 1,
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                '& .MuiDataGrid-scrollbar': {
                    '&::-webkit-scrollbar': {
                        width: '5px',
                        height: '2px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                    },
                },
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

             <ConfirmDialog
                open={openConfirmDialog}
                setOpen={setOpenConfirmDialog} 

                onConfirm={handleConfirmDelete}
                onClose={handleCloseDialog}
                deleteId={deleteId}
            />
            <DataGrid
                rowHeight={35}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                // pinnedColumns={pinnedColumns}
                components={{
                    Toolbar: EditToolbar,
                }}
            />
        </Box>
    );
    }
