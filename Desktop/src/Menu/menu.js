import React from "react";
import Grid from "@mui/material/Grid";
import ListItems from "./listItems";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";

function Menu() {
  return (
    <Grid container>
      <Grid item>
        <Drawer variant="permanent" open={true}>
          <Toolbar
            sx={{
              backgroundColor: "#126D65",
              px: [2], py: [2], // padding on the x and y axis
            }}
          >
            <Grid item className="logo" />
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
    </Grid>
  );
}

export default Menu;
