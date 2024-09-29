let quizData = [];
let storeAnswer = [];
let selectedAnswers = [];
let score = 0;
let currentScore = 0;
let currentQuestionIndex = 0;
let previouslySelectedButton = null;
let timerInterval; //1

const loadingElement = document.getElementById("loading");
const quizContainer = document.getElementById("quiz-container");
const questionHeader = document.getElementById("question-header");
const questionBody = document.getElementById("question-body"); //not used
const answerBtns = document.getElementById("answer-btns");
const nextBtn = document.getElementById("next-btn");
const lastQuizBtn = document.getElementById("last-quiz-btn");
const profileBtn = document.getElementById("profile");
const timeLeftSpan = document.getElementById("time-left");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionSpan = document.getElementById("total-question");
const multiple_correct_answer = document.getElementById("multiple");
const scoreDisplay = document.getElementById("score-display");

document.addEventListener("DOMContentLoaded", () => {
  loadQuiz();
});

async function loadQuiz() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/quiz", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (result.data) {
      const { userId, data } = result;
      totalQuestionSpan.textContent = data.length;
      showTime(data.length);
      if (!checkQuizQuestionsExists(userId)) {
        storeQuizQuestion(userId, data);
      }
      getQuizQuestion(userId);
    } else {
      throw new Error(result.msg || "Failed to load quiz data");
    }
  } catch (error) {
    console.error("Error loading quiz data:", error);
    alert("Failed to load quiz. Please try again later.");
    window.location.href = "../index.html";
  } finally {
    loadingElement.style.display = "none";
    quizContainer.style.display = "block";
  }
}

function showTime(datalength) {
  let timeLeft = Math.round(datalength * 0.3) * 60; // Convert to seconds
  const timeDisplay = document.getElementById("time-left");
  let timer;

  function updateTime() {
    if (currentQuestionIndex === datalength) {
      clearInterval(timer);
      timeDisplay.innerHTML = "00:00";
    } else if (timeLeft <= 0) {
      alert("Time's up!");
      clearInterval(timer);
      timeDisplay.innerHTML = "00:00";
      showScore();
    } else {
      const formattedTime = convertToMinutesAndSeconds(timeLeft);
      timeDisplay.innerHTML = formattedTime;
      timeLeft--;
    }
  }

  updateTime();
  timer = setInterval(updateTime, 1000);

  return function stopTimer() {
    clearInterval(timer);
    timeDisplay.innerHTML = "00:00";
    loadingElement.style.display = "block";
  };
}

function convertToMinutesAndSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

async function loadQuestion() {
  resetState();
  const currentQuestion = await quizData[0][currentQuestionIndex];
  updateURLWithQuestionId(currentQuestion.id);
  let questionNo = currentQuestionIndex + 1;
  currentQuestionSpan.textContent = `${questionNo} /`;
  const { answers } = currentQuestion;

  checkMultipleChoice();
  questionHeader.innerHTML = questionNo + ". " + currentQuestion.question;

  for (const key in answers) {
    if (answers.hasOwnProperty(key) && answers[key] !== null) {
      const answerButton = document.createElement("button");
      let value = answers[key];
      if (containsSpecialXters(value)) {
        value = escapeHtml(value);
      }
      answerButton.innerHTML = value;
      answerButton.dataset.questionKey = key;
      answerButton.classList.add("answer-btn");
      answerBtns.appendChild(answerButton);

      const { correct_answers } = currentQuestion;
      const correctAnswers = Object.entries(correct_answers)
        .filter(([, value]) => value === "true")
        .map(([key]) => key);

      answerButton.dataset.correctAnswers = correctAnswers.join(",");
      answerButton.addEventListener("click", selectAnswer);
    }
  }
}

function selectAnswer(event) {
  const selectedButton = event.target;
  const { questionKey } = selectedButton.dataset;
  const correctAnswers = selectedButton.dataset.correctAnswers.split(",");
  const isCorrect = correctAnswers.includes(`${questionKey}_correct`);

  selectedAnswers = removeItemFromArray(selectedAnswers, questionKey);

  if (selectedButton.classList.contains("selected")) {
    selectedButton.classList.remove("selected");
    previouslySelectedButton = null;
    if (isCorrect) {
      const scoreIncrement = 1 / correctAnswers.length;
      currentScore -= scoreIncrement;
      score = currentScore.toFixed(2);
    }
  } else {
    if (multiple_correct_answer.style.display !== "block") {
      if (
        previouslySelectedButton &&
        previouslySelectedButton !== selectedButton
      ) {
        previouslySelectedButton.classList.remove("selected");
        if (
          correctAnswers.includes(
            `${previouslySelectedButton.dataset.questionKey}_correct`
          )
        ) {
          const previousScoreIncrement = 1 / correctAnswers.length;
          currentScore -= previousScoreIncrement;
          score = currentScore.toFixed(2);
        }
      }
      previouslySelectedButton = selectedButton;
    }
    selectedButton.classList.add("selected");
    if (isCorrect) {
      const scoreIncrement = 1 / correctAnswers.length;
      currentScore += scoreIncrement;
      score = currentScore.toFixed(2);
    }
    selectedAnswers.push(questionKey);
  }

  nextBtn.style.display = "block";
  nextBtn.innerHTML =
    currentQuestionIndex < quizData[0].length - 1 ? "Next" : "Finish";
  nextBtn.removeEventListener("click", handleNextButton);
  nextBtn.addEventListener("click", handleNextButton);
}

function handleNextButton() {
  if (previouslySelectedButton) {
    storeAnswer.push(previouslySelectedButton.dataset.questionKey);
  } else {
    storeAnswer.push(selectedAnswers);
  }

  if (currentQuestionIndex < quizData[0].length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showScore();
  }
}

function resetState() {
  selectedAnswers = [];
  previouslySelectedButton = null;
  nextBtn.style.display = "none";
  while (answerBtns.firstChild) {
    answerBtns.removeChild(answerBtns.firstChild);
  }
}

function checkMultipleChoice() {
  const currentQuestion = quizData[0][currentQuestionIndex];
  multiple_correct_answer.style.display =
    currentQuestion.multiple_correct_answers === "true" ? "block" : "none";
}

function storeQuizQuestion(userId, result) {
  try {
    if (typeof Storage !== "undefined") {
      localStorage.setItem(`quiz_${userId}`, JSON.stringify(result));
    } else {
      console.error("Local storage is not supported in this browser");
    }
  } catch (error) {
    console.error("Error storing quiz result:", error);
  }
}

function getQuizQuestion(userId) {
  try {
    if (typeof Storage !== "undefined") {
      const resultString = localStorage.getItem(`quiz_${userId}`);
      if (resultString) {
        const data = JSON.parse(resultString);
        quizData.push(data);
        loadQuestion();
        return;
      }
    }
    console.error("Local storage is not supported or quiz data not found");
    return null;
  } catch (error) {
    console.error("Error retrieving quiz result:", error);
    return null;
  }
}

function checkQuizQuestionsExists(quizId) {
  try {
    return (
      typeof Storage !== "undefined" &&
      localStorage.getItem(`quiz_${quizId}`) !== null
    );
  } catch (error) {
    console.error("Error checking quiz result existence:", error);
    return false;
  }
}

async function showScore() {
  resetState();
  removeQuestionParamFromURL();
  totalQuestionSpan.style.display = "none";
  currentQuestionSpan.style.display = "none";

  scoreDisplay.innerHTML = "Highest Score: ";
  let result = (score / quizData[0].length) * 100;
  result = result.toFixed(2);
  try {
    await saveScore(result);

    questionHeader.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your final score is ${score} out of ${quizData[0].length}. Your percentage score is ${result}%</p>
  `;

    nextBtn.innerHTML = "Start Quiz Again";
    nextBtn.style.display = "block";
    lastQuizBtn.style.display = "block";
    profileBtn.style.display = "block";

    nextBtn.addEventListener(
      "click",
      () => (window.location.href = "../components/quiz.html")
    );
    profileBtn.addEventListener(
      "click",
      () => (window.location.href = "../components/profile.html")
    );
    lastQuizBtn.addEventListener(
      "click",
      () => (window.location.href = "../components/past-question.html")
    );
  } catch (e) {
    console.error("Error saving score:", e);
  } finally {
    loadingElement.style.display = "none";
    quizContainer.style.display = "block";
  }
}

function updateURLWithQuestionId(questionId) {
  const url = new URL(window.location.href);
  url.searchParams.set("question", questionId);
  window.history.pushState({}, "", url);
}

function removeQuestionParamFromURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete("question");
  window.history.pushState({}, "", url);
}

async function saveScore(result) {
  const pastResults = await getScore();
  multiple_correct_answer.style.display = "block";

  if (result > pastResults.score) {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/result", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ score: result }),
    });
    const results = await response.json();
    if (results.score) {
      multiple_correct_answer.innerHTML = `<h3>Your new highest score is ${results.score}%</h3>`;
      scoreDisplay.appendChild(document.createTextNode(`${results.score}%`));
    }
  } else {
    multiple_correct_answer.innerHTML = `<h3>Your highest score is ${pastResults.score}%</h3>`;
    scoreDisplay.appendChild(document.createTextNode(`${pastResults.score}%`));
  }
}

async function getScore() {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/result", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return await response.json();
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function containsSpecialXters(text) {
  return /[<>]/.test(text);
}

function removeItemFromArray(array, item) {
  return array.filter((element) => element !== item);
}
