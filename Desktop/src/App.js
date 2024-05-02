import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Login from "./login/Login";
import Menu from "./Menu/menu";
import Assignments from "./assignments/Assignments";
import Box from "@mui/material/Box";
import DogLists from "./dogLists/DogLists";
import Handlers from "./handlers/Handlers";
import {WithPrivateRoute,CreateTaskPrivateRoute} from "./auth/Auth";
import Register from "./login/Register";
import ErrorMessage from "./error/ErrorMessage";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorMessage />
        <Box className="blur-background">
          <Menu />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/profile/:userId/dashboard"
              element={
                <WithPrivateRoute> 
                  <CreateTaskPrivateRoute>
                  <Dashboard />
                  </CreateTaskPrivateRoute>
                </WithPrivateRoute>
              }
            />
            <Route
              path="/profile/:userId/dog-lists"
              element={
                <WithPrivateRoute>
                  <DogLists />
                </WithPrivateRoute>
              }
            />
            <Route
              path="/profile/:userId/handlers"
              element={
                <WithPrivateRoute>
                  <Handlers />
                </WithPrivateRoute>
              }
            />
            <Route
              path="/profile/:userId/tasks"
              element={
                <WithPrivateRoute>
                  <Assignments />
                </WithPrivateRoute>
              }
            />
          </Routes>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
