let currentQuestionIndex = 0;
let score = document.getElementById("current-score");
const totalScore = document.getElementById("total-score");
const questionElement = document.getElementsByClassName("question-header");
const answersElement = document.getElementById("answer-btns");
const multiple_correct_answer = document.getElementById("multiple");
const submitButton = document.getElementById("next-btn");

const loadQuiz = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/quiz", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    const { userId, data } = result;
    totalScore.innerHTML = data.length;
    //  showTime(datalength);
    if (!checkQuizQuestionsExists(userId)) {
      // If not, store the new quiz data
      storeQuizQuestion(userId, data);
    }
    getQuizQuestion(userId);
    // loadQuestion(data);
    // window.location.href = "../components/profile.html";
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};
loadQuiz();
function showTime(datalength) {
  let timeLeft = Math.round(datalength * 0.025) * 60; // Convert to seconds
  const timeDisplay = document.getElementById("time-left");

  function updateTime() {
    if (timeLeft < 0) {
      clearInterval(timer);
      timeDisplay.innerHTML = "00:00";
      // Add any logic for when time runs out (e.g., end the quiz)
      alert("Time's up!");
      window.location.href = "../components/profile.html";
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
async function loadQuestion(data) {
  // resetState();
  const currentQuestion = await data[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  const { answers } = currentQuestion;
  for (let i = 0; i < questionElement.length; i++) {
    checkMultipleChoice(data);
    questionElement[i].innerHTML = questionNo + ". " + currentQuestion.question;
  }
  answersElement.innerHTML = "";
  for (const key in answers) {
    const answerButton = document.createElement("button");
    if (answers.hasOwnProperty(key) && answers[key] !== null) {
      const value = answers[key];
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
      if (value === "false") {
        // change to true false
        correctAnswers.push(key);
      }
    }
    answerButton.dataset.correctAnswers = correctAnswers;
    answerButton.addEventListener("click", (event) =>
      selectAnswer(event, data)
    );
  }
}

let currentScore = 0;
let previouslySelectedButton = null;
function selectAnswer(event, data) {
  const selectedButton = event.target;
  const { questionKey } = selectedButton.dataset;
  const correctAnswers = selectedButton.dataset.correctAnswers.split(",");
  const isCorrect = correctAnswers.includes(`${questionKey}_correct`);

  if (selectedButton.classList.contains("selected")) {
    selectedButton.classList.remove("selected");
    if (isCorrect) {
      const scoreIncrement = 1 / correctAnswers.length;
      currentScore -= scoreIncrement;
      score.innerHTML = currentScore.toFixed(2); //used for questions
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
          score.innerHTML = currentScore.toFixed(2); //used for questions
        }
      }

      // Remove selection from all buttons
      document.querySelectorAll(".answer-button").forEach((button) => {
        button.classList.remove("selected");
      });

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
      score.innerHTML = currentScore.toFixed(2); //used for questions
    }
  }
  submitButton.style.display = "block";
  if (currentQuestionIndex < data.length) {
    submitButton.innerHTML = "Next";
  } else {
    submitButton.innerHTML = "Finish";
    // Display score
  }
  submitButton.addEventListener("click", (event) => nextButton(event, data));
}
function nextButton(event, data) {
  // Check answer and update score
  if (currentQuestionIndex < data.length) {
    nextQuestion(data);
  } else {
    // Quiz finished
    // startQuiz(data);
  }
}
// submitButton.addEventListener("click", (data) => {

// });

function nextQuestion(data) {
  currentQuestionIndex++;
  if (currentQuestionIndex < data.length) {
    loadQuestion(data);
  } else {
    // showScore();
  }
}

function checkMultipleChoice(data) {
  const currentQuestion = data[currentQuestionIndex];
  const currentChoice = currentQuestion.multiple_correct_answers;
  if (currentChoice === "false") {
    // change to true false
    multiple_correct_answer.style.display = "block";
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
        loadQuestion(data);
        // return
      } else {
        console.log(`No stored result found for quiz ${userId}`);
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
