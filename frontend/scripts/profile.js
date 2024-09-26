const loadUser = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    document.getElementById("title-user").textContent = result.data.username;
    document.getElementById("username").textContent = result.data.username;
    // window.location.href = "../components/profile.html";
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};
const lastQuizButton = document.getElementById("last-quiz-btn");
loadUser();
const startQuizButton = document.getElementById("start-quiz");
startQuizButton.addEventListener("click", async function (event) {
  event.preventDefault();
  startQuizButton.style.backgroundColor = "#001e4d";
  startQuizButton.style.color = "#fff";

  // Redirect to quiz.html
  window.location.href = "../components/quiz.html";
});

const logOut = document.getElementById("log-out");
logOut.addEventListener("click", async function (event) {
  logOut.style.backgroundColor = "#001e4d";
  logOut.style.color = "#fff";

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
lastQuizButton.addEventListener("click", function (event) {
  event.preventDefault();
  lastQuizButton.style.backgroundColor = "#001e4d";
  lastQuizButton.style.color = "#fff";

  // Redirect to past-question.html
  window.location.href = "../components/past-question.html";
});
