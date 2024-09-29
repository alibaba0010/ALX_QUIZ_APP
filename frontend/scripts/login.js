function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/;
  return passwordRegex.test(password);
}

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const checkEmail = isValidEmail(email);
    const checkPassword = isValidPassword(password);
    if (!checkEmail) {
      alert("Invalid email");
    } else if (!checkPassword) {
      alert(
        "Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      const response = await fetch("http://127.0.0.1:5000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const result = await response.json();
      // handle response
      if (result.data) {
        window.location.href = "../components/quiz.html";
      } else {
        alert(result.msg);
      }
    }
  });

// Google Sign-In functionality
function handleCredentialResponse(response) {
  // Send the ID token to your server
  const id_token = response.credential;

  fetch("http://127.0.0.1:5000/api/v1/user/google-signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: id_token }),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "../components/quiz.html";
      } else {
        alert("Google sign-in failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during Google sign-in");
    });
}

// Initialize Google Sign-In
window.onload = function () {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID",
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
    theme: "outline",
    size: "large",
  });
};
