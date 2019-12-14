import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { auth, db } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [new_task, setNewTask] = useState("");
  const [open, setOpen] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          const updated_tasks = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            updated_tasks.push({
              text: data.text,
              checked: data.checked,
              priority: data.priority,
              id: doc.id
            });
          });
          setTasks(updated_tasks);
        });
    }

    return unsubscribe;
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleAddTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: new_task, checked: false, priority: "" })
      .then(() => {
        setNewTask("");
      });
  };

  const handleDeleteTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(taskId)
      .delete();

    setOpen(false);
  };

  const handleConfirmDeleteTask = task_id => {
    setTaskId(task_id);
    setOpen(true);
  };

  const handleCheckTask = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };

  const handleSetPriority = (value, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ priority: value });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <Paper style={{ padding: "30px", width: "700px" }}>
          <Typography variant="h6">To Do List</Typography>
          <div style={{ display: "flex", marginTop: "30px" }}>
            <TextField
              fullWidth={true}
              placeholder="Add a new task here"
              style={{ marginRight: "30px" }}
              value={new_task}
              onChange={e => {
                setNewTask(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              disabled={new_task === ""}
            >
              Add
            </Button>
          </div>
          {tasks.length > 0 && (
            <Typography style={{ marginTop: 30 }}>Incomplete Tasks</Typography>
          )}
          <List>
            {tasks
              .filter(t => t.checked === false)
              .map(value => (
                <ListItem key={value.id}>
                  <ListItemIcon>
                    <Checkbox
                      checked={value.checked}
                      onChange={(e, checked) => {
                        handleCheckTask(checked, value.id);
                      }}
                      // checked={checked.indexOf(value) !== -1}
                    />
                  </ListItemIcon>
                  <ListItemText primary={value.text} />
                  <ListItemSecondaryAction>
                    <div>
                      <FormControl>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={value.priority}
                          onChange={e => {
                            handleSetPriority(e.target.value, value.id);
                          }}
                          style={{ width: 90 }}
                        >
                          <MenuItem value={"low"}>Low</MenuItem>
                          <MenuItem value={"medium"}>Medium</MenuItem>
                          <MenuItem value={"high"}>High</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        onClick={() => {
                          handleConfirmDeleteTask(value.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
          {tasks.length > 0 && (
            <Typography style={{ marginTop: 30 }}>Complete Tasks</Typography>
          )}
          <List>
            {tasks
              .filter(t => t.checked === true)
              .map(value => (
                <ListItem key={value.id}>
                  <ListItemIcon>
                    <Checkbox
                      checked={value.checked}
                      onChange={(e, checked) => {
                        handleCheckTask(checked, value.id);
                      }}
                      // checked={checked.indexOf(value) !== -1}
                    />
                  </ListItemIcon>
                  <ListItemText primary={value.text} />
                  <ListItemSecondaryAction>
                    <div>
                      <FormControl>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={value.priority}
                          onChange={e => {
                            handleSetPriority(e.target.value, value.id);
                          }}
                          style={{ width: 90 }}
                        >
                          <MenuItem value={"low"}>Low</MenuItem>
                          <MenuItem value={"medium"}>Medium</MenuItem>
                          <MenuItem value={"high"}>High</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        onClick={() => {
                          handleConfirmDeleteTask(value.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </Paper>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTask}
            variant="contained"
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
