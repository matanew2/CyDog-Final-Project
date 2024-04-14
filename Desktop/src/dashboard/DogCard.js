import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import "./DogCard.css";

const DogInfo = ({ className, children }) => (
  <Typography sx={{ color: "white", fontSize: "14px" }} className={className}>
    {children}
  </Typography>
);

const DogCard = ({ id, dogName, breed, age, job }) => {
  return (
    <Grid
      container
      className="rectangle-e"
      direction="row"
      sx={{ height: "22vh" }}
      alignItems="center"
    >
      <Grid
        item
        alignItems="center"
        justifyContent="center"
        sx={{
          px: "25px",
          py: "25px",
        }}
      >
        <Box>
        <Grid item className="dog-pic">
          {console.log(`http://localhost:8000/images/${id}/${dogName}`)}
          <img src={`http://localhost:8000/images/${id}/${dogName}`} alt={dogName} />
        </Grid>
      </Box>
      </Grid>
      <Grid item sx={{ px: "12px", py: "30px" }}>
        <DogInfo>
          {dogName} | {breed}
        </DogInfo>
        <DogInfo>{age} years old</DogInfo>
        <DogInfo>{job}</DogInfo>
        <DogInfo>ID:{id}</DogInfo>
      </Grid>
    </Grid>
  );
};

export default DogCard;
