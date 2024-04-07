import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import "./Camera.css";

function Camera() {
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
    data.append('video', blob, `recorded_video${uuidv4()}.webm`);
  
    // Send the FormData instance to the server
    axios.post('http://192.168.1.5:8000/save-video', data)
      .then(response => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
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
