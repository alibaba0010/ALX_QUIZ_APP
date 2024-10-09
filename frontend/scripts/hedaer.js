// let DEPLOYED_URL = "https://alx-quiz-app.onrender.com";
// let LOCAL_URL = "http://127.0.0.1:5000";
console.log(`${DEPLOYED_URL} with ${LOCAL_URL}`);
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadUser();
});
const profilePicture = document.getElementById("profile-pic");
async function loadUser() {
  try {
    const response = await fetch(`${DEPLOYED_URL}/api/v1/user/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (result.data) {
      document.title = `${result.data.username}'s Profile - ALX Quiz App`;
      document.getElementById("username").innerHTML = result.data.username;
      if (result.data.picture) {
        profilePicture.src = result.data.picture;
        profilePicture.alt = `${result.data.username}'s profile picture`;
      }
    } else {
      window.location.href = "../index.html";
      alert(result.msg || "Failed to load user data");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("An error occurred while loading user data");
  }
}
