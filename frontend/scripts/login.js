const clientId =
  "927889267460-lpv6m59dtuknfsbij1ivrgrhtfc6l923.apps.googleusercontent.com";
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
          "Invalid password. Password must be 8-21 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      } else {
        try {
          const response = await fetch(
            "http://127.0.0.1:5000/api/v1/user/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
              credentials: "include",
            }
          );
          const result = await response.json();
          if (result.data) {
            window.location.href = "./components/profile.html";
          } else {
            alert(result.msg || "Login failed");
          }
        } catch (error) {
          console.error("Login error:", error);
          alert("An error occurred during login");
        }
      }
    });

  // Password visibility toggle
  document
    .getElementById("toggle-password")
    .addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      const eyeIcon = this.querySelector("i");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.setAttribute("data-lucide", "eye-off");
      } else {
        passwordInput.type = "password";
        eyeIcon.setAttribute("data-lucide", "eye");
      }

      lucide.createIcons();
    });

  // Google Sign-In functionality
  function handleCredentialResponse(response) {
    console.log("In response: ", response);
    const id_token = response.credential;

    fetch("http://127.0.0.1:5000/api/v1/user/google", {
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
          window.location.href = "./components/profile.html";
        } else {
          alert("Google sign-in failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during Google sign-in");
      });
  }

  // // Initialize Google Sign-In
  // google.accounts.id.initialize({
  //   client_id:
  //     "927889267460-lpv6m59dtuknfsbij1ivrgrhtfc6l923.apps.googleusercontent.com",
  //   callback: handleCredentialResponse,
  // });

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
    scope: "https://www.googleapis.com/auth/userinfo.profile",
    // scope: "openid profile email",
    // prompt: "select_account",
    include_grant_scopes: true,
    state: "pass_through_value",
  };

  for (const key in params) {
    // if (Object.prototype.hasOwnProperty.call(object, key)) {
    //   const element = object[key];

    // }
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", params[key]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
