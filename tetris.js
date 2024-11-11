const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const speedSlider = document.getElementById("speedSlider");
const speedDisplay = document.getElementById("speedDisplay");

const WIDTH = 300;
const HEIGHT = 600;
const GRID_SIZE = 30;
const ROWS = HEIGHT / GRID_SIZE;
const COLS = WIDTH / GRID_SIZE;

let FPS = 5;
let intervalId;
let gamePaused = false;

const SHAPES = {
    'I': [[0, 1], [1, 1], [2, 1], [3, 1]],
    'O': [[1, 1], [1, 2], [2, 1], [2, 2]],
    'T': [[1, 0], [0, 1], [1, 1], [2, 1]],
    'L': [[0, 1], [1, 1], [2, 1], [2, 2]],
    'J': [[0, 1], [1, 1], [2, 1], [0, 2]],
    'S': [[1, 1], [2, 1], [0, 2], [1, 2]],
    'Z': [[0, 1], [1, 1], [1, 2], [2, 2]]
};

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
let score = 0;
let highScore = 0;

class Piece {
    constructor() {
        this.shape = SHAPES[Object.keys(SHAPES)[Math.floor(Math.random() * 7)]];
        this.x = Math.floor(COLS / 2);
        this.y = 0;
    }

    rotate() {
        this.shape = this.shape.map(([x, y]) => [-y, x]);
    }

    canMove(dx, dy) {
        return this.shape.every(([x, y]) => {
            const newX = this.x + x + dx;
            const newY = this.y + y + dy;
            return newX >= 0 && newX < COLS && newY < ROWS && (newY < 0 || board[newY][newX] !== "()");
        });
    }

    place() {
        this.shape.forEach(([x, y]) => {
            board[this.y + y][this.x + x] = "()";
        });
    }
}

let piece = new Piece();

function drawBoard() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === "()") {
                ctx.fillStyle = "lime";
                ctx.fillText("()", x * GRID_SIZE + 5, y * GRID_SIZE + 25);
            }
        });
    });
}

function clearLines() {
    board = board.filter(row => row.includes(" "));
    const linesCleared = ROWS - board.length;
    score += linesCleared * 100;
    highScore = Math.max(highScore, score);
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;

    while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(" "));
    }
}

function drawPiece() {
    ctx.fillStyle = "red";
    piece.shape.forEach(([x, y]) => {
        ctx.fillText("()", (piece.x + x) * GRID_SIZE + 5, (piece.y + y) * GRID_SIZE + 25);
    });
}

function gameLoop() {
    if (!gamePaused) {
        if (piece.canMove(0, 1)) {
            piece.y += 1;
        } else {
            piece.place();
            clearLines();
            piece = new Piece();
            if (!piece.canMove(0, 0)) {
                alert("Game Over!");
                resetGame();
            }
        }
        drawBoard();
        drawPiece();
    }
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
    score = 0;
    scoreDisplay.textContent = score;
    piece = new Piece();
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(gameLoop, 1000 / FPS);
}

document.addEventListener("keydown", (event) => {

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
    
    if (!gamePaused) {
        switch (event.key) {
            case "ArrowLeft":
                if (piece.canMove(-1, 0)) piece.x -= 1;
                break;
            case "ArrowRight":
                if (piece.canMove(1, 0)) piece.x += 1;
                break;
            case "ArrowDown":
                if (piece.canMove(0, 1)) piece.y += 1;
                break;
            case "ArrowUp":
                piece.rotate();
                if (!piece.canMove(0, 0)) piece.rotate();
                break;
        }
    }
});

pauseBtn.addEventListener("click", () => {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? "Resume" : "Pause";
});

restartBtn.addEventListener("click", resetGame);

speedSlider.addEventListener("input", (event) => {
    FPS = parseInt(event.target.value);
    speedDisplay.textContent = FPS;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(gameLoop, 1000 / FPS);
    }
});

ctx.font = "24px Arial";
ctx.fillStyle = "white";
intervalId = setInterval(gameLoop, 1000 / FPS);
