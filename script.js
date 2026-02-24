const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('scoreDisplay');
const restartButton = document.getElementById('restartButton');

const GRID_SIZE = 20;
const SNAKE_SIZE = GRID_SIZE;
const FOOD_SIZE = GRID_SIZE;

let snake, food, dx, dy, blikCounter;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

let currentScoreElem = document.getElementById('currentScore');
let highScoreElem = document.getElementById('highScore');

// Oyun başlatma fonksiyonu
function initializeGame() {
    snake = [{x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y: Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE},
        {x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y: (Math.floor(canvas.height / 2 / GRID_SIZE)+ 1) * GRID_SIZE},
    ];
    
    food = {
        ...generateFoodPosition(),
        dx: () => (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
        dy: () => (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
    };

    dx = 0;
    dy = -GRID_SIZE;
    blikCounter = 0;
    score = 0;
    currentScoreElem.textContent = score;
    highScoreElem.textContent = highScore;
   
}


initializeGame();

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -GRID_SIZE;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = GRID_SIZE;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -GRID_SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = GRID_SIZE;
                dy = 0;
            }
            break;
    }
});

function generateFoodPosition() {
    while (true) {
        let newFoodPossition = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE,
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE
        }
        let collisioWithSnake = false;
        for (let segment of snake) {
            if (segment.x === newFoodPossition.x && segment.y === newFoodPossition.y) {
                collisioWithSnake = true;
                break;
            }
        }

        if (!collisioWithSnake) {
            return newFoodPossition;
        }

    }

}

function checkCollision() {
    if(snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
}
return false;
} 



function update() {
    if (gamePaused) return;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (checkCollision()) {
       if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElem.textContent = highScore;
       }
       gameOver();
       return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreElem.textContent = score;
        food = {
            ...generateFoodPosition(),
            dx: () => (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
            dy: () => (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
        };


        if(snake.length === (canvas.width / GRID_SIZE) * (canvas.height / GRID_SIZE)) {
            gameWin();
            return;
        }
    }else {
        snake.pop();
    }

    if(blikCounter % 4 === 0) {
        food.x += food.dx();
        food.y += food.dy();
    }

    if(food.x < 0){
        food.dx = -food.dx;
        food.x = 0;
    }
    if(food.x >= canvas.width) {
        food.dx = -food.dx;
        food.x = canvas.width - GRID_SIZE;
    }
    if(food.y < 0) {
        food.dy = -food.dy;
        food.y = 0;
    }
    if(food.y >= canvas.height) {
        food.dy = -food.dy;
        food.y = canvas.height - GRID_SIZE;
    }

    blikCounter++;
    draw();
}

function drawGrid() {
    ctx.strokeStyle = '#AAA';
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for(const segment of snake) {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, FOOD_SIZE, FOOD_SIZE);
}

function gameOver() {
    gamePaused = true;
    gameOverScreen.style.display = 'flex';
}

function gameWin() {
    gamePaused = true;
    alert('Congratulations! You win!');
    initializeGame();
}

restartButton.addEventListener('click', function() {
    gameOverScreen.style.display = 'none';
    gamePaused = false;
    initializeGame();
    update();
});

setInterval(update, 100);

window.addEventListener('blur', function() {
    gamePaused = true;
});

window.addEventListener('focus', function() {
    gamePaused = false;
    update();
});


