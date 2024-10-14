import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Typography,
  Container,
  Box,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadUser } from "../hooks/requests";
function UserProfile() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [axiosInstance, setAxiosInstance] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage on component mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  useEffect(() => {
    loadUser();
  }, []);

  const handleStartQuiz = () => {
    clearLocalStorage();
    navigate("/quiz");
  };

  const handleLastQuiz = () => {
    navigate("/past-question");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/user/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      if (result.data) {
        alert(result.data);
        navigate("/");
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Profile
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Card sx={{ maxWidth: 345, margin: "auto", marginTop: 4 }}>
          <CardMedia
            component="img"
            height="140"
            image="/placeholder.svg?height=140&width=345"
            alt="profile background"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                {username.charAt(0)}
              </Avatar>
              <Typography variant="h5" component="div">
                {username}
              </Typography>
            </Box>
            <Box sx={{ "& > button": { m: 1 } }}>
              <Button variant="contained" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
              <Button variant="contained" onClick={handleLastQuiz}>
                Show Last Quiz
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default UserProfile;
