let powerPellets = [];

function initializePowerPellets() {
    powerPellets = [
        { x: 3 * tileSize + tileSize / 2, y: 3 * tileSize + tileSize / 2 },
        { x: 16 * tileSize + tileSize / 2, y: 7 * tileSize + tileSize / 2 }
    ];
}

function drawPowerPellets(ctx) {
    ctx.fillStyle = 'orange';
    for (let pellet of powerPellets) {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, tileSize / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function eatPowerPellets(pacman) {
    for (let i = 0; i < powerPellets.length; i++) {
        const pellet = powerPellets[i];
        if (Math.abs(pacman.x + pacman.size - pellet.x) < pacman.size && Math.abs(pacman.y + pacman.size - pellet.y) < pacman.size) {
            powerPellets.splice(i, 1);
            pacman.score += 50;
            ghost.frightened = true;  //become frightened
            ghost.frightenedTimer = 400;  //  timer
            break;
        }
    }
}
