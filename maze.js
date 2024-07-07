const tileSize = 40;
const rows = 11;
const cols = 20;

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 1, 2, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 1, 2, 2, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 1, 2, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function drawMaze(ctx) {
    ctx.strokeStyle = 'blue'; 
    ctx.lineWidth = 3; 
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                let x = col * tileSize;
                let y = row * tileSize;

                ctx.beginPath();
                // top border no wall above
                if (row === 0 || maze[row - 1][col] !== 1) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + tileSize, y);
                }
                // bottom border  no wall below
                if (row === rows - 1 || maze[row + 1][col] !== 1) {
                    ctx.moveTo(x, y + tileSize);
                    ctx.lineTo(x + tileSize, y + tileSize);
                }
                // left border sno wall to the left
                if (col === 0 || maze[row][col - 1] !== 1) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + tileSize);
                }
                //  right border no wall to the right
                if (col === cols - 1 || maze[row][col + 1] !== 1) {
                    ctx.moveTo(x + tileSize, y);
                    ctx.lineTo(x + tileSize, y + tileSize);
                }
                ctx.stroke();
            }
        }
    }
}
