import React from "react";
import { Grid, Typography,Box } from "@mui/material";
import "./DogCard.css";

const TaskInfo = ({ className, children }) => (
  <Typography sx={{ color: "white", fontSize: "14px" }} className={className}>
    {children}
  </Typography>
);

const TaskCard = ({ assignment }) => {
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
        <TaskInfo>{assignment?.date}</TaskInfo>
        <TaskInfo>Status: {assignment?.status}</TaskInfo>
        <TaskInfo>{assignment?.dogName} | {assignment?.dogType}</TaskInfo>
        <TaskInfo>{assignment?.task}</TaskInfo>
        <TaskInfo>ID:{assignment?.id}</TaskInfo>
      </Grid>
    </Grid>
  );
};

export default TaskCard;
