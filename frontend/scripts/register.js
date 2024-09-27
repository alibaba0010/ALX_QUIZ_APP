const registerButton = document.getElementById("register-form");
registerButton.addEventListener("submit", async function (event) {
  event.preventDefault();
  registerButton.style.backgroundColor = "#001e4d";
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
      "Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  } else if (password !== confirmPassword) {
    alert("Password does not match");
  } else {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/register", {
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
      const check = result.data;
      console.log("Check ", check);
      console.log("Check 2", check.username);
      window.location.href = "../index.html";
    } else {
      alert(result.msg);
    }
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/;
  return passwordRegex.test(password);
}
