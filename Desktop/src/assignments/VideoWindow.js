import React from 'react';

const PopupVideo = ({videoBuffer}) => {
  const openPopup = () => {
    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.write(
      `<video width="600" height="400" controls>
        <source src="${videoBuffer}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`
    );
  }
};

export default PopupVideo;
