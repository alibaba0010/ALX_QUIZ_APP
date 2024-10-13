const API_URL = "http://127.0.0.1:5000/api/v1/";
export const registerUser = async (
  username,
  email,
  password,
  confirmPassword
) => {
  try {
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

    //   if (result.data) {
    //       window.location.href = "/login";
    //   } else {
    //     alert(result.msg);
    //   }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
};
