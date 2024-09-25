let currentQuestionIndex = 0;
let questionNoDisplay = document.getElementById("current-question");
const totalQuestion = document.getElementById("total-question");
const questionElement = document.getElementsByClassName("question-header");
const answersElement = document.getElementById("answer-btns");
const multiple_correct_answer = document.getElementById("multiple");
const submitButton = document.getElementById("next-btn");
const showQuizResult = document.getElementById("last-quiz-btn");
const goToProfile = document.getElementById("profile");
const scoreDisplay = document.getElementById("score-display");
let storeAnswer = [];
let storeMultipleAnswer = [];
let previouslySelectedButton = null;
let quizData = [];
let score = 0;
let currentScore = 0;
const loadQuiz = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/quiz", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    const { userId, data } = result;
    totalQuestion.innerHTML = data.length;
    // showTime(data.length);
    if (!checkQuizQuestionsExists(userId)) {
      // If not, store the new quiz data
      storeQuizQuestion(userId, data);
    }
    getQuizQuestion(userId);
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};
loadQuiz();
function showTime(datalength) {
  let timeLeft = Math.round(datalength * 0.025) * 0.1 * 60; // Convert to seconds
  // let timeLeft = Math.round(datalength * 0.025) * 60; // Convert to seconds
  const timeDisplay = document.getElementById("time-left");

  function updateTime() {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeDisplay.innerHTML = "00:00";
      // Add any logic for when time runs out (e.g., end the quiz)
      alert("Time's up!");
      showScore();
    }

    const formattedTime = convertToMinutesAndSeconds(timeLeft);
    timeDisplay.innerHTML = formattedTime;
    timeLeft--;
  }

  // Initial call to set the starting time
  updateTime();

  // Set up the interval to update every second
  const timer = setInterval(updateTime, 1000);

  // Return the timer so it can be cleared if needed
  return timer;
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
  answersElement.innerHTML = "";
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
    const correctAnswers = [];
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

  if (selectedButton.classList.contains("selected")) {
    selectedButton.classList.remove("selected");
    if (isCorrect) {
      const scoreIncrement = 1 / correctAnswers.length;
      score -= scoreIncrement;
      score = currentScore.toFixed(2); //used for questions
      // selectedButton.classList.remove("correct-answer");
    }
  } else {
    selectedButton.classList.add("selected");
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
      selectedButton.classList.add("selected");
      previouslySelectedButton = selectedButton;
    }
    if (correctAnswers.includes(`${questionKey}_correct`)) {
      // Calculate score increment
      // Increment the score
    }
    if (isCorrect) {
      // Calculate score increment
      const scoreIncrement = 1 / correctAnswers.length;

      // Increment the score
      currentScore += scoreIncrement;
      // Update the score display
      // updateScoreDisplay();
      score = currentScore.toFixed(2); //used for questions
    }
  }
  submitButton.style.display = "block";
  if (currentQuestionIndex < quizData[0].length) {
    submitButton.innerHTML = "Next";
  } else {
    submitButton.innerHTML = "Finish";
    // Display score
  }
  submitButton.addEventListener("click", nextButton);
}
function nextButton() {
  const answerClicked = previouslySelectedButton.data.questionKey;
  if (answerClicked.length > 8) {
    storeMultipleAnswer.push(answerClicked);
    storeAnswer.push(storeMultipleAnswer);
    console.log("Stored Answer");
  } else {
    storeAnswer.push(storedAnswer);
  }
  // Check answer and update score
  if (currentQuestionIndex < quizData[0].length) {
    nextQuestion();
  } else {
    // Quiz finished
    // startQuiz(data);
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData[0].length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function resetState() {
  previouslySelectedButton = null;
  submitButton.style.display = "none";
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}
function checkMultipleChoice() {
  const currentQuestion = quizData[0][currentQuestionIndex];
  const currentChoice = currentQuestion.multiple_correct_answers;
  if (currentChoice === "true") {
    // change to true false
    multiple_correct_answer.style.display = "block";
  } else {
    multiple_correct_answer.style.display = "none";
  }
}
function storeQuizQuestion(userId, result) {
  try {
    // Check if local storage is available
    if (typeof Storage !== "undefined") {
      // Convert the result object to a JSON string
      const resultString = JSON.stringify(result);

      // Store the result in local storage
      localStorage.setItem(`quiz_${userId}`, resultString);
    } else {
      console.error("Local storage is not supported in this browser");
    }
  } catch (error) {
    console.error("Error storing quiz result:", error);
  }
}
function getQuizQuestion(userId) {
  try {
    // Check if local storage is available
    if (typeof Storage !== "undefined") {
      // Retrieve the result string from local storage
      const resultString = localStorage.getItem(`quiz_${userId}`);
      // If a result was found, parse it back into an object
      if (resultString) {
        const data = JSON.parse(resultString);
        quizData.push(data);
        loadQuestion(data);
        console.log(quizData[0]);
        return;
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
function checkQuizQuestionsExists(quizId) {
  try {
    if (typeof Storage !== "undefined") {
      const result = localStorage.getItem(`quiz_${quizId}`);
      return result !== null;
    } else {
      console.error("Local storage is not supported in this browser");
      return false;
    }
  } catch (error) {
    console.error("Error checking quiz result existence:", error);
    return false;
  }
}
async function showScore() {
  resetState();
  totalQuestion.style.display = "none";
  questionNoDisplay.style.display = "none";

  scoreDisplay.innerHTML = "Highest Score: ";
  const result = (score / quizData[0].length) * 100;
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

  submitButton.addEventListener("click", function () {
    clearLocalStorage();
    window.location.href = "../components/quiz.html";
  });
  goToProfile.addEventListener("click", function () {
    window.location.href = "../components/profile.html";
  });
  showQuizResult.addEventListener("click", function () {
    window.location.href = "../components/past-questions.html";
  });
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
    // Update the user score in DB
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
