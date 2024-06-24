  import { useState, useEffect } from 'react';
  import 'bootstrap/dist/css/bootstrap.css';
  import "../styles/Dnd.css";
  import { Card, CardContent, TextField, Button } from '@mui/material';
  import ConfirmDialog from "../Grid/ConfirmationDialog";
  import 'bootstrap-icons/font/bootstrap-icons.css';
  import AddBoxIcon from '@mui/icons-material/AddBox';
  import FullScreenPopup from './FullScreenPopup';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';

  const Board = () => {
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTaskStatus, setNewTaskStatus] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState("");
    const [deleteItemType, setDeleteItemType] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
    const [showFullScreenPopup, setShowFullScreenPopup] = useState(false);
    const [checkedTasks, setCheckedTasks] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);

   
  const handleCheckboxClick = (taskId, event) => {
    event.stopPropagation();
    setCheckedTasks(prevState => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));
  };


    useEffect(() => {
      const fetchColumns = async () => {
        try {
          const response = await fetch('http://localhost:8090/api/board/columns');
          if (response.ok) {
            const data = await response.json();
            const initialColumns = data.map(column => ({
              id: column.id,
              column: column.column,
              title: column.column.toUpperCase(),
              count: 0
            }));
            setColumns(initialColumns);
          } else {
            console.error('Failed to fetch columns:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred while fetching columns:', error);
        }
      };

      fetchColumns();
    }, []);

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await fetch('http://localhost:8090/api/tasks/task/view');
          if (response.ok) {
            const data = await response.json();
            const updatedTasks = data.map(task => {
              if (!task.taskStatus) {
                return { ...task, taskStatus: "todo" };
              }
              return task;
            });
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
          } else {
            console.error('Failed to fetch tasks:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred while fetching tasks:', error);
        }
      };
  
      fetchTasks();
    }, []);


    useEffect(() => {
      const columnCounts = columns.map(column => ({
        ...column,
        count: tasks.filter(task => task.taskStatus === column.column).length
      }));
      setColumns(columnCounts);
    }, [tasks]); 

    const onDragStart = (event, task) => {
      event.dataTransfer.setData("task", JSON.stringify(task));
    };


    useEffect(() => {
      const filtered = tasks.filter(task =>
        task.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.roleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.workLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.modeOfWork.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    }, [searchQuery, tasks]);
  
    // Handler for search query change
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };
  
    const onDragOver = (event) => {
      event.preventDefault();
    };

    const onDrop = async (event, status) => {
      event.preventDefault();
      const droppedTask = JSON.parse(event.dataTransfer.getData("task"));
      const updatedTasks = tasks.map(task => {
        if (task.taskId === droppedTask.taskId) {
          return { ...task, taskStatus: status };
        }
        return task;
      });
      setTasks(updatedTasks);
      event.dataTransfer.clearData();

      try {
        await fetch(`http://localhost:8090/api/tasks/task/${droppedTask.taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskStatus: status }),
        });
        console.log('Task status updated successfully.');
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    };

    const handleAddButtonClick = () => {
      setShowAddForm(true);
      setShowPreview(true);
    };

    const handlePreviewClose = () => {
      setShowPreview(false);
    };

    const handleAddFormSubmit = async () => {
      setShowAddForm(false);
      setNewTaskStatus("");
      try {
        const response = await fetch('http://localhost:8090/api/board/column', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ column: newTaskStatus }),
        });
        if (response.ok) {
          console.log('Column added successfully.');
          const newColumnId = `column-${columns.length}`;
          setColumns([...columns, { id: newColumnId, column: newTaskStatus, title: newTaskStatus.toUpperCase(), count: 0 }]);
        } else {
          console.error('Failed to add column:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while adding column:', error);
      }
    };

    const handleDeleteColumn = (id) => {
      const columnTasks = tasks.filter(task => task.taskStatus === id);
      console.log("length",columnTasks.length);
      if (columnTasks.length > 0) {
        setDeleteErrorMessage('Cannot delete column with tasks inside.');
      } else {
        setDeleteConfirmation(true);
        setDeleteItemId(id);
        setDeleteItemType("column");
      }
    };

    const handleDeleteTask = (taskId, event) => {
      // Prevent the event from propagating to the parent elements
      event.stopPropagation();
    
      setDeleteConfirmation(true);
      setDeleteItemId(taskId);
      setDeleteItemType("task");
    };
    

    const handleConfirmDelete = async () => {
      if (deleteItemType === "column") {
        try {
          const response = await fetch(`http://localhost:8090/api/board/column/${deleteItemId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            console.log('Column deleted successfully.');
            const updatedColumns = columns.filter(column => column.id !== deleteItemId);
            setColumns(updatedColumns);
          } else {
            console.error('Failed to delete column:', response.statusText);
        }
        } catch (error) {
          console.error('An error occurred while deleting column:', error);
        }
      } else if (deleteItemType === "task") {
        try {
          const response = await fetch(`http://localhost:8090/api/tasks/task/${deleteItemId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            console.log('Task deleted successfully.');
            const updatedTasks = tasks.filter(task => task.taskId !== deleteItemId);
            setTasks(updatedTasks);
          } else {
            console.error('Failed to delete task:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred while deleting task:', error);
        }
      }
      setDeleteConfirmation(false);
    };

    const handleCancelDelete = () => {
      setDeleteConfirmation(false);
      setDeleteItemId("");
      setDeleteItemType("");
      setDeleteErrorMessage("");
    };

    const handleCardClick = () => {
      setShowFullScreenPopup(true);
    };

    const handleCloseFullScreenPopup = () => {
      setShowFullScreenPopup(false);
    };
    return (
      <div className="board-container">
        <div className="header1">
          <div className='d-flex'>
          <h6>Projects / TA Board</h6>
          <h6>KAN Board</h6>
          </div>
          <div className="search-container">
          <TextField
            className="small-search"
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button
            className="small-search-button"
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </div>
      </div>
    
        <div className="kanboard">
          <div className={columns.length > 2 ? "kanboard-container d-flex " : "kanboard-container"}>
          {columns.map(column => (
  <div key={column.id} className="column" onDragOver={(event) => onDragOver(event)} onDrop={(event) => onDrop(event, column.column)}>
    <div className="column-header d-flex justify-content-between">
      <h6 className="columnTitle">
        {column.title} {column.count} 
   
      </h6>
      {!column.count > 0 && (
        <div className="delete-button" onClick={() => handleDeleteColumn(column.id)}>
          <span className="bi bi-trash"></span>
        </div>
      )}
    </div>
    <div className='cards'>
      {filteredTasks.map((task) => (
        task.taskStatus === column.column && task.approvalStatus == null && (
          <div className="draggable-item" key={task.taskId.toString()} draggable="true" onDragStart={(event) => onDragStart(event, task)}>
            <Card onClick={handleCardClick}>
  <CardContent className='cardcontent1'>
    <div className='d-flex justify-content-between task-detail'>
      <p>
        Identify small chunks
      </p>
      <div className="delete-task-button" onClick={(event) => handleDeleteTask(task.taskId, event)}>
        <span className="bi bi-trash"></span>
      </div>
    </div>
    <p className='task-detail'>
      <h7 className="getstat clientName">{task.clientName}</h7>
    </p>
    <div className='d-flex justify-content-between'>
      <h7 className="getstat">{task.roleType}</h7>
      <h7 className="getstat">{task.workLocation}</h7>
      <h7 className="getstat">{task.modeOfWork}</h7>
    </div>
    <div className='d-flex justify-content-between align-items-center mt-2'>
      <div className='d-flex align-items-center checkbox1'>
      <input 
              type="checkbox" 
              className="task-checkbox" 
                                checked={checkedTasks[task.taskId] || false}
                                onClick={(event) => handleCheckboxClick(task.taskId, event)}
            />        <h7 className="kanid ms-2">KAN-{task.taskId}</h7>
      </div>
    </div>
  </CardContent>
</Card>
          </div>
        )
      ))}
    </div>
  </div>
))}

            <div className="add-button-container">
              <div onClick={handleAddButtonClick}><AddBoxIcon color='primary' sx={{ fontSize: 40 }}/></div>
            </div>
            {showPreview && (
              <div className="kanboard1">
                <Card className='card'>
                  <CardContent>
                    <TextField
                      label="Enter Status"
                      variant="outlined"
                      size="small"
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                    />
                    <div className='addBtn'>
                      <Button variant="contained" color="primary" onClick={handleAddFormSubmit}>Submit</Button>
                      <Button variant="contained" color="primary" onClick={handlePreviewClose}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {showAddForm && !showPreview && (
              <div className="add-form-container">
                <TextField
                  label="Enter Status"
                  variant="outlined"
                  size="small"
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddFormSubmit}>Submit</Button>
              </div>
            )}
          </div>
        </div>
        <FullScreenPopup show={showFullScreenPopup} handleClose={handleCloseFullScreenPopup} />
        <ConfirmDialog
          open={deleteConfirmation}
          setOpen={setDeleteConfirmation}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          message={`Are you sure you want to delete this ${deleteItemType}?`}
        />
      </div>
    );
    
    };

    export default Board;
