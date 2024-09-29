let quizData = [];
let storeAnswer = [];
let selectedAnswers = [];
const correctAnswers = [];
let score = 0;
let currentScore = 0;
let currentQuestionIndex = 0;
let previouslySelectedButton = null;

const loadingElement = document.getElementById("loading"); //2
const quizContainer = document.getElementById("quiz-container"); //3

const questionElement = document.getElementsByClassName("question-header");
const answersElement = document.getElementById("answer-btns");
const submitButton = document.getElementById("next-btn");
const showQuizResult = document.getElementById("last-quiz-btn");
const goToProfile = document.getElementById("profile");
const timeDisplay = document.getElementById("time-left");
let questionNoDisplay = document.getElementById("current-question");
const totalQuestion = document.getElementById("total-question");
const multiple_correct_answer = document.getElementById("multiple");
const scoreDisplay = document.getElementById("score-display");

document.addEventListener("DOMContentLoaded", () => {
  submitButton.style.display = "none";
  showQuizResult.style.display = "none";
  goToProfile.style.display = "none";
  multiple_correct_answer.style.display = "none";
  loadQuiz();
});

const loadQuiz = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/quiz", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (result.data) {
      const { userId, data } = result;
      totalQuestion.innerHTML = data.length;
      showTime(data.length);
      if (!checkQuizQuestionsExists(userId)) {
        storeQuizQuestion(userId, data);
      }
      getQuizQuestion(userId);
    } else {
      window.location.href = "../index.html";
      alert(result.msg);
    }
  } catch (error) {
    console.error("Error loading quiz data:", error);
    alert("Failed to load quiz. Please try again later.");
    window.location.href = "../index.html";
  } finally {
    loadingElement.style.display = "none";
    quizContainer.style.display = "block";
  }
};
let timer; // Declare timer variable in this scope so it can be accessed by clearInterval

function showTime(datalength) {
  let timeLeft = Math.round(datalength * 0.3) * 60; // Convert to seconds

  function updateTime() {
    const dataLength = datalength - 1;
    if (currentQuestionIndex >= dataLength) {
      console.log("Hello world");
      // clearInterval(timer);
      // stopTimer();
    } else if (timeLeft <= 0) {
      alert("Time's up!");
      stopTimer();
      showScore();
    } else {
      const formattedTime = convertToMinutesAndSeconds(timeLeft);
      timeDisplay.innerHTML = formattedTime;
      timeLeft--;
    }
  }

  updateTime();
  timer = setInterval(updateTime, 1000);
  // Return a function to stop the timer from outside if needed
  return;
}
function stopTimer() {
  clearInterval(timer);
  timeDisplay.innerHTML = "00:00";
  quizContainer.style.display = "none";
  loadingElement.style.display = "block";
  loadQuestion.innerHTML = "Loading Reasult...";
}
function convertToMinutesAndSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function loadQuestion() {
  resetState();
  const currentQuestion = await quizData[0][currentQuestionIndex];
  updateURLWithQuestionId(currentQuestion.id);
  let questionNo = currentQuestionIndex + 1;
  questionNoDisplay.innerHTML = `${questionNo} /`;
  const { answers } = currentQuestion;
  for (let i = 0; i < questionElement.length; i++) {
    checkMultipleChoice();
    questionElement[i].innerHTML = questionNo + ". " + currentQuestion.question;
  }
  for (const key in answers) {
    const answerButton = document.createElement("button");
    if (answers.hasOwnProperty(key) && answers[key] !== null) {
      let value = answers[key];
      if (containsSpecialXters(value)) {
        value = escapeHtml(value);
      }
      answerButton.innerHTML = value;
      answerButton.dataset.questionKey = key;
      answerButton.classList.add("answer-btn");
      answersElement.appendChild(answerButton);
      if (value == null) {
        answersElement.display = "none";
      }
    }
    const { correct_answers } = currentQuestion;
    for (const [key, value] of Object.entries(correct_answers)) {
      if (value === "true") {
        // change to true false
        correctAnswers.push(key);
      }
    }
    answerButton.dataset.correctAnswers = correctAnswers;
    answerButton.addEventListener("click", selectAnswer);
  }
}

function selectAnswer(event) {
  const selectedButton = event.target;
  const { questionKey } = selectedButton.dataset;
  const correctAnswers = selectedButton.dataset.correctAnswers.split(",");
  const isCorrect = correctAnswers.includes(`${questionKey}_correct`);
  selectedAnswers = removeItemFromArray(
    selectedAnswers,
    selectedButton.dataset.questionKey
  );
  if (selectedButton.classList.contains("selected")) {
    selectedButton.classList.remove("selected");
    previouslySelectedButton = null;
    if (isCorrect) {
      scoreIncrement = 1 / correctAnswers.length;
      currentScore -= scoreIncrement;
      score = currentScore.toFixed(2); //used for questions
    }
  } else {
    // selectedButton.classList.add("selected");
    if (multiple_correct_answer.style.display !== "block") {
      // Single answer mode
      if (
        previouslySelectedButton &&
        previouslySelectedButton !== selectedButton
      ) {
        // Deselect the previous button
        previouslySelectedButton.classList.remove("selected");

        // If the previous button was correct, subtract its score
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
      // Select the current button
      previouslySelectedButton = selectedButton;
    }
    selectedButton.classList.add("selected");
    if (correctAnswers.includes(`${questionKey}_correct`)) {
      if (isCorrect) {
        // Calculate score increment
        const scoreIncrement = 1 / correctAnswers.length;

        // Increment the score
        currentScore += scoreIncrement;
        // Update the score display
        score = currentScore.toFixed(2);
      }
    }
    selectedAnswers.push(questionKey);
  }
  submitButton.style.display = "block";

  submitButton.innerHTML =
    currentQuestionIndex < quizData[0].length - 1 ? "Next" : "Finish";
  submitButton.addEventListener("click", nextButton);
}
function nextButton() {
  if (previouslySelectedButton) {
    const answerClicked = previouslySelectedButton.dataset.questionKey;
    storeAnswer.push(answerClicked);
  } else {
    storeAnswer.push(selectedAnswers);
  }
  // Check answer and update score
  if (currentQuestionIndex < quizData[0].length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    // Quiz finished
    stopTimer();
    showScore();
  }
}

function resetState() {
  selectedAnswers = [];
  previouslySelectedButton = null;
  submitButton.style.display = "none";
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}
function checkMultipleChoice() {
  const currentQuestion = quizData[0][currentQuestionIndex];
  const currentChoice = currentQuestion.multiple_correct_answers;
  multiple_correct_answer.style.display =
    currentChoice === "true" ? "block" : "none";
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
  totalQuestion.style.display = "none";
  questionNoDisplay.style.display = "none";

  scoreDisplay.innerHTML = "Highest Score: ";
  let result = (score / quizData[0].length) * 100;
  result = result.toFixed(2);
  try {
    await saveScore(result);
    for (let i = 0; i < questionElement.length; i++) {
      questionElement[i].innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your final score is ${score} out of ${quizData[0].length}. Your percentage score is ${result}%</p>
    `;
    }
    submitButton.innerHTML = "Start Quiz Again";
    submitButton.style.display = "block";
    showQuizResult.style.display = "block";
    goToProfile.style.display = "block";

    submitButton.addEventListener(
      "click",
      () => (window.location.href = "../components/quiz.html")
    );
    goToProfile.addEventListener(
      "click",
      () => (window.location.href = "../components/profile.html")
    );
    showQuizResult.addEventListener(
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
  // Get the current URL
  const url = new URL(window.location.href);

  // Get the existing search params
  const searchParams = url.searchParams;

  // Set or update the 'question' parameter
  searchParams.set("question", questionId);

  // Update the URL without reloading the page
  window.history.pushState({}, "", url);
}

function clearLocalStorage() {
  try {
    // Clear all items from localStorage and and array
    localStorage.clear();

    return true;
  } catch (error) {
    // Log the error if something goes wrong
    console.error("Error clearing localStorage:", error);
    return false;
  }
}

async function saveScore(result) {
  await getScore();

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
      const scoreText = document.createTextNode(`${results.score}%`);
      scoreDisplay.appendChild(scoreText);
    }
  } else {
    multiple_correct_answer.innerHTML = `<h3>Your highest score is ${result}%</h3>`;
    const scoreText = document.createTextNode(`${pastResults.score}%`);
    scoreDisplay.appendChild(scoreText);
  }
}
async function getScore() {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/result", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const resultData = await response.json();
  return resultData;
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

function removeItemFromArray(array, item) {
  if (array.includes(item)) {
    return array.filter((element) => element !== item);
  }
  return array;
}

function removeQuestionParamFromURL() {
  // Get the current URL
  let currentURL = new URL(window.location.href);

  // Remove the 'question' parameter
  currentURL.searchParams.delete("question");

  // Get the new URL string
  let newURL = currentURL.toString();

  // Update the browser's history without reloading the page
  window.history.pushState({}, "", newURL);

  // Return the new URL
  return;
}
