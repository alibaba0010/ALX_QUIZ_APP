import axios from "axios";
const API_URL = "http://127.0.0.1:5000/api/v1";
export const registerUser = async (
  username,
  email,
  password,
  confirmPassword
) => {
  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      confirmPassword,
    }),
    credentials: "include",
  });

  const result = await response.json();

  return result;
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/login`,
      { email, password },
      { withCredentials: true }
    );
    const result = await response.data;
    return result;
  } catch (error) {
    alert("Login failed:");
  }
};
export const loadUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const result = await response.data;

    return result;
  } catch (error) {
    alert("Error loading user data");
  }
};
