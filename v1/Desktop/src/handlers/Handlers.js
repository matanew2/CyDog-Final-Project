import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import DogCard from "../dashboard/DogCard";
import Button from "@mui/material/Button";
import socket from "../utils/utils";

/**
 * @param {string} name - Handler's name
 * @param {string} ID - Handler's ID
 * @param {string} job - Handler's job
 * @returns {JSX.Element} - Handler component
 * @description Handler component for displaying handler information
 */
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

/**
 * @returns {JSX.Element} - Handlers component
 * @description Handlers component for displaying handler list
 * and handler details
 * @var {array} handlers - List of handlers
 * @var {object} selectedHandler - Selected handler
 * @var {function} getHandlerList - Get handler list function
 * @var {function} setSelectedHandler - Set selected handler function
 * @var {function} setHandlers - Set handlers function
 * @var {function} useEffect - Side effect hook
 * @var {function} useState - Hook for managing local state
 * @var {function} socket - Socket.io client
 * @var {JSX.Element} - Handlers component
 * @description Handlers component for displaying handler list
 * and handler details
 */
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
    <Grid container sx={{ ml: -1.2 }}>
        <Grid container justifyContent="flex-start" sx={{ mt: 9, ml: 30 }}>
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
            lg={4}
            sx={{
              mt: -9,
              borderRadius: "20px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#126D65",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
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
              {!selectedHandler ? "No handler selected" : "Tasks:"}
              {selectedHandler?.tasks?.length > 0 ? (
                  <List >
                    {selectedHandler?.tasks.map((assignment) => (
                      <><br />
                        <Typography
                          variant="h6"
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
                        <Grid item sx={{mb: 2}}>
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
              ) : (
                <Typography
                  variant="h6"
                  sx={{ textAlign: "left", ml: 2, color: "white" }}
                >
                  {!selectedHandler ? "Select a handler to view tasks" : "No tasks"}
                </Typography>
              )}
            </Typography>
            <br />
          </Grid>
        </Grid>
    </Grid>
  );
};

export default Handlers;
