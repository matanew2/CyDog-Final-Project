import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import DogCard from "../dashboard/DogCard";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TaskCard from "../dashboard/TaskCard";
import socket from "../utils/utils";

// Assignment component
const Handler = ({ name, ID, job }) => {
  return (
    <Card
      sx={{
        width: 900,
        mb: 1,
        borderRadius: "13px",
        backgroundColor: "#043934",
      }}
    >
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
            {name} | {job} | {ID}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

// DogListList component
const Handlers = () => {
  const [handlers, setHandlers] = useState([]);
  const [selectedHandler, setSelectedHandler] = useState(null);

  const getHandlerList = () => {
    console.log("Requesting handler list");
    socket.emit("handlerList"); // trigger -> Request dog list from the server

    socket.on("handlerList", (handlerList) => {
      console.log("Received handler list", handlerList);
      setHandlers(handlerList);
    });
  };

  useEffect(() => {
    getHandlerList();
  }, []);

  return (
    <Grid container>
      <Grid item>
        <Grid container justifyContent="flex-start" sx={{ mt: 9, ml: 31 }}>
          {/* TASK LISTS */}
          <Grid
            item
            md={7}
            lg={8}
            sx={{
              overflowY: "auto",
              maxHeight: "700px",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#043934",
                borderRadius: "5px",
              },
            }}
          >
            {handlers.map((handler) => (
              <Grid item sx={{ p: 0, m: 0 }}>
                <Button
                  onClick={() => setSelectedHandler(handler)}
                  sx={{
                    borderColor:
                      selectedHandler === handler ? "#30D2C3" : "transparent",
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderRadius: 4,
                    p: 0,
                  }}
                >
                  <Handler
                    key={handler._id}
                    name={handler.name}
                    ID={handler._id}
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
              ml: 4,
              borderRadius: "20px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#126D65",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              overflowY: "auto",
              overflowY: "auto",
              maxHeight: "800px",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#043934",
                borderRadius: "5px",
              },
            }}
          >
            <br />

            <Typography
              variant="h5"
              sx={{ textAlign: "left", ml: 2, color: "white" }}
            >
              {selectedHandler?.name}
            </Typography>
            <Typography
              variant="body"
              sx={{ textAlign: "left", ml: 2, color: "white" }}
            >
              {selectedHandler ? `Handler | ${selectedHandler?._id}` : ""}
            </Typography>
            <br />
            <Typography
              variant="h5"
              sx={{ textAlign: "left", ml: 2, color: "white" }}
            >
              Assignments:
              {selectedHandler?.tasks?.length > 0 ? (
                <Paper
                  sx={{
                    backgroundColor: "#043934",
                    borderRadius: "13px",
                    width: 360,
                  }}
                >
                  <List>
                    {selectedHandler?.tasks.map((assignment) => (
                      <>
                        <Typography
                          variant="h5"
                          sx={{ textAlign: "left", ml: 2, color: "white" }}
                        >
                          {assignment.title} <br />
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "left", ml: 2, color: "white" }}
                        >
                          Create At:{" "}
                          {new Date(assignment.createdAt).toLocaleString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          <br />
                          End At:{" "}
                          {new Date(assignment.dueDate).toLocaleString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                        </Typography>
                        <Grid item sx={{mb: -1}}>
                          <DogCard
                            key={assignment.dog._id}
                            id={assignment.dog._id}
                            dogName={assignment.dog.name}
                            breed={assignment.dog.breed}
                            age={assignment.dog.age}
                            job={assignment.dog.job}
                          />
                        </Grid>
                      </>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Typography
                  variant="h6"
                  sx={{ textAlign: "left", ml: 2, color: "white" }}
                >
                  No assignment
                </Typography>
              )}
            </Typography>
            <br />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Handlers;
