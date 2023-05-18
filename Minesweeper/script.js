// Board configuration
const width = 8;
const height = 8;
const numMines = 10;
let board = [];
let mines = [];

// Create the board
function createBoard() {
  const boardElement = document.querySelector('.board');

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-x', x);
      cell.setAttribute('data-y', y);
      cell.addEventListener('click', handleCellClick);
      boardElement.appendChild(cell);
      board.push({ x, y, element: cell, mine: false, revealed: false, neighboringMines: 0 });
    }
  }
}

// Place mines randomly on the board
function placeMines() {
  for (let i = 0; i < numMines; i++) {
    let randomIndex = Math.floor(Math.random() * board.length);
    while (board[randomIndex].mine) {
      randomIndex = Math.floor(Math.random() * board.length);
    }
    board[randomIndex].mine = true;
    mines.push(board[randomIndex]);
  }
}

// Check if the cell is valid and has not been revealed
function isValidCell(x, y) {
  return x >= 0 && x < width && y >= 0 && y < height && !board[y * width + x].revealed;
}

// Count the neighboring mines for each cell
function countNeighboringMines() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = board[y * width + x];
      if (!cell.mine) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (isValidCell(x + dx, y + dy) && board[(y + dy) * width + (x + dx)].mine) {
              count++;
            }
          }
        }
        cell.neighboringMines = count;
      }
    }
  }
}

// Reveal the cell when clicked
function revealCell(cell) {
  cell.revealed = true;
  cell.element.classList.add('revealed');
  if (cell.mine) {
    cell.element.textContent = '💣';
  } else if (cell.neighboringMines > 0) {
    cell.element.textContent = cell.neighboringMines;
  } else {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = parseInt(cell.element.getAttribute('data-x')) + dx;
        const y = parseInt(cell.element.getAttribute('data-y')) + dy;
        if (isValidCell(x, y)) {
          const neighbor = board[y * width + x];
          if (!neighbor.revealed) {
            revealCell(neighbor);
          }
        }
      }
    }
  }
}

// Handle cell click event
function handleCellClick(event) {
    const x = parseInt(event.target.getAttribute('data-x'));
    const y = parseInt(event.target.getAttribute('data-y'));
    const cell = board[y * width + x];
    
    if (!cell.revealed) {
      if (cell.mine) {
        cell.revealed = true;
        cell.element.classList.add('revealed', 'mine');
        cell.element.innerHTML = '<span>💣</span>';
        gameOver();
      } else {
        revealCell(cell);
      }
    }
  }
  
  // Game over function
  function gameOver() {
    const cells = document.querySelectorAll('.cell');
  
    cells.forEach(cell => {
      const x = parseInt(cell.getAttribute('data-x'));
      const y = parseInt(cell.getAttribute('data-y'));
      const currentCell = board[y * width + x];
  
      if (currentCell.mine && !currentCell.revealed) {
        cell.classList.add('revealed', 'mine');
        cell.innerHTML = '<span>💣</span>';
      }
      cell.removeEventListener('click', handleCellClick);
    });
  
    alert('Game Over! You clicked on a bomb.');
  }
  
  // Initialize the game
  function initializeGame() {
    createBoard();
    placeMines();
    countNeighboringMines();
  }
  
// New Game button event listener
const newGameButton = document.getElementById('new-game-btn');
newGameButton.addEventListener('click', startNewGame);

// Start a new game
function startNewGame() {
  const boardElement = document.querySelector('.board');
  boardElement.innerHTML = '';
  board = [];
  mines = [];
  initializeGame();
}

// Show popup message
function showPopupMessage(message) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.classList.add('show-popup');
  setTimeout(() => {
    popup.classList.remove('show-popup');
  }, 2000);
}

// Game over function
function gameOver() {
  const cells = document.querySelectorAll('.cell');

  cells.forEach(cell => {
    const x = parseInt(cell.getAttribute('data-x'));
    const y = parseInt(cell.getAttribute('data-y'));
    const currentCell = board[y * width + x];

    if (currentCell.mine && !currentCell.revealed) {
      cell.classList.add('revealed', 'mine');
      cell.innerHTML = '<span>💣</span>';
    }
    cell.removeEventListener('click', handleCellClick);
  });

  showPopupMessage('Oh no, you clicked a bomb!');
}