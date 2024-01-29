import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./VoiceCommands.css";

function CommandButton({ command, selectedCommand, handleCommandClick }) {
  return (
    <Button
      fullWidth
      variant="contained"
      value={command}
      sx={{
        height: "50px",
        width: "150px",
        fontSize: "16px",
        color: "black",
        backgroundColor:
          selectedCommand === command
            ? "rgba(150, 255, 200, 2)"
            : "rgba(255, 255, 255, 0.5)",
        filter: "drop-shadow(0 0 5px white)",
        margin: "10px",
      }}
      onClick={handleCommandClick}
    >
      {command}
    </Button>
  );
}

export default function VoiceCommands({ socket }) {
  // eslint-disable-next-line
  const [commands, setCommands] = useState([
    "bark",
    "bite",
    "down",
    "jump",
    "sit",
    "stand",
    "stay",
  ]);
  const [selectedCommand, setSelectedCommand] = useState(null);

  const sendToDog = async () => {
    socket.emit("command", selectedCommand);
  };

  const handleCommandClick = (event) => {
    setSelectedCommand(event.target.value);
  };

  return (
    <React.Fragment>
      <Grid
        container
        className="list"
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "22vh" }}
      >
        <Grid
          item
          sx={{
            overflowY: "auto",
            backgroundColor: "#043934",
            borderRadius: "10px",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#126D65",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.8)",
            },
          }}
        >
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            {commands.map((command, index) => (
              <Grid item key={index}>
                <CommandButton
                  command={command}
                  selectedCommand={selectedCommand}
                  handleCommandClick={handleCommandClick}
                />
              </Grid>
            ))}
            <Grid item margin={1}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#FF9900",
                }}
                sx={{
                  height: "50px",
                  width: "150px",
                  fontSize: "16px",
                  color: "black",
                  filter: "drop-shadow(0 0 5px white)",
                }}
                onClick={sendToDog}
              >
                <Typography variant="subtitle2">Send To Dog</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
