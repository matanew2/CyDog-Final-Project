import React, { useState, useEffect } from "react";
import socket from "../utils/utils";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import DogCard from "../dashboard/DogCard";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PopupVideo from "./VideoWindow";

// Assignment component
const Assignment = ({ id, name, dateCreation, dateFinish, handler }) => {
  const deleteTask = (e) => {
    console.log("Delete icon clicked!");
    e.stopPropagation();
    socket.emit("deleteTask", id); // trigger -> Request dog list from the server
    socket.on("deleteTask", (newTask) => {
      // listen -> Receive dog list from the server
      console.log("task deleted", newTask);
      socket.emit("taskList"); //
    });
  };

  return (
    <Card
      sx={{
        width: 900,
        mb: 1,
        borderRadius: "13px",
        backgroundColor: "#043934",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          style={{ color: "white" }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Add this line
          }}
        >
          <span>
            {name} | {dateCreation} | {dateFinish} | {handler?.name}
          </span>
          <IconButton onClick={deleteTask}>
            <DeleteIcon sx={{ color: "#FF9900" }} />
          </IconButton>
        </Typography>
      </CardContent>
    </Card>
  );
};

// AssignmentsList component
const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [dogList, setDogList] = useState(null);
  const [handlerList, setHandlerList] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [selectDog, setSelectDog] = useState({});
  const [selectHandler, setSelectHandler] = useState({});
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { setCreatedTask, currentTask, setCurrentTask, currentUser } = useAuth();
  const [recordingLink, setRecordingLink] = useState("http://localhost:8000/public/videos/");

  const getAssignments = () => {
    console.log("Requesting task list");
    socket.emit("taskList"); // trigger -> Request dog list from the server

    socket.on("taskList", (taskList) => {
      // console.log("Received task list", taskList);
      setAssignments(taskList);
    });
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const addTask = () => {
    console.log("Add task button clicked!");
    setOpenAddTask(true);
    socket.emit("dogList");
    socket.on("dogList", (dogList) => {
      console.log("Received dog list", dogList);
      setDogList(dogList);
    });

    socket.emit("handlerList");
    socket.on("handlerList", (handlerList) => {
      console.log("Received handler list", handlerList);
      setHandlerList(handlerList);
    });
  };

  const startTask = () => {
    console.log("Start task button clicked!");
    setOpenAddTask(false);
    console.log(taskName, selectDog, selectHandler, description);
    if (!taskName || !selectDog || !selectHandler || !description) {
      alert("Please fill in all fields.");
      return;
    }
    const task = {
      title: taskName,
      dog: selectDog._id,
      handler: selectHandler._id,
      description: description,
      createdAt: new Date(),
    };
    socket.emit("newTask", task); // trigger -> Request dog list from the server
    socket.on("newTask", (newTask) => {
      // listen -> Receive dog list from the server
      console.log("Received new task", newTask);
      if (newTask) {
        setAssignments([...assignments, newTask]);
        setCreatedTask(true);
        setCurrentTask(newTask);
        console.log(currentTask);
        navigate(`/profile/${currentUser?.reloadUserInfo?.localId}/dashboard`);
      }
    });
  };

  return (
    <Grid container sx={{ ml: -1.2 }}>
      <Grid
        container
        justifyContent="flex-start"
        sx={{ mt: 4, ml: 30, gap: 7.6 }}
      >
        {/* NEW TASK */}
        <Grid container sx={{ ml: 25 }} justifyContent="center">
          <Button
            variant="contained"
            onClick={addTask}
            sx={{ backgroundColor: "#FF9900" }}
          >
            <DriveFileRenameOutlineIcon /> New Task
          </Button>
        </Grid>

        {/* TASK LISTS */}
        <Grid
          item
          md={7}
          lg={7.5}
          sx={{
            overflowY: "auto",
            maxHeight: "700px",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#043934",
              borderRadius: "5px",
            },
          }}
        >
          {assignments.map((assignment) => (
            <Grid item sx={{ p: 0, m: 0 }}>
              <Button
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setOpenAddTask(false);
                }}
                sx={{
                  borderColor:
                    selectedAssignment === assignment
                      ? "#30D2C3"
                      : "transparent",
                  borderWidth: 3,
                  borderStyle: "solid",
                  borderRadius: 4,
                  p: 0,
                }}
              >
                <Assignment
                  key={assignment?._id}
                  id={assignment?._id}
                  name={assignment?.title}
                  dateCreation={new Date(assignment?.createdAt).toLocaleString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  dateFinish={new Date(assignment?.dueDate).toLocaleString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  handler={assignment?.handler}
                />
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* TASK DETAILS */}
        <Grid
          item
          md={5}
          lg={4}
          sx={{
            mt: -16,
            borderRadius: "20px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            backgroundColor: "#126D65",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            overflowY: "auto",
            maxHeight: "800px", // Add this line
          }}
        >
          <br />
          {!openAddTask ? (
            <>
              <Typography
                variant="h5"
                sx={{ textAlign: "left", ml: 2, color: "white" }}
              >
                {selectedAssignment
                  ? `Task Name:  ${selectedAssignment?.title}`
                  : ""}
              </Typography>
              <br />
              <Typography
                variant="body1"
                sx={{ textAlign: "left", ml: 2, color: "white" }}
              >
                {selectedAssignment
                  ? `Handler Name:  ${selectedAssignment?.handler.name}`
                  : ""}
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "left", ml: 2, color: "white" }}
              >
                {selectedAssignment
                  ? `Create At:  ${new Date(
                      selectedAssignment.createdAt
                    ).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : ""}
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "left", ml: 2, color: "white" }}
              >
                {selectedAssignment
                  ? `End At:  ${new Date(
                      selectedAssignment.dueDate
                    ).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : ""}
              </Typography>
              <br />
              <Grid item sx={{ ml: 2 }}>
                {selectedAssignment ? (
                  <DogCard
                    breed={selectedAssignment.dog.breed}
                    age={selectedAssignment.dog.age}
                    job={selectedAssignment.dog.job}
                    id={selectedAssignment.dog._id}
                    dogName={selectedAssignment.dog.name}
                  />
                ) : (
                  ""
                )}
              </Grid>
              <br />
              <Typography
                variant="body1"
                sx={{ textAlign: "left", ml: 2, color: "white" }}
              >
                {selectedAssignment ? `Description:` : ""}
              </Typography>

              <Grid item>
                <Typography
                  sx={{
                    fontSize: selectedAssignment ? 15 : 19.5,
                    width: "100%",
                    color: "white",
                    ml: 2,
                  }}
                >
                  {selectedAssignment
                    ? `${selectedAssignment.description}`
                    : "Select an assignment to view details of it."}
                  <br />
                  <br />
                  <Typography sx={{ textAlign: "left", color: "white" }}>
                    {selectedAssignment && selectedAssignment.videoName !== "<no video>" && <PopupVideo name={recordingLink + selectedAssignment.videoName} />}
                  </Typography>
                  <br />
                  {selectedAssignment && "Commands:"}
                  <br />
                  {selectedAssignment &&
                    selectedAssignment.commands.map((command, index) => (
                      <Button
                        fullWidth
                        variant="contained"
                        value={command}
                        sx={{
                          height: "50px",
                          width: "100px",
                          fontSize: "16px",
                          color: "black",
                          backgroundColor: "#EDEDED",
                          margin: "10px",
                        }}
                      >
                        {command}
                      </Button>
                    ))}
                </Typography>
              </Grid>
              <br />
            </>
          ) : (
            <Grid container gap={3} justifyContent="center" padding={2}>
              <Typography
                variant="h5"
                sx={{ textAlign: "left", ml: 2, color: "white" }}
              >
                New Task
              </Typography>
              <br />
              <TextField
                id="outlined-basic"
                label="Task Name"
                variant="outlined"
                onChange={(e) => setTaskName(e.target.value)}
                sx={{ textAlign: "left", ml: 2, width: "80%" }}
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
              />
              <br />
              <TextField
                select
                id="outlined-basic"
                label="Dog Name"
                variant="outlined"
                onChange={(e) => {
                  const selectedDog = dogList.find(
                    (dog) => dog._id === e.target.value
                  );
                  setSelectDog(selectedDog);
                }}
                sx={{ textAlign: "left", ml: 2, width: "80%" }}
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
              >
                {dogList?.map((dog) => (
                  <MenuItem key={dog._id} value={dog._id}>
                    {dog.name}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <TextField
                select
                id="outlined-basic"
                label="Handler Name"
                variant="outlined"
                onChange={(e) => {
                  const selectedHandler = handlerList.find(
                    (handler) => handler._id === e.target.value
                  );
                  setSelectHandler(selectedHandler);
                }}
                sx={{ textAlign: "left", ml: 2, width: "80%" }}
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
              >
                {handlerList?.map((handler) => (
                  <MenuItem key={handler._id} value={handler._id}>
                    {handler.name}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                onChange={(e) => setDescription(e.target.value)}
                sx={{ textAlign: "left", ml: 2, width: "80%" }}
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
              />
              <br />
              <Button
                variant="contained"
                onClick={startTask}
                sx={{ backgroundColor: "#FF9900", ml: 2, mt: 2 }}
              >
                Start Task
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Assignments;
