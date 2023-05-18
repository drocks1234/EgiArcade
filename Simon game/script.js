const colors = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerTurn = false;
let playerSequence = [];
let level = 0;

const startButton = document.getElementById('start-btn');
const buttons = document.querySelectorAll('.button');
const infoElement = document.getElementById('info');

startButton.addEventListener('click', startGame);
buttons.forEach(button => button.addEventListener('click', handleButtonClick));

function startGame() {
  resetGame();
  playSequence();
}

function resetGame() {
  sequence = [];
  playerSequence = [];
  level = 0;
  playerTurn = false;
  startButton.disabled = true;
  infoElement.textContent = '';
}

function playSequence() {
  playerTurn = false;
  infoElement.textContent = 'Watch the sequence';

  generateSequence();
  animateSequence(sequence, () => {
    playerTurn = true;
    infoElement.textContent = 'Your Turn';
  });
}

function generateSequence() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    sequence.push(colors[randomIndex]);
  }
  
function checkPlayerSequence() {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== sequence[i]) {
      endGame();
      return;
    }
  }

  if (playerSequence.length === sequence.length) {
    playerTurn = false;
    infoElement.textContent = 'Correct! Generating next sequence...';
    playerSequence = [];
    setTimeout(() => {
      level++;
      infoElement.textContent = 'Watch the sequence';
      generateSequence();
      playSequence();
    }, 1000);
  }
}

function animateSequence(sequence, callback) {
  let i = 0;
  const sequenceInterval = setInterval(() => {
    const currentColor = sequence[i];
    const currentButton = document.getElementById(currentColor);
    if (currentButton) {
      animateButton(currentButton);
      i++;
    } else {
      clearInterval(sequenceInterval);
      callback();
    }
    if (i >= sequence.length) {
      clearInterval(sequenceInterval);
      callback();
    }
  }, 1000);
}

function animateButton(button) {
  if (button) {
    button.classList.add('active');
    setTimeout(() => {
      button.classList.remove('active');
    }, 500);
  }
}

function lightButton(color) {
  const button = document.getElementById(color);
  button.classList.add('active');
  setTimeout(() => {
    button.classList.remove('active');
  }, 500);
}

function handleButtonClick(event) {
  if (!playerTurn) return;

  const clickedColor = event.target.id;
  lightButton(clickedColor);
  playerSequence.push(clickedColor);

  if (playerSequence.length === sequence.length) {
    playerTurn = false;
    infoElement.textContent = 'Correct! Generating next sequence...';
    playerSequence = [];
    setTimeout(() => {
      level++;
      infoElement.textContent = 'Watch the sequence';
      generateSequence();
      playSequence();
    }, 1000);
  }
}

function endGame() {
  alert('Game Over! Your score: ' + level);
  resetGame();
}
