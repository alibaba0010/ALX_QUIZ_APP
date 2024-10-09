const DEPLOYED_URL = "https://alx-quiz-app.onrender.com";
let LOCAL_URL = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadUser();
});

async function loadUser() {
  try {
    const response = await fetch(`${DEPLOYED_URL}/api/v1/user/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (result.data) {
      const { id } = result.data;
      const quizData = getQuizQuestion(id);
      if (quizData) {
        loadQuiz(quizData);
      } else {
        showNoQuizData();
      }
    } else {
      window.location.href = "../index.html";
      alert(result.msg || "Failed to load user data");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("An error occurred while loading user data");
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function getQuizQuestion(userId) {
  try {
    if (typeof Storage !== "undefined") {
      const resultString = localStorage.getItem(`quiz_${userId}`);
      return resultString ? JSON.parse(resultString) : null;
    } else {
      console.error("Local storage is not supported in this browser");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving quiz result:", error);
    return null;
  }
}

function loadQuiz(quizData) {
  const quizContainer = document.getElementById("quiz-container");
  let quizHTML = "";

  quizData.forEach((questionData, index) => {
    const isMultipleChoice = questionData.multiple_correct_answers === "true";
    quizHTML += `
      <div class="question" id="question-${index}">
        <h2>Question ${index + 1}</h2>
        <p>${escapeHtml(questionData.question)}</p>
        <div class="answer-container">
    `;

    for (let key in questionData.answers) {
      if (questionData.answers[key] !== null) {
        const value = escapeHtml(questionData.answers[key]);
        const isCorrect =
          questionData.correct_answers[`${key}_correct`] === "true";
        const isSelected =
          questionData.selected_answers &&
          questionData.selected_answers.includes(key);
        const answerClass = `answer ${isCorrect ? "correct" : ""} ${
          isSelected ? "selected" : ""
        }`;
        quizHTML += `
          <div class="${answerClass}" data-question="${index}" data-answer="${key}">
            ${value}
          </div>
        `;
      }
    }

    quizHTML += `</div></div>`;
  });

  quizContainer.innerHTML = quizHTML;
}

function showNoQuizData() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = `
    <div class="no-quiz-data">
      <p>No past quiz data available. Take a quiz to see your results here!</p>
    </div>
  `;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

document.getElementById("profile-btn").addEventListener("click", function () {
  window.location.href = "../components/profile.html";
});
