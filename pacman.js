const pacman = {
    x: tileSize,
    y: tileSize,
    dx: tileSize,
    dy: 0,
    size: tileSize / 2,
    speed: 12,
    updateCounter: 0,
    score: 0,
    lives: 3,
    direction: 'right',
    mouthAngle: [0.25 * Math.PI, 0.15 * Math.PI, 0.05 * Math.PI],
    mouthFrame: 0,
    resetPosition: function() {
        this.x = tileSize;
        this.y = tileSize;
        this.dx = tileSize;
        this.dy = 0;
        this.direction = 'right';
    },
    loseLife: function() {
        this.lives -= 1;
        this.resetPosition();
        if (this.lives <= 0) {
            gameOver();
        }
    },
    update: function() {
        this.updateCounter++;
        if (this.updateCounter % this.speed === 0) {
            if (!this.checkCollision(this.x + this.dx, this.y + this.dy)) {
                this.x += this.dx;
                this.y += this.dy;
            }
            eatDots(this);
            eatPowerPellets(this);
            if (ghost.frightened && Math.abs(this.x - ghost.x) < this.size && Math.abs(this.y - ghost.y) < this.size) {
                ghost.resetPosition();
                this.score += 200; 
                ghost.frightened = false; 
                ghost.speed = ghost.originalSpeed;
            }
            this.mouthFrame = (this.mouthFrame + 1) % this.mouthAngle.length;
        }
    },
    draw: function(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x + this.size, this.y + this.size, this.size / 2,
            this.x + this.size, this.y + this.size, this.size
        );
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(1, '#FFD700');

        ctx.beginPath();
        const startAngle = this.getMouthStartAngle();
        const endAngle = this.getMouthEndAngle(startAngle);
        ctx.arc(this.x + this.size, this.y + this.size, this.size, startAngle, endAngle);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    },
    getMouthStartAngle: function() {
        const angle = this.mouthAngle[this.mouthFrame];
        switch (this.direction) {
            case 'right':
                return angle;
            case 'left':
                return Math.PI + angle;
            case 'up':
                return 1.5 * Math.PI + angle;
            case 'down':
                return 0.5 * Math.PI + angle;
        }
    },
    getMouthEndAngle: function(startAngle) {
        return startAngle + 2 * Math.PI - 2 * this.mouthAngle[this.mouthFrame];
    },
    checkCollision: function(newX, newY) {
        const col = Math.floor(newX / tileSize);
        const row = Math.floor(newY / tileSize);
        return maze[row][col] === 1;
    }
};

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (!pacman.checkCollision(pacman.x, pacman.y - tileSize)) {
                pacman.dx = 0;
                pacman.dy = -tileSize;
                pacman.direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (!pacman.checkCollision(pacman.x, pacman.y + tileSize)) {
                pacman.dx = 0;
                pacman.dy = tileSize;
                pacman.direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (!pacman.checkCollision(pacman.x - tileSize, pacman.y)) {
                pacman.dx = -tileSize;
                pacman.dy = 0;
                pacman.direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (!pacman.checkCollision(pacman.x + tileSize, pacman.y)) {
                pacman.dx = tileSize;
                pacman.dy = 0;
                pacman.direction = 'right';
            }
            break;
    }
});
