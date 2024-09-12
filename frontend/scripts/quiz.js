let currentQuestionIndex = 0;
let score = document.getElementById("current-score");
const totalScore = document.getElementById("total-score");
// console.log("Current Score: " + score.innerHTML);
const questionElement = document.getElementsByClassName("question-header");
const answersElement = document.getElementById("answer-btns");

const loadQuiz = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/quiz", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (result.data) {
    const { data } = result;
    totalScore.innerHTML = data.length;
    //  showTime(datalength);
    loadQuestion(data);
    // window.location.href = "../components/profile.html";
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};

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
function loadQuestion(data) {
  // resetState();
  const currentQuestion = data[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  const answers = currentQuestion.answers;
  for (let i = 0; i < questionElement.length; i++) {
    questionElement[i].innerHTML = questionNo + ". " + currentQuestion.question;
  }
  answersElement.innerHTML = "";
  for (const key in answers) {
    const answerButton = document.createElement("button");

    if (answers.hasOwnProperty(key) && answers[key] !== null) {
      const value = answers[key];
      answerButton.innerHTML = value;
      answerButton.classList.add("answer-btn");
      answersElement.appendChild(answerButton);
      if (value == null) {
        answersElement.display = "none";
      }
    }
  }
}

function checkMultipleChoice() {}
