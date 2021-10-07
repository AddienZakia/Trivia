let color = {
  easy: "linear-gradient(135deg, #b8fe24, #24fe41)",
  hard: "linear-gradient(135deg, #fc6d8f, #ff002e)",
  medium: "linear-gradient(135deg, #fcc36d, #ff9900)",
  default: "unset",
};
let globalDifficulty = "";

function diffClicked() {
  document.querySelector(".show").classList.toggle("showed");
}

function suffle(array) {
  let [result, exclude] = [[], []];
  for (let i = 0; i < array.length; i++) {
    exclude = array.filter((x) => result.indexOf(x) === -1);
    let random = exclude[Math.floor(Math.random() * exclude.length)];
    result.push(random);
  }
  return result;
}

async function newGame(point = 0, question = 1) {
  return new Promise((resolve, reject) => {
    if (globalDifficulty.toLowerCase() === "random") globalDifficulty = "";
    let url =
      "https://opentdb.com/api.php?amount=1&type=multiple&difficulty=" +
      globalDifficulty.toLowerCase();
    resolve(
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          let data = res.results[0];
          let difficult = document.getElementById("diff_color");
          let soal = document.getElementById("question");
          let jawaban = document.querySelectorAll(".jawaban p");

          let pointElement = document.getElementById("point_number");
          let pointElement2 = document.querySelector(".show_lose h1");
          let questionElement = document.getElementById("question_number");

          let answerList = suffle([
            ...data.incorrect_answers,
            data.correct_answer,
          ]);
          let answer_position = answerList.indexOf(data.correct_answer);

          jawaban.forEach((el) => (el.style.backgroundImage = color.default));
          soal.innerHTML = data.question;
          difficult.innerHTML =
            data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1);
          difficult.style.backgroundImage =
            color[data.difficulty.toLowerCase()];
          pointElement.innerHTML = "Point : " + point;
          pointElement2.innerHTML = point;
          questionElement.innerHTML = "Question " + question;

          for (let i = 0; i < jawaban.length; i++) {
            let element = jawaban[i];
            let jawaban_res = answerList[i];
            element.innerHTML = jawaban_res;
          }

          jawaban.forEach((element) => {
            element.onclick = function () {
              if (element.innerHTML === answerList[answer_position]) {
                element.style.backgroundImage = color.easy;
                nextGame();
                newGame((point += 50), (question += 1));
              } else {
                element.style.backgroundImage = color.hard;
                jawaban[answer_position].style.backgroundImage = color.easy;
                loseGame();
              }
            };
          });
        })
    );
  });
}

function loseGame(options = false) {
  if (options) {
    newGame().then((res) => {
      return document.querySelector(".lose").classList.remove("loseShow");
    });
  }
  document.querySelector(".lose").classList.add("loseShow");
}

function nextGame() {
  document.querySelectorAll(".jawaban p").forEach((el) => (el.onclick = ""));
}

newGame();
document.querySelectorAll(".options").forEach((el) => {
  el.onclick = function () {
    document.querySelector(".show").classList.remove("showed");
    globalDifficulty = el.innerHTML;
    document.querySelector(
      ".select_diff p"
    ).innerHTML = `Difficulty: ${globalDifficulty} <span class="material-icons"> expand_more </span>`;
    newGame();
  };
});
