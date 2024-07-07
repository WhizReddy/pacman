const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let pacman = {
    x: 10,
    y: 10,
    dx: 1,
    dy: 0,
    size: gridSize - 2,
    speed: 1,
    nextMove: null,
    resetPosition: function() {
        this.x = 10;
        this.y = 10;
        this.dx = 1;
        this.dy = 0;
        this.nextMove = null;
    },
    handleKey: function(key) {
        switch (key) {
            case 'ArrowUp':
                this.nextMove = { dx: 0, dy: -1 };
                break;
            case 'ArrowDown':
                this.nextMove = { dx: 0, dy: 1 };
                break;
            case 'ArrowLeft':
                this.nextMove = { dx: -1, dy: 0 };
                break;
            case 'ArrowRight':
                this.nextMove = { dx: 1, dy: 0 };
                break;
        }
    },
    update: function() {
        if (this.nextMove) {
            this.dx = this.nextMove.dx;
            this.dy = this.nextMove.dy;
            this.nextMove = null;
        }

        let newX = this.x + this.dx * this.speed;
        let newY = this.y + this.dy * this.speed;

        if (!this.checkWallCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }

        this.checkDotCollision();
    },
    draw: function(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, this.size / 2, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2);
        ctx.fill();
    },
    checkWallCollision: function(x, y) {
        return walls.some(wall => Math.abs(x - wall.x) < 0.5 && Math.abs(y - wall.y) < 0.5);
    },
    checkDotCollision: function() {
        for (let i = 0; i < dots.length; i++) {
            if (Math.abs(this.x - dots[i].x) < 0.5 && Math.abs(this.y - dots[i].y) < 0.5) {
                dots.splice(i, 1);
                this.score += 10;
                break;
            }
        }
    }
};

let walls = [
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
    { x: 6, y: 7 },
    { x: 7, y: 7 },
];

let dots = [
    { x: 2, y: 2 },
    { x: 8, y: 8 },
    { x: 3, y: 7 },
    { x: 6, y: 2 },
];

function drawWalls() {
    ctx.fillStyle = 'purple';
    walls.forEach(wall => {
        ctx.fillRect(wall.x * gridSize, wall.y * gridSize, gridSize, gridSize);
    });
}

function drawDots() {
    ctx.fillStyle = 'white';
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x * gridSize + gridSize / 2, dot.y * gridSize + gridSize / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWalls();
    drawDots();
    pacman.update();
    pacman.draw(ctx);

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', event => {
    pacman.handleKey(event.key);
});

gameLoop();
