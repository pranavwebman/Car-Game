const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const speedDisplay = document.getElementById('speed');
const gameArea = document.getElementById('game-area');
const road = document.getElementById('road');
const player = document.getElementById('player');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const gameOverInfo = document.getElementById('game-over-info');
const finalScore = document.getElementById('final-score');
const modalTitle = document.getElementById('modal-title');

let score = 0;
let speed = 5;
let isGameActive = false;
let playerPos = { x: 175, y: 0 };
let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, a: false, d: false, w: false, s: false };

// Event Listeners
startBtn.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

function startGame() {
    isGameActive = true;
    score = 0;
    speed = 5;
    playerPos = { x: 175, y: 0 };
    scoreDisplay.innerText = score;
    speedDisplay.innerText = 1;

    overlay.classList.remove('visible');
    gameOverInfo.classList.add('hidden');
    
    // Clear previous game elements
    road.innerHTML = '';
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(en => en.remove());

    // Create road lines
    for (let i = 0; i < 5; i++) {
        let line = document.createElement('div');
        line.classList.add('line');
        line.y = i * 150;
        line.style.top = line.y + "px";
        road.appendChild(line);
    }

    window.requestAnimationFrame(playGame);
}

function playGame() {
    if (isGameActive) {
        moveLines();
        moveEnemies();
        handleInput();

        // Increase difficulty
        score++;
        if (score % 500 === 0) {
            speed += 0.5;
            speedDisplay.innerText = (speed / 5).toFixed(1);
        }
        scoreDisplay.innerText = Math.floor(score / 10);

        window.requestAnimationFrame(playGame);
    }
}

function handleInput() {
    const roadRect = road.getBoundingClientRect();
    const moveSpeed = speed + 2;

    if ((keys.ArrowLeft || keys.a) && playerPos.x > 10) {
        playerPos.x -= moveSpeed;
    }
    if ((keys.ArrowRight || keys.d) && playerPos.x < (roadRect.width - 60)) {
        playerPos.x += moveSpeed;
    }
    if ((keys.ArrowUp || keys.w) && playerPos.y > -400) {
        playerPos.y -= moveSpeed / 2;
    }
    if ((keys.ArrowDown || keys.s) && playerPos.y < 0) {
        playerPos.y += moveSpeed / 2;
    }

    player.style.left = playerPos.x + "px";
    player.style.transform = `translateY(${playerPos.y}px)`;
}

function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        if (line.y >= 700) {
            line.y -= 750;
        }
        line.y += speed;
        line.style.top = line.y + "px";
    });
}

function moveEnemies() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        if (isCollide(player, enemy)) {
            endGame();
        }

        if (enemy.y >= 800) {
            enemy.y = -300;
            enemy.style.left = Math.floor(Math.random() * 340) + "px";
            // Randomize enemy color
            const colors = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f'];
            enemy.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }

        enemy.y += speed - 1; // Slightly slower than road for relative speed
        enemy.style.top = enemy.y + "px";
    });

    // Spawn new enemies if needed
    if (enemies.length < 3 && Math.random() < 0.02) {
        createEnemy();
    }
}

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -300;
    enemy.style.top = enemy.y + "px";
    enemy.style.left = Math.floor(Math.random() * 340) + "px";
    gameArea.appendChild(enemy);
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function endGame() {
    isGameActive = false;
    modalTitle.innerText = "Game Over!";
    finalScore.innerText = Math.floor(score / 10);
    gameOverInfo.classList.remove('hidden');
    startBtn.innerText = "Restart Race";
    overlay.classList.add('visible');
}
