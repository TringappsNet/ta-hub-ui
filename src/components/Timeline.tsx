import  { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/Dnd.css";
import { Card, CardContent, TextField, Button } from '@mui/material';
import { CgProfile } from "react-icons/cg";
import ConfirmDialog from "../Grid/ConfirmationDialog";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Timeline = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // State to control delete confirmation dialog
  const [deleteItemId, setDeleteItemId] = useState(""); // State to store the ID of the item to delete
  const [deleteItemType, setDeleteItemType] = useState(""); // State to store the type of item to delete

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/board/columns');
        if (response.ok) {
          const data = await response.json();
          // Set columns based on received data
          setColumns(data.map(column => ({
            id: column.id,
            column: column.column,
            title: column.column.toUpperCase(),
            count: 0
          })));
        } else {
          console.error('Failed to fetch columns:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching columns:', error);
      }
    };

    fetchColumns();
  }, []);

  const onDragStart = (event, task) => {
    event.dataTransfer.setData("task", JSON.stringify(task));
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/tasks/');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

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

  const handleDeleteColumn = async (id) => {
    setDeleteConfirmation(true);
    setDeleteItemId(id);
    setDeleteItemType("Board");
  };

  const handleDeleteTask = async (taskId) => {
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
  };

  return (
    <div className="board-container">
      <div className="header1">
        <h4>Projects / My Kandan Project</h4>
        <h8>KAN Timeline</h8>
        <div className="search-container">
          <TextField label="Search" variant="outlined" size="small" />
          <Button variant="contained" color="primary">Search</Button>
        </div>
      </div>
      <div className="kanboard">
        {columns.map(column => (
          <div key={column.id} className="column" onDragOver={(event) => onDragOver(event)} onDrop={(event) => onDrop(event, column.column)}>
            <div className='cards'>
              <div className="column-header d-flex justify-content-between">
                <h6>{column.title} ({column.count})</h6>
                <div className="delete-button" onClick={() => handleDeleteColumn(column.id)}>
                  <span className="bi bi-trash"></span>
                </div>
              </div>
              {tasks.map((task) => (
                (task.taskStatus === column.column) && (
                  <div className="draggable-item" key={task.taskId.toString()} draggable="true" onDragStart={(event) => onDragStart(event, task)}>
                    <Card className='card'>
                      <CardContent >
                        <p className='task-detail d-flex justify-content-between'>Ticket Details: {task.taskId}
                          <div className="delete-task-button" onClick={() => handleDeleteTask(task.taskId)}>
                            <span className="bi bi-trash"></span>
                          </div>
                        </p>
                        <h7>Get started</h7>
                        <div className='mt-2 cardcontent'>
                          <h8 className="taskId">{task.taskStatus}</h8>
                          <a href="#">
                            <CgProfile color='black' />
                          </a>
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
          <Button variant="contained" color="primary" onClick={handleAddButtonClick}>Add</Button>
        </div>
        {showAddForm && (
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
      {/* Confirmation dialog for delete */}
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

export default Timeline;
