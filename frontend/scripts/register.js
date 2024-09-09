document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const contact_number = document.getElementById("contact_number").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch("http://127.0.0.1:4001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email, contact_number }),
      credentials: "include",
    });
    const result = await response.json();
    // handle response
    if (result.ok) {
      window.location.href = "./index.html";
    } else {
      alert(result.message);
    }
  });
