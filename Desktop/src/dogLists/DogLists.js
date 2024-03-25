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
const Dog = ({ name, ID, handler }) => {
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
        {ID} | {name}  | {handler}
        </span>
      </Typography>
    </CardContent>
  </Card>
  );
};

// DogListList component
const DogList = () => {
  const [doglists, setDogLists] = useState([
    {
      name: "Marvin",
      ID: 1,
      handler: "Daniella",
      assignments: ['Search & Rescue', 'Explosive Detect']
    },
    {
        name: "Leo",
        ID: 2,
        handler: "Daniella",
        assignments: []
      },
    {
        name: "Buddy",
        ID: 3,
        handler: "Daniella",
        assignments: ['Search & Rescue']
        },
  ]);
  const [selectedDog, setSelectedDog] = useState(null);

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
              {doglists.map((dog) => (
                <Grid item sx={{ p: 0, m: 0 }}>
                  <Button 
                    onClick={() => setSelectedDog(dog)}
                    sx={{
                      borderColor: selectedDog === dog ? '#30D2C3' : 'transparent',
                      borderWidth: 3,
                      borderStyle: 'solid',
                      borderRadius: 4,
                      p: 0
                    }}
                  >
                    <Dog 
                      key={dog.id}
                      name={dog.name}
                      ID={dog.ID}
                      handler={dog.handler}
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
              Dog Name: {selectedDog?.name}
            </Typography><br/>
            <Typography variant="h5" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                handler: {selectedDog?.handler}
            </Typography><br/>
            <br/><Grid item sx={{ml: 4}}>{selectedDog ? <DogCard id={selectedDog?.ID} dogName={selectedDog?.name} /> : ""}</Grid><br/>
            <Typography variant="h5" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                Current Assignment: 
                {selectedDog?.assignments.length > 0 ? (
                    <List>
                    {selectedDog?.assignments.map((assignment) => (
                      <Typography variant="h6" sx={{ textAlign: "left", ml: 2, color:"white" }}>
                        {assignment}
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

export default DogList;
