let currentQuestion = 1;
let answeredQuestions = [];
let markedQuestions = [];
let notVisited = 2;
let timerInterval;
let timeLeft = 600; // 10 minutes in seconds
let questionsAnswered = 0;
let questionsMarked = 0;
const totalQuestions = 2;

const questionArea = document.getElementById('question-area');
const questionNumbers = document.getElementById('question-numbers');
const timerDisplay = document.getElementById('timer');
const answeredDisplay = document.getElementById('answered');
const markedDisplay = document.getElementById('marked');
const notVisitedDisplay = document.getElementById('not-visited');
const markReview = document.getElementById('mark-review');
const clearResponse = document.getElementById('clear-response');
const saveNext = document.getElementById('save-next');
const togglePanel = document.getElementById("toggle-panel");
const rightPanel = document.getElementById("right-panel");
const mainQuestionArea = document.getElementById("main-question-area");

// Display Timer
function updateTimerDisplay() {
    if (timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        timerDisplay.textContent = "Time's Up!";
        document.getElementById('quiz-form').submit();
    }
}

// Start Timer on Page Load
function startTimer() {
    updateTimerDisplay(); // Initial update to display the timer
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Other functionality for handling questions
function displayQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.style.display = 'none');
    document.getElementById(`q${questionNumber}`).style.display = 'block';

    const numDivs = questionNumbers.querySelectorAll('div');
    numDivs.forEach((div, index) => {
        div.classList.remove('active');
        if (index + 1 === questionNumber) {
            div.classList.add('active');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    togglePanel.addEventListener("click", () => {
        rightPanel.classList.toggle("show");
        if (rightPanel.classList.contains("show")) {
            mainQuestionArea.classList.remove("col-md-12");
            mainQuestionArea.classList.add("col-md-9");
        } else {
            mainQuestionArea.classList.remove("col-md-9");
            mainQuestionArea.classList.add("col-md-12");
        }
    });
});

function updateQuestionNumbers() {
    for (let i = 1; i <= totalQuestions; i++) {
        const div = document.createElement('div');
        div.textContent = i;
        div.dataset.questionNumber = i;
        div.addEventListener('click', (event) => {
            const clickedQuestion = parseInt(event.target.dataset.questionNumber);
            if (!answeredQuestions.includes(clickedQuestion) && !markedQuestions.includes(clickedQuestion) && currentQuestion !== clickedQuestion) {
                notVisited--;
                notVisitedDisplay.textContent = notVisited;
            }
            currentQuestion = clickedQuestion;
            displayQuestion(currentQuestion);
        });
        questionNumbers.appendChild(div);
    }
    questionNumbers.firstChild.classList.add('active');
}

// Button Event Listeners
markReview.addEventListener('click', () => {
    if (!isOptionSelected()) {
        displayWarning();
        return;
    }
    if (!markedQuestions.includes(currentQuestion)) {
        markedQuestions.push(currentQuestion);
        questionsMarked++;
        markedDisplay.textContent = questionsMarked;
        const numDivs = questionNumbers.querySelectorAll('div');
        numDivs.forEach((div, index) => {
            if (index + 1 === currentQuestion) {
                div.classList.add('marked');
            }
        });
    }
    moveToNextQuestion();
});

clearResponse.addEventListener('click', () => {
    const currentQuestionRadios = document.querySelectorAll(`input[name="q${currentQuestion}"]`);
    currentQuestionRadios.forEach(radio => radio.checked = false);

    if (answeredQuestions.includes(currentQuestion)) {
        answeredQuestions = answeredQuestions.filter(q => q !== currentQuestion);
        questionsAnswered--;
        answeredDisplay.textContent = questionsAnswered;
        if (!markedQuestions.includes(currentQuestion)) {
            notVisited++;
            notVisitedDisplay.textContent = notVisited;
        }
        const numDivs = questionNumbers.querySelectorAll('div');
        numDivs.forEach((div, index) => {
            if (index + 1 === currentQuestion) {
                div.classList.remove('answered');
            }
        });
    }
});

saveNext.addEventListener('click', () => {
    if (!isOptionSelected()) {
        displayWarning();
        return;
    }
    const isAnswered = Array.from(document.querySelectorAll(`input[name="q${currentQuestion}"]`)).some(radio => radio.checked);

    if (isAnswered && !answeredQuestions.includes(currentQuestion)) {
        answeredQuestions.push(currentQuestion);
        questionsAnswered++;
        answeredDisplay.textContent = questionsAnswered;
        const numDivs = questionNumbers.querySelectorAll('div');
        numDivs.forEach((div, index) => {
            if (index + 1 === currentQuestion) {
                div.classList.add('answered');
            }
        });
        if (!markedQuestions.includes(currentQuestion)) {
            notVisited--;
            notVisitedDisplay.textContent = notVisited;
        }
    }
    moveToNextQuestion();
});

// Helper Functions
function isOptionSelected() {
    return Array.from(document.querySelectorAll(`input[name="q${currentQuestion}"]`)).some(radio => radio.checked);
}

function displayWarning() {
    let warningMessage = document.getElementById('warning-message');
    if (!warningMessage) {
        warningMessage = document.createElement('p');
        warningMessage.id = 'warning-message';
        warningMessage.textContent = "Please select an option before proceeding.";
        const questionArea = document.getElementById('question-area');
        questionArea.insertAdjacentElement('afterend', warningMessage);
    } else {
        warningMessage.style.display = 'block';
    }
    setTimeout(() => {
        warningMessage.style.display = 'none';
    }, 3000);
}

function moveToNextQuestion() {
    currentQuestion++;
    if (currentQuestion > totalQuestions) {
        currentQuestion = 1;
    }
    displayQuestion(currentQuestion);
}

document.addEventListener('DOMContentLoaded', () => {
    updateQuestionNumbers();
    startTimer();

    const quizForm = document.getElementById('quiz-form');
    quizForm.addEventListener('submit', (event) => {
        clearInterval(timerInterval);
    });
});