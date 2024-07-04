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
interface Client {
    clientId: number; 
    clientName: string;
  
}

function Form() {      
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [reqStartDate, setReqStartDate] = useState<Date | null>(null);
    const [projectStartDate, setProjectStartDate] = useState('');
    const [primarySkill, setPrimarySkill] = useState('');
    const [secondarySkill, setSecondarySkill] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [clientNames, setClientNames] = useState<string[]>([]);
    const [clientDetails, setClientDetails] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientName, setClientName] = useState<string>('');
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

      useEffect(() => {
        fetchClientDetails();
    }, []);

    const fetchClientDetails = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/clients/');
            if (!response.ok) {
                throw new Error('Failed to fetch client details');
            }
            const data = await response.json();
            setClientDetails(data);
            const names = data.map(client => client.clientName);
            setClientNames(names); 
            
        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };
    const handleClientChange = (selectedClientName: string) => {
        const foundClient = clientDetails.find(client => client.clientName === selectedClientName);
        if (foundClient) {
            setSelectedClient(foundClient);
            fetchClientAdditionalDetails(foundClient.clientId); 
            console.log("Selected Client ID: ", foundClient.clientId);
        } else {
            setSelectedClient(null);
        }
    };
      const fetchClientAdditionalDetails = async (clientId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/clients/client/${clientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch client details');
            }
            const clientData = await response.json();
            setClientSpocName(clientData.clientSpocName);
            setClientSpocContact(clientData.clientSpocContact);
            console.log("Fetched Client Data: ", clientData);
        } catch (error) {
            console.error('Error fetching additional client details:', error);
        }


    };
   
    
      

      const submitFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormSubmitted(true); 
     if (
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
  const newPosition = {
    id: positions.length > 0 ? positions[positions.length - 1].id + 1 : 0,
    jobTitle: '',
    noOfOpenings: '',
    roleType: '',
    modeOfWork: '',
    workLocation: '',
    yearsOfExperienceRequired: '',
    primarySkillSet: '',
    secondarySkillSet: '',
  };

  // Add new position at the beginning
  setPositions([newPosition, ...positions]);
  setRowModesModel((prevModel) => ({
    ...prevModel,
    [newPosition.id]: { mode: GridRowModes.Edit, fieldToFocus: 'jobTitle' },
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
                                    <select
                                        style={{ borderColor: (formSubmitted && clientName.trim() === '') ? 'red' : '' }} 
                                        className="input-box" 
                                        id="clientSelect" 
                                        value={selectedClient ? selectedClient.clientName : ''}
                                        onChange={(e) => handleClientChange(e.target.value)}
                                        >
                                        <option value=""disabled>Select Client</option>
                                        {clientNames.map((name, index) => (
                                            <option key={index} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="spocname" className="form-label">Client SPOC Name</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        value={clientSpocName}
                                        readOnly
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
                                        value={clientSpocContact}
                                        readOnly
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
                                    <FaTimes className="close-icon pl-2 move-left-close-icon" onClick={handleClose} style={{ marginLeft: '1148px', marginTop: '-10',display: 'flex', alignItems: 'center' }} />
                                    <Button onClick={handleAddPosition} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>Add Position</Button>
                                    <div style={{ height: '89%', width: '100%' }}>
                                    
                                    <DataGrid
                                        className = "custom-data-grid"
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
                                                <option value="option1">Online Interview</option>
                                                <option value="option2">In-person Interview</option>
                                                <option value="option3">Telephone/Mobile Interview</option>
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
