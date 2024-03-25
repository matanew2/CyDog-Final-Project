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
    },    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },
    {
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },{
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },{
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },{
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },{
      name: "Adoption",
      dateCreation: new Date(),
      dateFinish: new Date(),
      handler: "Daniella",
    },
  ]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  return (
    <Grid container>
      <Grid item>
        <Grid container justifyContent="flex-start" sx={{ mt: 10, ml: 30 }}>
          {/* TASK LISTS */}
          <Grid 
              item 
              md={7} 
              lg={8} 
              sx={{
                overflowY: "auto", 
                maxHeight: "700px", 
                '&::-webkit-scrollbar': {
                  width: '10px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px', 
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#043934',
                  borderRadius: '5px', 
                },
              }}
            >
              {assignments.map((assignment) => (
                <Grid item sx={{ p: 0, m: 0 }}>
                  <Button 
                    onClick={() => setSelectedAssignment(assignment)}
                    sx={{
                      borderColor: selectedAssignment === assignment ? '#30D2C3' : 'transparent',
                      borderWidth: 3,
                      borderStyle: 'solid',
                      borderRadius: 4,
                      p: 0
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
                ml: 5,
                borderRadius: "20px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#126D65",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflowY: "auto",
                maxHeight: "800px", // Add this line
              }}
          ><br/>
          
            <Typography variant="h5" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment?.name}
            </Typography><br/>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment?.handler}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment?.dateCreation.toLocaleString()} 
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment?.dateFinish.toLocaleString()}
            </Typography>
            <br/><Grid item sx={{ml: 4}}>{selectedAssignment ? <DogCard dogName={"Marvin"} /> : ""}</Grid><br/>
            <Typography variant="body1" sx={{ textAlign: "left", ml: 2, color:"white" }}>
              {selectedAssignment ? 'Description:' : 'Select an assignment to view details of it.'}
            </Typography>
            {selectedAssignment ? <br/> : ""}
            <Grid item>
              <Typography 
                sx={{ 
                  fontSize: 13,
                  width: "100%",
                  color: "white",
                  ml: 2
                }} 
              >
                {selectedAssignment ? 'This is a description of the assignment' : ""}

              </Typography>
            </Grid><br/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Assignments;
