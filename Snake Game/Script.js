window.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    let blockSize = 20;
    let currentGameSpeed = 100;
    const powerUps = [];
    let touchStartX = null;
    let touchStartY = null;    
    let gamePaused = false;
    let score = 0;
    let highScore = 0;
    let gameLoop = null;
    let powerUpSpawnInterval = null;
    let foodSpawnRateMultiplier = 1;
    let snake = [{x: canvas.width / 2, y: canvas.height / 2}];
    let food = [];
    let dx = blockSize;
    let dy = 0;

    
    const newGameButton = document.getElementById("newGameButton");
    newGameButton.addEventListener("click", newGame);
    
    const settingsButton = document.getElementById("settingsButton");
    settingsButton.addEventListener("click", showSettings);
    
    const foodSpawnRateSlider = document.getElementById('foodSpawnRateSlider');
    const foodSpawnRateDisplay = document.getElementById('foodSpawnRateDisplay');
    foodSpawnRateSlider.addEventListener('input', updateFoodSpawnRateDisplay);
  
    const powerUpSpawnRateSlider = document.getElementById('powerUpSpawnRateSlider');
    const powerUpSpawnRateDisplay = document.getElementById('powerUpSpawnRateDisplay');
    powerUpSpawnRateSlider.addEventListener('input', updatePowerUpSpawnRateDisplay);
    
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', updateSpeedDisplay);
    
    const easyModeCheckbox = document.getElementById('easyModeCheckbox');
    
    const pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener("click", togglePause);
    
      
    easyModeCheckbox.addEventListener('change', () => {
      // Stop the current game
      clearInterval(gameLoop);
    
      if (easyModeCheckbox.checked) {
        // Set the game speed and snake size for easy mode
        currentGameSpeed = 500; // Slower game speed
        blockSize = 50; // Bigger snake size
      } else {
        // Set the game speed and snake size for normal mode
        currentGameSpeed = 100;
        blockSize = 20;
      }
      // Update the game speed display
      speedDisplay.textContent = `${currentGameSpeed}ms`;
      speedSlider.value = currentGameSpeed;
    
      // Restart the game with the updated settings
      newGame();
    
      // Update the game loop with the new speed
      clearInterval(gameLoop);
      gameLoop = setInterval(() => {
        update();
        draw();
      }, currentGameSpeed);
    });


    function handleTouchStart(event) {
      if (event.touches.length === 1) {
        // Only deal with one finger touch
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }
    }
    
    function handleTouchEnd(event) {
      if (!touchStartX || !touchStartY) {
        return;
      }
    
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
    
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
    
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && dx !== -blockSize) {
          // Swipe right
          dx = blockSize;
          dy = 0;
        } else if (deltaX < 0 && dx !== blockSize) {
          // Swipe left
          dx = -blockSize;
          dy = 0;
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && dy !== -blockSize) {
          // Swipe down
          dx = 0;
          dy = blockSize;
        } else if (deltaY < 0 && dy !== blockSize) {
          // Swipe up
          dx = 0;
          dy = -blockSize;
        }
      }
    
      // Reset touch start coordinates
      touchStartX = null;
      touchStartY = null;
    }
    
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });


    
    function togglePause() {
      gamePaused = !gamePaused;
      
      if (gamePaused) {
        clearInterval(gameLoop);
        pauseButton.textContent = "Resume";
      } else {
        gameLoop = setInterval(() => {
          update();
          draw();
        }, currentGameSpeed);
        pauseButton.textContent = "Pause";
      }
    }
    
    function updateGameSettings() {
      if (easyModeCheckbox.checked) {
        // Set the game speed and snake size for easy mode
        currentGameSpeed = 50; // Slower game speed
        blockSize = 50; // Bigger snake size
      } else {
        // Set the game speed and snake size for normal mode
        currentGameSpeed = parseInt(speedSlider.value); // Use the slider value for game speed
        blockSize = 20;
      }
    
      // Update the game speed display and slider value
      document.querySelector('#speedDisplay').textContent = `${currentGameSpeed}ms`;
      speedSlider.value = currentGameSpeed;
    
      // Stop the current game
      clearInterval(gameLoop);
    
      // Restart the game with the updated settings
      newGame();
    }
    
    function saveSettings() {
      // Save the current settings to local storage or send them to the server
      // ...
      // Hide the settings screen and show the score display and "New Game" button
      settingsScreen.style.display = 'none';
      document.querySelector('.score').style.display = 'block';
      newGameButton.style.display = 'block';
    }
    
    function showSettings() {
      // Hide the score display and "New Game" button
      document.querySelector('.score').style.display = 'none';
      newGameButton.style.display = 'none';
    
      // Show the settings screen
      settingsScreen.style.display = 'block';
    
      // Add event listener to the cancel button
      const cancelSettingsButton = document.getElementById('cancelSettingsButton');
      cancelSettingsButton.addEventListener('click', hideSettings);
    
      // Add an event listener to the save button
      saveSettingsButton.addEventListener('click', saveSettings);
    }
    
    function hideSettings() {
      // Hide the settings screen
      settingsScreen.style.display = 'none';
    
      // Show the score display and "New Game" button
      document.querySelector('.score').style.display = 'block';
      newGameButton.style.display = 'block';
    
      // Remove event listener from the cancel button
      const cancelSettingsButton = document.getElementById('cancelSettingsButton');
      cancelSettingsButton.removeEventListener
    ('click', hideSettings);
    }
    
    function updateSpeedDisplay() {
        if (!easyModeCheckbox.checked) {
        // Update the game speed based on the slider value
        currentGameSpeed = 250 - speedSlider.value;
    
        // Update the speed display
        document.querySelector('#speedDisplay').textContent = `${250 - currentGameSpeed}ms`;
    
        // Restart the game loop with the new speed
        clearInterval(gameLoop);
        gameLoop = setInterval(() => {
          update();
          draw();
        }, currentGameSpeed);
      }
    }
      
    function spawnPowerUp() {
      // Generate a new power-up at a random location on the canvas
      const powerUp = {
          x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
          y: Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize,
          type: 'scoreAddition',
          duration: 5000 // 5 seconds
      };
      // Add the power-up to the array of food (powerUps)
      powerUps.push(powerUp);
    }
      
    function update() {
      // Move the snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      snake.unshift(head);
    
      // Check for power-up collision
      for (let i = 0; i < powerUps.length; i++) {
          const powerUp = powerUps[i];
          if (head.x === powerUp.x && head.y === powerUp.y) {
              // Apply power-up effect
              switch (powerUp.type) {
                  case 'scoreAddition':
                      score += 4; // add 5 to the score instead of multiplying
                      break;
                  // Add other power-up effects here...
              }
    
              // Remove power-up from canvas
              powerUps.splice(i, 1);
          }
      }
    
     // Check for food collision
     let ateFood = false;
     for (let i = 0; i < food.length; i++) {
       if (head.x === food[i].x && head.y === food[i].y) {
         ateFood = true;
         food.splice(i, 1);
         createFood();
         score++;
         if (score > highScore) {
           highScore = score;
           updateHighScoreDisplay();
         }
         updateScoreDisplay();
         break; // Exit the loop, since we already found and ate a food
       }
     }
    
     if (!ateFood) {
       // Only remove the last segment of the snake if it didn't eat any food
       snake.pop();
     }
    
      // Check for wall or self collision
      if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkSelfCollision(head)) {
        // Game over
        canvas.classList.add('shake'); // Add the shake class to the canvas element
        setTimeout(() => {
            canvas.classList.remove('shake'); // Remove the shake class after 500ms
        }, 500);
        clearInterval(gameLoop); // Stop the game loop
        updateLocalLeaderboard(score); // Update the local leaderboard with the score
        showLocalLeaderboard(); // Show the local leaderboard
        newGameButton.style.display = 'block'; // Show the "New Game" button
        pauseButton.style.display = "none"; // Hide the pause button
        return;
      }
    }
    
    function updateHighScoreDisplay() {
        highScore = Math.max(highScore, score);
        localStorage.setItem('highScore', highScore);
        document.querySelector('.high-score').textContent = `High Score: ${highScore}`;
    }
    
    function updateLocalLeaderboard(score) {
      let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      leaderboard.push(score);
      leaderboard.sort((a, b) => b - a);
      leaderboard = leaderboard.slice(0, 5); // Only keep the top 5 scores
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    
    function showLocalLeaderboard() {
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      const leaderboardElement = document.getElementById('localLeaderboard');
      leaderboardElement.innerHTML = '';
      for (let i = 0; i < leaderboard.length; i++) {
        const score = leaderboard[i];
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${score}`;
        leaderboardElement.appendChild(li);
      }
      const leaderboardContainer = document.getElementById('localLeaderboardContainer');
      leaderboardContainer.style.display = leaderboard.length > 0 ? 'flex' : 'none';
    }
    
    function checkSelfCollision(head) {
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          return true;
        }
      }
      return false;
    }
    
    function createFood() {
      const numFood = foodSpawnRateMultiplier - food.length;
    
      for (let i = 0; i < numFood; i++) {
        let newFood = null;
        while (newFood === null || foodInSnake(newFood)) {
          newFood = {
            x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
            y: Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize
          };
        }
        food.push(newFood);
      }
    
      function foodInSnake(newFood) {
        for (let segment of snake) {
          if (segment.x === newFood.x && segment.y === newFood.y) {
            return true;
          }
        }
        return false;
      }
    }
    
    function updateScoreDisplay() {
      const scoreElements = document.querySelectorAll('.score');
      scoreElements.forEach(element => {
        element.textContent = `Score: ${score}`;
      });
    }
    
    function newGame() {
      // Reset the game
      snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
      dx = blockSize;
      dy = 0;
      score = 0;
      updateScoreDisplay();
      
      // Remove any existing power-ups
      powerUps.length = 0;
      
      // Remove any existing food
      food = [];
    
      // Show the pause button
      pauseButton.style.display = "inline-block";
      pauseButton.textContent = "Pause";
      
      // Show the score display
      document.querySelector(".score").style.display = "block";
      
      // Hide the "New Game" button
      newGameButton.style.display = "none";
    
      // Display the countdown timer
      let count = 3;
      const countdownElement = document.createElement('div');
      countdownElement.classList.add('countdown');
      document.body.appendChild(countdownElement);
      
      const countdownInterval = setInterval(() => {
        if (count === 0) {
          clearInterval(countdownInterval);
          document.body.removeChild(countdownElement);
          
          // Restart the game loop with the current game speed
          clearInterval(gameLoop);
          gameLoop = setInterval(() => {
            update();
            draw();
          }, currentGameSpeed);
      
          // Spawn a power-up every 10 seconds
          powerUpSpawnInterval = setInterval(spawnPowerUp, powerUpSpawnRateSlider.value * 1000);    
          // Create new food
          createFood();
          
        } else {
          countdownElement.textContent = count;
          count--;
        }
      }, 1000);
        showLocalLeaderboard(); // Show the local leaderboard
    }
    
    function draw() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // Draw the snake
      ctx.fillStyle = 'green';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'green';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, blockSize, blockSize);
      }
    
      // Draw the power-ups
      ctx.fillStyle = 'orange';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'orange';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      for (let powerUp of powerUps) {
        ctx.fillRect(powerUp.x, powerUp.y, blockSize, blockSize);
      }
    
      // Draw the food
      ctx.fillStyle = 'red';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'red';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      for (let f of food) {
        ctx.fillRect(f.x, f.y, blockSize, blockSize);
      }
    }
    
    function updateFoodSpawnRateDisplay() {
      foodSpawnRateMultiplier = foodSpawnRateSlider.value;
      if (foodSpawnRateDisplay) {
        foodSpawnRateDisplay.textContent = `${foodSpawnRateMultiplier}x`;
      }
    }
  
    function updatePowerUpSpawnRateDisplay() {
      const powerUpSpawnRate = powerUpSpawnRateSlider.value;
      if (powerUpSpawnRateDisplay) {
        powerUpSpawnRateDisplay.textContent = `${powerUpSpawnRate}s`;
      }
      // Update the power-up spawn interval
      clearInterval(powerUpSpawnInterval);
      powerUpSpawnInterval = setInterval(spawnPowerUp, powerUpSpawnRate * 1000);
    }
    
    function getHighScore() {
        return localStorage.getItem('highScore') || 0;
    }  
      // Add keyboard event listener
      document.addEventListener("keydown", event => {
      // Ignore repeated keydown events
      if (event.repeat) {
      return;
      }
      
      switch (event.code) {
      case "ArrowLeft":
      if (dx !== blockSize) {
      dx = -blockSize;
      dy = 0;
      }
      break;
      case "ArrowRight":
      if (dx !== -blockSize) {
      dx = blockSize;
      dy = 0;
      }
      break;
      case "ArrowUp":
      if (dy !== blockSize) {
      dx = 0;
      dy = -blockSize;
      }
      break;
      case "ArrowDown":
      if (dy !== -blockSize) {
      dx = 0;
      dy = blockSize;
      }
      break;
      }
      });
    
      
      
      // Initialize the game
      newGame();
      
    });