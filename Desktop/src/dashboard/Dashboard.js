import * as React from "react";
import io from "socket.io-client";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItems from "./listItems";
import Map from "../dashboard/Map";
import VoiceCommands from "./VoiceCommands";
import Camera from "./Camera";
import DogCard from "./DogCard";
import "./Dashboard.css";

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
  const [open, setOpen] = React.useState(true);
  const [location, setLocation] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
  });
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const socket = io(
      "https://34bb-2a06-c701-7436-5900-a809-dc39-3aeb-eb6b.ngrok-free.app"
    ); // Replace with your server URL

    socket.on("connection", (socket) => {
      socket.on("newLocation", (loc) => {
        console.log("location", loc);
        setLocation(loc);
      });
      socket.on("error", (error) => {
        console.error("Socket.IO error", error);
      });
    });

    // Cleanup function to disconnect when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <Grid container>
      <Grid item>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              backgroundColor: "#126D65",
              px: [1],
            }}
          >
            {open && <Grid item className="logo" />}
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
          <List
            component="nav"
            sx={{
              height: "95vh",
              backgroundColor: "#126D65",
            }}
          >
            {<ListItems />}
          </List>
        </Drawer>
      </Grid>
      <Grid item>
        <Box className="blur-background">
          {/* <Toolbar /> */}
          <Grid container maxWidth={open ? "xl" : "xxl"} sx={{ mt: 2, ml: 1 }}>
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
                  <Map
                    latitude={location.latitude}
                    longitude={location.longitude}
                  />
                </Paper>
                =
              </Grid>

              {/* Voice Commands */}
              <Grid item md={5} lg={7}>
                <VoiceCommands />
              </Grid>

              {/* Dog Card */}
              <Grid item md={3} lg={4}>
                <DogCard dogName={"Marvin"} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
