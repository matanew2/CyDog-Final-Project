import React,{useState, useEffect} from "react";
import { Grid, Typography, Box } from "@mui/material";
import "./DogCard.css";

const DogInfo = ({ className, children }) => (
  <Typography sx={{ color: "white", fontSize: "14px" }} className={className}>
    {children}
  </Typography>
);

const DogCard = ({ id, dogName, breed, age, job }) => {
  
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    import(`../images/${id}/${dogName}.png`)
      .then((image) => {
        setImgSrc(image.default);
      })
      .catch((error) => {
        console.error(`Error loading image: ${error}`);
      });
  }, [id, dogName]);
  
  return (
    <Grid
      container
      className="rectangle-e"
      direction="row"
      sx={{ height: "22vh" }}
      alignItems="center"
    >
      <Grid
        item
        alignItems="center"
        justifyContent="center"
        sx={{
          px: "25px",
          py: "25px",
        }}
      >
    <Grid  item>
      <img src={imgSrc} alt={dogName} className="dog-pic"/>
    </Grid>      </Grid>
      <Grid item sx={{ px: "12px", py: "30px" }}>
        <DogInfo>
          {dogName} | {breed}
        </DogInfo>
        <DogInfo>{age} years old</DogInfo>
        <DogInfo>{job}</DogInfo>
        <DogInfo>ID:{id}</DogInfo>
      </Grid>
    </Grid>
  );
};

export default DogCard;
