import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Box,
  List,
  Button,
} from "@mui/material";
import DogCard from "../dashboard/DogCard";
import socket from "../utils/utils";

// Dog component
const Dog = ({ name, ID, job }) => {
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
            {ID} | {name} | {job}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

// DogList component
const DogList = () => {
  const [doglists, setDogLists] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);

  const getDogList = () => {
    console.log("Requesting dog list");
    socket.emit("dogList"); // trigger -> Request dog list from the server

    socket.on("dogList", (dogList) => {
      console.log("Received dog list", dogList);
      setDogLists(dogList);
    });
  };

  useEffect(() => {
    getDogList();
  }, []);

  return (
    <Grid container sx={{ ml: -1.2 }}>
        <Grid container justifyContent="flex-start" sx={{ mt: 9, ml: 30 }}>
          {/* DOG LISTS */}
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
            {doglists.map((dog) => (
              <Grid item sx={{ p: 0, m: 0 }}>
                <Button
                  onClick={() => setSelectedDog(dog)}
                  sx={{
                    borderColor:
                      selectedDog === dog ? "#30D2C3" : "transparent",
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderRadius: 4,
                    p: 0,
                  }}
                >
                  <Dog
                    key={dog._id}
                    name={dog.name}
                    ID={dog._id}
                    job={dog.job}
                  />
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* DOG DETAILS */}
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
              "&::-webkit-scrollbar": { width: "10px" },
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
              {selectedDog ? `Dog Name: ${selectedDog?.name}` : "Select a dog"}
            </Typography>
            <br />
            <Grid item sx={{ ml: 2 }}>
              {selectedDog ? (
                <DogCard
                  id={selectedDog?._id}
                  dogName={selectedDog?.name}
                  breed={selectedDog?.breed}
                  age={selectedDog?.age}
                  job={selectedDog?.job}
                  avatar={selectedDog?.avatar}
                />
              ) : (
                ""
              )}
            </Grid>
            <br />
            <Grid item sx={{ ml: 2 }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "left", color: "white" }}
              >
                Assignments:
                {selectedDog?.tasks?.length > 0 ? (
                  <Paper
                    sx={{
                      backgroundColor: "transparent",
                      borderRadius: "13px",
                      width: 360,
                    }}
                  >
                    <List>
                      {selectedDog?.tasks.map((assignment) => (
                        <Box mb={2}>
                          <Paper
                            sx={{
                              backgroundColor: "#043934",
                              borderRadius: "13px",
                              width: 360,
                            }}
                          >
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
                              <br />
                              Handler: {assignment.handler.name} <br />
                              <br />
                            </Typography>
                          </Paper>
                        </Box>
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
            </Grid>
            <br />
          </Grid>
        </Grid>
    </Grid>
  );
};

export default DogList;
