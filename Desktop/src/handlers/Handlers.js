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
import TaskCard from "../dashboard/TaskCard"


// Assignment component
const Handler = ({ name, ID, dog,job }) => {
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
          alignItems: "center", 
        }}
      >
        <span>
        {ID} | {name} | {job} | {dog}
        </span>
      </Typography>
    </CardContent>
  </Card>
  );
};

// DogListList component
const Handlers = () => {
  const [handlers, setHandlers] = useState([
    {
      name: "Matan",
      ID: 123456789,
      job: "Search & Rescue",
      dog: "Buddy",
      assignments: [
        {'dogName': 'Buddy', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 1, 'status': 'In Progress', 'date': new Date().toISOString().slice(0, 10)},
        {'dogName': 'Leo', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 2, 'status': 'Finished', 'date': '2022-12-12'}        
    ]
    },
    {
      name: "Yael",
      ID: 987654321,
      job: "Search & Rescue",
      dog: "Leo",
      assignments: [
        {'dogName': 'Leo', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 3, 'status': 'In Progress', 'date': new Date().toISOString().slice(0, 10)},
        {'dogName': 'Buddy', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 4, 'status': 'Finished', 'date': '2022-12-12'},
        {'dogName': 'Buddy', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 9, 'status': 'Finished', 'date': '2022-12-12'},
        {'dogName': 'Buddy', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 10, 'status': 'Finished', 'date': '2022-12-12'}
    ]
    },
    {
      name: "Shay",
      ID: 123123123,
      job: "Search & Rescue",
      dog: "Buddy",
      assignments: [
        {'dogName': 'Buddy', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 5, 'status': 'In Progress', 'date': new Date().toISOString().slice(0, 10)},
        {'dogName': 'Leo', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 6, 'status': 'Finished', 'date': '2022-12-12'}
    ]
    },
    {
      name: "Nadav",
      ID: 321321321,
      job: "Search & Rescue",
      dog: "Leo",
      assignments: [
        {'dogName': 'Leo', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 7, 'status': 'In Progress', 'date': new Date().toISOString().slice(0, 10)},
        {'dogName': 'Buddy', 'dogType': 'Golden Retriever', 'task': 'Find the missing person', 'id': 8, 'status': 'Finished', 'date': '2022-12-12'}
    ]
    },
  ]);
  const [selectedHandler, setSelectedHandler] = useState(null);

  return (
    <Grid container>
      <Grid item>
        <Grid container justifyContent="flex-start"sx={{ mt: 10, ml: 31 }}>
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
              {handlers.map((handler) => (
                <Grid item sx={{ p: 0, m: 0 }}>
                  <Button 
                    onClick={() => setSelectedHandler(handler)}
                    sx={{
                      borderColor: selectedHandler === handler ? '#30D2C3' : 'transparent',
                      borderWidth: 3,
                      borderStyle: 'solid',
                      borderRadius: 4,
                      p: 0
                    }}
                  >
                    <Handler 
                      key={handler.id}
                      name={handler.name}
                      ID={handler.ID}
                      dog={handler.dog}
                      job={handler.job}
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
                mt: -9,
                ml: 4.1,
                borderRadius: "20px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#126D65",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflowY: "auto",
                overflowY: "auto", 
                maxHeight: "800px", 
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
          ><br/> 

            <Typography variant="h5" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                {selectedHandler?.name}
            </Typography>
            <Typography variant="body" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                Handler | {selectedHandler?.ID}
            </Typography><br/>
            <Typography variant="h5" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                Assignments: 
                {selectedHandler?.assignments.length > 0 ? (
                    <List>
                    {selectedHandler?.assignments.map((assignment) => (
                      <Typography variant="h6" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                        <br/><Grid item >{selectedHandler ? <TaskCard assignment={assignment} /> : ""}</Grid><br/>
                      </Typography>
                    ))}
                  </List>
                ) : (
                  <Typography variant="h6" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                    No assignment
                  </Typography>
                )}
            </Typography><br/> 
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Handlers;
