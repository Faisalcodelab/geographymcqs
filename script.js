// Define global variables
let currentQuestionIndex = 0;
let questionsData = [];
let selectedOption = null;
let correctCount = 0;
let incorrectCount = 0;
let gameOverFlag = false;
let tryAgainClicked = false;

// Function to fetch JSON data
async function fetchQuestions() {
    try {
        const response = await fetch('geography_mcqs.json');
        const data = await response.json();
        const questions = data.geography_mcqs;
        shuffleArray(questions);
        return questions;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to play click sound
function playClickSound() {
    const clickSound = document.getElementById('clickSound');
    clickSound.play();
}

// Function to play correct sound
function playCorrectSound() {
    const correctSound = document.getElementById('correctSound');
    correctSound.play();
}

// Function to play incorrect sound
function playIncorrectSound() {
    const incorrectSound = document.getElementById('incorrectSound');
    incorrectSound.play();
}

// Function to display question and options
function displayQuestion(questionObj) {
    const questionContainer = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options');
    const resultContainer = document.querySelector('.result');
    const submitBtn = document.querySelector('.submit-btn');
    const nextBtn = document.querySelector('.next-btn');
    const tryAgainBtn = document.querySelector('.try-again-btn');

    questionContainer.textContent = questionObj.question;
    optionsContainer.innerHTML = '';
    selectedOption = null;

    questionObj.options.forEach(option => {
        const optionElement = document.createElement('input');
        optionElement.setAttribute('type', 'radio');
        optionElement.setAttribute('name', 'options');
        optionElement.setAttribute('value', option);
        optionElement.addEventListener('change', () => {
            selectedOption = optionElement.value;
            submitBtn.disabled = false;
        });
        
        const labelElement = document.createElement('label');
        labelElement.textContent = option;

        const br = document.createElement('br');

        optionsContainer.appendChild(optionElement);
        optionsContainer.appendChild(labelElement);
        optionsContainer.appendChild(br);
    });

    resultContainer.textContent = '';
    submitBtn.disabled = true;
    nextBtn.disabled = true;

    function nextQuestion() {
        if (!gameOverFlag) {
            currentQuestionIndex++;
            if (currentQuestionIndex < questionsData.length) {
                displayQuestion(questionsData[currentQuestionIndex]);
            } else {
                currentQuestionIndex = 0;
                displayQuestion(questionsData[currentQuestionIndex]);
            }
        }
    }

    submitBtn.onclick = () => {
        playClickSound(); 
        const isCorrect = checkAnswer(selectedOption, questionObj.answer);
        if (isCorrect) {
            correctCount++;
            playCorrectSound(); 
            nextBtn.disabled = false;
        } else {
            incorrectCount++;
            playIncorrectSound(); 
            gameOver();
        }
        submitBtn.disabled = true;
    };

    nextBtn.onclick = () => {
        playClickSound(); 
        nextQuestion();
    };

    tryAgainBtn.onclick = () => {
        playClickSound(); 
        tryAgain();
    };
}

// Function to check user's answer
function checkAnswer(userAnswer, correctAnswer) {
    const resultContainer = document.querySelector('.result');
    if (userAnswer === correctAnswer) {
        resultContainer.textContent = 'Correct!';
        resultContainer.style.color = 'green'; 
        return true;
    } else {
        resultContainer.textContent = 'Incorrect!';
        resultContainer.style.color = 'red'; 
        return false;
    }
}

function gameOver() {
    gameOverFlag = true;
    const resultContainer = document.querySelector('.result');
    const correctAnswer = questionsData[currentQuestionIndex].answer; // Get the correct answer
    resultContainer.textContent = `Oops incorrect: Game Over! The correct answer was: ${correctAnswer}. Total correct: ${correctCount}`;
    resultContainer.style.color = 'red';
     resultContainer.style.fontSize = '14px' 
    
    if (!tryAgainClicked) {
        document.querySelector('.try-again-btn').style.display = 'inline-block';
    }
    tryAgainClicked = false;

    document.querySelector('.next-btn').style.display = 'none';
    document.querySelector('.submit-btn').style.display = 'none';
}

function tryAgain() {
    document.querySelector('.try-again-btn').style.display = 'none';
    currentQuestionIndex = 0;
    selectedOption = null;
    correctCount = 0;
    incorrectCount = 0;
    gameOverFlag = false;
    shuffleArray(questionsData);
    displayQuestion(questionsData[currentQuestionIndex]);
    document.querySelector('.next-btn').style.display = 'inline-block';
    document.querySelector('.submit-btn').style.display = 'inline-block';
}

function startQuiz() {
    document.querySelector('.start-container').style.display = 'none';
    fetchQuestions()
        .then(data => {
            questionsData = data;
            document.querySelector('.container').style.display = 'block';
            displayQuestion(questionsData[currentQuestionIndex]);
        })
        .catch(error => console.error('Error starting quiz:', error));
}

document.querySelector('.start-btn').addEventListener('click', () => {
    playClickSound(); 
    startQuiz();
});
