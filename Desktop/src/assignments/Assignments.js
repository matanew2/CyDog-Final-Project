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

// Assignment component
// Assignment component
const Assignment = ({ name, dateCreation, dateFinish, handler }) => {
  return (
    <Card sx={{ width: 900, mb: 1 }} style={{ backgroundColor: "#043934" }}>
      <CardContent>
        <Typography variant="h6" component="div" style={{ color: "white" }}>
          {name} | {dateCreation.toLocaleString()} |{" "}
          {dateFinish.toLocaleString()} | {handler}
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
          <Grid container item md={7} lg={7} spacing={1}>
            {/* TASK LISTS */}
            {assignments.map((assignment) => (
              <Grid item>
                <Assignment
                  key={assignment.id}
                  name={assignment.name}
                  dateCreation={assignment.dateCreation}
                  dateFinish={assignment.dateFinish}
                  handler={assignment.handler}
                />
              </Grid>
            ))}
          </Grid>

          <Grid
            item
            md={5}
            lg={3}
            sx={{
              mt: -10,
              ml: 6,
              borderRadius: "20px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#126D65",
            }}
          >
            <Typography variant="body1">{selectedAssignment.name}</Typography>
            <Typography variant="body1">
              {selectedAssignment.handler}
            </Typography>
            <Typography variant="body1">
              {selectedAssignment.dateCreation.toLocaleString()}
            </Typography>
            <Typography variant="body1">
              {selectedAssignment.dateFinish.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Assignments;
