let randomNumber = Math.floor(Math.random() * 100) + 1;

let guessSubmit = document.querySelector('#submitGuess');
let guessField = document.querySelector('#guessField');
let resultContainer = document.querySelector('#resultContainer');
let timerContainer = document.querySelector('#timerContainer');
let resetButton = document.querySelector('#resetButton');
let totalScoreContainer = document.querySelector('#totalScoreContainer'); // Reference to the new total score container
let myRange = document.querySelector('#myRange');


let guessCount = 1;
let totalScore = 0;
let timer;

let roundScoreContainer = document.querySelector('#roundScoreContainer'); // Element to display current round's score
let score = 10; // Maximum score for each round

function checkGuess() {
    let userGuess = Number(guessField.value);
    if (userGuess === randomNumber) {
        displayMessage('Congratulations! You got it right!', 'green');
        totalScore += score; // Add the remaining points to the total score
        totalScoreContainer.textContent = 'Total Score: ' + totalScore; // Update total score on screen
        roundScoreContainer.textContent = ''; // Clear round score
        endGame();
    } else {
        if (score > 1) { // Only subtract a point if there are points left
            score--; // Subtract one point for an incorrect guess
            roundScoreContainer.textContent = 'Current Round Score: ' + score; // Update round score on screen
        }
        if (userGuess < randomNumber) {
            displayMessage('Last guess was too low!', 'red');
        } else if(userGuess > randomNumber) {
            displayMessage('Last guess was too high!', 'red');
        }
    }
    let sliderValue = 100 - Math.abs(userGuess - randomNumber);
    myRange.value = sliderValue;
    
    guessCount++;
    guessField.value = '';
    guessField.focus();
}

guessSubmit.addEventListener('click', checkGuess);

function displayMessage(msg, color) {
    resultContainer.textContent = msg;
    resultContainer.style.color = color;
    }
    
function endGame() {
    guessField.disabled = true;
    guessSubmit.disabled = true;
    resetButton.classList.remove('hidden'); // Show the button by removing 'hidden' class
    clearInterval(timer);
    }
    
    resetButton.addEventListener('click', resetGame);
    
function resetGame() {
    guessCount = 1;
    score = 10; // Reset the score for the new round
    roundScoreContainer.textContent = 'Current Round Score: ' + score; // Display initial score for new round
    guessField.disabled = false;
    guessSubmit.disabled = false;
    guessField.value = '';
    guessField.focus();
    resetButton.classList.add('hidden'); // Hide the button by adding 'hidden' class
    resultContainer.textContent = '';
    timerContainer.textContent = '';
    randomNumber = Math.floor(Math.random() * 100) + 1;
    startTimer();
    }
    
function startTimer() {
    let time = 60; // 60 seconds
    timer = setInterval(function() {
    if (time <= 0) {
    clearInterval(timer);
    displayMessage('Time is up! Try again.', 'red');
    endGame();
    } else {
    timerContainer.textContent = `Remaining time: ${time} seconds`;
    time--;
    }
    }, 1000);
    }
    
startTimer();
