const clientId =
  "927889267460-lpv6m59dtuknfsbij1ivrgrhtfc6l923.apps.googleusercontent.com";

const DEPLOYED_URL = "https://alx-quiz-app.onrender.com";
let LOCAL_URL = "http://127.0.0.1:5000";
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
          const response = await fetch(`${LOCAL_URL}/api/v1/user/register`, {
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
  // Custom Google Sign-In button
  document
    .getElementById("custom-google-signin")
    .addEventListener("click", function () {
      googleSignIn();
    });
});

function googleSignIn() {
  let oauthEndPoint = "https://accounts.google.com/o/oauth2/v2/auth";
  // form to submit parameters to OAuth 2.0 endpoint
  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauthEndPoint);

  let params = {
    client_id: clientId,
    redirect_uri: "http://127.0.0.1:5501/components/profile.html",
    response_type: "token",
    scope: "openid profile email",
    include_grant_scopes: true,
    state: "pass_through_value",
  };

  for (const key in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", params[key]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
