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
      "How should Application Access be configured to prevent all other private application scopes from creating configuration records on an application's data tables?",
    answers: [
      {
        text: "Set the Accessible from field value to This application scope only",
        correct: true,
      },
      {
        text: "Set the Accessible from field value to This application scope only and de­-select the Allow access to this table via web services option",
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
      { text: "g_form.addlnfoMessage()", correct: true },
      { text: "g_form.addlnfoMsg()", correct: false },
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
