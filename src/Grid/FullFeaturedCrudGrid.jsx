import  { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {  GridToolbarContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { randomId } from '@mui/x-data-grid-generator';
import { TextField } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { setUsers } from '../GlobalRedux/Features/usersSlice';
import { setClients } from '../GlobalRedux/Features/clientsSlice';
import { setCandidates } from '../GlobalRedux/Features/candidatesSlice';
import { updateUser, deleteUser } from '../GlobalRedux/Features/usersSlice';
import { updateCandidate, deleteCandidate,handleCandidateAdd } from '../GlobalRedux/Features/candidatesSlice';
import { updateClient, deleteClient,handleClientAdd } from '../GlobalRedux/Features/clientsSlice';
import { updateUserOnServer, deleteUserOnServer } from '../GlobalRedux/Features/usersSlice';
import { updateCandidateOnServer, deleteCandidateOnServer } from '../GlobalRedux/Features/candidatesSlice';
import { updateClientOnServer, deleteClientOnServer } from '../GlobalRedux/Features/clientsSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ConfirmDialog from '../Grid/ConfirmationDialog';
import fetchDataFromAPI from '../Grid/FetchApi';
// import EditToolbar from "../Grid/EditToolbar";
import "../styles/FullFeaturedCrudGrid.css";

import { handleUserAdd } from '../GlobalRedux/Features/usersSlice';
function EditToolbar(props) {

    const { setRows, setRowModesModel } = props;
  
    const handleClick = () => {
        const id = randomId();
        const newEmptyRow = { id, name: '', age: '', roleId: 1, isNew: true };
        setRows((oldRows) => [...oldRows, newEmptyRow]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
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
        } else if (apiEndpoint === 'http://localhost:8090/api/clients/clientPositions') {
            dispatch(setClients(data));
        } else if (apiEndpoint === 'http://localhost:8090/api/candidates/status') {
            dispatch(setCandidates(data));
        }
        else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
            // dispatch(setCandidates(data));
            setRows(data);

        }
        setRows(data);
    }

    fetchData();

}, [dispatch, apiEndpoint]);

const [searchValue, setSearchValue] = useState('');

const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
};
const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchValue.toLowerCase())
    )
);

const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
    }
};

const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
};

const handleSaveClick = (id, rowData) => async () => {
    console.log('rowData:', rowData); 
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    if (rowData.isNew) {
        
        const updatedRowData = { ...rowData, isNew: false };
        await handleUserAdd(updatedRowData); 
    } else {
        await updateUserOnServer(rowData); 
    }
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

        } else if (apiEndpoint === 'http://localhost:8090/api/candidates/status') {
            const candidateId = rowData.candidateId;
            dispatch(deleteCandidateOnServer(candidateId));
            dispatch(deleteCandidate(candidateId));
            handleOpenSnackbar('Record deleted successfully!', 'success');

        } else if (apiEndpoint === 'http://localhost:8090/api/clients/clientPositions ' || apiEndpoint === 'http://localhost:8080/api/clients/' ) {
            const clientId = rowData.clientId;
            dispatch(deleteClientOnServer(clientId));
            dispatch(deleteClient(clientId));
            handleOpenSnackbar('Record deleted successfully!', 'success');

        }

        

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

const processRowUpdate = async (rowUpdate, row) => {
    const newRow = { ...row, ...rowUpdate };

    try {
        if (newRow.isNew) {
            // If it's a new row, add it based on the API endpoint
            if (apiEndpoint === 'http://localhost:8090/api/users/') {
                await handleUserAdd(newRow);
                handleOpenSnackbar('User Added successfully!', 'success');
            } else if (apiEndpoint === 'http://localhost:8090/api/candidates/status') {
                await handleCandidateAdd(newRow);
                handleOpenSnackbar('Candidate Added successfully!', 'success');
            } else if (apiEndpoint === 'http://localhost:8090/api/clients/clientPositions ' || apiEndpoint === 'http://localhost:8080/api/clients/' ) {
                await handleClientAdd(newRow);
                handleOpenSnackbar('Client Added successfully!', 'success');
            }
         
            newRow.isNew = false; // Set isNew to false after adding
        } else {
         
            if (apiEndpoint === 'http://localhost:8090/api/users/') {
                await updateUserOnServer(newRow);
                handleOpenSnackbar('User Updated successfully!', 'success');
            } else if (apiEndpoint === 'http://localhost:8090/api/candidates/status') {

                const response = await fetch(`http://localhost:8090/api/candidates/candidate/${newRow.candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRow),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update candidate on the server');
      }
  
                // await updateCandidateOnServer(newRow);
                // console.log("candidate row",newRow)
                handleOpenSnackbar('Candidate Updated successfully!', 'success');
            } else if (apiEndpoint === 'http://localhost:8090/api/clients/clientPositions') {
                const response = await fetch(`http://localhost:8090/api/clients/client/${newRow.clientId}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRow),
                  });
              
                  if (!response.ok) {
                    throw new Error('Failed to update client on the server');
                  }

                // await updateClientOnServer(newRow);
                handleOpenSnackbar('Client Updated successfully!', 'success');
            }
        }
    } catch (error) {
        console.error('Error processing record:', error);
        handleOpenSnackbar('Error processing record. Please try again.', 'error');
        return null;
    }

    return newRow;
};



const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
};

const handleAddClick = () => {
    const id = randomId();
    const newEmptyRow = { id, name: '', age: '', roleId: 1, isNew: true };
    setRows((oldRows) => [...oldRows, newEmptyRow]);
    setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
};


let columns= [];

if (apiEndpoint === 'http://localhost:8090/api/users/') {
    columns = [
        { field: 'userId', headerName: 'USER ID', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'firstName', headerName: 'FIRST NAME', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'lastName', headerName: 'LAST NAME', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'username', headerName: 'USERNAME', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'email', headerName: 'EMAIL', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'phone', headerName: 'PHONE', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'resetToken', headerName: 'RESET TOKEN', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'password', headerName: 'PASSWORD', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'isActive', headerName: 'ACTIVE', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'currentSessionId', headerName: 'CURRENT SESSION ID', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'lastLoginTime', headerName: 'LAST LOGIN TIME', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
        { field: 'createdDate', headerName: 'CREATED DATE', width: 140, editable: true, headerAlign: 'center', align: 'center', headerClassName: 'custom-header' },
    
    {
        field: 'actions',
        headerClassName: 'custom-header',
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
    
}  else if (apiEndpoint === 'http://localhost:8090/api/candidates/status') {
    columns = [
        { field: 'candidateId', headerName: 'CANDIDATEID', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'candidateEmail', headerName: 'CANDIDATEEMAIL', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'candidateContact', headerName: 'CANDIDATECONTACT', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header' },
        { field: 'technology', headerName: 'TECHNOLOGY', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'totalExperience', headerName: 'TOTALEXPERIENCE', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header' },
        { field: 'currentCtc', headerName: 'CURRENTCTC', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header' },
        { field: 'expectedCtc', headerName: 'EXPECTEDCTC', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'noticePeriod', headerName: 'NOTICEPERIOD', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'modeOfWork', headerName: 'MODEOFWORK', width: 140, editable: true, headerAlign: 'center', align:'center' ,headerClassName: 'custom-header'},
        { field: 'currentLocation', headerName: 'CURRENTLOCATION', width: 140, editable: true, headerAlign: 'center', align:'center' ,headerClassName: 'custom-header'},
        { field: 'candidateStatus', headerName: 'CANDIDATESTATUS', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header' },
        { field: 'comments', headerName: 'COMMENTS', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header' },
        { field: 'remarks', headerName: 'REMARKS', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'recruiter', headerName: 'RECRUITER', width: 140, editable: true, headerAlign: 'center', align:'center',headerClassName: 'custom-header' },
        { field: 'recruitedSource', headerName: 'RECRUITEDSOURCE', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'createdDate', headerName: 'CREATEDDATE', width: 140, editable: true , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'clientName', headerName: 'CLIENTNAME', width: 140, editable: false , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},
        { field: 'taskCandidateStatus', headerName: 'TASKCANDIDATESTATUS', width: 140, editable: false , headerAlign: 'center', align:'center',headerClassName: 'custom-header'},        
    {
         headerAlign: 'center', align:'center',
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        right:0,
        headerClassName: 'custom-header',
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
else if (apiEndpoint === 'http://localhost:8090/api/clients/clientPositions') {
    columns = [
  
    { field: 'clientName', align:'center',headerName: 'CLIENTNAME', width: 600, editable: true ,    headerAlign: 'center',headerClassName: 'custom-header',
},
   
{ field: 'jobTitle', align:'center',headerName: 'JOBTITLE', width: 600, editable: true,    headerAlign: 'center',headerClassName: 'custom-header',
},



    {
        headerAlign: 'center',
        headerClassName: 'custom-header',
         align:'center',
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 248,
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
else if (apiEndpoint === 'http://localhost:8090/api/clients/') {
    columns = [
        { field: 'clientId', align:'center', headerName: 'CLIENTID', width: 180, editable: true,    headerAlign: 'center',    headerClassName: 'custom-header',

    },
        { field: 'clientName', align:'center',headerName: 'CLIENTNAME', width: 180, editable: true ,    headerAlign: 'center',headerClassName: 'custom-header',
    },
        { field: 'clientSpocName', align:'center',headerName: 'CLIENTSPOCNAME', width: 180, editable: true,    headerAlign: 'center',headerClassName: 'custom-header',
    },
        { field: 'clientSpocContact', align:'center',headerName: 'CLIENTSPOCCONTACT', width: 180, editable: true ,    headerAlign: 'center',headerClassName: 'custom-header',
    },
        { field: 'clientLocation', align:'center',headerName: 'CLIENTLOCATION', width: 180, editable: true,    headerAlign: 'center',headerClassName: 'custom-header',
    },
        { field: 'createdAt', align:'center',headerName: 'CREATEDAT', width: 180, editable: true,    headerAlign: 'center',headerClassName: 'custom-header',
    },

    {
        headerAlign: 'center',
        headerClassName: 'custom-header',
         align:'center',
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 247,
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
            height: 600,
            width: '100%',
            '& .custom-header': {
                backgroundColor: '#2A3F54',
                color: '#FFFFFF',
            },
            '& .MuiDataGrid-cell': {
                fontSize: 'small', 
                
            },
             
            // marginBottom: 30,
            backgroundColor: 'white',
            fontWeight: 'medium',
           paddingRight:7,
            paddingTop: 5,
            paddingLeft: 4,
            background: 'none',
            
        }}
    >
      
        <TextField
            label="Search"
            value={searchValue}
            onChange={handleSearchChange}
            variant="outlined"
            sx={{ mb: 2 }}
            size='small'
        />
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            variant="contained"
            sx={{ mb: 2, bgcolor: '#2A3F54', color: 'white',marginLeft:130 }}
    >
            Add Record
        </Button>
        <DataGrid
                    rowHeight={34}
                    

            rows={filteredRows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowEditStop={handleRowEditStop}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
        />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
            <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                {snackbarMessage}
            </MuiAlert>
        </Snackbar>
        <ConfirmDialog
            open={openConfirmDialog}
            setOpen={setOpenConfirmDialog} 

            onClose={handleCloseDialog}
            onConfirm={handleConfirmDelete}
            title="Confirm Delete"
            deleteId={deleteId}

            message="Are you sure you want to delete this record?"
        />
    </Box>
    
);
}