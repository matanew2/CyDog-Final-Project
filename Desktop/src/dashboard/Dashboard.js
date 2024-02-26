import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Map from "../dashboard/Map";
import VoiceCommands from "./VoiceCommands";
import Camera from "./Camera";
import DogCard from "./DogCard";
import "./Dashboard.css";
import io from "socket.io-client";

const socket = io.connect("http://10.0.0.10:8000");

const drawerWidth = 268;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Dashboard() {
  const [location, setLocation] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
  });

  React.useEffect(() => {
    socket.on("newLocation", (data) => {
      console.log(data);
      setLocation({ latitude: data.latitude, longitude: data.longitude });
    });
  }, []);

  return (
    <Grid container>
      <Grid item>
        <Grid container maxWidth={"xl"} sx={{ mt: 2, ml: 30 }}>
          <Grid container spacing={3}>
            {/* Video */}
            <Grid item md={5} lg={7} sx={{ height: "75vh" }}>
              <Camera />
            </Grid>

            {/* Map */}
            <Grid item md={3} lg={4}>
              <Paper
                sx={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Map location={location} />
              </Paper>
    
            </Grid>

            {/* Voice Commands */}
            <Grid item md={5} lg={7}>
              <VoiceCommands socket={socket} />
            </Grid>

            {/* Dog Card */}
            <Grid item md={3} lg={4}>
              <DogCard dogName={"Marvin"} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
