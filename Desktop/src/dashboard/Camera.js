import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import socket from "../utils/utils";
import Button from "@mui/material/Button";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import useAuth from "../contexts/AuthContext";
import "./Camera.css";

function Camera({currentTask, setCurrentTask}) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setPermission(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const handleStartRecording = () => {
    setRecording(true);
    mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.onstop = handleStopRecording;
    mediaRecorderRef.current.start(10); // collect 10ms of data
    setRecordedChunks([]);
  };
  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      setRecordedChunks((prev) => prev.concat(e.data));
    }
  };
  const handleStopRecording = () => {
    if (mediaRecorderRef.current.state !== "recording") {
      return;
    }

    mediaRecorderRef.current.stop();
    setRecording(false);

    const blob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    // Create a new FormData instance
    const data = new FormData();

    // Append the blob to the FormData instance
    const videoFileName = `recorded_video${uuidv4()}.webm`;

    const tempTask = {...currentTask};
    tempTask.videoName = videoFileName;
    setCurrentTask({...tempTask});
  
    data.append("video", blob, videoFileName);

    // Send the FormData instance to the server
    axios
      .post("http://localhost:8000/save-video/"+currentTask._id, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Grid
      item
      container
      className="camera"
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Camera Stream */}
      <Grid item xs={12}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            transform: "rotateY(180deg)",
          }}
        />
      </Grid>

      {/* Record Button */}
      <Grid item sx={{ top: 6, maxWidth: "15%", position: "absolute" }}>
        <Link
          to="/tasks"
          style={{ textDecoration: "none" }}
          onClick={() => {
            handleStopRecording();
          }}
        >
          <ListItemButton
            sx={{ backgroundColor: "red", borderRadius: 3 }}
          >
            <ListItemIcon sx={{ minWidth: "35px" }}>
              <AssignmentTurnedInIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Finish" sx={{ color: "white" }} />
          </ListItemButton>
        </Link>
      </Grid>

      {/* Record Button */}
      <Grid item className="recordButton">
        {!permission ? (
          <Button
            onClick={() => setPermission(true)}
            style={{ width: "100%", height: "100%" }}
          ></Button>
        ) : (
          <Button
            onClick={recording ? handleStopRecording : handleStartRecording}
            className={recording ? "recording" : ""}
            style={{
              height: "100%",
              border: "none",
              backgroundColor: recording ? "red" : "initial",
              filter: recording ? "blur(20px)" : "none",
            }}
          ></Button>
        )}
      </Grid>
    </Grid>
  );
}

export default Camera;
