import * as React from "react";
import { useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TasksIcon from "@mui/icons-material/Assignment";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default function ListItems() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <Link to="/dashboard">
        <ListItemButton>
          <ListItemIcon>
            <img
              src="../../images/Dashboard.png"
              alt="Dashboard"
              style={{ width: "26px", height: "26px" }}
            />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ color: "white" }} />
        </ListItemButton>
      </Link>
      <Link to="/dog-lists">
        <ListItemButton>
          <ListItemIcon>
            <img
              src="../../images/dog_lists.png"
              alt="Dog Lists"
              style={{ width: "26px", height: "26px" }}
            />
          </ListItemIcon>
          <ListItemText primary="Dog Lists" sx={{ color: "white" }} />
        </ListItemButton>
      </Link>
      <Link to="/handlers">
        <ListItemButton>
          <ListItemIcon>
            <img
              src="../../images/Handlers.png"
              alt="Handlers"
              style={{ width: "26px", height: "26px" }}
            />
          </ListItemIcon>
          <ListItemText primary="Handlers" sx={{ color: "white" }} />
        </ListItemButton>
      </Link>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <TasksIcon sx={{ color: "white", fontSize: "30px" }} />
        </ListItemIcon>
        <ListItemText primary="Assigment" sx={{ color: "white" }} />
        {open ? (
          <ExpandLess sx={{ color: "white" }} />
        ) : (
          <ExpandMore sx={{ color: "white" }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/tasks">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ViewListIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="View All Tasks" sx={{ color: "white" }} />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/new-task">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AddIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Add Task" sx={{ color: "white" }} />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </Router>
  );
}
