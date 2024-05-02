import React, { useState, useRef } from "react";
import Modal from "react-modal";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./VideoWindow.css";

Modal.setAppElement("#root"); // replace '#root' with the id of your app's root element

const PopupVideo = ({ name }) => {
  // Replace this URL with the URL of your .webm video
  const videoUrl = name;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const videoRef = useRef(null);

  const openPopup = () => {
    setModalIsOpen(true);
  };

  const closePopup = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      Recording: <br />
      <br />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={openPopup}
          style={{
            backgroundColor: "black",
            height: "200px",
            width: "400px",
            borderRadius: "15px",
          }}
        >
          <PlayArrowIcon sx={{ height: "50px", width: "100px" }} />
        </Button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closePopup}
          contentLabel="Video Modal"
          style={{
            content: {
              position: "fixed",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#126D65",
              borderRadius: "20px",
            },
          }}
        >
          <Box display="flex" justifyContent="flex-end" gap="10px">
            <IconButton
              onClick={closePopup}
              style={{ cursor: "pointer", color: "black" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <video
            className="flipped-video"
            controls
            ref={videoRef}
            width="100%"
            height="100%"
            style={{ borderRadius: "20px" }}
          >
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </Modal>
      </Box>
    </>
  );
};

export default PopupVideo;
