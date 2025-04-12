import React from "react";
import { Grid, Typography,Box } from "@mui/material";
import "./DogCard.css";

/**
 * TaskInfo component
 * @param {string} className - Class name
 * @param {string} children - Children
 * @returns {JSX.Element} - TaskInfo component
 * @description TaskInfo component for displaying task information
 */
const TaskInfo = ({ className, children }) => (
  <Typography sx={{ color: "white", fontSize: "14px" }} className={className}>
    {children}
  </Typography>
);

/**
 * TaskCard component
 * @param {object} assignment - Assignment object
 * @returns {JSX.Element} - TaskCard component
 * @description TaskCard component for displaying task card
 * @var {object} assignment - Assignment object
 * @var {function} TaskInfo - TaskInfo component
 * @var {function} setImgSrc - Set image source function
 */
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
