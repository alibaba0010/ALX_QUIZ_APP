const loadUser = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    document.getElementById("username").textContent = result.data.username;
    // window.location.href = "../components/profile.html";
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};
loadUser();
const startQuizButton = document.getElementById("start-quiz");
const startQuiz = async () => {
  startQuizButton.style.backgroundColor = "#001e4d"; // Change button color to green

  // Redirect to quiz.html
  window.location.href = "../components/quiz.html";
};

const logOut = document.getElementById("log-out");
logOut.addEventListener("click", async function (event) {
  logOut.style.backgroundColor = "#001e4d"; // Change button color to green

  event.preventDefault();
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/logout", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  // handle response
  if (result.data) {
    alert(result.data);
    window.location.href = "../index.html";
  } else {
    alert(result.msg);
  }
});
