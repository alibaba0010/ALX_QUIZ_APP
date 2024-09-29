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
      // }
    });
});

// Google Sign-In functionality
// Google Sign-In functionality
// function handleCredentialResponse(response) {
//   console.log("In response");
//   const id_token = response.credential;

//   fetch("http://127.0.0.1:5000/api/v1/user/google", {
//     method: "GET",
//     credentials: "include",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         window.location.href = "./components/profile.html";
//       } else {
//         alert("Google sign-in failed: " + (data.message || "Unknown error"));
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert("An error occurred during Google sign-in");
//     });
// }

// Initialize Google Sign-In
window.onload = function () {
  // google.accounts.id.initialize({
  //   client_id:
  //     "927889267460-lpv6m59dtuknfsbij1ivrgrhtfc6l923.apps.googleusercontent.com",
  //   callback: handleCredentialResponse,
  // });
  // google.accounts.id.renderButton(document.getElementById("google-signin"), {
  //   theme: "outline",
  //   size: "large",
  // });
};
document
  .getElementById("google-signin")
  .click(() => (window.href = "http://localhost:5000/api/user/google"));
