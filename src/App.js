import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/registerForm";
import UserProfile from "./pages/Profile";
import { loadUser } from "./hooks/requests";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loadUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/profile" replace /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/profile" replace /> : <Register />}
        />
        <Route
          path="/profile"
          element={user ? <UserProfile /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
