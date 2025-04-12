import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  InputAdornment,
  Box,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

/**
 * Register component
 * @returns {JSX.Element}
 * @var {string} email - User's email
 * @var {string} password - User's password
 * @var {string} confirmPassword - User's password confirmation
 * @var {boolean} loading - Loading state
 * @var {function} setEmail - Set email state
 * @var {function} setPassword - Set password state
 * @var {function} setConfirmPassword - Set confirmPassword state
 * @var {function} setLoading - Set loading state
 * @var {function} handleSubmit - Handle submit function
 * @var {function} navigate - Navigation function
 * @var {object} currentUser - Current user object
 * @var {function} register - Register function
 * @var {function} setMessage - Set message function
 * @description Register component for user registration
 */
const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, register, setMessage } = useAuth();

  // Redirect to tasks page if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/profile/" + currentUser.reloadUserInfo.localId + "/tasks");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      setMessage("");
      setLoading(true);
      await register(email, password);
    } catch (e) {
      setMessage("Failed to register user");
    }

    setLoading(false);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      style={{ height: "100vh" }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Avatar style={{ margin: "0 auto", backgroundColor: "#3f51b5" }}>
          <AccountCircleIcon />
        </Avatar>
        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              startIcon={<PersonIcon />}
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              className="register-button"
              size="large"
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Grid>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#3f51b5",
                  marginLeft: "5px",
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Grid>
  );
};

export default Register;
