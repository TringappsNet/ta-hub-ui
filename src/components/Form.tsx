"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/Form.css';
import { FaTimes } from 'react-icons/fa'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RiAddCircleFill } from 'react-icons/ri';
import { submitForm } from '../GlobalRedux/Features/formSlice';
import SimplePopup from './popUp';
import { Grid, TextField, Select, MenuItem, Button } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer, GridActionsCellItem, GridRowId, GridRowModel, GridRowEditStopReasons, GridRowModesModel, GridRowModes } from '@mui/x-data-grid';
import CustomSnackbar from "../components/CustomSnackbar";
import { Tooltip } from '@mui/material';



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

    useEffect(() => {
        const totalOpenings = positions.reduce((sum, position) => sum + parseInt(position.noOfOpenings, 10), 0);
        setNoOfOpenings(totalOpenings);
      }, [positions]);
      

    const submitFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newErrors = {
        clientName: clientName ? '' : 'Client Name is required',
        clientSpocName: clientSpocName ? '' : 'Client SPOC Name is required',
        reqStartDate: reqStartDate ? '' : 'Requirement Start Date is required',
        clientSpocContact: clientSpocContact ? '' : 'Client Contact Details are required',
        accountManager: accountManager ? '' : 'Account Manager Name is required',
        accountManagerEmail: accountManagerEmail ? '' : 'Account Manager E-mail is required',
        salaryBudget: salaryBudget ? '' : 'Salary Budget is required',
        modeOfInterviews: modeOfInterviews ? '' : 'Mode of Interview is required',
        startDate: startDate ? '' : 'Project Start Date is required',
        projectStartDate: projectStartDate ? '' : 'Project Duration is required',
        approvedBy: approvedBy ? '' : 'Approval request is required',
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (hasErrors) {
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
              yearsOfExperienceRequired: parseInt(yearsOfExperienceRequired as string),
              primarySkillSet: primarySkill,
              secondarySkillSet: secondarySkill
          })),
          salaryBudget: parseFloat(salaryBudget as string),
          modeOfInterviews,
          tentativeStartDate: startDate?.toISOString(),
          tentativeDuration: projectStartDate,
          approvedBy,
          primarySkillSet: primarySkill,
          secondarySkillSet: secondarySkill
      }];

      // Debugging: Log the formData to see its structure
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
            <Button
              onClick={handleSavePosition(params.id)}
              color="primary"
              size="small"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => {
                setRowModesModel((prevModel) => ({
                  ...prevModel,
                  [params.id]: { mode: GridRowModes.Edit, fieldToFocus: 'jobTitle' },
                }));
              }}
              color="primary"
              size="small"
            >
              Edit
            </Button>
          )}
          <Button
            onClick={handleDeletePosition(params.id)}
            color="secondary"
            size="small"
          >
            Delete
          </Button>
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
                        <div className='header'>
                            <h3>Client Requirement Form</h3>
                            <FaTimes className="close-icon pl-2" onClick={handleClose} />
                        </div>
                        <div className="scrollable-area">
                            <div className='fields'>
                                <div className="form-group p-2">
                                    <label htmlFor="cname" className="form-label">Client Name</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        name="cname"  
                                        value={clientName} 
                                        onChange={(e) => setClientName(e.target.value)}  
                                        required
                                    />
                                    {errors.clientName && <span className="error-message">{errors.clientName}</span>}
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="spocname" className="form-label">Client SPOC Name</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        name="spocname" 
                                        value={clientSpocName} 
                                        onChange={(e) => setClientSpocName(e.target.value)} 
                                        required={true} 
                                    />
                                    {errors.clientSpocName && <span className="error-message">{errors.clientSpocName}</span>}
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
                                            required={true}
                                        />
                                        {errors.reqStartDate && <span className="error-message">{errors.reqStartDate}</span>}
                                    </div>
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="contact" className="form-label">Client Contact Details</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        name="contact" 
                                        value={clientSpocContact} 
                                        onChange={(e) => setClientSpocContact(e.target.value)} 
                                        required={true} 
                                    />
                                    {errors.clientSpocContact && <span className="error-message">{errors.clientSpocContact}</span>}
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="manager" className="form-label">Account Manager Name</label>
                                    <input 
                                        type="text" 
                                        className="input-box" 
                                        name="manager" value={accountManager} 
                                        onChange={(e) => setAccountManager(e.target.value)} 
                                        required={true} 
                                    />
                                    {errors.accountManager && <span className="error-message">{errors.accountManager}</span>}
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
                                    {errors.accountManagerEmail && <span className="error-message">{errors.accountManagerEmail}</span>}
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
                                        <RiAddCircleFill className="add-icon" onClick={handleAddField} />
                                    </div>
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
                                        <div className="view-positions">View Positions</div>
                                    </Tooltip>
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
                                        onRowEditStop={(params, event) => {
                                        if (event.reason === GridRowEditStopReasons.escapeKeyDown) {
                                            setRowModesModel((prevModel) => ({
                                            ...prevModel,
                                            [params.id]: { mode: GridRowModes.View },
                                            }));
                                        }
                                        }}
                                        processRowUpdate={(newRow: GridRowModel) => {
                                        const updatedPositions = positions.map((position) =>
                                            position.id === newRow.id ? { ...position, ...newRow } : position
                                        );
                                        setPositions(updatedPositions);
                                        return newRow;
                                        }}
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
                                        {errors.salaryBudget && <span className="error-message">{errors.salaryBudget}</span>}
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="modeOfInterview" className="form-label">Mode of Interview</label>
                                            <select 
                                                className="input-box" 
                                                name="modeOfInterview" 
                                                value={modeOfInterviews} 
                                                onChange={(e) => setModeOfInterviews(e.target.value)} 
                                                required
                                            >
                                                <option value="">Select an option</option>
                                                <option value="option1">Option 1</option>
                                                <option value="option2">Option 2</option>
                                                <option value="option3">Option 3</option>
                                            </select>
                                            {errors.modeOfInterviews && <span className="error-message">{errors.modeOfInterviews}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group pt-3 p-2">
                                    <label htmlFor="date" className="form-label">Project Start Date</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            className="calender"
                                            name="date"
                                            dateFormat="dd/MM/yyyy"
                                            required={true}
                                        />
                                        {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                                    </div>
                                </div>
                                {/* <div className="form-group p-2">
                                    <label htmlFor="date" className="form-label">Project Start Date</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            className="calender"
                                            name="date"
                                            dateFormat="dd/MM/yyyy"
                                            required={true}
                                        />
                                    </div>
                                </div> */}
                                {/* <div className="form-group p-2">
                                    <label htmlFor="proj-duration" className="form-label">Project Duration</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            selected={projectStartDate}
                                            onChange={(date) => setProjectStartDate(date)}
                                            className="calender"
                                            name="proj-duration"
                                            dateFormat="dd/MM/yyyy"
                                            required={true}
                                        />
                                    </div>
                                </div> */}
                                <div className="form-group p-2">
                                    <label htmlFor="proj-duration" className="form-label">Project Duration</label>
                                    <div className="duration-input-container">
                                        <input
                                        type="number"
                                        id="proj-duration"
                                        className="form-control"
                                        value={projectStartDate}
                                        onChange={(e) => setProjectStartDate(e.target.value)}
                                        name="proj-duration"
                                        required
                                        min="1"
                                        />
                                        {errors.projectStartDate && <span className="error-message">{errors.projectStartDate}</span>}
                                        <span className="duration-suffix">months</span>
                                    </div>
                                </div>
                                <div className="form-group p-2">
                                    <label htmlFor="email" className="form-label">Approval request</label>
                                    <input 
                                        type="email" 
                                        className="input-box" 
                                        name="email" 
                                        value={approvedBy} 
                                        onChange={(e) => setApprovedBy(e.target.value)} 
                                        required={true} 
                                    />
                                    {errors.approvedBy && <span className="error-message">{errors.approvedBy}</span>}
                                </div>
                                {/* <div className="form-group p-2">
                                    <label htmlFor="ex" className="form-label">Years of Experience</label>
                                    <input 
                                        type="number" 
                                        className="input-box" 
                                        name="ex" 
                                        value={yearsOfExperienceRequired} 
                                        onChange={(e) => setYearsOfExperienceRequired(e.target.value)} 
                                        required={true} 
                                    />
                                </div> */}
                                {/* <div className="form-group p-2">
                                    <label htmlFor="primary-skill" className="form-label">Primary Skill set</label>
                                    <textarea 
                                        className="text-area" 
                                        name="primarySkill" 
                                        id="primary-skill" 
                                        rows={3}
                                        value={primarySkill} 
                                        onChange={(e) => setPrimarySkill(e.target.value)} 
                                        required
                                    />
                                </div> */}
                                {/* <div className="form-group p-2">
                                    <label htmlFor="secondary-skill" className="form-label">Secondary Skill set</label>
                                    <textarea
                                        className="text-area" 
                                        name="secondarySkill" 
                                        id="secondary-skill" 
                                        rows={3}
                                        value={secondarySkill} 
                                        onChange={(e) => setSecondarySkill(e.target.value)} 
                                        required
                                    />
                                </div> */}
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
