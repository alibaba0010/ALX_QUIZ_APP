document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const checkEmail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const email = isValidEmail(checkEmail);
    if (!email) {
      alert("Invalid email");
    } else {
      const response = await fetch("http://127.0.0.1:5000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const result = await response.json();
      // handle response
      if (result.ok) {
        if (result.is_admin) {
          window.location.href = "./admin/dashboard.html";
          return;
        }
        window.location.href = "./profile.html";
      } else {
        alert(result.message);
      }
    }
  });
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
