import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Login from "./login/Login";
import Menu from "./Menu/menu";
import Assignments from "./assignments/Assignments";
import Box from "@mui/material/Box";
import DogLists from "./dogLists/DogLists";
import Handlers from "./handlers/Handlers";

function App() {
  return (
    <BrowserRouter>
      <Box className="blur-background">
        <Menu />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dog-lists" element={<DogLists />} />
          <Route path="/handlers" element={<Handlers />} />
          <Route path="/tasks" element={<Assignments />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
