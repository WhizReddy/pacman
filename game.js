const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let isGameOver = false;
let isPaused = false;
let requestId;

function initializeGame() {
    pacman.resetPosition();
    ghost.resetPosition();
    pacman.score = 0;
    pacman.lives = 3;
    initializeDots();
    initializePowerPellets();
    isGameOver = false;
    isPaused = false;
    gameLoop();
}

function gameLoop() {
    if (!isPaused && !isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze(ctx);
        drawDots(ctx);
        drawPowerPellets(ctx);
        pacman.update();
        pacman.draw(ctx);
        ghost.update();
        ghost.draw(ctx);
        drawScore(ctx);
        drawLives(ctx);

        if (allDotsEaten()) {
            youWin();
        } else {
            requestId = requestAnimationFrame(gameLoop);
        }
    } else if (isPaused) {
        drawPauseMessage(ctx);
    } else if (isGameOver) {
        drawGameOverMessage(ctx);
    }
}

function drawScore(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${pacman.score}`, 20, canvas.height - 40);
}

function drawLives(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Lives: ${pacman.lives}`, 20, canvas.height - 20);
}

function drawPauseMessage(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Paused', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Resume', canvas.width / 2, canvas.height / 2 + 20);
}

function drawGameOverMessage(ctx) {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 20);
}

function youWin() {
    isGameOver = true;
    ctx.fillStyle = 'green';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Win !', canvas.width / 2, canvas.height / 2);
}

function gameOver() {
    isGameOver = true;
    drawGameOverMessage(ctx);
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            if (!isPaused && !isGameOver) {
                pacman.handleKey(event.key);
            }
            break;
        case ' ':
            if (isGameOver) {
                initializeGame(); // Restart game on space press
            } else {
                isPaused = !isPaused; // Toggle pause
                if (isPaused) {
                    cancelAnimationFrame(requestId); // Pause the game loop
                    drawPauseMessage(ctx);
                } else {
                    gameLoop(); // Resume game loop if unpaused
                }
            }
            break;
    }
});

initializeGame();
