import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/registerForm";
import UserProfile from "./pages/Profile";
import { loadUser } from "./hooks/requests";

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loadUser();
        console.log("User Data: ", userData);
        setUser(userData);
        if (
          userData &&
          (location.pathname === "/" || location.pathname === "/register")
        ) {
          navigate("/profile", { replace: true });
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, location]);

  if (loading) {
    <LoadingSpinner />;
  }

  return children({ user });
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthWrapper>
        {({ user }) => (
          <Routes>
            <Route
              path="/"
              element={
                user ? <Navigate to="/profile" replace /> : <LoginForm />
              }
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
        )}
      </AuthWrapper>
    </BrowserRouter>
  );
};

export default App;
