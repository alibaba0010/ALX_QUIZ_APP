document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadUser();
});

async function loadUser() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (result.data) {
      document.title = `${result.data.username}'s Profile - ALX Quiz App`;
      document.getElementById("username").textContent = result.data.username;
    } else {
      window.location.href = "../index.html";
      alert(result.msg || "Failed to load user data");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("An error occurred while loading user data");
  }
}
