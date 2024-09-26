let quizData = [];
const loadUser = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    //   document.getElementById("title-user").textContent = result.data.username;
    //   document.getElementById("username").textContent = result.data.username;
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
    // Check if local storage is available
    if (typeof Storage !== "undefined") {
      // Retrieve the result string from local storage
      const resultString = localStorage.getItem(`quiz_${userId}`);
      // If a result was found, parse it back into an object
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

// http://127.0.0.1:5501/components/past-questions.html

function loadQuiz() {
  console.log(quizData[0]);
  const quizContainer = document.getElementById("quiz-container");

  let quizHTML = "";

  quizData[0].forEach((questionData, index) => {
    checkMultipleQuestion(questionData);
    console.log(questionData.multiple_correct_answers);
    quizHTML += `
        <div class="question" id="question-${index}">
          <h2>Question ${index + 1}</h2>
          <p>${questionData.question}</p>
          <form class="quiz-form">
      `;

    for (let key in questionData.answers) {
      if (questionData.answers[key] !== null) {
        quizHTML += `
          <button class="answer-btn" data-question="${index}" data-answer="${key}">
            ${questionData.answers[key]}
          </button>
        `;
      }
    }
  });

  // quizHTML += '<button id="submit-quiz">Submit Quiz</button>';

  quizContainer.innerHTML = quizHTML;

  // document.getElementById("submit-quiz").addEventListener("click", submitQuiz);
}

function checkMultipleQuestion(question) {
  if (question.multiple_correct_answers === "true") {
    console.log("Hello World");
  } else {
    console.log("Hello Universe");
  }
}
