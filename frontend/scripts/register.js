function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/;
  return passwordRegex.test(password);
}

document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons();

  document
    .getElementById("register-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-password")
        .value.trim();

      const checkEmail = isValidEmail(email);
      const checkPassword = isValidPassword(password);

      if (!checkEmail) {
        alert("Invalid email");
      } else if (!checkPassword) {
        alert(
          "Invalid password. Password must be 8-21 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      } else if (password !== confirmPassword) {
        alert("Passwords do not match");
      } else {
        try {
          const response = await fetch(
            "http://127.0.0.1:5000/api/v1/user/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username,
                email,
                password,
                confirmPassword,
              }),
              credentials: "include",
            }
          );

          const result = await response.json();
          if (result.data) {
            console.log("Registration successful:", result.data);
            window.location.href = "../index.html";
          } else {
            alert(result.msg || "Registration failed");
          }
        } catch (error) {
          console.error("Registration error:", error);
          alert("An error occurred during registration");
        }
      }
    });

  // Password visibility toggle
  document.querySelectorAll(".toggle-password").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const eyeIcon = this.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        eyeIcon.setAttribute("data-lucide", "eye-off");
      } else {
        input.type = "password";
        eyeIcon.setAttribute("data-lucide", "eye");
      }

      lucide.createIcons();
    });
  });
});

// Google Sign-Up functionality
function handleCredentialResponse(response) {
  const id_token = response.credential;

  fetch("http://127.0.0.1:5000/api/v1/user/google-signup", {
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
        console.log("Google sign-up successful");
        window.location.href = "../index.html";
      } else {
        alert("Google sign-up failed: " + (data.message || "Unknown error"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during Google sign-up");
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
    text: "signup_with",
  });
};
