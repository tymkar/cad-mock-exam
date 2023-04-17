const previewButton = document.getElementById("preview-button");
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const setsElement = document.getElementById("sets");
const questionSetContainer = document.getElementById("question-set-container");

let shuffledQuestions, currentQuestionIndex, pickedQuestionSet;

startButton.addEventListener("click", startExam);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

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

function startExam() {
  startButton.classList.add("hide");
  shuffledQuestions = pickedQuestionSet.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  questionSetContainer.classList.add("hide");

  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;

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
  } else {
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

      showNextButton = true;
      selectedAnswersCount = 0;
    }
  }

  if (showNextButton) {
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      nextButton.classList.remove("hide");
    } else {
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

//Question Sets (1-9)

const questionSet1 = [
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
    question: "aaa",
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
    question: "pick pick pick a fruit",
    answers: [
      { text: "apple", correct: true },
      { text: "potato", correct: false },
      { text: "deer", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "pick a fruitty",
    answers: [
      { text: "appppple", correct: true },
      { text: "poppptato", correct: false },
      { text: "deepppr", correct: false },
    ],
  },
  {
    question_type: "single-choice",
    question: "pick a potato",
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
