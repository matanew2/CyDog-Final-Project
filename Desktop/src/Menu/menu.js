import React from "react";
import Grid from "@mui/material/Grid";
import ListItems from "./listItems";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

function Menu() {

  const {logout} = useAuth();
  
  return (
    <Grid container>
      <Grid item>
        <Drawer variant="permanent" open={true}>
          <Toolbar
            sx={{
              backgroundColor: "#126D65",
              px: [2],
              py: [2], // padding on the x and y axis
            }}
          >
            <Grid item className="logo" />
          </Toolbar>
          <Box
            component="nav"
            sx={{
              height: "95vh",
              backgroundColor: "#126D65",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <List>
              <ListItems />
            </List>
            <Button
              sx={{
                color: "white",
                backgroundColor: "#126D66",
                fontSize: "15px",
                fontWeight: "bold",
              }}
              onClick={logout}
              variant="contained"
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Drawer>
      </Grid>
    </Grid>
  );
}

export default Menu;
