let dots = [];

function initializeDots() {
    dots = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 0) {
                dots.push({ x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2 });
            }
        }
    }
}

function drawDots(ctx) {
    ctx.fillStyle = 'white';
    for (let dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, tileSize / 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function eatDots(pacman) {
    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (Math.abs(pacman.x + pacman.size - dot.x) < pacman.size && Math.abs(pacman.y + pacman.size - dot.y) < pacman.size) {
            dots.splice(i, 1);
            pacman.score += 10;
            break;
        }
    }
}

function allDotsEaten() {
    return dots.length === 0;
}
