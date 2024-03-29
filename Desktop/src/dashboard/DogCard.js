import React from "react";
import { Grid, Typography,Box } from "@mui/material";
import "./DogCard.css";

const DogInfo = ({ className, children }) => (
  <Typography sx={{ color: "white", fontSize: "14px" }} className={className}>
    {children}
  </Typography>
);

const DogCard = ({ id, dogName }) => {
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
        <Box><Grid item className="dog-pic" /></Box>
      </Grid>
      <Grid item sx={{ px: "12px", py: "30px" }}>
        <DogInfo>{dogName} | Golden Retriever</DogInfo>
        <DogInfo>3 year old</DogInfo>
        <DogInfo>Search & Rescue</DogInfo>
        <DogInfo>ID:{id}</DogInfo>
      </Grid>
    </Grid>
  );
};

export default DogCard;
