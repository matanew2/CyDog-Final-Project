import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import DogCard from "../dashboard/DogCard"
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';


// Assignment component
const Assignment = ({ name, dateCreation, dateFinish, handler }) => {
  return (
  <Card sx={{ width: 900, mb: 1, borderRadius: "13px", backgroundColor: "#043934" }} >
    <CardContent>
      <Typography 
        variant="h6" 
        component="div" 
        style={{ color: "white" }} 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center", // Add this line
        }}
      >
        <span>
          {name} | {dateCreation.toLocaleString()} | {" "}
          {dateFinish.toLocaleString()} | {handler}
        </span>
        <IconButton onClick={() => { console.log('Delete icon clicked!'); }}>
          <DeleteIcon sx={{color: "#FF9900"}}/>
        </IconButton>
      </Typography>
    </CardContent>
  </Card>
  );
};

// AssignmentsList component
const Assignments = () => {
  const [assignments, setAssignments] = useState([
    {
      name: "Rescue",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },
    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },
  ]);
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]);

  return (
    <Grid container>
      <Grid item>
        <Grid container justifyContent="flex-start" sx={{ mt: 10, ml: 31 }}>
          {/* TASK LISTS */}
          <Grid item md={7} lg={7} >
          {assignments.map((assignment) => (
            <Grid item sx={{ p: 0, m: 0 }}>
              <Button 
                onClick={() => setSelectedAssignment(assignment)}
                sx={{
                  borderColor: selectedAssignment === assignment ? '#30D2C3' : 'transparent',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderRadius: 1,
                }}
              >
                <Assignment
                  key={assignment.id}
                  name={assignment.name}
                  dateCreation={assignment.dateCreation}
                  dateFinish={assignment.dateFinish}
                  handler={assignment.handler}
                />
              </Button>
            </Grid>
          ))}
          </Grid>

          {/* TASK DETAILS */}
          <Grid
            item
            md={5}
            lg={3}
            sx={{
              mt: -10,
              ml: 3,
              borderRadius: "20px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#126D65",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          ><br/>
            <Typography variant="h5" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment.name}
            </Typography><br/>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment.handler}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment.dateCreation.toLocaleString()} 
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment.dateFinish.toLocaleString()}
            </Typography>
            <br/><Grid item sx={{ml: 2}}><DogCard dogName={"Marvin"} /></Grid><br/>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              Description:
            </Typography>
            <Grid item>
              <Typography 
                sx={{ 
                  fontSize: 13,
                  width: "85%",
                  ml: 2,
                  color: "white",
                }} 
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                 sed do eiusmod tempor incididunt ut labore et dolore magn
                 a aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                   reprehenderit in voluptate velit esse cillum
              </Typography>
            </Grid><br/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Assignments;
