import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TasksIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import List from "@mui/material/List";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ListItems() {
  const { createdTask } = useAuth(); // Boolean state for tracking login status
  return (
    <List sx={{ width: 195 }}>
      {createdTask && (
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
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
      )}
      {!createdTask && (
        <Link to="/dog-lists" style={{ textDecoration: "none" }}>
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
      )}
      {!createdTask && (
        <Link to="/handlers" style={{ textDecoration: "none" }}>
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
      )}
      {!createdTask && (
        <Link to="/tasks" style={{ textDecoration: "none" }}>
          <ListItemButton>
            <ListItemIcon>
              <TasksIcon sx={{ color: "white", fontSize: "30px" }} />
            </ListItemIcon>
            <ListItemText primary="Assigment" sx={{ color: "white" }} />
          </ListItemButton>
        </Link>
      )}
    </List>
  );
}
