const ghost = {
    x: (Math.floor(cols / 2) - 1) * tileSize,  
    y: Math.floor(rows / 2) * tileSize,  
    dx: 0,
    dy: 0,
    size: tileSize / 2,
    speed: 20,
    updateCounter: 0,
    colorFrame: 0,
    colors: ['#FF0000', '#FF69B4', '#00FFFF', '#FFA500'],
    colorIndex: 0,
    colorTransitionSpeed: 0.05,
    currentColor: '#FF0000',
    targetColor: '#FF69B4',
    frightened: false,
    frightenedTimer: 0,
    originalSpeed: 20,
    frightenedSpeed: 20,
    
    update: function() {
        if (this.frightened) {
            this.speed = this.frightenedSpeed;
            this.currentColor = '#0000FF'; // Ghost turn blue
            if (this.frightenedTimer > 0) {
                this.frightenedTimer--;
            } else {
                this.frightened = false;
                this.speed = this.originalSpeed;
                this.currentColor = this.colors[this.colorIndex];
            }
        }
        this.updateCounter++;
        if (this.updateCounter % this.speed === 0) {
            if (this.frightened) {
                this.runAwayFromPacman();
            } else {
                this.moveTowardsPacman();
            }
            if (!this.checkCollision(this.x + this.dx, this.y + this.dy)) {
                this.x += this.dx;
                this.y += this.dy;
            } else {
                this.changeDirection();
            }
        }
        if (!this.frightened) {
            this.checkPacmanCollision();
        }
    },
    
    draw: function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.size, this.y + this.size, this.size, Math.PI, 0);
        ctx.lineTo(this.x + this.size * 2, this.y + this.size * 2);
        ctx.lineTo(this.x, this.y + this.size * 2);
        ctx.closePath();
        ctx.fillStyle = this.currentColor;
        ctx.fill();

        const eyeXOffset = this.size / 2.5;
        const eyeYOffset = this.size / 2.5;
        const eyeRadius = this.frightened ? this.size / 2 : this.size / 5; 
        ctx.beginPath();
        ctx.arc(this.x + this.size - eyeXOffset, this.y + eyeYOffset, eyeRadius, 0, 2 * Math.PI);
        ctx.arc(this.x + this.size + eyeXOffset, this.y + eyeYOffset, eyeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        const pupilRadius = eyeRadius / 2;
        ctx.beginPath();
        ctx.arc(this.x + this.size - eyeXOffset, this.y + eyeYOffset, pupilRadius, 0, 2 * Math.PI);
        ctx.arc(this.x + this.size + eyeXOffset, this.y + eyeYOffset, pupilRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
    },
    
    checkCollision: function(newX, newY) {
        const col = Math.floor(newX / tileSize);
        const row = Math.floor(newY / tileSize);
        return maze[row][col] === 1;
    },
    
    changeDirection: function() {
        const directions = [
            { dx: tileSize, dy: 0 },
            { dx: -tileSize, dy: 0 },
            { dx: 0, dy: tileSize },
            { dx: 0, dy: -tileSize }
        ];
        const validDirections = directions.filter(direction => 
            !this.checkCollision(this.x + direction.dx, this.y + direction.dy)
        );
        if (validDirections.length > 0) {
            const newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
            this.dx = newDirection.dx;
            this.dy = newDirection.dy;
        }
    },
    
    moveTowardsPacman: function() {
        const path = this.findPathToPacman();
        if (path.length > 1) {
            const nextMove = path[1];
            this.dx = nextMove.x - this.x;
            this.dy = nextMove.y - this.y;
        } else {
            this.changeDirection(); 
        }
    },
    
    runAwayFromPacman: function() {
        const diffX = pacman.x - this.x;
        const diffY = pacman.y - this.y;

        const directions = [];

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) directions.push({ dx: -tileSize, dy: 0 }); // Move left
            else directions.push({ dx: tileSize, dy: 0 }); // Move right
            if (diffY > 0) directions.push({ dx: 0, dy: -tileSize }); // Move up
            else directions.push({ dx: 0, dy: tileSize }); // Move down
        } 

        // move the ghost away from Pacman
        directions.sort((a, b) => {
            const aDist = Math.abs((this.x + a.dx) - pacman.x) + Math.abs((this.y + a.dy) - pacman.y);
            const bDist = Math.abs((this.x + b.dx) - pacman.x) + Math.abs((this.y + b.dy) - pacman.y);
            return bDist - aDist;
        });

        for (const direction of directions) {
            if (!this.checkCollision(this.x + direction.dx, this.y + direction.dy)) {
                this.dx = direction.dx;
                this.dy = direction.dy;
                return;
            }
        }

        this.changeDirection(); 
    },
    
    findPathToPacman: function() {
        const queue = [{ x: this.x, y: this.y, path: [] }];
        const visited = new Set();
        visited.add(`${this.x},${this.y}`);

        while (queue.length > 0) {
            const current = queue.shift();
            const currentX = current.x;
            const currentY = current.y;
            const currentPath = current.path;

            if (currentX === pacman.x && currentY === pacman.y) {
                return currentPath.concat({ x: currentX, y: currentY });
            }

            const directions = [
                { x: currentX + tileSize, y: currentY },
                { x: currentX - tileSize, y: currentY },
                { x: currentX, y: currentY + tileSize },
                { x: currentX, y: currentY - tileSize }
            ];

            for (const direction of directions) {
                if (!this.checkCollision(direction.x, direction.y)) {
                    const key = `${direction.x},${direction.y}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push({
                            x: direction.x,
                            y: direction.y,
                            path: currentPath.concat({ x: currentX, y: currentY })
                        });
                    }
                }
            }
        }

        return []; 
    },
    
    checkPacmanCollision: function() {
        if (Math.abs(this.x - pacman.x) < this.size && Math.abs(this.y - pacman.y) < this.size) {
            pacman.loseLife();
        }
    },
    
    resetPosition: function() {
        this.x = (Math.floor(cols / 2) - 1) * tileSize; 
        this.y = Math.floor(rows / 2) * tileSize;  
        this.dx = 0;
        this.dy = 0;
    }
};

ghost.resetPosition();
