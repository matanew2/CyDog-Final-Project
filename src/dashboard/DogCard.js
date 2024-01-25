import React from "react";
import { Grid, Typography } from "@mui/material";
import "./DogCard.css";

const DogInfo = ({ className, children }) => (
  <Typography sx={{ color: "white", fontSize: "18px" }} className={className}>
    {children}
  </Typography>
);

const DogCard = ({ dogName }) => {
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
        <Grid item className="dog-pic" />
      </Grid>
      <Grid item sx={{ px: "12px", py: "30px" }}>
        <DogInfo>{dogName} | Golden Retriever</DogInfo>
        <DogInfo>3 year old</DogInfo>
        <DogInfo>Search & Rescue</DogInfo>
        <DogInfo>ID:12039781203812</DogInfo>
      </Grid>
    </Grid>
  );
};

export default DogCard;
