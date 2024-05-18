// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const clearButton = document.getElementById('clearButton');
const setButton = document.getElementById('setButton');
const coordinatesInput = document.getElementById('coordinates');

const rows = 30;
const cols = 30;
const cellSize = canvas.width / cols;
let grid = createGrid(rows, cols);
let running = false;
let interval;

canvas.addEventListener('click', handleCanvasClick);
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
clearButton.addEventListener('click', clearGrid);
setButton.addEventListener('click', setInitialConditions);

function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid();
}

function startGame() {
    if (!running) {
        running = true;
        interval = setInterval(() => {
            grid = nextGeneration(grid);
            drawGrid();
        }, 100);
    }
}

function stopGame() {
    running = false;
    clearInterval(interval);
}

function clearGrid() {
    grid = createGrid(rows, cols);
    drawGrid();
}

function setInitialConditions() {
    const coordinates = coordinatesInput.value.trim().split(/\s+/);
    clearGrid();
    coordinates.forEach(coord => {
        const [row, col] = coord.split(',').map(Number);
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            grid[row][col] = 1;
        }
    });
    drawGrid();
}

function nextGeneration(grid) {
    const newGrid = createGrid(rows, cols);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1 && (neighbors === 2 || neighbors === 3)) {
                newGrid[row][col] = 1;
            } else if (grid[row][col] === 0 && neighbors === 3) {
                newGrid[row][col] = 1;
            } else {
                newGrid[row][col] = 0;
            }
        }
    }
    return newGrid;
}

function countNeighbors(grid, row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

drawGrid();
