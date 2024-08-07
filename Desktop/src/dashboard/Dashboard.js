import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Map from "../dashboard/Map";
import VoiceCommands from "./VoiceCommands";
import Camera from "./Camera";
import DogCard from "./DogCard";
import "./Dashboard.css";
import socket from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";

/**
 * Dashboard component
 * @returns {JSX.Element}
 * @description Dashboard component for displaying the dashboard
 * @var {object} location - Location
 * @var {function} setLocation - Set location
 * @var {object} doubleCheck - Double check
 * @var {function} setMessage - Set message
 * @var {object} currentTask - Current task
 * @var {function} setCurrentTask - Set current task
 * @var {object} currentUser - Current user
 * @var {function} setCreatedTask - Set created task
 * @var {JSX.Element} - Dashboard component
 */
export default function Dashboard() {

  const {doubleCheck, setMessage, currentTask, setCurrentTask, currentUser, setCreatedTask} = useAuth();

  const [location, setLocation] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
  });

  React.useEffect(() => {
    const handleNewLocation = (data) => {
      console.log("New location received: ", data);
      setLocation({ latitude: data.latitude, longitude: data.longitude });
    };

    socket.on("newLocation", handleNewLocation);
    const intervalId = setInterval(5000); // Request new location every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
      socket.off("newLocation", handleNewLocation); // Clean up the socket listener
    };
  }, []);

  return (
    <Grid container>
      <Grid item >
        <Grid container maxWidth={"xl"} sx={{ mt: 2, ml: 26 }}>
          <Grid container spacing={2}>
            {/* Video */}
            <Grid item md={5} lg={8.7} sx={{ height: "75vh" }}>
              <Camera doubleCheck={doubleCheck} setMessage={setMessage} currentTask={currentTask} setCurrentTask={setCurrentTask} currentUser={currentUser} setCreatedTask={setCreatedTask}/>
            </Grid>

            {/* Map */}
            <Grid item md={3} lg={3}>
              <Paper
                sx={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Map setCurrentTask={setCurrentTask} location={location} />
              </Paper>
    
            </Grid>

            {/* Voice Commands */}
            <Grid item md={5} lg={8.7}>
              <VoiceCommands socket={socket} currentTask={currentTask} />
            </Grid>

            {/* Dog Card */}
            <Grid item md={3} lg={3}>
            <DogCard
                  id={currentTask?.dog?._id}
                  dogName={currentTask?.dog?.name}
                  breed={currentTask?.dog?.breed}
                  age={currentTask?.dog?.age}
                  job={currentTask?.dog?.job}
                />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
