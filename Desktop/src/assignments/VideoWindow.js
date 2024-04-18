import React from "react";

const PopupVideo = ({name}) => {
  // Replace this URL with the URL of your .webm video
  const videoUrl = name;
  console.log(videoUrl);

  const openPopup = () => {
    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.write(
      `<video width="600" height="400" controls>
        <source src="${videoUrl}" type="video/webm">
        Your browser does not support the video tag.
      </video>`
    );
  };

  return (
    <div>
      Video: &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={openPopup}>Open Video</button>
    </div>
  );
};

export default PopupVideo;