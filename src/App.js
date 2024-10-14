import "./App.css";
import LoginForm from "./pages/LoginForm";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/registerForm";
import UserProfile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LoginForm />} />
        <Route path="/register" exact element={<Register />} />
        <Route path="/profile" exact element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
