// Quiz data with multiple questions
const quizData = [
  {
    question: "Which SQL statement is used to return only different values?",
    answers: {
      a: "DUPLICATE",
      b: "DISTINCT",
      c: "DIFFERENT",
      d: "SELECT",
      e: "None of the above",
      f: null,
    },
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "true",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    category: "SQL",
    difficulty: "Medium",
  },
  {
    question: "What does HTML stand for?",
    answers: {
      a: "Hyper Text Markup Language",
      b: "High Tech Modern Language",
      c: "Hyperlink and Text Markup Language",
      d: "Home Tool Markup Language",
      e: null,
      f: null,
    },
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    category: "Web Development",
    difficulty: "Easy",
  },
  // Add more questions here as needed
];

function loadQuiz() {
  const quizContainer = document.getElementById("quiz-container");
  const totalQuestionSpan = document.getElementById("total-question");

  totalQuestionSpan.textContent = quizData.length;

  let quizHTML = "";

  quizData.forEach((questionData, index) => {
    quizHTML += `
        <div class="question" id="question-${index}">
          <h2>Question ${index + 1}</h2>
          <p>${questionData.question}</p>
          <form class="quiz-form">
      `;

    for (let key in questionData.answers) {
      if (questionData.answers[key] !== null) {
        quizHTML += `
            <div>
              <input type="radio" id="question${index}_answer_${key}" name="question${index}" value="${key}" required>
              <label for="question${index}_answer_${key}">${questionData.answers[key]}</label>
            </div>
          `;
      }
    }

    quizHTML += `
          </form>
          <p>Category: ${questionData.category}</p>
          <p>Difficulty: ${questionData.difficulty}</p>
        </div>
      `;
  });

  quizHTML += '<button id="submit-quiz">Submit Quiz</button>';

  quizContainer.innerHTML = quizHTML;

  document.getElementById("submit-quiz").addEventListener("click", submitQuiz);
}

function submitQuiz() {
  let score = 0;
  let answeredQuestions = 0;

  quizData.forEach((questionData, index) => {
    const selectedAnswer = document.querySelector(
      `input[name="question${index}"]:checked`
    );

    if (selectedAnswer) {
      answeredQuestions++;
      const questionElement = document.getElementById(`question-${index}`);

      if (
        questionData.correct_answers[
          `answer_${selectedAnswer.value}_correct`
        ] === "true"
      ) {
        score++;
        questionElement.style.backgroundColor = "#dff0d8"; // Green for correct
      } else {
        questionElement.style.backgroundColor = "#f2dede"; // Red for incorrect
      }

      // Disable all inputs after submission
      questionElement
        .querySelectorAll("input")
        .forEach((input) => (input.disabled = true));
    }
  });

  if (answeredQuestions < quizData.length) {
    alert(
      `Please answer all questions before submitting. You've answered ${answeredQuestions} out of ${quizData.length} questions.`
    );
    return;
  }

  const scoreDisplay = document.getElementById("score-display");
  scoreDisplay.innerHTML = `Quiz completed! Your score: ${score}/${quizData.length}`;

  document.getElementById("submit-quiz").disabled = true;
}

// Initialize the quiz
loadQuiz();

// Update the display text
document.getElementById("display").textContent = "Quiz Application";
