document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const checkEmail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const email = isValidEmail(checkEmail);
    if (!email) {
      alert("Invalid email");
    } else if (password !== confirmPassword) {
      alert("Password does not match");
    } else {
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
      if (result.ok) {
        window.location.href = "../components/login.html";
      } else {
        alert(result.message);
      }
    }
  });

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
