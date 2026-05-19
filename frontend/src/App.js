import { Box, Button, Checkbox, Container, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Paper, TextField, ThemeProvider, Typography } from '@mui/material';
import './App.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState, forwardRef } from 'react';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//API
const API_URL = 'http://127.0.0.1:5001/api/todos';


// google fonts
const theme = createTheme({
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(',')
  }
});

function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState('');
  const [disabled, setDsiabled] = useState(true);
  const [deleteDia, setDeleteDia] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [updateDia, setUpdateDia] = useState(false);

  //get data
  useEffect(() => {
    fetchTodos();
  }, []);

  //add task
  const handleAddTask = async () => {
    if (!content.trim()) return
    setDsiabled(true);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setContent('');
      alert("Task Added!");
    } else {
      console.error("failed to add task");
    }
  }

  //finish task
  const handleFinishTask = async (id, completed) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    }
  }

  //delete task
  const handleComfirmDelete = (id) => {
    setTaskId(id);
    // open delete confirm window
    setDeleteDia(true);
  }

  const handleDeletTask = async () => {
    // close delete dialog window
    setDeleteDia(false);

    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      const message = await response.json();
      alert(message.message);
      setTodos(todos.filter(todo => todo.id !== taskId));
    }

    setTaskId(null);
  }

  const handleCancleDelete = () => {
    setTaskId(null);
    setDeleteDia(false);
  }

  // update task information
  const handleUpdateTask = (id) => {
    setTaskId(id);
    setUpdateDia(true);
  }

  const handleUpdate = async () => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === taskId ? updatedTodo : todo));
    }

    setTaskId(null);
    setContent('');
    setUpdateDia(false);
    alert("Task Updated!");
  }

  const handleCancleUpdate = () => {
    setTaskId(null);
    setContent('');
    setUpdateDia(false);
  }


  // fetch data
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL, { method: "GET" });
      const data = await response.json();
      // update state
      setTodos(data);
    } catch (error) {
      console.error("error in getting data", error);
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: '15vh', maxWidth: 'sm' }}>
        <Paper elevation={3} sx={{ padding: "0.5em" }}>
          <Typography typography={{ xs: 'h4', md: 'h3' }} align='center' gutterBottom>
            ToDo List
          </Typography>
          <Box display={'flex'} alignContent={"center"} gap={"1vw"}>
            <TextField onChange={e => {
              setContent(e.target.value);
              setDsiabled(false);
            }}
              value={content} label='task content' variant='outlined' color='secondary' fullWidth />
            <Button disabled={disabled} onClick={handleAddTask} variant='contained' size='large' sx={{ minWidth: "150px" }}>
              <Typography typography={{ xs: 'h6', md: 'h7' }}>
                Add Task
              </Typography>
            </Button>
          </Box>
          <List>
            {todos.map(todo =>
              <ListItem key={todo.id}>
                <Checkbox color='primary' checked={todo.completed} onChange={() => handleFinishTask(todo.id, todo.completed)} />
                <ListItemText primary={todo.content}
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'gray' : 'inherit'
                  }} />
                <IconButton onClick={() => handleUpdateTask(todo.id)} aria-label="update" size="large">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleComfirmDelete(todo.id)} aria-label="delete" size="large">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            )}
          </List>
        </Paper>
      </Container>
      {/* delete dialog window */}
      <Dialog open={deleteDia} slots={{ transition: Transition }}
        aria-describedby="alert-dialog-delete">
        <DialogTitle>Are you sure to delete this task?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancleDelete}>No</Button>
          <Button onClick={handleDeletTask}>Yes</Button>
        </DialogActions>
      </Dialog>
      {/* update taks information window */}
      <Dialog open={updateDia} slots={{ transition: Transition }}
        aria-describedby="alert-dialog-update">
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <form id="update-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="content"
              name="content"
              label="Task Content"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => setContent(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancleUpdate}>Cancle</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
