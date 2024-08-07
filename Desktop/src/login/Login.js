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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircularProgress } from "@mui/material";


/**
 * Login component
 * @returns {JSX.Element}
 * @var {string} email - User's email
 * @var {string} password - User's password
 * @var {boolean} loading - Loading state
 * @var {function} setEmail - Set email state
 * @var {function} setPassword - Set password state
 * @var {function} setLoading - Set loading state
 * @var {function} handleSubmit - Handle submit function
 * @var {function} navigate - Navigation function
 * @var {object} currentUser - Current user object
 * @var {function} login - Login function
 * @var {function} setMessage - Set message function
 * @description Login component for user login
 */
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, login, setMessage } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setMessage("");
      
      navigate("/profile/" + currentUser.reloadUserInfo.localId+"/tasks");
    }
  }, [currentUser, navigate, setMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
    } catch (e) {
      setMessage("Failed to login: Invalid email or password");
    } finally {
      setLoading(false);
    }
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
          Login
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
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Grid>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#3f51b5",
                  marginLeft: "5px",
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Grid>
  );
};

export default Login;
