document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadUser();
  setupEventListeners();
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
      loadQuizHistory(result.data.quizHistory);
    } else {
      window.location.href = "../index.html";
      alert(result.msg || "Failed to load user data");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("An error occurred while loading user data");
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

function setupEventListeners() {
  document.getElementById("start-quiz").addEventListener("click", startQuiz);
  document
    .getElementById("last-quiz-btn")
    .addEventListener("click", showLastQuiz);
  document.getElementById("log-out").addEventListener("click", logOut);
}

function startQuiz(event) {
  event.preventDefault();
  clearLocalStorage();
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

function clearLocalStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}
