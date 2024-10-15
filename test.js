import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/registerForm";
import UserProfile from "./pages/Profile";

// const AuthWrapper = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await loadUser();
//         console.log("User Data: ", userData);
//         setUser(userData);
//         if (
//           userData &&
//           (location.pathname === "/" || location.pathname === "/register")
//         ) {
//           navigate("/profile", { replace: true });
//         }
//       } catch (error) {
//         console.error("Failed to load user:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate, location]);

//   if (loading) {
//     <LoadingSpinner />;
//   }

//   return children({ user });
// };

const App = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
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
