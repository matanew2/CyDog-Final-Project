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
        <TaskInfo>{assignment?.createdAt}</TaskInfo>
        <TaskInfo>{assignment?.dog.name} | {assignment?.dog.breed}</TaskInfo>
        <TaskInfo>{assignment?.title}</TaskInfo>
        <TaskInfo>ID:{assignment?._id}</TaskInfo>
      </Grid>
    </Grid>
  );
};

export default TaskCard;
