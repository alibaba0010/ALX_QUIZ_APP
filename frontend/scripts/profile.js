document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  await getGoogleSignIn();
  setupEventListeners();
});
const profilePicture = document.getElementById("profile-piccs");
let googleSignIn = false;
let userId = "";
const user = document.getElementById("username");
async function loadUser() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    const { username, id } = result.data;
    if (result.data) {
      document.title = `${username}'s Profile - ALX Quiz App`;
      user.innerHTML = username;
      userId = id;
      loadQuizHistory(result.data.quizHistory);
    } else {
      window.location.href = "../index.html";
      alert(result.msg || "Failed to load user data");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("An error occurred while loading user data");
    window.location.href = "../index.html";
  }
}

function loadQuizHistory(quizHistory) {
  const quizList = document.getElementById("quiz-list");
  quizList.innerHTML = "";

  if (quizHistory && quizHistory.length > 0) {
    quizHistory.forEach((quiz, index) => {
      const li = document.createElement("li");
      li.textContent = `Quiz ${index + 1}: Score ${quiz.score}/${
        quiz.totalQuestions
      } - ${new Date(quiz.date).toLocaleDateString()}`;
      quizList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No quiz history available";
    quizList.appendChild(li);
  }
}

document.getElementById("start-quiz").addEventListener("click", startQuiz);
function setupEventListeners() {
  document
    .getElementById("last-quiz-btn")
    .addEventListener("click", showLastQuiz);
  document.getElementById("log-out").addEventListener("click", logOut);
}

function startQuiz() {
  // event.preventDefault();
  clearLocalStorage(userId);
  window.location.href = "../components/quiz.html";
}

function showLastQuiz(event) {
  event.preventDefault();
  window.location.href = "../components/past-question.html";
}

async function logOut(event) {
  event.preventDefault();
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (result.data) {
      alert(result.data);
      window.location.href = "../index.html";
    } else {
      alert(result.msg || "Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred during logout");
  }
}

function clearLocalStorage(userId) {
  try {
    localStorage.removeItem(`quiz_${userId}`);
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}
async function getGoogleSignIn() {
  let params = {};
  let regex = /([^&=]+)=([^&]*)/g,
    m;
  while ((m = regex.exec(location.href))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  if (Object.keys(params).length > 0) {
    localStorage.setItem("jwt", JSON.stringify(params));
  }
  window.history.pushState({}, document.title, "/" + "components/profile.html");

  let token = JSON.parse(localStorage.getItem("jwt"));
  if (token) {
    googleSignIn = true;
    let data = await fetch("https:/www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token["access_token"]}`,
      },
    });
    data = await data.json();
    const username = data.name.replace(/\s/g, "");
    const email = data.email;
    const picture = data.picture;
    user.innerHTML = username;
    profilePicture.src = picture;
    profilePicture.alt = `${username}'s profile picture`;
    // loadQuizHistory(result.data.quizHistory);

    const response = await fetch(
      "http://127.0.0.1:5000/api/v1/user/google/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          picture,
        }),
        credentials: "include",
      }
    );
    const result = await response.json();
    if (result.msg) {
      const response = await fetch(
        "http://127.0.0.1:5000/api/v1/user/google/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
          }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (!result.data) {
        window.location.href = "../index.html";
      }
    } else if (result.data) {
      window.location.href = "../index.html";
    } else {
      alert("Failed to register user");
      window.location.href = "../index.html";
    }
  } else {
    await loadUser();
  }
  googleSignIn = false;
  localStorage.clear();
}
