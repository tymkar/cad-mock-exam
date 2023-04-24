const previewButton = document.getElementById("preview-button");
const homeButton = document.getElementById("home-button");
const goBackButton = document.getElementById("go-back-button");
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const finishButton = document.getElementById("finish-button");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const setsElement = document.getElementById("sets");
const questionSetContainer = document.getElementById("question-set-container");
const questionSetPreview = document.getElementById("preview-container");
const containerElement = document.getElementById("container");
const progressBar = document.getElementById("progress-bar-inner");
const celebrationSound = document.getElementById("celebraion-sound");
const scoreboard = document.getElementById("scoreboard");
const userScore = document.getElementById("score");

//button event listeners
let shuffledQuestions, currentQuestionIndex, pickedQuestionSet;

previewButton.addEventListener("click", showPreview);

startButton.addEventListener("click", startExam);

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

goBackButton.addEventListener("click", showQuestionSets);
homeButton.addEventListener("click", endMockExam);

finishButton.addEventListener("click", showScoreboard);

function showScoreboard() {
  //start confetti
  confetti.start();
  playCelebrationSound();

  setTimeout(function () {
    confetti.stop();
  }, 10000);

  scoreboard.classList.remove("hide");
  finishButton.classList.add("hide");
  questionContainerElement.classList.add("hide");
  selectedSetButton.classList.remove("selected-answer");
  homeButton.classList.remove("hide");

  userScore.innerText =
    Math.round((score / pickedQuestionSet.length) * 100) + " %";
}

function playCelebrationSound() {
  if (celebrationSound) {
    celebrationSound.currentTime = 0;
    celebrationSound.play();
  }
}

function endMockExam() {
  score = 0;
  questionContainerElement.classList.add("hide");
  questionSetContainer.classList.remove("hide");
  scoreboard.classList.add("hide");
  homeButton.classList.add("hide");
}

let score = 0;

for (let i = 0; i < Array.from(setsElement.children).length; i++) {
  const questionSetButton = Array.from(setsElement.children)[i];
  questionSetButton.addEventListener("click", setQuestionSet);
}

let selectedSetButton;

function setQuestionSet(e) {
  if (selectedSetButton) {
    selectedSetButton.classList.remove("selected-answer");
  }

  selectedSetButton = e.target;
  selectedSetButton.classList.add("selected-answer");

  if (e.target.id === "questionSet1") {
    pickedQuestionSet = questionSet1;
  }
  if (e.target.id === "questionSet2") {
    pickedQuestionSet = questionSet2;
  }
  if (e.target.id === "questionSet3") {
    pickedQuestionSet = questionSet3;
  }
  if (e.target.id === "questionSet4") {
    pickedQuestionSet = questionSet4;
  }
  if (e.target.id === "questionSet5") {
    pickedQuestionSet = questionSet5;
  }
  if (e.target.id === "questionSet6") {
    pickedQuestionSet = questionSet6;
  }
  if (e.target.id === "questionSet7") {
    pickedQuestionSet = questionSet7;
  }
  if (e.target.id === "questionSet8") {
    pickedQuestionSet = questionSet8;
  }
  if (e.target.id === "questionSet9") {
    pickedQuestionSet = questionSet9;
  }

  previewButton.classList.remove("hide");
  startButton.classList.remove("hide");
}

let progressBarWidth;

function startExam() {
  previewButton.classList.add("hide");
  startButton.classList.add("hide");
  shuffledQuestions = pickedQuestionSet.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  questionSetContainer.classList.add("hide");

  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex], currentQuestionIndex);
}

function showQuestion(question, questionNumber) {
  progressBarWidth = (questionNumber / pickedQuestionSet.length) * 100 + "%";
  progressBar.style.width = progressBarWidth;

  questionElement.innerText = questionNumber + 1 + ") " + question.question;

  question.answers.forEach((answer) => {
    const button = document.createElement("button");

    button.innerText = answer.text;

    button.classList.add("button", "answer-button");

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }

    button.addEventListener("click", selectAnswer);

    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  nextButton.classList.add("hide");

  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

let selectedAnswersCount = 0;
let multipleChoiceCorrectCount = 0;

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  let showNextButton = false;

  selectedButton.classList.add("selected-answer");

  if (
    shuffledQuestions[currentQuestionIndex].question_type === "single-choice"
  ) {
    Array.from(answerButtonsElement.children).forEach((button) => {
      setStatusClass(button, button.dataset.correct);
      button.removeEventListener("click", selectAnswer);
    });

    showNextButton = true;

    if (correct) {
      score++;
    }
  } else {
    if (correct) {
      multipleChoiceCorrectCount++;
    }

    selectedAnswersCount++;
    selectedButton.removeEventListener("click", selectAnswer);

    if (
      selectedAnswersCount ===
      shuffledQuestions[currentQuestionIndex].number_of_correct_answers
    ) {
      Array.from(answerButtonsElement.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct);
        button.removeEventListener("click", selectAnswer);
      });

      if (
        multipleChoiceCorrectCount ===
        shuffledQuestions[currentQuestionIndex].number_of_correct_answers
      ) {
        score++;
      }
      multipleChoiceCorrectCount = 0;

      showNextButton = true;
      selectedAnswersCount = 0;
    }
  }

  if (showNextButton) {
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      nextButton.classList.remove("hide");
    } else {
      finishButton.classList.remove("hide");
    }
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);

  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

//question set preview
function showPreview() {
  while (questionSetPreview.firstChild) {
    questionSetPreview.removeChild(questionSetPreview.firstChild);
  }

  previewButton.classList.add("hide");
  startButton.classList.add("hide");
  goBackButton.classList.remove("hide");

  questionSetPreview.classList.remove("hide");
  questionSetContainer.classList.add("hide");
  containerElement.classList.add("preview-view");

  pickedQuestionSet.forEach((question, questionNumber) => {
    const questionDiv = document.createElement("div");
    questionSetPreview.appendChild(questionDiv);
    questionDiv.innerText = questionNumber + 1 + ") " + question.question;
    questionDiv.setAttribute("class", "previewed-question");

    question.answers.forEach((answer) => {
      const asnwerDiv = document.createElement("div");
      questionDiv.appendChild(asnwerDiv);
      asnwerDiv.innerHTML = answer.text;
      asnwerDiv.setAttribute("class", "previewed-answer");

      if (answer.correct === true) {
        asnwerDiv.classList.add("previewed-correct-answer");
      } else {
        asnwerDiv.classList.add("previewed-wrong-answer");
      }
    });
  });
}

//go back to question sets
function showQuestionSets() {
  goBackButton.classList.add("hide");
  previewButton.classList.remove("hide");
  questionSetPreview.classList.add("hide");
  startButton.classList.remove("hide");
  questionSetContainer.classList.remove("hide");
  containerElement.classList.remove("preview-view");
}

//confetti
const start = () => {
  setTimeout(function () {
    confetti.start();
  }, 500);
};

var confetti = {
  maxCount: 150,
  speed: 1,
  frameInterval: 15,
  alpha: 1.0,
  gradient: false,
  start: null,
  stop: null, //call to stop adding confetti
  toggle: null, //call to start or stop the confetti animation depending on whether it's already running
  pause: null, //call to freeze confetti animation
  resume: null, //call to unfreeze confetti animation
  togglePause: null, //call to toggle whether the confetti animation is paused
  remove: null, //call to stop the confetti animation and remove all confetti immediately
  isPaused: null, //call and returns true or false depending on whether the confetti animation is paused
  isRunning: null, //call and returns true or false depending on whether the animation is running
};
(function () {
  confetti.start = startConfetti;
  confetti.stop = stopConfetti;
  confetti.toggle = toggleConfetti;
  confetti.pause = pauseConfetti;
  confetti.resume = resumeConfetti;
  confetti.togglePause = toggleConfettiPause;
  confetti.isPaused = isConfettiPaused;
  confetti.remove = removeConfetti;
  confetti.isRunning = isConfettiRunning;
  var supportsAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  var colors = [
    "rgba(30,144,255,",
    "rgba(107,142,35,",
    "rgba(255,215,0,",
    "rgba(255,192,203,",
    "rgba(106,90,205,",
    "rgba(173,216,230,",
    "rgba(238,130,238,",
    "rgba(152,251,152,",
    "rgba(70,130,180,",
    "rgba(244,164,96,",
    "rgba(210,105,30,",
    "rgba(220,20,60,",
  ];
  var streamingConfetti = false;
  var animationTimer = null;
  var pause = false;
  var lastFrameTime = Date.now();
  var particles = [];
  var waveAngle = 0;
  var context = null;

  function resetParticle(particle, width, height) {
    particle.color =
      colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
    particle.color2 =
      colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = Math.random() * Math.PI;
    return particle;
  }

  function toggleConfettiPause() {
    if (pause) resumeConfetti();
    else pauseConfetti();
  }

  function isConfettiPaused() {
    return pause;
  }

  function pauseConfetti() {
    pause = true;
  }

  function resumeConfetti() {
    pause = false;
    runAnimation();
  }
  function runAnimation() {
    if (pause) return;
    else if (particles.length === 0) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      animationTimer = null;
    } else {
      var now = Date.now();
      var delta = now - lastFrameTime;
      if (!supportsAnimationFrame || delta > confetti.frameInterval) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        updateParticles();
        drawParticles(context);
        lastFrameTime = now - (delta % confetti.frameInterval);
      }
      animationTimer = requestAnimationFrame(runAnimation);
    }
  }
  function startConfetti(timeout, min, max) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    window.requestAnimationFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, confetti.frameInterval);
        }
      );
    })();
    var canvas = document.getElementById("confetti-canvas");
    if (canvas === null) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("id", "confetti-canvas");
      canvas.setAttribute(
        "style",
        "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"
      );
      document.body.prepend(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener(
        "resize",
        function () {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        },
        true
      );
      context = canvas.getContext("2d");
    } else if (context === null) context = canvas.getContext("2d");
    var count = confetti.maxCount;
    if (min) {
      if (max) {
        if (min == max) count = particles.length + max;
        else {
          if (min > max) {
            var temp = min;
            min = max;
            max = temp;
          }
          count = particles.length + ((Math.random() * (max - min) + min) | 0);
        }
      } else count = particles.length + min;
    } else if (max) count = particles.length + max;
    while (particles.length < count)
      particles.push(resetParticle({}, width, height));
    streamingConfetti = true;
    pause = false;
    runAnimation();
    if (timeout) {
      window.setTimeout(stopConfetti, timeout);
    }
  }

  function stopConfetti() {
    streamingConfetti = false;
  }

  function removeConfetti() {
    stop();
    pause = false;
    particles = [];
  }

  function toggleConfetti() {
    if (streamingConfetti) stopConfetti();
    else startConfetti();
  }

  function isConfettiRunning() {
    return streamingConfetti;
  }

  function drawParticles(context) {
    var particle;
    var x, y, x2, y2;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 = particle.x + particle.tilt;
      x = x2 + particle.diameter / 2;
      y2 = particle.y + particle.tilt + particle.diameter / 2;
      if (confetti.gradient) {
        var gradient = context.createLinearGradient(x, particle.y, x2, y2);
        gradient.addColorStop("0", particle.color);
        gradient.addColorStop("1.0", particle.color2);
        context.strokeStyle = gradient;
      } else context.strokeStyle = particle.color;
      context.moveTo(x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();
    }
  }
  function updateParticles() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var particle;
    waveAngle += 0.01;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      if (!streamingConfetti && particle.y < -15) particle.y = height + 100;
      else {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(waveAngle) - 0.5;
        particle.y +=
          (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.5;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        if (streamingConfetti && particles.length <= confetti.maxCount)
          resetParticle(particle, width, height);
        else {
          particles.splice(i, 1);
          i--;
        }
      }
    }
  }
})();

//Question Sets (1-9)

const questionSet1 = [
  {
    question_type: "single-choice",
    question: "set 1",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question: "2+2=?",
    answers: [
      { text: "4", correct: true },
      { text: "4", correct: true },
      { text: "9", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "set 1",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet2 = [
  {
    question_type: "single-choice",
    question: "set 2 pick pick pick a fruit",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: " set 2pick a fruitty",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: " set2 pick a potato",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet3 = [
  {
    question_type: "single-choice",
    question: "set 3 ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: " set 3 bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "set 3 aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet4 = [
  {
    question_type: "single-choice",
    question: "ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet5 = [
  {
    question_type: "single-choice",
    question: "ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet6 = [
  {
    question_type: "single-choice",
    question: "ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet7 = [
  {
    question_type: "single-choice",
    question: "ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet8 = [
  {
    question_type: "single-choice",
    question: "ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];

const questionSet9 = [
  {
    question_type: "single-choice",
    question: "ccc",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "bbb",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "aaa",
    answers: [
      { text: "potato", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
];
