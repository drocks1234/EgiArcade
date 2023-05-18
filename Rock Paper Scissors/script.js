const choices = ['rock', 'paper', 'scissors'];
let wins = 0;
let losses = 0;
let ties = 0;

document.getElementById('rock').addEventListener('click', () => playGame('rock'));
document.getElementById('paper').addEventListener('click', () => playGame('paper'));
document.getElementById('scissors').addEventListener('click', () => playGame('scissors'));

function playGame(playerChoice) {
    const computerChoice = getRandomChoice();
    const result = determineResult(playerChoice, computerChoice);
    displayResult(playerChoice, computerChoice, result);
    updateScore(result);
}

function getRandomChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

function displayResult(playerChoice, computerChoice, result) {
    const resultElement = document.getElementById('result-text');
    const computerChoiceElement = document.getElementById('computer-choice');
    
    resultElement.textContent = `You chose ${playerChoice}. You ${result}!`;
    computerChoiceElement.textContent = `Computer's Choice: ${computerChoice}`;
    resultElement.className = result;
}

function updateScore(result) {
    console.log('updateScore called');
    
    if (result === 'win') {
        wins++;
    } else if (result === 'lose') {
        losses++;
    } else if (result === 'tie') {
        ties++;
    }

    document.getElementById('wins').textContent = wins;
    document.getElementById('losses').textContent = losses;
    document.getElementById('ties').textContent = ties;
}
