const previewButton = document.getElementById("preview-button");
const homeButton = document.getElementById("home-button");
const goBackButton = document.getElementById("go-back-button");
const startButton = document.getElementById("start-button");
const previousButton = document.getElementById("previous-button");
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
const scoreboard = document.getElementById("scoreboard");
const scoreTitle = document.getElementById("score-title");
const userScore = document.getElementById("score");
const scrollUpButton = document.getElementById("scroll-up-button");

//button event listeners
let shuffledQuestions, currentQuestionIndex, pickedQuestionSet;

previewButton.addEventListener("click", showPreview);

startButton.addEventListener("click", startExam);

scrollUpButton.addEventListener("click", topFunction);

previousButton.addEventListener("click", () => {
  currentQuestionIndex--;
  setPreviousQuestion();
});

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

goBackButton.addEventListener("click", showQuestionSets);
homeButton.addEventListener("click", endMockExam);

finishButton.addEventListener("click", showScoreboard);

function getColor(value) {
  var hue = (value * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

function showScoreboard() {
  var userScorePercentage = Math.round(
    (score / pickedQuestionSet.length) * 100
  );

  //start confetti
  if (userScorePercentage > 65) {
    confetti.start();

    setTimeout(function () {
      confetti.stop();
    }, 10000);
  }

  scoreTitle.style.color = getColor(userScorePercentage);
  userScore.style.color = getColor(userScorePercentage);

  scoreboard.classList.remove("hide");
  previousButton.classList.add("hide");
  finishButton.classList.add("hide");
  questionContainerElement.classList.add("hide");
  selectedSetButton.classList.remove("selected-answer");
  goBackButton.classList.add("hide");
  homeButton.classList.remove("hide");

  userScore.innerText = userScorePercentage + " %";
}

function endMockExam() {
  score = 0;
  questionContainerElement.classList.add("hide");
  questionSetContainer.classList.remove("hide");
  goBackButton.classList.add("hide");
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
  goBackButton.classList.remove("hide");

  // Random questions and answers
  shuffledQuestions = pickedQuestionSet.sort(() => Math.random() - 0.5);

  for (var i = 0; i < shuffledQuestions.length; i++) {
    shuffledQuestions[i].answers.sort(() => Math.random() - 0.5);

    shuffledQuestions[i].answers.map((answer) =>
      answer.selected ? delete answer.selected : ""
    );
  }

  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  questionSetContainer.classList.add("hide");

  setNextQuestion();
}

function setPreviousQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex], currentQuestionIndex);
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex], currentQuestionIndex);
}

function showQuestion(question, questionNumber) {
  progressBarWidth = (questionNumber / pickedQuestionSet.length) * 100 + "%";
  progressBar.style.width = progressBarWidth;

  questionElement.innerText = questionNumber + 1 + ") " + question.question;

  if (question.question_type === "multiple-choice") {
    questionElement.innerText =
      questionElement.innerText + " (Multiple choice)";
  }

  let checked = false;
  let answerCount = 0;
  let correctAnswersCount = 0;

  for (var i = 0; i < question.answers.length; i++) {
    if (question.answers[i].selected) {
      checked = true;
      answerCount++;
    }

    if (question.question_type != "single-choice") {
      correctAnswersCount = question.number_of_correct_answers;
    } else {
      correctAnswersCount = 1;
    }
  }

  if (!checked || answerCount != correctAnswersCount) {
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
  } else {
    question.answers.forEach((answer) => {
      const button = document.createElement("button");

      button.innerText = answer.text;

      button.classList.add("button", "answer-button");

      if (answer.correct) {
        button.classList.add("correct");
      } else {
        button.classList.add("wrong");
      }

      if (answer.selected) {
        button.classList.add("selected-answer");
      }

      button.removeEventListener("click", selectAnswer);

      answerButtonsElement.appendChild(button);
    });
  }

  //Show previous and next/finish buttons on quiz.
  if (currentQuestionIndex > 0) {
    previousButton.classList.remove("hide");
  } else {
    previousButton.classList.add("hide");
  }

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    finishButton.classList.remove("hide");
  }
}

function resetState() {
  nextButton.classList.add("hide");
  finishButton.classList.add("hide");

  multipleChoiceCorrectCount = 0;
  selectedAnswersCount = 0;

  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

let selectedAnswersCount = 0;
let multipleChoiceCorrectCount = 0;

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;

  selectedButton.classList.add("selected-answer");

  for (
    var i = 0;
    i < shuffledQuestions[currentQuestionIndex].answers.length;
    i++
  ) {
    if (
      shuffledQuestions[currentQuestionIndex].answers[i].text ==
      selectedButton.innerHTML
    ) {
      shuffledQuestions[currentQuestionIndex].answers[i].selected = true;
    }
  }

  if (
    shuffledQuestions[currentQuestionIndex].question_type === "single-choice"
  ) {
    Array.from(answerButtonsElement.children).forEach((button) => {
      setStatusClass(button, button.dataset.correct);
      button.removeEventListener("click", selectAnswer);
    });

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

      selectedAnswersCount = 0;
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

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    scrollUpButton.style.display = "block";
  } else {
    scrollUpButton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

//go back to question sets
function showQuestionSets() {
  finishButton.classList.add("hide");
  nextButton.classList.add("hide");
  previousButton.classList.add("hide");
  questionContainerElement.classList.add("hide");
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
    question:
      "Which Application Access configuration field(s) are NOT available if the Can read configuration field is NOT selected?",
    answers: [
      { text: "All access to this table via web services", correct: false },
      { text: "Can create, Can update, and Can delete", correct: true },
      { text: "Allow configuration", correct: false },
      {
        text: "Can read does not affect the availability of other Application Access fields",
        correct: false,
      },
    ],
    selectedAnswers: [],
  },
  {
    question_type: "single-choice",
    question:
      "How should Application Access be configured to prevent all other private application scopes from creating configuration records on an application's data tables?",
    answers: [
      {
        text: "Set the Accessible from field value to This application scope only",
        correct: true,
      },
      {
        text: "Set the Accessible from field value to This application scope only and de­ select the Allow access to this table via web services option",
        correct: false,
      },
      {
        text: "Set the Accessible from field value to All application scopes and de-select the Can create option",
        correct: false,
      },
      {
        text: "You must create Access Controls to prevent all other application scopes from creating configuration records on an application's data tables rather than using Application Access",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which source control operation is available from BOTH Studio and the Git Repository?",
    answers: [
      { text: "Stash Local Changes", correct: false },
      { text: "Switch Branch", correct: false },
      { text: "Create Branch", correct: true },
      { text: "Commit Changes", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT true for the Weight field?",
    answers: [
      { text: "The Weight value defaults to zero", correct: false },
      {
        text: "Only Notifications with the highest weight for the same record and recipients are sent",
        correct: false,
      },
      {
        text: "A Weight value of zero means the Notification is always sent when the Notification's When to send criteria is met",
        correct: false,
      },
      {
        text: "A Weight value of zero means that no email should be sent",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is true?",
    answers: [
      {
        text: "A UI Policy's Actions and Scripts execute at the same time",
        correct: false,
      },
      {
        text: "The execution order for a UI Policy's Scripts andActions is determined at runtime",
        correct: false,
      },
      {
        text: "A UI Policy's Actions execute before the UI Policy's Scripts",
        correct: true,
      },
      {
        text: "A UI Policy's Scripts execute before the UI Policy's Actions",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a debugging strategy for client-side scripts?",
    answers: [
      { text: "jslog()", correct: false },
      { text: "Field Watcher", correct: false },
      { text: "g_form.addlnfoMessage()", correct: false },
      { text: "gs.log()", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is the fastest way to create and configure a Record Producer?",
    answers: [
      {
        text: "Open the table in the Table records and select the Add to Service Catalog Related Link",
        correct: true,
      },
      {
        text: "Create a Catalog Category, open the category, and select the Add New Record Producer button",
        correct: false,
      },
      {
        text: "Open the table's form,right-click on the form header, and select the Create Record Producer menu item",
        correct: false,
      },
      {
        text: "Use the Record Producer module then add andconfigure all variables manually",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A scoped application containing Flow Designer content dedicated to a particular application is called a(n):",
    answers: [
      { text: "Spoke", correct: true },
      { text: "Action", correct: false },
      { text: "Bundle", correct: false },
      { text: "Flow", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which platform feature can be used to determine the relationships between field in an Import Set table to field in an existing ServiceNow table?",
    answers: [
      { text: "Cl Relationship Builder", correct: false },
      { text: "Business Service Management Map", correct: false },
      { text: "Data Sources", correct: false },
      { text: "Transform Map", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following client-side scripts apply to Record Producers?",
    answers: [
      { text: "Catalog Client Scripts and Catalog UI Policies", correct: true },
      { text: "Client Scripts and UI Policies", correct: false },
      { text: "UI Scripts and UI Actions", correct: false },
      { text: "UI Scripts and Record Producer Scripts", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which Report Type{s) can be created by right-clicking on a column header in a table's list?",
    answers: [
      { text: "Bar Chart", correct: false },
      { text: "Bar Chart, Pie Chart, Histogram, and Line", correct: false },
      { text: "Bar Chart and Pie Chart", correct: true },
      { text: "Bar Chart, Pie Chart, and Histogram", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is part of the client-side scripting API?",
    answers: [
      { text: "GlideUser object (g_user)", correct: true },
      { text: "current and previous objects", correct: false },
      { text: "workflow.scratchpad", correct: false },
      { text: "GlideSystem object (gs)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT required to link a ServiceNow application to a Git repository?",
    answers: [
      { text: "URL", correct: false },
      { text: "Password", correct: false },
      { text: "Application name", correct: true },
      { text: "Username", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which objects can be used in Inbound Action scripts?",
    answers: [
      { text: "email", correct: true },
      { text: "previous", correct: false },
      { text: "current", correct: true },
      { text: "event", correct: true },
      { text: "producer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for GlideUser (g_user) methods?",
    answers: [
      {
        text: "Can be used in Business Rules, and Scripts Includes",
        correct: false,
      },
      {
        text: "Can be used in Client Scripts, UI Policies and UI Actions",
        correct: true,
      },
      { text: "Can be used in Business Rules only", correct: false },
      {
        text: "Can be used in Client Scripts and UI Policies only",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following statements does NOT apply when extending an existing table?",
    answers: [
      {
        text: "The parent tables Access Controls are evaluated when determining access to the new tables records and fields",
        correct: false,
      },
      {
        text: "You must script and configure all required behaviors",
        correct: true,
      },
      {
        text: "The new table inherits all of the fields from the parent table",
        correct: false,
      },
      {
        text: "The new table inherits the functionality built into the parent table",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `What is the output of below code snippet?
	  var count = new GlideAggregate('incident');
	      count.addAggregate('MIN','sys_mod_count');
	      count.addAggregate('MAX','sys_mod_count');
	      count.addAggregate('AVG','sys_mod_count');
	      count.groupBy('category');
	      count.query();

	  while(count.next()){

	    var min= count.getAggregate('MIN','sys_mod_count');
	    var max = count.getAggregate('MAX','sys_mod_count');
	    var avg= count.getAggregate('AVG','sys_mod_count');
	    var category= count.category.getDisplayValue();

	    gs.log(category + " Update counts: MIN="+ min+" MAX="+ max+" AVG="+ avg);
	  }`,
    answers: [
      {
        text: "Result is total number of times records have been modified using the MIN, MAX, and AVG values.",
        correct: true,
      },
      {
        text: "Result is total number of times records have been created using the MIN, MAX, and AVG values.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is a Module?",
    answers: [
      {
        text: "A web-based way of providing software to end-users",
        correct: false,
      },
      {
        text: "A way of helping users quickly access information and services by filtering the items in the Application Navigator",
        correct: false,
      },
      {
        text: "A group of menus, or pages, providing related information and functionality to end-users",
        correct: false,
      },
      {
        text: "The functionality within an application menu such as opening a page in the content frame or a separate tab or window",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for a Script Include with a Protection Policy value of Protected?",
    answers: [
      {
        text: "The Protection Policy is applied only if the glide.app.apply_protection system property value is true",
        correct: false,
      },
      {
        text: "Any user with the protected_edit role can see and edit the Script Include",
        correct: false,
      },
      {
        text: "The Protection Policy is applied only if the application is downloaded from the ServiceNow App Store",
        correct: true,
      },
      {
        text: "The Protection policy option can only be enabled by a user with the admin role",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Application developers configure ServiceNow using industry standard JavaScript to ...",
    answers: [
      {
        text: "Extend and add functionality",
        correct: true,
      },
      {
        text: "Customize the organizations company logo and banner text",
        correct: false,
      },
      {
        text: "Enable the right-click to edit the context menus on applications in the navigator",
        correct: false,
      },
      { text: "Configure the outgoing email display name", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is true regarding Application Scope?",
    answers: [
      { text: "Any developer can edit any application", correct: false },
      {
        text: "Developers can choose the prefix for a scopes namespace",
        correct: false,
      },
      {
        text: "All applications are automatically part of the Global scope",
        correct: false,
      },
      {
        text: "Applications downloaded from 3rd party ServiceNow application developers cannot have naming conflicts",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following CANNOT be debugged using the Field Watcher?",
    answers: [
      { text: "Access Controls", correct: false },
      { text: "Client Scripts", correct: false },
      { text: "Script Includes", correct: true },
      { text: "Business Rules", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Identify the incorrect statement about Delegated Development in ServiceNow.",
    answers: [
      {
        text: "Administrators can specify which application file types the developer can access.",
        correct: false,
      },
      {
        text: "Administrators can grant non-admin users the ability to develop global applications.",
        correct: true,
      },
      {
        text: "Administrators can grant the developer access to security records.",
        correct: false,
      },
      {
        text: "Administrators can grant the developer access to script fields.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is NOT supported by Flow Designer?",
    answers: [
      { text: "Run a flow from a MetricBase Trigger", correct: false },
      { text: "Use Delegated Developer", correct: false },
      { text: "Call a subflow from a flow", correct: false },
      { text: "Test a flow with rollback", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a purpose of application scoping?",
    answers: [
      {
        text: "Provide a namespace (prefix and scope name) to prevent cross application name collisions",
        correct: false,
      },
      {
        text: "Provide a way of tracking the user who developed an application",
        correct: true,
      },
      {
        text: "Provide controls for how scripts from another scope can alter tables in a scoped application",
        correct: false,
      },
      {
        text: "Provide a relationship between application artifacts",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following writes a message to the system log but NOT to the syslog table unless debug has been activated?",
    answers: [
      { text: 'gs.log("Hello World");', correct: false },
      { text: 'gs.info("Hello World");', correct: false },
      { text: 'gs.print("Hello World");', correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How to see what scripts, reports, and other application artifacts will be present in a published application:",
    answers: [
      {
        text: "Open the artifact records individually to verify the value in the Application field",
        correct: false,
      },
      { text: "Open the list of Update Sets for the instance", correct: false },
      {
        text: "Enter the name of the Application in the Global search field",
        correct: false,
      },
      {
        text: "Examine the Application Files Related List in the application to be published",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How do I make my accept solution widget conditional on page load in Service Portal?",
    answers: [
      { text: "Use ngShow", correct: false },
      { text: "Use ngApp", correct: false },
      { text: "Use ng-if", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is a list of Link types?",
    answers: [
      {
        text: "List of Records, Content Page, Order, URL (from arguments)",
        correct: false,
      },
      {
        text: "Assessment, List of Records, Separator, Timeline Page",
        correct: true,
      },
      {
        text: "Assessment, List of Records, Content Page, Roles",
        correct: false,
      },
      {
        text: "List of Records, Separator, Catalog Type, Roles",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "In what order are ServiceNow Access Controls evaluated?",
    answers: [
      { text: "table, field", correct: true },
      { text: "record, field", correct: false },
      { text: "table, record", correct: false },
      { text: "field, table", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When configuring a module, what does the Override application menu roles configuration option do?",
    answers: [
      {
        text: "Self-Service users can access the module even though they do not have roles",
        correct: false,
      },
      {
        text: "Users with the module role but without access to the application menu access the module",
        correct: true,
      },
      {
        text: "Users with access to the application menu can seethe module even if they dont have the module role",
        correct: false,
      },
      {
        text: "Admin is given access to the module even if Access Controls would ordinarily prevent access",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When configuring an Access Control rule which has no condition or script, which one of the following statements is NOT true?",
    answers: [
      {
        text: "table.None will grant access to every record on the table",
        correct: false,
      },
      {
        text: "table.*will grant access to every field in a record",
        correct: false,
      },
      {
        text: "table.field will grant access to a specific field in a record",
        correct: false,
      },
      {
        text: "table.id will grant access to a specific record on the table",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which method call in client side returns true only if the currently logged in user has the catalog_admin role and in no other case?",
    answers: [
      { text: 'g_user.hasRoleOnly("catalog_admin")', correct: false },
      { text: 'g_user.hasRole("catalog_admin")', correct: false },
      { text: 'g_user.hasRoleExactly("catalog_admin")', correct: true },
      { text: 'g_user.hasRoleFromlist("catalog_admin")', correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which roles grant access to source control repository operations such as importing applications from source control, or linking an application to source control?",
    answers: [
      { text: "git_admin", correct: false },
      { text: "source_control_admin", correct: false },
      { text: "admin", correct: true },
      { text: "source_control", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is NOT a trigger type in Flow Designer?",
    answers: [
      { text: "Application", correct: false },
      { text: "Outbound Email", correct: true },
      { text: "Record", correct: false },
      { text: "Schedule/Dates", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "If the Create module field is selected when creating a table, what is the new modules default behavior?",
    answers: [
      { text: "Display an empty homepage for the application", correct: false },
      {
        text: "Open a link to a wiki article with instructions on how to customize the behavior of the new module",
        correct: false,
      },
      {
        text: "Open an empty form so new records can be created",
        correct: false,
      },
      { text: "Display a list of all records from the table", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "From the list below, identify one reason an application might NOT be a good fit with ServiceNow.",
    answers: [
      { text: "Requires reporting capabilities", correct: false },
      { text: "Needs workflow to manage processes", correct: false },
      { text: "Uses forms extensively to interact with data", correct: false },
      {
        text: 'Requires "as-is" use of low-level programming libraries',
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What is the maximum number of test cases that can be added to a suite in ATF?",
    answers: [
      {
        text: "The limit depends on the ServiceNow instance version",
        correct: false,
      },
      {
        text: "The limit depends on the type of application - whether it is in global scope or custom scope",
        correct: false,
      },
      {
        text: "There is no such limit. You can have one suite with many test cases.",
        correct: true,
      },
      {
        text: "The limit depends on the ServiceNow instance version",
        correct: false,
      },
      {
        text: "The limit depends on the type of application - whether it is in global scope or custom scope and ServiceNow instance version",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When working in the Form Designer, configuring the label of a field in a child table changes the label on which table(s)?",
    answers: [
      { text: "base table", correct: false },
      { text: "all tables", correct: false },
      { text: "child table", correct: true },
      { text: "parent table", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is the baseline behavior of a table in a privately-scoped application?",
    answers: [
      {
        text: "The table and its data are not accessible using web services",
        correct: false,
      },
      { text: "All application scopes can read from the table", correct: true },
      {
        text: "Only artifacts in the tables application can read from the table",
        correct: false,
      },
      {
        text: "Any Business Rule can read, write, delete, and update from the table",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following features are available to Global applications?",
    answers: [
      { text: "Source Control", correct: false },
      { text: "Delegated Development", correct: false },
      { text: "Automated Test Framework", correct: true },
      { text: "Flow Designer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When creating new application files in a scoped application, cross scope access is turned on by default in which of the following?",
    answers: [
      { text: "Workflow", correct: false },
      { text: "REST messages", correct: false },
      { text: "Script Include", correct: false },
      { text: "Table", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When creating a Utilities Script Include. Identify the step that does not belong.",
    answers: [
      { text: "Create a prototype object from the new class", correct: false },
      { text: "Identify the table", correct: false },
      { text: "Script the function(s)", correct: false },
      { text: "Create a class", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which objects can you use in a Scheduled Script Execution (Scheduled Job) script?",
    answers: [
      { text: "GlideSystem and current", correct: false },
      { text: "GlideRecord and current", correct: false },
      { text: "GlideSystem and GlideRecord", correct: true },
      { text: "GlideUser and GlideRecord", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      'Which one of the following is true for a table with the "Allow configuration" Application Access option selected?',
    answers: [
      {
        text: "Out of scope applications can create Business Rules for the table",
        correct: true,
      },
      {
        text: "Out of scope applications can add new tables to the scoped application",
        correct: false,
      },
      {
        text: "Any user with the applications user role can modify the applications scripts",
        correct: false,
      },
      {
        text: "Only the in scope applications scripts can create Business Rules for the table",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following methods prints a message on a blue background to the top of the current form by default?",
    answers: [
      { text: "g_form.showFieldMessage()", correct: false },
      { text: "g_form.showFieldMsg()", correct: false },
      { text: "g_form.addInfoMessage()", correct: true },
      { text: "g_form.addInfoMsg()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "One of the uses of the ServiceNow REST API Explorer is:",
    answers: [
      {
        text: "Find resources on the web for learning about REST",
        correct: false,
      },
      {
        text: "Create sample code for sending REST requests to ServiceNow",
        correct: true,
      },
      {
        text: "Practice using REST to interact with public data providers",
        correct: false,
      },
      {
        text: "Convert SOAP Message functions to REST methods",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which of the following are true for reports in ServiceNow?",
    answers: [
      { text: "Can be run on demand by authorized users.", correct: true },
      { text: "Any user can see any report shared with them", correct: false },
      {
        text: "Can be scheduled to be run and distributed by email.",
        correct: true,
      },
      { text: "All users can generate reports on any table.", correct: false },
      { text: "Can be a graphical representationof data.", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "How many applications menus can an application have?",
    answers: [
      {
        text: "One for an applications user modules and one for an applications administrator modules",
        correct: false,
      },
      {
        text: "One for an applications user modules, one for an applications administrator modules, and one for the ServiceNow administrators modules",
        correct: false,
      },
      { text: "Which is used for all application modules", correct: false },
      { text: "As many as the application design requires", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a method used for logging messages in a server-side script for a privately-scoped application?",
    answers: [
      { text: "gs.warn()", correct: false },
      { text: "gs.debug()", correct: false },
      { text: "gs.log()", correct: true },
      { text: "gs.error()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What syntax is used in a Record Producer script to access values from Record Producer form fields?",
    answers: [
      { text: "current.variable_name", correct: false },
      { text: "current.field_name", correct: false },
      { text: "producer.variablename", correct: true },
      { text: "producer.field_name", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What are some of the considerations to document as part of the business process?",
    answers: [
      {
        text: "Business problem, data input/output, users/stakeholders, and process steps",
        correct: true,
      },
      {
        text: "Business problem, data input/output, project schedule, and process steps",
        correct: false,
      },
      {
        text: "Business problem, data input/output, users/stakeholders, and database capacity",
        correct: false,
      },
      {
        text: "Business problem, users/stakeholders, available licenses, and database capacity",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "When configuring a REST Message, the Endpoint is:",
    answers: [
      {
        text: "The URI of the data to be accessed, queried, or modified",
        correct: true,
      },
      {
        text: "Information about the format of the returned data",
        correct: false,
      },
      {
        text: "The response from the provider indicating there is no data to send back",
        correct: false,
      },
      {
        text: "The commands to the REST script to stop execution",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "What are some of the benefits of extending an existing table such as the Task table when creating a new application?",
    answers: [
      { text: "Use existing fields with no modifications", correct: true },
      {
        text: "You can repurpose existing fields by simply changing the label",
        correct: true,
      },
      {
        text: "Existing logic from the parent table will be automatically applied to the new table.",
        correct: true,
      },
      {
        text: "All of the parent table records are copied to the new table.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Here is the Business Rule script template:
	  (function executeRule (current, previous */null when async*/){ }) (current, previous);
	  This type of JavaScript function is known as:`,
    answers: [
      { text: "Scoped", correct: false },
      { text: "Anonymous", correct: false },
      { text: "Self-invoking", correct: true },
      { text: "Constructor", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `The source control operation used to store local changes on an instance for later application is called a(n)`,
    answers: [
      { text: "Tag", correct: false },
      { text: "Update set", correct: false },
      { text: "Branch", correct: false },
      { text: "Stash", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which one of the following returns true if the currently logged in user has the admin role in a server side script?`,
    answers: [
      { text: "gs.hasRole(admin)", correct: true },
      { text: "g_form.hasRoleExactly(admin)", correct: false },
      { text: "gs.hasRoleExactly(admin)", correct: false },
      { text: "g_form.hasRole(admin)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `When a ServiceNow instance requests information from a web service, ServiceNow is the web service:`,
    answers: [
      { text: "Specialist", correct: false },
      { text: "Provider", correct: false },
      { text: "Publisher", correct: false },
      { text: "Consumer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `When a ServiceNow instance requests information from a web service, ServiceNow is the web service:`,
    answers: [
      { text: "Specialist", correct: false },
      { text: "Provider", correct: false },
      { text: "Publisher", correct: false },
      { text: "Consumer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which one of the following is not a UI Action type?`,
    answers: [
      { text: "List choice", correct: false },
      { text: "Form choice", correct: true },
      { text: "List banner button", correct: false },
      { text: "Form button", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Which of the following are configured in an Email Notification?`,
    answers: [
      { text: "How to send the notification", correct: false },
      { text: "When to send the notification", correct: true },
      { text: "Who will receive the notification", correct: true },
      { text: "What content will be in the notification", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Which of the following statements is true for the Form Designer? (3 options)`,
    answers: [
      {
        text: "To add a section to the form layout, drag it from the Field Types tab to the desired destination on the form.",
        correct: false,
      },
      {
        text: "To remove a field from the form layout, hover over the field to enable the Action buttons, and select the Delete (X) button.",
        correct: true,
      },
      {
        text: "To add a field to the form layout, drag the field from the Fields tab to the desired destination on the form.",
        correct: true,
      },
      {
        text: "To create a new field on a forms table, drag the appropriate data type from the Field Types tab to the form and then configure the new field",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following methods are useful in Access Control scripts?`,
    answers: [
      { text: "g_user.hasRole() and current.isNewRecord()", correct: false },
      { text: "gs.hasRole() and current.isNewRecord()", correct: true },
      { text: "g_user.hasRole() and current.isNew()", correct: false },
      { text: "gs.hasRole() and current.isNew()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following objects does a Display Business Rule NOT have access to?`,
    answers: [
      { text: "GlideSystem", correct: false },
      { text: "previous", correct: true },
      { text: "g_scratchpad", correct: false },
      { text: "current", correct: false },
    ],
  },
];

const questionSet2 = [
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "How can a developer extract data from the response body after calling a REST web service?",
    answers: [
      {
        text: "Use the Convert Response Body wizard to translate the response into an object.",
        correct: false,
      },
      {
        text: "Use the XMLDocument2 API to extract data from XML formatted responses.",
        correct: true,
      },
      {
        text: "Use the XMLDocument2 Script Include to parse the XML.",
        correct: false,
      },
      {
        text: "Use the JSON API to convert JSON formatted responses to a JavaScript object",
        correct: true,
      },
      {
        text: "Click the Convert Response Body button to convert the response.",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "What are the UDC (user experience) options available in Guided Application Creator?",
    answers: [
      { text: "Classic", correct: true },
      { text: "Desktop", correct: false },
      { text: "Workspace", correct: false },
      { text: "Mobile", correct: true },
      { text: "Tablet", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When evaluating Access Controls, ServiceNow searches and evaluates:",
    answers: [
      { text: "Only for matches on the current table", correct: false },
      {
        text: "From the most generic match to the most specific match",
        correct: false,
      },
      {
        text: "From the most specific match to the most generic match",
        correct: true,
      },
      { text: "Only for matches on the current field", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When ServiceNow receives an inbound email it attempts to match the sender to a user record. Which one of the following is NOT true?",
    answers: [
      {
        text: "Inbound Action scripts can reference the user using methods such as gs.getUserName()",
        correct: false,
      },
      {
        text: "If no match is found the email is sent to the Inbox Junk folder",
        correct: true,
      },
      {
        text: "If a match is found, the user is impersonated for the execution of the Inbound Actions",
        correct: false,
      },
      {
        text: "If automatic user creation is disabled, the Guest user is impersonated",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which role is required to access Guide Application Creator?",
    answers: [
      { text: "sn_g_app_creator.app_creator", correct: true },
      { text: "sn_app_creator.app_creator", correct: false },
      { text: "sn_gac.app_creator", correct: false },
      { text: "sn_developer.app_creator", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following are NOT methods from the GlideRecord API?",
    answers: [
      { text: "addOrQuery()", correct: true },
      { text: "addQuery()", correct: false },
      { text: "addAndOuery()", correct: true },
      { text: "addEncodedQuery()", correct: false },
      { text: "query()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is NOT a type of annotation?",
    answers: [
      { text: "Info Box Yellow", correct: true },
      { text: "Text", correct: false },
      { text: "Info Box Red", correct: false },
      { text: "Section Separator", correct: false },
      { text: "Line Separator", correct: false },
      { text: "Info Box Blue", correct: false },
      { text: "Section Details", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "While debugging security rules,what does the blue color code indicate",
    answers: [
      { text: "Failed", correct: false },
      { text: "Access denied", correct: false },
      { text: "Passed", correct: false },
      {
        text: "Indicates the ACL is already in the cache and does not need to be re-evaluated",
        correct: true,
      },
      { text: "Access granted", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which Script Debugger feature helps filter debugging searches to quickly narrow down script problems?",
    answers: [
      { text: "Script Search", correct: false },
      { text: "Session Tracer", correct: false },
      { text: "Script Filter", correct: false },
      { text: "Script Tracer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "An application has a table named MyTable with the following three fields: field1, field2, field3. Table.none is set for READ for the Admin and Itil roles. Table.field3 is set for the READ by the Ad min role only. What with the Itil role be able to read? (select one)",
    answers: [
      { text: "field2, field3", correct: false },
      { text: "fieldl, field2", correct: true },
      { text: "fieldl, field2, field3", correct: false },
      { text: "fieldl, field3", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "In Form Designer, when you edit the label of a field on a child table, the label is updated on?",
    answers: [
      { text: "Child table", correct: true },
      { text: "Parent table", correct: false },
      { text: "Base table", correct: false },
      { text: "All tables", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What one of the following is the correct syntax for adding dynamic content to a notifications HTML message field?",
    answers: [
      { text: "current.short_description", correct: false },
      { text: "${short_description}", correct: true },
      { text: "$current.short_description", correct: false },
      { text: "$short_description", correct: false },
      { text: "S{current.short_description}", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following is NOT a type of authentication used by RESTAPIs?",
    answers: [
      { text: "0Auth 2.0", correct: true },
      { text: "JDBC", correct: true },
      { text: "Basic Auth", correct: false },
      { text: "CIM", correct: false },
      { text: "Mutual authentication using protocol profiles", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the below is the best practice for adding instructions to a form?",
    answers: [
      { text: "Populated read only field", correct: false },
      { text: "Form Annotations", correct: true },
      { text: "Context menu or UI Action", correct: false },
      { text: "Related links to wiki pages", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The option in Table configuration that allows this table to be extended from?",
    answers: [
      { text: "Can be Extended", correct: false },
      { text: "Extended By", correct: false },
      { text: "Extensible", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following function is NOT available in the ServiceNow REST API?",
    answers: [
      { text: "PATCH", correct: false },
      { text: "DELETE", correct: false },
      { text: "POST", correct: false },
      { text: "PUT", correct: false },
      { text: "COPY", correct: true },
      { text: "GET", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "How does ServiceNow match inbound email to existing records?",
    answers: [
      { text: "Subject Line", correct: false },
      { text: "Watermark", correct: true },
      { text: "sys_id", correct: false },
      { text: "Record link", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When debugging a script a developer can log breakpoints or conditional log points to log messages to the console at specific lines, and remove log points when they are done debugging them. Which system property must be set to true to enable log points?",
    answers: [
      { text: "com.glide.index_suggestion.debug", correct: false },
      { text: "glide.debug.log_point", correct: true },
      { text: "glide.debugger.log.ui", correct: false },
      { text: "glide.ui.js_can_debug", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following is NOT report type in ServiceNow reports?",
    answers: [
      { text: "Trend", correct: false },
      { text: "List", correct: false },
      { text: "Line", correct: false },
      { text: "Chart", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following is NOT report type in ServiceNow reports?",
    answers: [
      { text: "Trend", correct: false },
      { text: "List", correct: false },
      { text: "Line", correct: false },
      { text: "Chart", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which module creates a user for a Automated Test Framework?",
    answers: [
      { text: "User Creation", correct: false },
      { text: "Create Group", correct: false },
      { text: "Create a User", correct: true },
      { text: "Create Role", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 7,
    question: "What are the core activities of a Workflow?",
    answers: [
      { text: "Notifications", correct: true },
      { text: "Timers", correct: true },
      { text: "Service Catalog", correct: true },
      { text: "Subflows", correct: true },
      { text: "Test", correct: false },
      { text: "Conditions", correct: true },
      { text: "Utilities", correct: true },
      { text: "Approvals", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "How are flow variables access in the flow designer data panel?",
    answers: [
      { text: "Scratchpad variables", correct: false },
      { text: "Data pills", correct: true },
      { text: "New tabs", correct: false },
      { text: "Newly generated icons", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following pops out a special field messages?",
    answers: [
      { text: "g_form.addFieldMessage()", correct: false },
      { text: "g_form.addlnfoMessage()", correct: false },
      { text: "g_form.addErrorMessage()", correct: false },
      { text: "g_form.showFieldMsg()", correct: true },
      { text: "g_form.showFieldMessage()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the below is not a valid state for a scheduled job in ServiceNow instance?",
    answers: [
      { text: "Ready", correct: false },
      { text: "Error", correct: false },
      { text: "Queued", correct: false },
      { text: "Waiting for approval", correct: true },
      { text: "Running", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which protects applications by identifying and restricting access to application files and data?",
    answers: [
      { text: "ACLs", correct: false },
      { text: "Application Scope", correct: true },
      { text: "Roles", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is the name of the guided application creator plugin?",
    answers: [
      { text: "glide.sn-guided-app-creator", correct: false },
      { text: "com.glide.sn-guided-creator-app", correct: false },
      { text: "com.glide.sn-guided-app-creator", correct: true },
      { text: "com.glide.guided-app-creator", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which API provides methods to translate text into multiple languages in real life?",
    answers: [
      { text: "Genius Result Answer", correct: false },
      { text: "Genius Translation", correct: false },
      { text: "Dynamic Result Answer", correct: false },
      { text: "Dynamic Translation", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When creating an application via Guided Application Creator, which of the following is NOT a user experience options?",
    answers: [
      { text: "Classic", correct: false },
      { text: "Portal", correct: true },
      { text: "Workplace", correct: true },
      { text: "Mobile", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following would not be good fit for an application to run on the ServiceNow instance?",
    answers: [
      { text: "Billing & Cost Management application", correct: false },
      { text: "Virtual Reality Gaming application", correct: true },
      { text: "Facilities Management application", correct: false },
      { text: "A meeting room scheduling application", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "When managing global application files, you can NOT:",
    answers: [
      {
        text: "Move application files into or out of scoped application",
        correct: true,
      },
      {
        text: "Move an application file between global applications",
        correct: false,
      },
      { text: "Remove files from a global application", correct: false },
      {
        text: "Add files from global scope to a global application",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is not true about email notifications?",
    answers: [
      { text: "What", correct: false },
      { text: "How", correct: true },
      { text: "Who", correct: false },
      { text: "When", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following actions is not supported by Studio?",
    answers: [
      { text: "Integrate with source control", correct: false },
      { text: "Format code indentation with JS Beautify", correct: false },
      { text: "Enable context menu options to modify data", correct: true },
      { text: "Download only the required session logs.", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Application files in a ServiceNow application are:",
    answers: [
      { text: "XML exports of an application export set", correct: false },
      {
        text: "Artifacts comprising the ServiceNow application",
        correct: true,
      },
      {
        text: "An xml export of the applications table records",
        correct: false,
      },
      {
        text: "csv files containing data imported into an application",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "You are writing an Async Business Rule for a table in a different scope than the Business Rule record. Which one of the following database operations CANNOT be part of the Async Business Rules configuration?",
    answers: [
      { text: "Insert", correct: false },
      { text: "Query", correct: true },
      { text: "Delete", correct: false },
      { text: "Update", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following best describes what a flow is?",
    answers: [
      {
        text: "A script that defines the steps to automate processes on the platform",
        correct: false,
      },
      {
        text: "A sequence of steps to automate processes on the platform",
        correct: false,
      },
      {
        text: "A sequence of actions to automate processes on the platform",
        correct: true,
      },
      {
        text: "A sequence of activities to automate processes on the platform",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following objects does a before business rule have access to?",
    answers: [
      { text: "previous", correct: false },
      { text: "GlideRecord", correct: false },
      { text: "current", correct: false },
      { text: "All the above", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "If the Create module field is selected when creating a table, what is the new modules default behavior?",
    answers: [
      {
        text: "Open an empty form so new record can be created",
        correct: false,
      },
      { text: "Display a list of all records from the table", correct: true },
      { text: "Display an empty homepage for the application", correct: false },
      {
        text: "Open a link to wiki article with instructions on how to customize the behavior of the new module",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What debugging method you use in the server side scripting in a scoped application?",
    answers: [
      { text: "gs.info()", correct: true },
      { text: "gs.log()", correct: false },
      { text: "gs.addlnfoMessage()", correct: false },
      { text: "gs.debuglog()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following modules enables security rule debugging?",
    answers: [
      {
        text: "Access Control > Debugging > Debug Security Rule",
        correct: false,
      },
      {
        text: "System Security > Session Debug > Debug Security Rules",
        correct: false,
      },
      {
        text: "System Diagnostics > Debugging > Debug Security Rules",
        correct: false,
      },
      {
        text: "System Diagnostics > Session Debug > Debug Security Rules",
        correct: false,
      },
      {
        text: "System Security > Debugging > Debug Security Rules",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "In a business rule which of the following returns the sys_id of the current logged in user?",
    answers: [
      { text: "gs.getUserSysID()", correct: false },
      { text: "gs.getUserID()", correct: true },
      { text: "g_form.getUserID()", correct: false },
      { text: "g_form.getUserSysID()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following statements must evaluate to true to grant a user access to application tables record?
    a) Conditions configured in the access controls must evaluate to true
    b) Scripts configured in the access control must evaluate to true
    c) The user has one of the roles specified in the required roles related list
    d) Other matching access controls for the records evaluate to true`,
    answers: [
      { text: "a and c", correct: false },
      { text: "a,b,c", correct: false },
      { text: "a and b", correct: false },
      { text: "a,b,c and d", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following is NOT an example of when an application might use a Scheduled Script Execution(Scheduled Job)?`,
    answers: [
      {
        text: "The application needs to send weekly email remainders",
        correct: false,
      },
      {
        text: "The application needs to query the database every day to look for a unassigned records",
        correct: false,
      },
      {
        text: "The application needs to run a clean up script on the last day of every month",
        correct: false,
      },
      {
        text: "The application needs to run a client-side script at the same time every day",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which one of the following is true about the Client side scripted security?`,
    answers: [
      {
        text: "Client side scripts have access to the GlideSystem(gs) user methods",
        correct: false,
      },
      {
        text: "Client side scripts have access to both GlideSystem(gs) and GlideUser(g_user) methods",
        correct: false,
      },
      {
        text: "Client side scripts have access to the GlideUser(g_user) user methods",
        correct: true,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `What does the code search feature do in the studio?`,
    answers: [
      { text: "Searching in all applications", correct: true },
      { text: "Searching in your application", correct: true },
      { text: "Search from a list of applications", correct: false },
      { text: "Searching in a business rule", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `As it relates ServiceNow reporting, which of the following statements describes what a metric can do?`,
    answers: [
      {
        text: "A metric is used to measure and evaluate the effectiveness of IT service management processes",
        correct: true,
      },
      {
        text: "A metric is a report gauge used on homepages to display real-time data",
        correct: false,
      },
      {
        text: "A metric is a time measurement used to report the effectiveness of workflows and SLAs",
        correct: false,
      },
      {
        text: "A metric is a comparative measurement used to report the effectiveness of workflows and SLAs",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which utility is used to determine if field names in an Import Set match the field names on the target table when importing data into ServiceNow?`,
    answers: [
      { text: "Business Service Management Map", correct: false },
      { text: "Transform Maps", correct: false },
      { text: "Auto Map Matching Fields", correct: true },
      { text: "CI Relationship Builder", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following scripts do not always run on the server side?`,
    answers: [
      { text: "Business Rule", correct: false },
      { text: "Script Includes", correct: false },
      { text: "UI Action", correct: true },
      { text: "Script Action", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following can be used to place a report on a Homepage?`,
    answers: [
      { text: "Tag", correct: false },
      { text: "Gauge", correct: true },
      { text: "Catalog", correct: false },
      { text: "Gadget", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question: `Which of the following variab'es are NOT available in all Business Rules?`,
    answers: [
      { text: "g_scratchpad", correct: true },
      { text: "GlideSystem", correct: false },
      { text: "previous", correct: true },
      { text: "current", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `How is access to Application menus and modules controlled?`,
    answers: [
      { text: "Client Scripts", correct: false },
      { text: "Application Rules", correct: false },
      { text: "Roles", correct: true },
      { text: "Access Controls", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `What are the 2 core base tables from which all other tables are extended in ServiceNow?`,
    answers: [
      { text: "incident and cmdb_ci", correct: false },
      { text: "task and cmdb", correct: true },
      { text: "task and cmdb_model", correct: false },
      { text: "incident and cmdb_rel_ci", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following API methods are used when working with datetime in a privately scoped application?`,
    answers: [
      { text: "GlideDateTime", correct: true },
      { text: "gs.nowDateTime()", correct: false },
      { text: "GlideSystem", correct: false },
      { text: "GlideRecord", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Identify the way(s) an application can respond to an Event generated by the gs.eventQueue() method.`,
    answers: [
      { text: "Script Action", correct: true },
      { text: "UI Policy", correct: false },
      { text: "Email Notification", correct: true },
      { text: "Scheduled Job", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following statements is true for managing applications purchased from the Store?`,
    answers: [
      {
        text: "Applications that belong to other organizations can be changed.",
        correct: false,
      },
      {
        text: "There are separate entitlements for application-customizations.",
        correct: false,
      },
      {
        text: "Applications that belong to other organizations can be customized.",
        correct: false,
      },
      {
        text: "Customizations cannot revert back to the base system application.",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which method is used to retrieve system property?`,
    answers: [
      { text: "gs.getAppProperty()", correct: false },
      { text: "g_form.getProperty()", correct: false },
      { text: "g_form.getAppProperty()", correct: false },
      { text: "gs.getProperty()", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `What is true about homepages on mobile?`,
    answers: [
      { text: "Same as desktop homepages in every way", correct: false },
      {
        text: "Same as desktop homepages without the delete option",
        correct: false,
      },
      { text: "There are no homepages on mobile", correct: true },
      {
        text: "Same as desktop homepages with the delete option",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `What is the main purpose of Integration Hub in ServiceNow?`,
    answers: [
      {
        text: "Enables execution of third-party APIs as part of a flow when a specific event occurs in ServiceNow",
        correct: true,
      },
      {
        text: "Activity in workflow designer to integrate 3rd party applications",
        correct: false,
      },
      {
        text: "Custom application from ServiceNow store used for importing data into ServiceNow",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `The getCurrentDomainID() method is part of which scoped class?`,
    answers: [
      { text: "Scoped DCManager", correct: false },
      { text: "Scoped GlideSession", correct: true },
      { text: "Scoped Domain", correct: false },
      { text: "GlideRecord", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Which of the following are steps in the generalized process for working with events?`,
    answers: [
      { text: "Respond to the event", correct: true },
      { text: "Generate the event", correct: true },
      { text: "Write a Business Rule", correct: false },
      { text: "Add an event to the Event Registry", correct: true },
      { text: "Create a Scheduled Script Execution", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which method is used in emulating mobile for testing?`,
    answers: [
      { text: "$t.do", correct: false },
      { text: "$mobile.do", correct: false },
      { text: "$m.do", correct: true },
      { text: "$tablet.do", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which one of the following is NOT a GlideUser (g_user) method?`,
    answers: [
      { text: "getFullName()", correct: false },
      { text: "hasRole()", correct: false },
      { text: "userName", correct: true },
      { text: "hasRoleExactly()", correct: false },
    ],
  },
];

const questionSet3 = [
  {
    question_type: "single-choice",
    question:
      "Which of the following would not be good fit for an application to run on the Servicenow instance?",
    answers: [
      { text: "Facilities Management application", correct: false },
      { text: "Virtual Reality Gaming application", correct: true },
      { text: "A meeting room scheduling application", correct: false },
      { text: "Billing & Cost Management application", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Schema map is part of the form designer",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `An email notification can be triggered using the below options: 
		a) Trigger conditions		
		b) Events		
		c) Manually`,
    answers: [
      { text: "b and c", correct: false },
      { text: "a, b and c", correct: true },
      { text: "a and b", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Is it a best practice to develop applications in Global Scope?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Access to modules is controlled by",
    answers: [
      { text: "ACLs", correct: false },
      { text: "Roles", correct: true },
      { text: "Assignment groups", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The scope of a custom application can be changed at any time by a ServiceNow developer?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Its mandatory to register an event in the event registry for it to be functional",
    answers: [
      { text: "Yes", correct: true },
      { text: "No", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the below methods can be used to default the current date/time in a scoped app?",
    answers: [
      { text: "gs.nowDateTime()", correct: false },
      { text: "new GlideDateTime().getDisplayValue()", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A new section can be added to a form using one of the field types in the form designer",
    answers: [
      {
        text: "False, Sections are added by clicking the + symbol in the current section only.",
        correct: true,
      },
      { text: "True", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Is similar to ACLs in that it allow you to restrict access to certain resources, but instead of restricting tables and records from users - they restrict application resources from other applications",
    answers: [
      { text: "Application Permissions", correct: false },
      { text: "Application roles", correct: false },
      { text: "Application Access Settings", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is the baseline behavior of a table in a privately-scoped application?",
    answers: [
      {
        text: "The table and its data are not accessible using web services",
        correct: false,
      },
      { text: "All application scopes can read from the table", correct: true },
      {
        text: "Only artifacts in the tables application can read from the table",
        correct: false,
      },
      {
        text: "Any Business Rule can read, write, delete, and update from the table",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Team Development administrators can require that pushes undergo ________________ before accepting pushes",
    answers: [
      { text: "Code changes", correct: false },
      { text: "Code review", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "g_form.getReference() function works in the Service Portal client scripts",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When configuring a module, what does the Override application menu roles configuration option do?",
    answers: [
      {
        text: "Self-Service users can access the module even though they do not have roles",
        correct: false,
      },
      {
        text: "Users with the module role but without access to the application menu access the module",
        correct: true,
      },
      {
        text: "Users with access to the application menu can seethe module even if they dont have the module role",
        correct: false,
      },
      {
        text: "Admin is given access to the module even if Access Controls would ordinarily prevent access",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following statements does not apply when extending an existing table?",
    answers: [
      {
        text: "You must script and configure all required behavior",
        correct: false,
      },
      {
        text: "The parents tables access controls are evaluated when determining access to the new tables records and fields",
        correct: false,
      },
      {
        text: "The new table inherits thefunctionality built into the parent table",
        correct: true,
      },
      {
        text: "The new table inherits all of the fields from the parent",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which record is generated to indicate something has occured in ServiceNow?",
    answers: [
      { text: "Event record", correct: true },
      { text: "Script Action", correct: false },
      { text: "Ecc Queue record", correct: false },
      { text: "UI Action", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following cannot be debugged using the field watcher?",
    answers: [
      { text: "Script Includes", correct: true },
      { text: "Business rules", correct: false },
      { text: "Client scripts", correct: false },
      { text: "Access controls", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "All the records created using a record producer are inserted in the Requested Item (sc_req_item) table",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Producer object is available in client scripts of a record producer",
    answers: [
      { text: "No", correct: true },
      { text: "Yes", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What are embedded lists in ServiceNow?",
    answers: [
      {
        text: "Allows for editing related lists without having to navigate away from the form. Changes are saved when the form is saved.",
        correct: true,
      },
      {
        text: "Displays records inother tables that have relationships to the current record.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Application files in a ServiceNow application are:",
    answers: [
      {
        text: "csv files containing data imported into an application",
        correct: false,
      },
      { text: "XMLexports of an application export set", correct: false },
      {
        text: "Artifacts comprising the Servicenow application",
        correct: true,
      },
      {
        text: "An xml export of the applications table recods",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Protects applications by identifying and restricting access to application files and data",
    answers: [
      { text: "ACLs", correct: false },
      { text: "Roles", correct: false },
      { text: "Application Scope", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which method is used to retrieve system property?",
    answers: [
      { text: "gs.getAppProperty()", correct: false },
      { text: "gs.getProperty()", correct: true },
      { text: "g_form.getAppProperty()", correct: false },
      { text: "g_form.getProperty()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A table called x is created with 3 fields,x1,x2,x3 and has the below access controls configured: x.None read access control for users with the admin and itil role x.* read access control for users with the admin role x.x3 read access control for users with itil role which field or fields can a user with itil role read?",
    answers: [
      { text: "x3 only", correct: true },
      { text: "all fields except x3", correct: false },
      { text: "x1 and x3", correct: false },
      { text: "all fields", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Client Scripts and UI Policies can execute based on view",
    answers: [
      { text: "False", correct: false },
      { text: "True", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Workflow can be used to automate UI Actions?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Developers can create an to prevent pushes or pulls to particular instances in the team development hierarchy",
    answers: [
      { text: "Roles", correct: false },
      { text: "Exclusion policy", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A sequence of activities for automating processes in applications is achieved by",
    answers: [
      { text: "Business Rules", correct: false },
      { text: "Workflow", correct: true },
      { text: "UI Actions", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is a module in ServiceNow?",
    answers: [
      { text: "A group of forms with a defined purpose", correct: false },
      {
        text: "The functionality within an application menu such as opening a new record in the same or separate window",
        correct: true,
      },
      {
        text: "A separate application which is downloaded from the ServiceNow store",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Script actions can be triggered using business rules apart from events?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Utility is used to determine if field names in an Import Set match the field names on the target table when importing data into ServiceNow?",
    answers: [
      { text: "Mapping Assist", correct: false },
      { text: "Auto Map Matching Fields", correct: true },
      { text: "Transform Map", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Script debugger can be used to debug client side scripts?",
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "All new tables created in ServiceNow have a default form and list layout",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "While debugging security rules,what does the blue color code indicate",
    answers: [
      { text: "Failed", correct: false },
      { text: "Access denied", correct: false },
      { text: "Passed", correct: false },
      {
        text: "Indicates the ACL is already in the cache and does not need to be re-evaluated",
        correct: true,
      },
      { text: "Access granted", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "The form designer can be used to design list layouts",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `How is access to Application menus and modules controlled?`,
    answers: [
      { text: "Client Scripts", correct: false },
      { text: "Application Rules", correct: false },
      { text: "Roles", correct: true },
      { text: "Access Controls", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Removing a field from a form using the Form Designer deletes the field from the database table.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What module line type is used to access an Application properties page?",
    answers: [
      { text: "Single Record", correct: false },
      { text: "URL (From Arguments)", correct: true },
      { text: "HTML (From Arguments)", correct: false },
      { text: "Script (From Arguments)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Team Dashboard provides a central place to manage all Team Development activities on your development instance",
    answers: [
      { text: "False", correct: false },
      { text: "True", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Removing a field from the form designer deletes it from the database?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The basic strategy while creating a utils script include,identify the steps that does not belong",
    answers: [
      { text: "Identify the table", correct: true },
      { text: "Create a prototype objectfrom the new class", correct: false },
      { text: "Script the function/s", correct: false },
      { text: "Create a class", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which of the following are correct for record producers?",
    answers: [
      {
        text: "Record producer forms can contain graphics and movies",
        correct: true,
      },
      { text: "UI Policies are applicable for record producer", correct: true },
      { text: "Record producer variables map to table fields", correct: true },
      {
        text: "Record producers are used to insert and update records for a single table",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The basic strategy while creating a utils script include,identify the steps that does not belong",
    answers: [
      { text: "Identify the table", correct: true },
      { text: "Create a prototype objectfrom the new class", correct: false },
      { text: "Script the function/s", correct: false },
      { text: "Create a class", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Default scope for all custom applications that uniquely identifies them",
    answers: [
      { text: "Global", correct: false },
      { text: "Private", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Any code changes done in a checked out workflow version are applied to all ServiceNow users triggering the workflow",
    answers: [
      { text: "False", correct: false },
      { text: "True", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "An application menu can have a maximum of 10 modules",
    answers: [
      { text: "True", correct: false },
      {
        text: "False, there can be as many as required bythe application",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What additional information does Debug Business Rules(Details) show in comparison to Debug Business Rules?",
    answers: [
      {
        text: "The time at which the Business rule executed including milliseconds",
        correct: false,
      },
      { text: "Debug information from lists as well as forms", correct: false },
      {
        text: "The result of the business rules condition evaluation",
        correct: false,
      },
      {
        text: "Old and new values for field values changed by the business rule",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "A UI Policy has access to a scripts prior value?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "g_user.hasRole(`x_foo_app_user`), does this return true for the admin role?",
    answers: [
      { text: "No", correct: false },
      { text: "Yes", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "ServiceNow is good for real-time data delivery and update from external sources",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "An ACL for a table may include a table.None Access control or a table.* access control but never both",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Are ACLs mandatory for privately scoped applications?",
    answers: [
      { text: "True", correct: false },
      { text: "False, but it is a best practice", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Purpose of source control integration",
    answers: [
      { text: "Used a versioning system inside ServiceNow", correct: false },
      {
        text: "Allows application developers to integrate with GIT source control repository to save and manage multiple versions of a sub-production instance",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When a referenced field is added to a table, it stores the number or the display value of the referenced record in the database?",
    answers: [
      {
        text: "Yes, it stores the display value of the referenced record",
        correct: false,
      },
      {
        text: "No, the reference field contains sys_id of the referenced record",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When a referenced field is added to a table, it stores the number or the display value of the referenced record in the database?",
    answers: [
      {
        text: "Yes, it stores the display value of the referenced record",
        correct: false,
      },
      {
        text: "No, the reference field contains sys_id of the referenced record",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following objects does a before business rule have access to?",
    answers: [
      { text: "previous", correct: false },
      { text: "GlideRecord", correct: false },
      { text: "current", correct: false },
      { text: "All the above", correct: true },
    ],
  },
];

const questionSet4 = [
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT a UI Action type?",
    answers: [
      { text: "List choice", correct: false },
      { text: "List banner button", correct: false },
      { text: "Form button", correct: false },
      { text: "Form choice", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "In a business rule which of the following returns the sys_id of the current logged in user?",
    answers: [
      { text: "gs.getUserSysID()", correct: false },
      { text: "gs.getUserID()", correct: true },
      { text: "g_form.getUserID()", correct: false },
      { text: "g_form.getUserSysID()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following objects does a Display Business Rule NOT have access to?`,
    answers: [
      { text: "GlideSystem", correct: false },
      { text: "previous", correct: true },
      { text: "g_scratchpad", correct: false },
      { text: "current", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is not a Report Type in ServiceNow?",
    answers: [
      { text: "Trend", correct: false },
      { text: "Funnel", correct: false },
      { text: "Chart", correct: true },
      { text: "Pyramid", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Who sets the glide.appcreator.company.code property?",
    answers: [
      { text: "By the ServiceNow admin", correct: false },
      { text: "ServiceNow sets it", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Can an application have more then one defauIt update set?",
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The protection policy on a script include is useful to protect code for Applications published to the ServiceNow Store?",
    answers: [
      { text: "Yes", correct: true },
      { text: "No", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When you move code changes to a private application scope,you must add the scope namespace qualifier to each function call",
    answers: [
      { text: "Yes", correct: true },
      { text: "No", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When you move code changes to a private application scope,you must add the scope namespace qualifier to each function call",
    answers: [
      { text: "Yes", correct: true },
      { text: "No", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is the fastest way to create and configure a Record Producer?",
    answers: [
      {
        text: "Open the table in the Table records and select the Add to Service Catalog Related Link",
        correct: true,
      },
      {
        text: "Create a Catalog Category, open the category, and select the Add New Record Producer button",
        correct: false,
      },
      {
        text: "Open the table's form,right-click on the form header, and select the Create Record Producer menu item",
        correct: false,
      },
      {
        text: "Use the Record Producer module then add andconfigure all variables manually",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which objects can be used in Inbound Action scripts?",
    answers: [
      { text: "email", correct: true },
      { text: "previous", correct: false },
      { text: "current", correct: true },
      { text: "event", correct: true },
      { text: "producer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Can a field database name be changed once it has been created?",
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "More than one update set can be the default set for any application scope",
    answers: [
      { text: "Yes", correct: true },
      { text: "No", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The field watcher can be used to debug multipie fields at the same time?",
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "In a transform map, only one field can be used for coalesce?",
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `What are the 2 core base tables from which all other tables are extended in ServiceNow?`,
    answers: [
      { text: "incident and cmdb_ci", correct: false },
      { text: "task and cmdb", correct: true },
      { text: "task and cmdb_model", correct: false },
      { text: "incident and cmdb_rel_ci", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following function is NOT available in the ServiceNow REST API?",
    answers: [
      { text: "PATCH", correct: false },
      { text: "DELETE", correct: false },
      { text: "POST", correct: false },
      { text: "PUT", correct: false },
      { text: "COPY", correct: true },
      { text: "GET", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `What are the 3 basic components of Workflow?`,
    answers: [
      { text: "Approvals, Scripts and Tasks", correct: false },
      { text: "Approvals, Notifications and Timers", correct: false },
      { text: "Approvals,Notifications and Tasks", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `ServiceNow recommends creating all new applications in this type of application scope`,
    answers: [
      { text: "Global", correct: false },
      { text: "Private Scope", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Application properties can have reference field as their data type`,
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Records are created in Application Cross scope access table when the Runtime Access Tracking Setting is set to:`,
    answers: [
      { text: "None", correct: false },
      { text: "Tracking/Enforcing", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `What is Runtime Access Tracking for an Application?`,
    answers: [
      {
        text: "Allows administrators to control access to the application settings",
        correct: false,
      },
      {
        text: "Allows administrators to manage script access to application resources, be creating a list of script operations and targets that the system authorizes to run with Options: None, Tracking, Enforcing",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `The client script types`,
    answers: [
      { text: "Before, After, Query, Display", correct: false },
      { text: "onLoad, onChange, onSubmit , onCellEdit", correct: true },
      { text: "onLoad, OnChange", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `A custom application called 'XYZ' has a table 'XYTable' with the below Application Access Configuration:			
		Accessible from: All Application Scopes			
		Can read: Selected			
		Can delete: Selected			
		Allow configuration: Selected			
		Which of the following is true based on the above config?`,
    answers: [
      {
        text: "No script can be written outside the application which can successfully delete records intable XYTable",
        correct: false,
      },
      {
        text: "An Application developer working in another privately scoped app can write a business rule to which successfully deletes all records from the XYTable",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `If there is a role "pa_admin", which methods should be used to exclusively check if admins have the specified role?`,
    answers: [
      { text: "g_user.hasRolefromlist(`pa_admin`)", correct: false },
      { text: "g_user.hasRoleOnly(`pa_admin`)", correct: false },
      { text: "g_user.hasRoleExactly(`pa_admin`)", correct: true },
      { text: "g_user.hasRole(`pa_admin`)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `If there is a role "pa_admin", which methods should be used to exclusively check if admins have the specified role?`,
    answers: [
      { text: "g_user.hasRolefromlist(`pa_admin`)", correct: false },
      { text: "g_user.hasRoleOnly(`pa_admin`)", correct: false },
      { text: "g_user.hasRoleExactly(`pa_admin`)", correct: true },
      { text: "g_user.hasRole(`pa_admin`)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which is the correct link type to use when creating a module which opens the record producer`,
    answers: [
      { text: "HTML (form arguments)", correct: false },
      { text: "Script (form arguments)", correct: false },
      { text: "Content page", correct: true },
      { text: "URL (form arguments)", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Below changes are Captured in update sets`,
    answers: [
      { text: "Tables & Fields", correct: true },
      { text: "CMDB Update", correct: false },
      { text: "Customization", correct: true },
      { text: "Reports", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `An application owns its tables and determine whether other application can access resources from them`,
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `For application access there is a configuration called Allow Access to this table via web services. Which of the following statements is true when this option is selected`,
    answers: [
      {
        text: "The user performing the query via web services must have the correct permission to access the tables records",
        correct: true,
      },
      {
        text: "Even when not selected,users with, correct permissions can use web services to access thetables records",
        correct: false,
      },
      {
        text: "The option restricts access to delete the records but allows all other access",
        correct: false,
      },
      {
        text: "The option restricts access only to SOAP web services and not RESTAPI",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following is true for Scripted REST API?			
		a} They are faster compared to standard table REST API			
		b) They can be used to combine data from multiple tables			
		c} They are used to limit access to system tables			
		d} They are useful when a rest operation involves complex operations.`,
    answers: [
      { text: "b and d", correct: true },
      { text: "a and c", correct: false },
      { text: "None of the aboves", correct: false },
      { text: "a,b,c,d", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following is true for Scripted REST API?			
		a} They are faster compared to standard table REST API			
		b) They can be used to combine data from multiple tables			
		c} They are used to limit access to system tables			
		d} They are useful when a rest operation involves complex operations.`,
    answers: [
      { text: "b and d", correct: true },
      { text: "a and c", correct: false },
      { text: "None of the aboves", correct: false },
      { text: "a,b,c,d", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `When a ServiceNow instance requests information from a web service, ServiceNow is the web service:`,
    answers: [
      { text: "Specialist", correct: false },
      { text: "Provider", correct: false },
      { text: "Publisher", correct: false },
      { text: "Consumer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `What is the purpose of the gs.isInteractive() function in business rules`,
    answers: [
      {
        text: "The function returns true if the action is performed by an interactive user",
        correct: true,
      },
      {
        text: "The function returns true when an event is triggered",
        correct: false,
      },
      {
        text: "The function returns true when a UIAction is clicked",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Team Development uses Git to manage versions`,
    answers: [
      { text: "False (uses version records)", correct: true },
      { text: "True", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `What is the ServiceNow app store?`,
    answers: [
      {
        text: "A forum where you can discuss ServiceNow issues",
        correct: false,
      },
      {
        text: "A website for downloading ServiceNow applications",
        correct: true,
      },
      {
        text: "A portal where incidents can be logged for HI Support",
        correct: false,
      },
      { text: "A store for purchasing SeviceNow plugins", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `Update sets track customizations where the table has an "update_synch" dictionary attribute`,
    answers: [
      { text: "False", correct: false },
      { text: "True", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "ServiceNow is good for media streaming.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The option in Table configuration that allows this table to be extended from?",
    answers: [
      { text: "Can be Extended", correct: false },
      { text: "Extended By", correct: false },
      { text: "Extensible", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What check box is selected in ACL config to display the Script field?",
    answers: [
      { text: "Script", correct: false },
      { text: "Advanced", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Can token based/oauth authentication be used in ServiceNow when consuming REST API?",
    answers: [
      { text: "No", correct: false },
      { text: "Yes", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "By default any new table records are available for viewing by users.",
    answers: [
      { text: "Yes", correct: false },
      {
        text: "No, a user will not be able to see the table records unless they satisfy the acls on the table",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a method used for logging messages in a server-side script for a privately-scoped application?",
    answers: [
      { text: "gs.warn()", correct: false },
      { text: "gs.debug()", correct: false },
      { text: "gs.log()", correct: true },
      { text: "gs.error()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the below is the best practice for adding instructions to a form?",
    answers: [
      { text: "Populated read only field", correct: false },
      { text: "Annotations", correct: true },
      { text: "Context menu or UI Action", correct: false },
      { text: "Related links to wiki pages", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `How to get to the mobile version of the ServiceNow?`,
    answers: [
      { text: "$t.do", correct: false },
      { text: "$mobile.do", correct: false },
      { text: "$m.do", correct: true },
      { text: "$tablet.do", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `current.isNew() is a valid function which returns true if the record being created is a new record`,
    answers: [
      { text: "True", correct: false },
      {
        text: "False, current.isNewRecord() is the correct function which returns true for a new record",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Can you copy a custom application from one instance to another?`,
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Developers DO/DO NOT create application file records directly from the Application File table",
    answers: [
      { text: "Do", correct: false },
      { text: "Do not", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 4,
    question: "What ways can a form field be made read-only?",
    answers: [
      { text: "Business Rules", correct: false },
      { text: "Client Scripts", correct: true },
      { text: "Ul Actions", correct: true },
      { text: "Ul Policy", correct: true },
      { text: "Field Attributes", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What is the purpose of the Allow configuration option on the Application Access settings of a scoped application?",
    answers: [
      {
        text: "Any user with the applications user role will have access to modify the application scripts",
        correct: false,
      },
      {
        text: "Any user with the application's user role can modify the application's scripts",
        correct: false,
      },
      {
        text: "Out of scope applications can create business rules for the table",
        correct: true,
      },
      {
        text: "Out of scope applications can add new tables to the scoped application",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Can a scheduled job be used to run a client siide script everyday?`,
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Applications can access and change its own tables and business logic but other applications such as Incident Management cannot make changes to it without explicit Permission.`,
    answers: [
      { text: "False", correct: false },
      { text: "True", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Can a scheduled job be used to run a client siide script everyday?`,
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which one of the following is true about the client side scripted security?`,
    answers: [
      {
        text: "Client side scripts have access to both the glideSystem(gs) user methods",
        correct: false,
      },
      {
        text: "Client side scripts have access to both the glideUser(g_user) user methods",
        correct: true,
      },
      {
        text: "Client side scripts have access to both the glideSystem(gs) and glideUser(g_user) methods",
        correct: false,
      },
      {
        text: "Client side scripts have no access to both the glideSystem(gs) user methods",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `While accessing a table using REST API, is authentication required for every request sent to the server?`,
    answers: [
      { text: "Yes", correct: false },
      { text: "No, one time authentication is enough", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `A servicenow developer can push updates to any server in the team development hierarchy?`,
    answers: [
      { text: "False", correct: false },
      { text: "True", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `When creating application tables, a user role is automatically added to the table record."	
		which other role does an application typically have?`,
    answers: [
      { text: "Application manager", correct: false },
      { text: "Application admin", correct: true },
      { text: "Application super user", correct: false },
      { text: "Application fulfiller", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `In an email notification which of the following is NOT true for the weight field?`,
    answers: [
      {
        text: "Only notifications with the highest weight for the same record and recipient are sent",
        correct: false,
      },
      {
        text: "A weight value of zero means no email should be send",
        correct: true,
      },
      { text: "The weight value defaults to zero", correct: false },
    ],
  },
];

const questionSet5 = [
  {
    question_type: "single-choice",
    question: "A graphical view of relationships among tables is a <blank>",
    answers: [
      { text: "Schema map", correct: true },
      { text: "Graphical User Interface", correct: false },
      { text: "Dependency view", correct: false },
      { text: "Map source report", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT true for Modules?",
    answers: [
      { text: "Modules open content pages", correct: false },
      {
        text: "Every Module must be part of an Application Menu",
        correct: false,
      },
      { text: "Access to Modules is controlled with roles", correct: false },
      { text: "Every Module must be associated with a table", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "What are Application Files in a ServiceNow application?",
    answers: [
      { text: "An XMLexport of an applications table records", correct: false },
      { text: "ServiceNow artifacts comprising an application", correct: true },
      {
        text: "CSV files containing data imported into an application",
        correct: false,
      },
      { text: "XMLexports of an applications Update Set", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is the purpose of the Application Picker?",
    answers: [
      { text: "Select an application to view", correct: true },
      {
        text: "Choose an application to edit and set the Application Scope",
        correct: false,
      },
      {
        text: "Select an application as a favorite in the Application Navigator",
        correct: false,
      },
      { text: "Choose an application to download and install", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Can inherited fields be deleted from a table?",
    answers: [
      {
        text: "Yes, select the red X in the left-most column in the table definition",
        correct: false,
      },
      {
        text: "Yes, but only if there has never been any saved field data",
        correct: false,
      },
      { text: "Yes, but only if they are text fields", correct: false },
      {
        text: "No, inherited fields cannot be deleted from a child table",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What scripts, reports, and other application artifacts will be in a published application:",
    answers: [
      {
        text: "Enter the name of the Application in the Global search field",
        correct: false,
      },
      {
        text: "Examine the Application Files Related List in the application to be published",
        correct: true,
      },
      { text: "Open the list of Update Sets for the instance", correct: false },
      {
        text: "Open the artifact records individually to verify the value in the Application field",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT a UI Action type?",
    answers: [
      { text: "List choice", correct: false },
      { text: "List banner button", correct: false },
      { text: "Form button", correct: false },
      { text: "Form choice", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for a Script Include with a Protection Policy value of Protected?",
    answers: [
      {
        text: "Any user with the protected_edit role can see and edit the Script Include",
        correct: false,
      },
      {
        text: "The Protection Policy is applied only if the glide.app.apply_protection_system property value is true",
        correct: false,
      },
      {
        text: "The Protection policy option can only be enabled by a user with the admin role",
        correct: false,
      },
      {
        text: "The Protection Policy is applied only if the application is downloaded from the ServiceNow App Store",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When evaluating Access Controls,ServiceNow searches and evaluates:",
    answers: [
      { text: "Only for matches on the current table", correct: false },
      {
        text: "From the most specific match to the most generic match",
        correct: true,
      },
      { text: "Only for matches on the current field", correct: false },
      {
        text: "From the most generic match to the most specific match",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "When configuring a REST Message, the Endpoint is:",
    answers: [
      {
        text: "The commands to the REST script to stop execution",
        correct: false,
      },
      {
        text: "Information about the format of the returned data",
        correct: false,
      },
      {
        text: "The URI of the data to be accessed, queried, or modified",
        correct: true,
      },
      {
        text: "The response from the provider indicating there is no data to send back",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Application developers configure ServiceNow using industry standard JavaScript to",
    answers: [
      {
        text: "Enable the right-click to edit the context menus on applications in the navigator",
        correct: false,
      },
      {
        text: "Customize the organizations company logo and banner text",
        correct: false,
      },
      { text: "Extend and add functionality", correct: true },
      { text: "Configure the outgoing email display name", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How must Application Access be configured to prevent all other private application scopes from creating configuration recordls on an applications data tables?",
    answers: [
      {
        text: "You must create Access Controls to prevent all other application scopes from creating configuration records on an applications data tables rather than using Application Access",
        correct: false,
      },
      {
        text: "Set the Accessible from field value to This application scope only and de-select the Allow access to this table via web services option",
        correct: false,
      },
      {
        text: "Set the Accessible from field value to All application scopes and de-select the Can create option",
        correct: false,
      },
      {
        text: "Set the Accessible from field value to This application scope",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What module in the Service Catalog application does an Administrator access to begin creating a new catalog item?",
    answers: [
      { text: "Maintain Categories", correct: false },
      { text: "Maintain Items", correct: true },
      { text: "Content Items", correct: false },
      { text: "Items", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "How is the Event Log different from the Event Registry?",
    answers: [
      {
        text: "Event Log contains generated Events, the Event Registry is a table of Event definitions",
        correct: true,
      },
      {
        text: "Event Log is formatted in the Log style, the Event Registry displays different fields",
        correct: false,
      },
      {
        text: "Event Log lists Events that were triggered by integrations, the Event Registry lists the Events that were triggered during the day (24-hour period)",
        correct: false,
      },
      {
        text: "Event Log lists Events that were triggered by integrations,the Event Registry lists the Events that were triggered during the day (24-hour period)",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following steps can be used to import new data into ServiceNow from a spreadsheet?",
    answers: [
      { text: "Select Data Source, Schedule Transform", correct: false },
      { text: "Load Data, Create Transform Map, Run Transform", correct: true },
      {
        text: "Define Data Source, Select Transform Map, Run Transform",
        correct: false,
      },
      {
        text: "Select Import Set, Select Transform Map, Run Transform",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question: "Tables are made up of which of the following?",
    answers: [
      { text: "records", correct: true },
      { text: "lists", correct: false },
      { text: "forms", correct: false },
      { text: "fields", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "What are the three components of a filter condition:",
    answers: [
      { text: "Field, Operator and Value", correct: true },
      { text: "Condition, Operator, and Value", correct: false },
      { text: "Field, Condition, and Value", correct: false },
      { text: "Variable, Field, and Value", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "Access Control rules may be defined with which of the following permission requirements?",
    answers: [
      { text: "Roles", correct: true },
      { text: "Conditional Expressions", correct: true },
      { text: "Assignment Rules", correct: false },
      { text: "Scripts", correct: true },
      { text: "User Criteria", correct: false },
      { text: "Groups", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which term best describes something that is created, has worked performed upon it, and is eventually moved to a state of closed?",
    answers: [
      { text: "report", correct: false },
      { text: "flow", correct: false },
      { text: "event", correct: false },
      { text: "task", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for a Script Include with a Protection Policy value of Protected?",
    answers: [
      {
        text: "Any user with the protected_edit role can see and edit the Script Include",
        correct: false,
      },
      {
        text: "The Protection policy option can only be enabled by a user with the admin role",
        correct: false,
      },
      {
        text: "The Protection Policy is applied only if the glide.app.apply_protection system property value is true",
        correct: false,
      },
      {
        text: "The Protection Policy is applied only if the application is (Poprawne) downloaded from the ServiceNow App Store",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for GlideUser (g_user) methods?",
    answers: [
      {
        text: "Can be used in Business Rules, and Scripts Includes",
        correct: false,
      },
      {
        text: "Can be used in Client Scripts, UI Policies and UI Actions",
        correct: true,
      },
      { text: "Can be used in Business Rules only", correct: false },
      {
        text: "Can be used in Client Scripts and UI Policies only",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which roles grant access to source control repository operations such as importing applications from source control, or linking an application to source control?",
    answers: [
      { text: "git_admin", correct: false },
      { text: "source_control_admin", correct: false },
      { text: "admin", correct: true },
      { text: "source_control", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which method call in client side returns true only if the currently logged in user has the catalog_admin role and in no other case?",
    answers: [
      { text: 'g_user.hasRoleOnly("catalog_admin")', correct: false },
      { text: 'g_user.hasRole("catalog_admin")', correct: false },
      { text: 'g_user.hasRoleExactly("catalog_admin")', correct: true },
      { text: 'g_user.hasRoleFromlist("catalog_admin")', correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When creating a Utilities Script Include. Identify the step that does not belong.",
    answers: [
      { text: "Create a prototype object from the new class", correct: false },
      { text: "Identify the table", correct: false },
      { text: "Script the function(s)", correct: false },
      { text: "Create a class", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When working in the Form Designer, configuring the label of a field in a child table changes the label on which table(s)?",
    answers: [
      { text: "base table", correct: false },
      { text: "all tables", correct: false },
      { text: "child table", correct: true },
      { text: "parent table", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is true?",
    answers: [
      {
        text: "A UI Policy's Actions and Scripts execute at the same time",
        correct: false,
      },
      {
        text: "The execution order for a UI Policy's Scripts andActions is determined at runtime",
        correct: false,
      },
      {
        text: "A UI Policy's Actions execute before the UI Policy's Scripts",
        correct: true,
      },
      {
        text: "A UI Policy's Scripts execute before the UI Policy's Actions",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is a list of Link types?",
    answers: [
      {
        text: "List of Records, Content Page, Order, URL (from arguments)",
        correct: false,
      },
      {
        text: "Assessment, List of Records, Separator, Timeline Page",
        correct: true,
      },
      {
        text: "Assessment, List of Records, Content Page, Roles",
        correct: false,
      },
      {
        text: "List of Records, Separator, Catalog Type, Roles",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for a table with the 'Allow configuration' Application Access option selected?",
    answers: [
      {
        text: "Only the in scope application's scripts can create Business Rules for the table",
        correct: false,
      },
      {
        text: "Any user with the application's user role can modify the application's scripts",
        correct: false,
      },
      {
        text: "Out of scope applications can create Business Rules for the table when Can Read is also selected",
        correct: true,
      },
      {
        text: "Out of scope applications can add new tables to the scoped application",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is NOT supported by Flow Designer?",
    answers: [
      { text: "Run a flow from a MetricBase Trigger", correct: false },
      { text: "Use Delegated Developer", correct: false },
      { text: "Call a subflow from a flow", correct: false },
      { text: "Test a flow with rollback", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which of the following are true for reports in ServiceNow?",
    answers: [
      { text: "Can be run on demand by authorized users.", correct: true },
      { text: "Any user can see any report shared with them", correct: false },
      {
        text: "Can be scheduled to be run and distributed by email.",
        correct: true,
      },
      { text: "All users can generate reports on any table.", correct: false },
      { text: "Can be a graphical representationof data.", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following features are available to Global applications?",
    answers: [
      { text: "Source Control", correct: false },
      { text: "Delegated Development", correct: false },
      { text: "Automated Test Framework", correct: true },
      { text: "Flow Designer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which Application Access configuration field(s) are NOT available if the Can read configuration field is NOT selected?",
    answers: [
      { text: "All access to this table via web services", correct: false },
      { text: "Can create, Can update, and Can delete", correct: true },
      { text: "Allow configuration", correct: false },
      {
        text: "Can read does not affect the availability of other Application Access fields",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When configuring the content of an Email Notification, which syntax should be used to reference the properties of an event triggering the Notification?",
    answers: [
      { text: "${event.<property name>}", correct: true },
      { text: "${current.<property name>}", correct: false },
      { text: "${property name>.getDisplayValue()}", correct: false },
      { text: "${gs.<property name>}", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is the best UX format to use for lists and forms?",
    answers: [
      { text: "Forms", correct: false },
      { text: "Standard", correct: false },
      { text: "Lists", correct: false },
      { text: "Classic", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which script types execute on the server?",
    answers: [
      { text: "Business Rule", correct: true },
      { text: "UI Policies", correct: false },
      { text: "Scheduled Jobs", correct: true },
      { text: "Client Scripts", correct: false },
      { text: "Script Actions", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Identify characteristic(s) of a Record Producer.",
    answers: [
      {
        text: "All records created using this strategy are inserted into the Requested Item [sc_req_item] table.",
        correct: false,
      },
      { text: "They must be scripted.", correct: false },
      {
        text: "Graphics can be included on the user interface.",
        correct: true,
      },
      {
        text: "Each field prompts the user with a q1uestion rather than a field label",
        correct: true,
      },
      {
        text: "You can scriptbehaviors of fields in the user interface.",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Application developers can specify which ServiceNow page a user sees after submitting a new record using the Record Producer UI. How is the page specified?",
    answers: [
      {
        text: "Create an application property to store the URL",
        correct: false,
      },
      {
        text: "Write an after Business Rule scriptfor the Record Producers table: window.redirect = <URL>",
        correct: false,
      },
      {
        text: "Configure the page in the Module that opens the Record Producer UI",
        correct: false,
      },
      {
        text: "Write a script in the Record Producers Scriptfield",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which server-side object provides methods for working with dates when writing a script in a privately scoped application?",
    answers: [
      { text: "GlideDateTime", correct: true },
      { text: "GlideSystem", correct: false },
      { text: "GlideRecord", correct: false },
      { text: "current", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which actions can a Business Rule take without scripting?",
    answers: [
      { text: "Set field values andwrite to the system log", correct: false },
      {
        text: "Set field values, add message or abort certainactions",
        correct: true,
      },
      { text: "Set field values and generate an event", correct: false },
      { text: "Set field values andquery the database", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When creating an application through the Guided Application Creator, which of the following is a user experience option?",
    answers: [
      { text: "Portal", correct: false },
      { text: "Self-service", correct: false },
      { text: "Mobile", correct: true },
      { text: "Workspace", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is true for the Application Picker?",
    answers: [
      {
        text: "All custom application scope and the Global scope appear in the Application Picker",
        correct: true,
      },
      {
        text: "Only custom applications appear in the Application Picker",
        correct: false,
      },
      {
        text: "All applications in ServiceNow, including baseline applications like Incident, appear in the Application Picker",
        correct: false,
      },
      {
        text: "Only downloaded applications appear in the Application Picker",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which platform feature can be used to det:ermine the relationships between field in an Import Set table to field in an existing ServiceNow table?",
    answers: [
      { text: "Transform Map", correct: true },
      { text: "Data Sources", correct: false },
      { text: "Cl Relationship Builder", correct: false },
      { text: "Business Service Management Map", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What is used to determine user access to knowledge bases or a knowledge article?",
    answers: [
      { text: "Privacy Settings", correct: false },
      { text: "User Criteria", correct: true },
      { text: "sn_kb_read,sn_article_read", correct: false },
      { text: "Read Access Flag", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What is the best practice related to using the Default Update Set for moving customizations between instances?",
    answers: [
      {
        text: "Submit Default update set to application repository",
        correct: false,
      },
      {
        text: "You should not usethe Default Update sets for moving between instances",
        correct: true,
      },
      {
        text: "Merge Default update sets before moving between instances",
        correct: false,
      },
      {
        text: "Keep Default update set to maximum of 20 records, for troubleshooting purposes",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What ServiceNow feature can be triggered by events,and is used to inform users about activities or updates in ServiceNow?",
    answers: [
      { text: "Notifications", correct: true },
      { text: "Events", correct: false },
      { text: "Texts", correct: false },
      { text: "Alerts", correct: false },
      { text: "Emails", correct: false },
    ],
  },
];

const questionSet6 = [
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT a UI Action type?",
    answers: [
      { text: "List choice", correct: false },
      { text: "Form button", correct: false },
      { text: "List banner button", correct: false },
      { text: "Form choice", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When creating new application files in a scoped application, cross scope access is turned on by default in which of the following?",
    answers: [
      { text: "Workflow", correct: false },
      { text: "REST messages", correct: false },
      { text: "Script Include", correct: false },
      { text: "Table", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which Application Access configuration field(s) are NOT available if the Can read configuration field is NOT selected?",
    answers: [
      { text: "All access to this table via web services", correct: false },
      { text: "Can create, Can update, and Can delete", correct: true },
      { text: "Allow configuration", correct: false },
      {
        text: "Can read does not affect the availability of other Application Access fields",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is NOT a trigger type in Flow Designer?",
    answers: [
      { text: "Application", correct: false },
      { text: "Outbound Email", correct: true },
      { text: "Record", correct: false },
      { text: "Schedule/Dates", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How to see what scripts, reports, and other application artifacts will be present in a published application:",
    answers: [
      {
        text: "Open the artifact records individually to verify the value in the Application field",
        correct: false,
      },
      { text: "Open the list of Update Sets for the instance", correct: false },
      {
        text: "Enter the name of the Application in the Global search field",
        correct: false,
      },
      {
        text: "Examine the Application Files Related List in the application to be published",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a debugging strategy for client-side scripts?",
    answers: [
      { text: "jslog()", correct: false },
      { text: "Field Watcher", correct: false },
      { text: "g_form.addlnfoMessage()", correct: false },
      { text: "gs.log()", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Which of the following statements is true for the Form Designer? (3 options)`,
    answers: [
      {
        text: "To add a section to the form layout, drag it from the Field Types tab to the desired destination on the form.",
        correct: false,
      },
      {
        text: "To remove a field from the form layout, hover over the field to enable the Action buttons, and select the Delete (X) button.",
        correct: true,
      },
      {
        text: "To add a field to the form layout, drag the field from the Fields tab to the desired destination on the form.",
        correct: true,
      },
      {
        text: "To create a new field on a forms table, drag the appropriate data type from the Field Types tab to the form and then configure the new field",
        correct: true,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: `Which of the following are configured in an Email Notification?`,
    answers: [
      { text: "How to send the notification", correct: false },
      { text: "When to send the notification", correct: true },
      { text: "Who will receive the notification", correct: true },
      { text: "What content will be in the notification", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which objects can you use in a Scheduled Script Execution (Scheduled Job) script?",
    answers: [
      { text: "GlideSystem and current", correct: false },
      { text: "GlideRecord and current", correct: false },
      { text: "GlideSystem and GlideRecord", correct: true },
      { text: "GlideUser and GlideRecord", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: `When a ServiceNow instance requests information from a web service, ServiceNow is the web service:`,
    answers: [
      { text: "Specialist", correct: false },
      { text: "Provider", correct: false },
      { text: "Publisher", correct: false },
      { text: "Consumer", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is the fastest way to create and configure a Record Producer?",
    answers: [
      {
        text: "Open the table in the Table records and select the Add to Service Catalog Related Link",
        correct: true,
      },
      {
        text: "Create a Catalog Category, open the category, and select the Add New Record Producer button",
        correct: false,
      },
      {
        text: "Open the table's form,right-click on the form header, and select the Create Record Producer menu item",
        correct: false,
      },
      {
        text: "Use the Record Producer module then add andconfigure all variables manually",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which of the following methods are useful in Access Control scripts?`,
    answers: [
      { text: "g_user.hasRole() and current.isNewRecord()", correct: false },
      { text: "gs.hasRole() and current.isNewRecord()", correct: true },
      { text: "g_user.hasRole() and current.isNew()", correct: false },
      { text: "gs.hasRole() and current.isNew()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following client-side scripts apply to Record Producers?",
    answers: [
      { text: "Catalog Client Scripts and Catalog UI Policies", correct: true },
      { text: "Client Scripts and UI Policies", correct: false },
      { text: "UI Scripts and UI Actions", correct: false },
      { text: "UI Scripts and Record Producer Scripts", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When configuring an Access Control rule which has no condition or script, which one of the following statements is NOT true?",
    answers: [
      {
        text: "table.None will grant access to every record on the table",
        correct: false,
      },
      {
        text: "table.*will grant access to every field in a record",
        correct: false,
      },
      {
        text: "table.field will grant access to a specific field in a record",
        correct: false,
      },
      {
        text: "table.id will grant access to a specific record on the table",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How should Application Access be configured to prevent all other private application scopes from creating configuration records on an application's data tables?",
    answers: [
      {
        text: "Set the Accessible from field value to This application scope only",
        correct: true,
      },
      {
        text: "Set the Accessible from field value to This application scope only and de­ select the Allow access to this table via web services option",
        correct: false,
      },
      {
        text: "Set the Accessible from field value to All application scopes and de-select the Can create option",
        correct: false,
      },
      {
        text: "You must create Access Controls to prevent all other application scopes from creating configuration records on an application's data tables rather than using Application Access",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "What are some of the benefits of extending an existing table such as the Task table when creating a new application?",
    answers: [
      { text: "Use existing fields with no modifications", correct: true },
      {
        text: "You can repurpose existing fields by simply changing the label",
        correct: true,
      },
      {
        text: "Existing logic from the parent table will be automatically applied to the new table.",
        correct: true,
      },
      {
        text: "All of the parent table records are copied to the new table.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a method used for logging messages in a server-side script for a privately-scoped application?",
    answers: [
      { text: "gs.warn()", correct: false },
      { text: "gs.debug()", correct: false },
      { text: "gs.log()", correct: true },
      { text: "gs.error()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "If the Create module field is selected when creating a table, what is the new modules default behavior?",
    answers: [
      {
        text: "Open an empty form so new record can be created",
        correct: false,
      },
      { text: "Display a list of all records from the table", correct: true },
      { text: "Display an empty homepage for the application", correct: false },
      {
        text: "Open a link to wiki article with instructions on how to customize the behavior of the new module",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT required to link a ServiceNow application to a Git repository?",
    answers: [
      { text: "URL", correct: false },
      { text: "Password", correct: false },
      { text: "Application name", correct: true },
      { text: "Username", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which Report Type{s) can be created by right-clicking on a column header in a table's list?",
    answers: [
      { text: "Bar Chart", correct: false },
      { text: "Bar Chart, Pie Chart, Histogram, and Line", correct: false },
      { text: "Bar Chart and Pie Chart", correct: true },
      { text: "Bar Chart, Pie Chart, and Histogram", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is a Module?",
    answers: [
      {
        text: "A web-based way of providing software to end-users",
        correct: false,
      },
      {
        text: "A way of helping users quickly access information and services by filtering the items in the Application Navigator",
        correct: false,
      },
      {
        text: "A group of menus, or pages, providing related information and functionality to end-users",
        correct: false,
      },
      {
        text: "The functionality within an application menu such as opening a page in the content frame or a separate tab or window",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which source control operation is available from BOTH Studio and the Git Repository?",
    answers: [
      { text: "Stash Local Changes", correct: false },
      { text: "Switch Branch", correct: false },
      { text: "Create Branch", correct: true },
      { text: "Commit Changes", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following methods prints a message on a blue background to the top of the current form by default?",
    answers: [
      { text: "g_form.showFieldMessage()", correct: false },
      { text: "g_form.showFieldMsg()", correct: false },
      { text: "g_form.addInfoMessage()", correct: true },
      { text: "g_form.addInfoMsg()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A scoped application containing Flow Designer content dedicated to a particular application is called a(n):",
    answers: [
      { text: "Spoke", correct: true },
      { text: "Action", correct: false },
      { text: "Bundle", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What syntax is used in a Record Producer script to access values from Record Producer form fields?",
    answers: [
      { text: "current.variable_name", correct: false },
      { text: "current.field_name", correct: false },
      { text: "producer.variablename", correct: true },
      { text: "producer.field_name", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "How many applications menus can an application have?",
    answers: [
      {
        text: "One for an applications user modules and one for an applications administrator modules",
        correct: false,
      },
      {
        text: "One for an applications user modules, one for an applications administrator modules, and one for the ServiceNow administrators modules",
        correct: false,
      },
      { text: "Which is used for all application modules", correct: false },
      { text: "As many as the application design requires", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `The source control operation used to store local changes on an instance for later application is called a(n)`,
    answers: [
      { text: "Tag", correct: false },
      { text: "Update set", correct: false },
      { text: "Branch", correct: false },
      { text: "Stash", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is part of the client-side scripting API?",
    answers: [
      { text: "GlideUser object (g_user)", correct: true },
      { text: "current and previous objects", correct: false },
      { text: "workflow.scratchpad", correct: false },
      { text: "GlideSystem object (gs)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Application developers configure ServiceNow using industry standard JavaScript to ...",
    answers: [
      {
        text: "Extend and add functionality",
        correct: true,
      },
      {
        text: "Customize the organizations company logo and banner text",
        correct: false,
      },
      {
        text: "Enable the right-click to edit the context menus on applications in the navigator",
        correct: false,
      },
      { text: "Configure the outgoing email display name", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following CANNOT be debugged using the Field Watcher?",
    answers: [
      { text: "Access Controls", correct: false },
      { text: "Client Scripts", correct: false },
      { text: "Script Includes", correct: true },
      { text: "Business Rules", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which objects can be used in Inbound Action scripts?",
    answers: [
      { text: "email", correct: true },
      { text: "previous", correct: false },
      { text: "current", correct: true },
      { text: "event", correct: true },
      { text: "producer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What are some of the considerations to document as part of the business process?",
    answers: [
      {
        text: "Business problem, data input/output, users/stakeholders, and process steps",
        correct: true,
      },
      {
        text: "Business problem, data input/output, project schedule, and process steps",
        correct: false,
      },
      {
        text: "Business problem, data input/output, users/stakeholders, and database capacity",
        correct: false,
      },
      {
        text: "Business problem, users/stakeholders, available licenses, and database capacity",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following statements does NOT apply when extending an existing table?",
    answers: [
      {
        text: "The parent tables Access Controls are evaluated when determining access to the new tables records and fields",
        correct: false,
      },
      {
        text: "You must script and configure all required behaviors",
        correct: true,
      },
      {
        text: "The new table inherits all of the fields from the parent table",
        correct: false,
      },
      {
        text: "The new table inherits the functionality built into the parent table",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is the baseline behavior of a table in a privately-scoped application?",
    answers: [
      {
        text: "The table and its data are not accessible using web services",
        correct: false,
      },
      { text: "All application scopes can read from the table", correct: true },
      {
        text: "Only artifacts in the tables application can read from the table",
        correct: false,
      },
      {
        text: "Any Business Rule can read, write, delete, and update from the table",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a purpose of application scoping?",
    answers: [
      {
        text: "Provide a namespace (prefix and scope name) to prevent cross application name collisions",
        correct: false,
      },
      {
        text: "Provide a way of tracking the user who developed an application",
        correct: true,
      },
      {
        text: "Provide controls for how scripts from another scope can alter tables in a scoped application",
        correct: false,
      },
      {
        text: "Provide a relationship between application artifacts",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is true regarding Application Scope?",
    answers: [
      { text: "Any developer can edit any application", correct: false },
      {
        text: "Developers can choose the prefix for a scopes namespace",
        correct: false,
      },
      {
        text: "All applications are automatically part of the Global scope",
        correct: false,
      },
      {
        text: "Applications downloaded from 3rd party ServiceNow application developers cannot have naming conflicts",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Identify the incorrect statement about Delegated Development in ServiceNow.",
    answers: [
      {
        text: "Administrators can specify which application file types the developer can access.",
        correct: false,
      },
      {
        text: "Administrators can grant non-admin users the ability to develop global applications.",
        correct: true,
      },
      {
        text: "Administrators can grant the developer access to security records.",
        correct: false,
      },
      {
        text: "Administrators can grant the developer access to script fields.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "One of the uses of the ServiceNow REST API Explorer is:",
    answers: [
      {
        text: "Find resources on the web for learning about REST",
        correct: false,
      },
      {
        text: "Create sample code for sending REST requests to ServiceNow",
        correct: true,
      },
      {
        text: "Practice using REST to interact with public data providers",
        correct: false,
      },
      {
        text: "Convert SOAP Message functions to REST methods",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: `Which one of the following returns true if the currently logged in user has the admin role in a server side script?`,
    answers: [
      { text: "gs.hasRole(admin)", correct: true },
      { text: "g_form.hasRoleExactly(admin)", correct: false },
      { text: "gs.hasRoleExactly(admin)", correct: false },
      { text: "g_form.hasRole(admin)", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "From the list below, identify one reason an application might NOT be a good fit with ServiceNow.",
    answers: [
      { text: "Requires reporting capabilities", correct: false },
      { text: "Needs workflow to manage processes", correct: false },
      { text: "Uses forms extensively to interact with data", correct: false },
      {
        text: 'Requires "as-is" use of low-level programming libraries',
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "When configuring a REST Message, the Endpoint is:",
    answers: [
      {
        text: "The URI of the data to be accessed, queried, or modified",
        correct: true,
      },
      {
        text: "Information about the format of the returned data",
        correct: false,
      },
      {
        text: "The response from the provider indicating there is no data to send back",
        correct: false,
      },
      {
        text: "The commands to the REST script to stop execution",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When evaluating Access Controls, ServiceNow searches and evaluates:",
    answers: [
      { text: "Only for matches on the current table", correct: false },
      {
        text: "From the most generic match to the most specific match",
        correct: false,
      },
      {
        text: "From the most specific match to the most generic match",
        correct: true,
      },
      { text: "Only for matches on the current field", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When configuring a module, what does the Override application menu roles configuration option do?",
    answers: [
      {
        text: "Self-Service users can access the module even though they do not have roles",
        correct: false,
      },
      {
        text: "Users with the module role but without access to the application menu access the module",
        correct: true,
      },
      {
        text: "Users with access to the application menu can seethe module even if they dont have the module role",
        correct: false,
      },
      {
        text: "Admin is given access to the module even if Access Controls would ordinarily prevent access",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which platform feature can be used to determine the relationships between field in an Import Set table to field in an existing ServiceNow table?",
    answers: [
      { text: "Cl Relationship Builder", correct: false },
      { text: "Business Service Management Map", correct: false },
      { text: "Data Sources", correct: false },
      { text: "Transform Map", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT true for the Weight field?",
    answers: [
      { text: "The Weight value defaults to zero", correct: false },
      {
        text: "Only Notifications with the highest weight for the same record and recipients are sent",
        correct: false,
      },
      {
        text: "A Weight value of zero means the Notification is always sent when the Notification's When to send criteria is met",
        correct: false,
      },
      {
        text: "A Weight value of zero means that no email should be sent",
        correct: true,
      },
    ],
  },
];

const questionSet7 = [
  {
    question_type: "single-choice",
    question: "ServiceNow is good for media streaming.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      'g_user.hasRole("x_foo_app_user"), does this return true for the admin role?',
    answers: [
      { text: "Yes", correct: true },
      { text: "No", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What Business Rules type execute their logic before a database operation occurs?",
    answers: [
      { text: "After", correct: false },
      { text: "Before", correct: true },
      { text: "Async", correct: false },
      { text: "Display", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What Business Rule type execute their logic immediately after a database operation occurs and before the resulting form is rendered for the user?",
    answers: [
      { text: "After", correct: true },
      { text: "Before", correct: false },
      { text: "Async", correct: false },
      { text: "Display", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What Business Rule type execute asynchronously?",
    answers: [
      { text: "After", correct: false },
      { text: "Before", correct: false },
      { text: "Async", correct: true },
      { text: "Display", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What allows direct scripting access to fields and field values on related records?",
    answers: [
      { text: "Dot-Walking", correct: true },
      { text: "GlideSystem", correct: false },
      { text: "GlideRecord", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "An ACL cant have a NONE Access Control and a * Access Control",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Can an application system property be a reference field?",
    answers: [
      { text: "Yes", correct: false },
      { text: "No", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Can default homepages can be customized?",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "__________ option makes a field a records unique key",
    answers: [
      { text: "Coalesce", correct: true },
      { text: "Unique", correct: false },
      { text: "Key", correct: false },
      { text: "ID", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Assume an application scope, sn_my_app, exists. Scripts from other application scopes can never delete records from tables in the sn_my_app scope.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "An application owns its tables and determine whether other application can access resources from them.",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Developers DO/DO NOT create application file records directly from the Application File table",
    answers: [
      { text: "Do", correct: false },
      { text: "Do not", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Removing a field from a form using the Form Designer deletes the field from the	database table.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Team Development uses Git to manage versions.",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      'Update sets track customizations where the table has an "update_synch" dictionary attribute',
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "More than one update set can be the default set for any application scope",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "ServiceNow is good for real-time data delivery and update form external sources",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "An unpublished workflow will be captured in an update set.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "You can define visibility of variables on a task form using the workflow.",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Sending an email notification is possible via an inbound action?",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "Setting up an application in Guided Application Creator guides you through what three steps?",
    answers: [
      { text: "Load newIntegration Hub spokes", correct: false },
      { text: "Define user roles", correct: true },
      { text: "Customize a Flow Action", correct: false },
      { text: "Launch Virtual Agent", correct: false },
      { text: "Choose User Experience", correct: true },
      { text: "Table configurations", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "The ServiceNow Studio application offers a simple way to do what three things from a tabbed environment?",
    answers: [
      { text: "Use Agent Affinity", correct: false },
      { text: "Create application files", correct: true },
      { text: "Use Advanced Work Assignment", correct: false },
      { text: "Review application files", correct: true },
      { text: "Explore Conversational Interfaces", correct: false },
      { text: "Update application files", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "In the Next Experience, what provides context for where you are in your instance, and enables you to favorite the item youre viewing?",
    answers: [
      { text: "All menu", correct: false },
      { text: "Al search", correct: false },
      { text: "Contextual app pill", correct: true },
      { text: "Instance Personalization", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "With the Next Experience landing page, you can access workspaces, classic lists and forms,applications,history,and favoriites through the:",
    answers: [
      { text: "Standard Homepage layout", correct: false },
      { text: "Dualpane Next Experience UI", correct: false },
      { text: "Standard Dashboard layout", correct: false },
      { text: "Triple pane Next Experience UI", correct: false },
      { text: "Single pane Next Experience UI", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "In the Next Experience,to retrieve any item in the menu, use:",
    answers: [
      { text: "Al search", correct: false },
      { text: "Instance Personalization", correct: false },
      { text: "All menu", correct: true },
      { text: "Contextualapp pill", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "ServiceNow Studio includes which three capabilities?",
    answers: [
      { text: "Launch Machine Learning", correct: false },
      { text: "Integrate with source control", correct: true },
      { text: "Customize a Flow Action", correct: false },
      { text: "Create anapplication and application artifacts", correct: true },
      { text: "Load newIntegration Hub spokes", correct: false },
      { text: "Perform code search", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT a UI Action type?",
    answers: [
      { text: "List choice", correct: false },
      { text: "Form button", correct: false },
      { text: "List banner button", correct: false },
      { text: "Form choice", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "ServiceNow Desktop applications automat ically run on which platform(s):",
    answers: [
      { text: "Desktop", correct: false },
      { text: "Smartphone", correct: false },
      { text: "Desktop and Smartphone", correct: false },
      { text: "Desktop and Tablet", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "You are writing an Async Business Rule fora table in a different scope than the Business Rule record. Which one of the folllowing database operations CANNOT be part of the Async Business Rules configuration?",
    answers: [
      { text: "Query", correct: true },
      { text: "Update", correct: false },
      { text: "Delete", correct: false },
      { text: "Insert", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following is NOT a GlideUser (g_user) method?",
    answers: [
      { text: "userName()", correct: true },
      { text: "getFullName()", correct: false },
      { text: "hasRole()", correct: false },
      { text: "hasRoleExactly()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How do you configure a Scheduled Job to execute on the last day of every month?",
    answers: [
      {
        text: "Set the Run field value to Periodically and the RepeatInterval value to 31",
        correct: false,
      },
      {
        text: "Set the Run field value to Periodically and the RepeatInterval value to Last Day",
        correct: false,
      },
      {
        text: "Set the Run field value to Monthly and the Day field value to 31",
        correct: true,
      },
      {
        text: "Set the Run field value to Monthly and the Day field value to Last Day",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which utility is used to determine if field names in an Import Set match the field names on the target table when importing data into ServiceNow?",
    answers: [
      { text: "Transform Maps", correct: false },
      { text: "Auto Map Matching Fields", correct: true },
      { text: "Cl Relationship Builder", correct: false },
      { text: "Business Service Management Map", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "When managing global application files, you can NOT:",
    answers: [
      {
        text: "Add files from global scope to a global application",
        correct: false,
      },
      { text: "Remove files from aglobal application", correct: false },
      {
        text: "Move an application file between global applications",
        correct: false,
      },
      {
        text: "Move application files into or out of a scoped application",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Assume an application scope, sn_my_app ,exists. Scripts from other application scopes can never delete records from tables in the sn_my_app scope. True or False?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Removing a field from a form using the Form Designer deletes the field from the database table. True or False?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: `The Application Access settings for a table are:	
		A. Global application scope	
		B. All application scopes	
		C. This application scope	
		D. ServiceNow application scope	`,
    answers: [
      { text: "A and B", correct: false },
      { text: "B and C", correct: true },
      { text: "C and D", correct: false },
      { text: "A and C", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is not a Report Type in ServiceNow?",
    answers: [
      { text: "Trend", correct: false },
      { text: "Funnel", correct: false },
      { text: "Chart", correct: true },
      { text: "Pyramid", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Identify the incorrect statement about the Team Development application in ServiceNow",
    answers: [
      {
        text: "Team Development allows for branching operations including pushing and pulling record versions betweeninstances",
        correct: false,
      },
      {
        text: "Team Development cannot use Git to manage versions",
        correct: true,
      },
      {
        text: "Developers can compare adevelopment instance to another development instance.",
        correct: false,
      },
      {
        text: "The Dashboard is acentrallocation for all team development activities.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of these is used to control access to features and capabilities in applications and modules.",
    answers: [
      { text: "Department", correct: false },
      { text: "Group", correct: false },
      { text: "Role", correct: true },
      { text: "Company", correct: false },
      { text: "Organization", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question: "Which one the following best describes an Angular Providers?",
    answers: [
      { text: "addQuery()", correct: false },
      { text: "addEncodedQuery()", correct: false },
      { text: "addOrOuery()", correct: true },
      { text: "addAndQuery()", correct: true },
      { text: "query()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following are NOT methods from the GlideRecord API?",
    answers: [
      { text: "Directive", correct: true },
      { text: "Controller", correct: false },
      { text: "Widget API Class", correct: false },
      { text: "Event", correct: false },
      { text: "Function", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "When do onSubmit Client Scripts execute their script logic?",
    answers: [
      { text: "When a user clicks the Submit button", correct: true },
      { text: "When a user clicks the Delete button", correct: false },
      { text: "When a user clicks the Update button", correct: true },
      {
        text: "When a user clicks the Save menu item in the Additional Actions menu.",
        correct: false,
      },
      {
        text: "When a user clicks the Lookup button on a reference field.",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What one of the following is the correct syntax for adding dynamic content to a notifications HTML message field?",
    answers: [
      { text: "current.short_description", correct: true },
      { text: "$current.short_description", correct: false },
      { text: "${current.short_description}", correct: false },
      { text: "$short_description", correct: false },
      { text: "$(short_description}", correct: true },
    ],
  },
];

const questionSet8 = [
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following are settings configured in the Application Settings? More than one response may be correct.",
    answers: [
      { text: "Accessible from", correct: false },
      { text: "Allow configuration", correct: false },
      { text: "Can update", correct: false },
      { text: "Runtime Access Tracking", correct: true },
      { text: "Restrict Table Choices", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following describe what is configured in the Content Negotiation section?",
    answers: [
      { text: "The available authentication methods.", correct: false },
      { text: "The supported request formats", correct: true },
      { text: "The records available to the API.", correct: false },
      { text: "The supported response formats.", correct: true },
      {
        text: "The contract between the web service provider and consumer.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is the purpose of Embedded Help?",
    answers: [
      { text: "Coach users on using a custom application", correct: false },
      {
        text: "Provide specific written or video-based instructions for a custom application",
        correct: false,
      },
      { text: "Provide help in languages other than English", correct: false },
      { text: "Display content based on user role", correct: false },
      {
        text: "Display content based on query parameter values",
        correct: false,
      },
      { text: "All of the above", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What value does a Business Rule Condition field return if the field is empty?",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
      { text: "Neither", correct: false },
      { text: "Both", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "When managing global application files, you can NOT:",
    answers: [
      {
        text: "Add files from global scope to a global application",
        correct: false,
      },
      { text: "Remove files from a global application", correct: false },
      {
        text: "Move an application file between global applications",
        correct: false,
      },
      {
        text: "Move application files into or out of a scoped application",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which utility is used to determine if field names in an Import Set match the field names on the target table when importing data into ServiceNow?",
    answers: [
      { text: "Auto Map Matching Fields", correct: true },
      { text: "Transform Maps", correct: false },
      { text: "OCI Relationship Builder", correct: false },
      { text: "Business Service Management Map", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following best describes an inbound email action?",
    answers: [
      {
        text: "Defines which actions ServiceNow takes in response to incoming email",
        correct: true,
      },
      { text: "Cannot manage emails from unknown users", correct: false },
      {
        text: "Requires a human to determine which record matches the incoming email",
        correct: false,
      },
      {
        text: "Can only handle replies to notifications sent from ServiceNow",
        correct: false,
      },
      {
        text: "Can only work if a matching outbound message is found",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What field does the data pill reference? Input Variables-> User Group-> Group-> Manager-> Name",
    answers: [
      {
        text: "The Name of the user from the conversation's manager.",
        correct: false,
      },
      { text: "The Name of the manager of a group.", correct: true },
      {
        text: "The Name of the manager of a group the user is part of.",
        correct: false,
      },
      { text: "The Name of a group the user is part of.", correct: false },
      { text: "The Name of user from the conversation.", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following are true about scheduling in ATF?",
    answers: [
      {
        text: "Scheduling allows tests to be scheduled to run at a specific date and time.",
        correct: false,
      },
      {
        text: "Schedules can be configured to test specific browsers and browser versions.",
        correct: false,
      },
      {
        text: "Schedules can be configured to test specific operating systems and operating system versions",
        correct: false,
      },
      { text: "Schedules run at a configured frequency.", correct: true },
      {
        text: "Schedules send results to a watch list of users after completion.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A single Client Script can execute its script logic when a user loads a record into a form AND when a user saves/submits/updates a form",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "Which of the following are NOT true about the current object? [pick three]",
    answers: [
      {
        text: "The current object is automatically instantiated.",
        correct: false,
      },
      {
        text: "The current object property values never change after a record is loaded from the database.",
        correct: true,
      },
      {
        text: "The current and previous objects are always identical.",
        correct: true,
      },
      {
        text: "The current and previous objects are sometimes identical.",
        correct: false,
      },
      {
        text: "The properties of the current object are the same for all Business Rules.",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which Runtime Access Tracking option prevents a script from accessing resources until explicitly allowed?",
    answers: [
      { text: "None", correct: false },
      { text: "Blocking", correct: false },
      { text: "Enforcing", correct: true },
      { text: "Tracking", correct: false },
      { text: "Validating", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "How can user temporarily become another user for testing purposes?",
    answers: [
      {
        text: "Open the User menu and select the Impersonate User menu item. Select a user to impersonate.",
        correct: true,
      },
      {
        text: "Open User Administration > Users, select a user, and click the Impersonate User related link.",
        correct: false,
      },
      {
        text: "Open the User menu and select the Elevate Roles menu item. Select a user to impersonate.",
        correct: false,
      },
      {
        text: "Open User Administration > Impersonate User and select a user to impersonate.",
        correct: false,
      },
      {
        text: "Select a user to impersonate with the User Picker in the banner.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following describes the process to test the configured web service call to a ServiceNow instance?",
    answers: [
      { text: "Click the Send button and view the results.", correct: false },
      { text: "Click the Test button and view the results.", correct: true },
      {
        text: "Click the Execute Now button and view the results.",
        correct: false,
      },
      {
        text: "Click the Run Test button and view the results.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "UI Policies require scripting to make form fields Mandatory, Visible, or Read only.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The x_12345_lego_set table extends the alm_asset table. Which Access Control is evaluated first when determining whether to grant access to the serial_number field?",
    answers: [
      { text: "x_12345_lego_set.serial_number", correct: true },
      { text: "Ox_12345_lego_set.*", correct: false },
      { text: "alm_asset.serial_number", correct: false },
      { text: "alm_asset.*", correct: false },
      { text: "*serial_number", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Protection policies are not applied when installed via update sets",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following are true when a data source does not have columns or values for mandatory target table fields?",
    answers: [
      { text: "The records are imported to the target table", correct: false },
      {
        text: "The records cannot be imported to the target table",
        correct: false,
      },
      {
        text: "The records can be imported if the mandatory fields are not mapped",
        correct: false,
      },
      {
        text: "The records can be imported if the mandatory fields are mapped",
        correct: false,
      },
      {
        text: "The records are imported if all mandatory fields are mapped",
        correct: false,
      },
      { text: "All of the above", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is true for a table with the 'Allow configuration' Application Access option selected?",
    answers: [
      {
        text: "Only the in scope application's scripts can create Business Rules for the table",
        correct: false,
      },
      {
        text: "Any user with the application's user role can modify the application's scripts",
        correct: false,
      },
      {
        text: "Out of scope applications can create Business Rules for the table when Can Read is also selected",
        correct: true,
      },
      {
        text: "Out of scope applications can add new tables to the scoped application",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which items can be configured with multiple roles to grant access?",
    answers: [
      { text: "Application", correct: false },
      { text: "Application Menu", correct: true },
      { text: "Module", correct: true },
      { text: "Table", correct: false },
      { text: "Business Rule", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following methods creates the response body in the resource script?",
    answers: [
      { text: "setBody()", correct: true },
      { text: "setContent()", correct: false },
      { text: "setBodyContent()", correct: false },
      { text: "getBody()", correct: false },
      { text: "getContent()", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "How do you use data from one step in a test in a later step?",
    answers: [
      {
        text: "Write a script to open the test step object to get the data to use in the later step.",
        correct: false,
      },
      {
        text: "Click the step in the Data Panel and select the data to use in the later step.",
        correct: false,
      },
      {
        text: "Create variables on the test and write scripts to populate the variables when the test executes.",
        correct: false,
      },
      {
        text: "Click the Reference button and select the record from the table.",
        correct: false,
      },
      {
        text: "Click the Data Pill Picker button and select the variable from the data pill picker.",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following modules enables security rule debugging?",
    answers: [
      {
        text: "System Diagnostics > Debugging > Debug Security Rules",
        correct: false,
      },
      {
        text: "System Diagnostics > Session Debug > Debug Security Rules",
        correct: false,
      },
      {
        text: "System Security > Session Debug > Debug Security Rules",
        correct: false,
      },
      {
        text: "System Security > Debugging > Debug Security Rules",
        correct: true,
      },
      {
        text: "Access Control > Debugging > Debug Security Rule",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following are possible outcomes when coalescing detects a match between a record in the staging table and a record in the target table?",
    answers: [
      { text: "Create duplicate records", correct: false },
      { text: "Halt the import and ask the user what to do", correct: false },
      { text: "Keep the record already in the target table", correct: true },
      {
        text: "Overwrite the record in the target table with the source data",
        correct: true,
      },
      {
        text: "Stop the import and delete the previously imported records",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "The system can not detect choice and reference type fields when importing data from a spreadsheet.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following are true statements about the ServiceNow Agent mobile application?",
    answers: [
      {
        text: "There is no charge to install the ServiceNow Agent mobile application on mobile devices",
        correct: true,
      },
      {
        text: "When adeveloper creates a custom application for desktop,a mobile version of the custom application is automatically created",
        correct: false,
      },
      {
        text: "Business Rules for custom app tables do not apply when records are modified using the ServiceNow Agent mobile application",
        correct: false,
      },
      {
        text: "If a Mobile view is defined for a custom app table,the ServiceNow Agent mobile application usesthe Mobile view to create a List screen",
        correct: false,
      },
      {
        text: "Developers can create mobile applications for the ServiceNow Agent mobile application without wri·ting any scripts",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Removing a field from a form using the Form Designer deletes the field from the database table. True or False?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "REST API Explorer creates code samples for which of the following languages?",
    answers: [
      { text: "cURL", correct: false },
      { text: "Perl", correct: false },
      { text: "Python", correct: false },
      { text: "JavaScript", correct: false },
      { text: "PowerShell", correct: false },
      { text: "All of the above", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question: "Which the following are true statements about Record Watch?",
    answers: [
      {
        text: "Notifies tables when records are changed by widgets",
        correct: false,
      },
      {
        text: "The recordWatch() method is part of the spUtilWidget API class",
        correct: true,
      },
      { text: "Is automatically part of a widgets logic", correct: false },
      { text: "Registers a listener in a widget", correct: true },
      {
        text: "Notified when table records are inserted, updated, or deleted",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "How do you use data from a subflow in a flow?",
    answers: [
      {
        text: "Write a script to open the subflow object to get the data to use in the flow.",
        correct: false,
      },
      {
        text: "Create a subflow output and assign the subflow output a value from the Assign subflow output action in the subflow. Subflow outputs are data pills in the flow.",
        correct: false,
      },
      {
        text: "Create data pills in the Data Panel to use when the subflow is added to a flow.",
        correct: false,
      },
      {
        text: "Create anaction output and use the Assign subflow output flow logic to assign avalue to the output. Subflow outputs are data pills in the flow.",
        correct: true,
      },
      {
        text: "Outputs from allactions in the subflow are automatically available as data pills in the flow.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Marko is a user in the MSP domain in the hierarchy. The MSP domain has the ACME domain configured as a contains domain. Carl needs to work with records in the ACME EMEA domain. Which configuration change should be made to allow Carl to work with ACME EMEA records?",
    answers: [
      {
        text: "Configure the ACME EMEA domain as a contains domain for the MSP domain.",
        correct: false,
      },
      {
        text: "Configure the MSP domain as a contains domain for the ACME EMEA domain.",
        correct: false,
      },
      {
        text: "Configure the ACME EMEA domain as avisibility domain for Carl Lucas user record.",
        correct: false,
      },
      { text: "No change is necessary.", correct: true },
      {
        text: "Configure the ACME EMEA domainas avisibility domain for the ACME EMEA Technicians group.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Assume an application scope, sn_my_app, exists. Scripts from other application scopes can never delete records from tables in the sn_my_app scope. True or False?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following is NOT a type of credentialused by REST APls?",
    answers: [
      { text: "APIKey", correct: false },
      { text: "Basic Auth", correct: false },
      { text: "CIM", correct: true },
      { text: "0Auth 2.0", correct: false },
      { text: "JDBC", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Test Management can integrate with PPM",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "gs.getProperty() method is used to retrieve Application Property values ina script?",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following best describes the Client Script globalfunction this.server.update()?",
    answers: [
      {
        text: "Calls the server and posts this.data to the Server Script",
        correct: true,
      },
      {
        text: "Calls the server and automatically replaces the current options and data from the server response",
        correct: false,
      },
      {
        text: "Retrieves the options used to invoke the widget on the server",
        correct: false,
      },
      {
        text: "Calls the Server Script and passes custom input",
        correct: false,
      },
      {
        text: "Retrieves the serialized data object from the Server Script",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What happens if no Embedded Help is available for a page?",
    answers: [
      { text: "A default Embedded Help page is displayed.", correct: true },
      { text: "The Toggle Help Sidebar button is grayed out.", correct: false },
      { text: "The No HelpAvailable dialog appears.", correct: false },
      {
        text: "The requestor is redirected to the	ServiceNow docs site.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What happens if no Embedded Help is available for a page?",
    answers: [
      { text: "A default Embedded Help page is displayed.", correct: true },
      { text: "The Toggle Help Sidebar button is grayed out.", correct: false },
      { text: "The No HelpAvailable dialog appears.", correct: false },
      {
        text: "The requestor is redirected to the	ServiceNow docs site.",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "Which of the following should you do before importing data into ServiceNow?",
    answers: [
      { text: "Understand the data you plan to import", correct: true },
      { text: "Play fetch with your dog :)", correct: false },
      {
        text: "Decide what to do with incomplete or erroneous data",
        correct: true,
      },
      {
        text: "Determine which source data maps to which target fields",
        correct: true,
      },
      {
        text: "Delete all the existing target table records to avoid conflicts",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which one of the following best describes what a flow is?",
    answers: [
      { text: "The water flowing over Niagara Falls :)", correct: false },
      {
        text: "A sequence of steps to automate processes on the Now Platform.",
        correct: false,
      },
      {
        text: "A script that definesthe steps to automate processes on the Now Platform",
        correct: false,
      },
      {
        text: "A sequence of actions to automate processes on the Now Platform",
        correct: true,
      },
      {
        text: "A sequence of activities to automate processes on the Now Platform.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following must a user have to access and use the Document Feed for a record?",
    answers: [
      {
        text: "Access to the record to see the live feed group",
        correct: false,
      },
      { text: "Read permissions on the comments field", correct: false },
      { text: "All of the above", correct: true },
      {
        text: "Write permissions on the comments field if the user wants to add comments",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following describes how to parse the response body from REST API call?",
    answers: [
      {
        text: "Use the XML Parser step to extract data from the response body.",
        correct: true,
      },
      {
        text: "Use the JSON Parser step to extract data from the response body.",
        correct: false,
      },
      {
        text: "Use the Parse Response option in the REST step to write the results of the response to output variables.",
        correct: false,
      },
      {
        text: "Create a script step that parses the response body and writes the results to output variables.",
        correct: true,
      },
      {
        text: "Use the OpenAPI Specification to generate outputvariables from the response body.",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 4,
    question:
      "Which of the following are possible data sources for importing data into ServiceNow?",
    answers: [
      { text: "csv", correct: true },
      { text: "TXT", correct: false },
      { text: "JDBC", correct: true },
      { text: "XML", correct: true },
      { text: "HTTP", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one statement correctly describes Access Control rule evaluation?",
    answers: [
      {
        text: "Rules are evaluated from the general to the specific, so a table rule must be active to continue",
        correct: false,
      },
      {
        text: "Rules are evaluated using roles.The role with the most permissions evaluates the rules first",
        correct: false,
      },
      {
        text: "If more than one rule applies to a row,the older rule is evaluated first",
        correct: false,
      },
      {
        text: "If a row levelrule and a field levelrule exist, both rules must be true before an operation is allowed",
        correct: true,
      },
    ],
  },
];

const questionSet9 = [
  {
    question_type: "single-choice",
    question: "Which of the following are true statements about portals?",
    answers: [
      { text: "Page layouts are responsive to device type", correct: false },
      {
        text: "Page layouts are responsive to screen resolution",
        correct: false,
      },
      { text: "Viewport size changes when a page is resized", correct: false },
      { text: "Containers can be fixed layout", correct: false },
      { text: "Containers can be fluid layout", correct: false },
      { text: "All of the above", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following describe ways to make REST step dynamic? [pick two]",
    answers: [
      { text: "Write a script to build the endpoint", correct: false },
      {
        text: "Set HTTP Method to POST and the user will be prompted for any values required by the API",
        correct: false,
      },
      {
        text: "Use a data pill in the Resource Path for any variable information described in the external API's documentation",
        correct: true,
      },
      {
        text: "Use a data pill in the Query Parameter value for any query parameters described in the external API's documentation",
        correct: true,
      },
      {
        text: "Create Connection Attributes for any variables and set values for the Connection Attributes in the Connection record",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following is NOT a true statement about a workflow?",
    answers: [
      { text: "Can be modified by any user", correct: true },
      {
        text: "Is a sequence of activities to automate processes",
        correct: false,
      },
      { text: "Can be triggered by a field value on a record", correct: false },
      { text: "Executes server-side", correct: false },
      { text: "Contains activities and transitions", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following are NOT methods from the GlideRecord API? [pick two]",
    answers: [
      { text: "addQuery()", correct: false },
      { text: "addEncodedQuery()", correct: false },
      { text: "addOrQuery()", correct: true },
      { text: "addAndQuery()", correct: true },
      { text: "query()", correct: false },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "Which of the following are true about widget options? [pick two]",
    answers: [
      {
        text: "Setting widgets option values affects all instances of a widget",
        correct: false,
      },
      {
        text: "Widget options are identical for all widget types",
        correct: false,
      },
      {
        text: "Portal users can change the widget option values",
        correct: false,
      },
      {
        text: "Developers can add widget options to the widget option schema",
        correct: true,
      },
      {
        text: "Reference is a valid data type for a widget option",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "A workflow context contains logging information. Developers can write their own log messages to the workflow context using the Workflow API logging methods. Which one of the following is NOT a Workflow API logging method?",
    answers: [
      { text: "workflow.info", correct: false },
      { text: "workflow.crit", correct: true },
      { text: "workflow.debug", correct: false },
      { text: "workflow.warn", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which of the following is a strategy for debugging Client Scripts or UI Policies?",
    answers: [
      { text: "Browser's Developer Console", correct: false },
      { text: "Debug UI Policies module", correct: false },
      { text: "JavaScript try/catch", correct: false },
      { text: "JavaScript Log and jslog()", correct: false },
      { text: "Field Watcher", correct: false },
      { text: "All of the above", correct: true },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 2,
    question:
      "How can a developer extract data from the response body after calling a REST web service? [pick two]",
    answers: [
      {
        text: "Click the Convert Response Body button to convert the response",
        correct: false,
      },
      {
        text: "Use the JSON API to convert JSON formatted responses to a JavaScript object",
        correct: true,
      },
      {
        text: "Use the XMLDocument2 API to extract data from XML formatted responses.",
        correct: true,
      },
      {
        text: "Use the XMLDocument2 Script Include to parse the XML.",
        correct: false,
      },
      {
        text: "Use the Convert Response Body wizard to translate the response into an object.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following best describes the data import process?",
    answers: [
      {
        text: "Use a Transform Map to move data from the data source to the staging table. Verify the data integrity then move the records to the target table",
        correct: false,
      },
      {
        text: "Load the records from the data source into the target table using a Transform Map then verify the data integrity.",
        correct: false,
      },
      {
        text: "Copy the data source records into a staging table. Copy the records from the staging table to the target table using a Transform Map only if the field names are different between the two tables. Verify the data integrity.",
        correct: false,
      },
      {
        text: "Load data from the data source into a staging table. Use a Transform Map to move data from the staging table fields to the (Poprawne) target table fields then verify the data integrity.",
        correct: true,
      },
      {
        text: "Load the records from the data source into the staging table using a Transform Map then verify the data integrity.",
        correct: false,
      },
    ],
  },
  {
    question_type: "multiple-choice",
    number_of_correct_answers: 3,
    question:
      "Which of the following are steps in the generalized process for working with events? [pick three]",
    answers: [
      { text: "Add an event to the Event Registry", correct: true },
      { text: "Write a Business Rule", correct: false },
      { text: "Generate the event", correct: true },
      { text: "Respond to the event", correct: true },
      { text: "Create a Scheduled Script Execution", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Where can Admins check which release is running on an ServiceNow instance?",
    answers: [
      { text: "Memory Stats module", correct: false },
      { text: "Stats module", correct: true },
      { text: "System.upgraded table", correct: false },
      { text: "Transactions log", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "How are Workflows moved between instances?",
    answers: [
      { text: "Workflows are moved using Update Sets", correct: true },
      { text: "Workflows are moved using Transform Maps", correct: false },
      { text: "Workflows are moved using Application Sets", correct: false },
      { text: "Workflows cannot be moved between instances", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which group of permissions is used to control Application and Module access?",
    answers: [
      { text: "Access Control Rules", correct: false },
      { text: "UI Policies", correct: false },
      { text: "Roles", correct: true },
      { text: "Assignment Rules", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is a Dictionary Override?",
    answers: [
      {
        text: "A Dictionary Override is an incoming customer update in an Update Set which applies to the same objects as a newer local customer update",
        correct: false,
      },
      {
        text: "A Dictionary Override is the addition, modification, or removal of anything that could have an effect on IT services",
        correct: false,
      },
      {
        text: "A Dictionary Override is a task within a workflow that requests an action before the workflow can continue",
        correct: false,
      },
      {
        text: "A Dictionary Override sets field properties in extended tables",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is the function of user impersonation?",
    answers: [
      { text: "Testing and visibility", correct: true },
      { text: "Activate verbose logging", correct: false },
      { text: "View custom perspectives", correct: false },
      { text: "Unlock Application master list", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What information does the System Dictionary contain?",
    answers: [
      {
        text: "The human-readable labels and language settings",
        correct: false,
      },
      { text: "The definition for each table and column", correct: true },
      {
        text: "The information on how tables relate to each other",
        correct: false,
      },
      {
        text: "The language dictionary used for spell checking",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following statements best describes the purpose of an Update Set?",
    answers: [
      {
        text: "An Update Set allows administrators to group a series of changes into a named set and then move this set as a unit to other systems",
        correct: true,
      },
      {
        text: "By default, an Update Set includes customizations, Business Rules, and homepages",
        correct: false,
      },
      {
        text: "An Update Set is a group of customizations that is moved from Production to Development",
        correct: false,
      },
      {
        text: "By default, the changes included in an Update Set are visible only in the instance to which they are applied",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which technique is used to get information from a series of referenced fields from different tables?",
    answers: [
      { text: "Table-Walking", correct: false },
      { text: "Sys_ID Pulling", correct: false },
      { text: "Dot-Walking", correct: true },
      { text: "Record-Hopping", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is a schema map?",
    answers: [
      {
        text: "A schema map enables administrators to define records from specific tables as trouble sources for Configuration Items",
        correct: false,
      },
      {
        text: "A schema map graphically organizes the visual task boards for the CMDB",
        correct: false,
      },
      {
        text: "A schema map graphically displays the Configuration Items that support a business service",
        correct: false,
      },
      {
        text: "A schema map displays the details of tables and their relationships in a visual manner, allowing administrators to view (Poprawne) and easily access different parts of the database schema",
        correct: true,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following statements describes the contents of the Configuration Management Database (CMDB)?",
    answers: [
      {
        text: "The CMDB contains data about tangible and intangible business assets",
        correct: true,
      },
      {
        text: "The CMDB contains the Business Rules that direct the intangible, configurable assets used by a company",
        correct: false,
      },
      {
        text: "The CMDB archives all Service Management PaaS equipment metadata and usage statistics",
        correct: false,
      },
      {
        text: "The CMDB contains ITIL process data pertaining to configuration items",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "In what order should filter elements be specified?",
    answers: [
      { text: "Field, Operator, then Value", correct: true },
      { text: "Field, Operator, then Condition", correct: false },
      { text: "Operator, Condition, then Value", correct: false },
      { text: "Value, Operator, then Field", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "Which one of the following statements is true about Column Context Menus?",
    answers: [
      {
        text: "It displays actions such as creating quick reports, configuring the list, and exporting data",
        correct: true,
      },
      {
        text: "It displays actions related to filtering options, assigning tags, and search",
        correct: false,
      },
      {
        text: "It displays actions related to viewing and filtering the entire list",
        correct: false,
      },
      {
        text: "It displays actions such as view form, view related task, and add relationship",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "When using the Load Data and Transform Map process, what is the Mapping Assist used for?",
    answers: [
      { text: "Mapping fields using the Import Log", correct: false },
      { text: "Mapping fields using Transform History", correct: false },
      { text: "Mapping fields using an SLA", correct: false },
      { text: "Mapping fields using a Field Map", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Which of the following is used to initiate a flow?",
    answers: [
      { text: "A Trigger", correct: true },
      { text: "Core Action", correct: false },
      { text: "A spoke", correct: false },
      { text: "An Event", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Define record producer",
    answers: [
      {
        text: "A record producer is a catalog item that lets users create task-based records from the Service Catalog. It provides an alternate (Poprawne) way for creating records through Service Catalog.",
        correct: true,
      },
      {
        text: "A record producer is a catalog item that lets users create task-based records from the GlideRecord. It provides an alternate way for creating records through server side scripting.",
        correct: false,
      },
    ],
  },
  {
    question_type: "single-choice",
    question: "What is the use of a reference qualifier?",
    answers: [
      {
        text: "It is used to restrict the data that can be selected for a reference field.",
        correct: true,
      },
      {
        text: "It is used to provide data payload to the table",
        correct: false,
      },
      { text: "It is used to display data on the form", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "Who can create or update ACL?",
    answers: [
      { text: "security_admin creates or updates ACL.", correct: true },
      { text: "admin", correct: false },
      { text: "acl_admin", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "It is possible to create incidents automatically based on alerts from Event Management?",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question:
      "What can you use to explore the CMDB hierarchy and table definitions?",
    answers: [
      { text: "CMDB Manager", correct: false },
      { text: "CI Manager", correct: false },
      { text: "CMDB Schema", correct: false },
      { text: "CI Class Manager", correct: true },
    ],
  },
  {
    question_type: "single-choice",
    question: "Are Business Rules need to be always scripted?",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
    ],
  },
];
