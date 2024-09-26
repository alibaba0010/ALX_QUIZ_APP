const quizData = [];

const loadUser = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    const { id } = result.data;
    const res = getQuizQuestion(id);
    quizData.push(res);
    loadQuiz();
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};

loadUser();

function getQuizQuestion(userId) {
  try {
    if (typeof Storage !== "undefined") {
      const resultString = localStorage.getItem(`quiz_${userId}`);
      if (resultString) {
        const data = JSON.parse(resultString);
        return data;
      } else {
        return null;
      }
    } else {
      console.error("Local storage is not supported in this browser");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving quiz result:", error);
    return null;
  }
}

function loadQuiz() {
  console.log(quizData[0]);
  const quizContainer = document.getElementById("quiz-container");

  let quizHTML = "";
  if (quizData[0] === null) {
    window.location.href = "../components/profile.html";
  } else {
    quizData[0].forEach((questionData, index) => {
      checkMultipleQuestion(questionData);
      // const isMultipleChoice = checkMultipleQuestion(questionData);
      console.log(questionData.multiple_correct_answers);
      quizHTML += `
        <div class="question" id="question-${index}">
          <h2>Question ${index + 1}</h2>
          <p>${questionData.question}</p>
          <div class="answer-container">
      `;

      for (let key in questionData.answers) {
        if (questionData.answers[key] !== null) {
          let value = questionData.answers[key];
          if (containsSpecialXters(value)) {
            value = escapeHtml(value);
          }
          const isCorrect =
            questionData.correct_answers[`${key}_correct`] === "true";
          const answerClass = isCorrect ? "answer correct" : "answer";
          quizHTML += `
          <div class="${answerClass}" data-question="${index}" data-answer="${key}">
            ${value}
          </div>
        `;
        }
      }

      quizHTML += `</div></div>`;
    });
  }
  // Add the "Go to Profile" button at the bottom
  quizHTML += `
    <div class="button-container">
      <button id="next-btn" type="button">Go to Profile</button>
    </div>
  `;

  quizContainer.innerHTML = quizHTML;

  document.getElementById("next-btn").addEventListener("click", function () {
    window.location.href = "../components/profile.html";
  });
}

function checkMultipleQuestion(question) {
  return question.multiple_correct_answers === "true";
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

function containsSpecialXters(text) {
  return /[<>]/.test(text);
}

// Add new styles
const style = document.createElement("style");
style.textContent = `
  .question {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .question h2 {
    margin-top: 0;
    color: #333;
  }

  .answer-container {
    display: grid;
    gap: 10px;
    margin-top: 10px;
  }

  .answer {
    padding: 10px 15px;
    background-color: #e0e0e0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    color: #333;
    transition: background-color 0.3s ease;
  }

  .answer.correct {
    background-color: #90EE90;
    border-color: #4CAF50;
  }

  /* Disable hover effects */
  .answer:hover {
    cursor: default;
  }

  /* Disable selection */
  .answer {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* Additional styles for better readability */
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  #quiz-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  /* Styles for the "Go to Profile" button */
  .button-container {
    text-align: center;
    margin-top: 20px;
  }

  #next-btn:hover {
    background-color: #575e69;
  }
`;
document.head.appendChild(style);
