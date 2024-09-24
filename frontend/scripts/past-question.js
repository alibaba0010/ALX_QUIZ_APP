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
    getQuizQuestion(id);
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
        quizData.push(data);
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
