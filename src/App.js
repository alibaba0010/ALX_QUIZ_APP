import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/registerForm";
import UserProfile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<LoginForm />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
};

export default App;
