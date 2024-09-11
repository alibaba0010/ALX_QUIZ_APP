let currentQuestionIndex = 0;
let score = 0;

const loadQuiz = async () => {
  const response = await fetch("http://127.0.0.1:5000/api/v1/user/quiz", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  console.log(result.data.length);
  if (result.data) {
    // window.location.href = "../components/profile.html";
  } else {
    window.location.href = "../index.html";
    alert(result.msg);
  }
};
loadQuiz();
