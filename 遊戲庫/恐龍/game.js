const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const dino = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    dy: 0,
    gravity: 0.4, // 调整重力，加快下降速度
    jumpPower: -12, // 调整跳跃力量，增加跳跃高度
    grounded: false
};

const obstacles = [];
let frame = 0;
let gameRunning = false;

function drawDino() {
    ctx.fillStyle = 'black';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: 160,
        width: 20,
        height: 20
    };
    obstacles.push(obstacle);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.x -= 3; // 调整障碍物的移动速度
    });

    if (obstacles.length && obstacles[0].x < -obstacles[0].width) {
        obstacles.shift();
    }
}

function jump() {
    if (dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
    }
}

function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameRunning = false;
            alert('游戏结束!');
        }
    });
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // 恐龙的物理效果
    dino.y += dino.dy;
    dino.dy += dino.gravity;

    if (dino.y > 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
    }

    drawDino();
    drawObstacles();
    detectCollision();

    if (frame % 120 === 0) { // 调整障碍物生成的间隔
        createObstacle();
    }

    requestAnimationFrame(update);
}

// 避免在游戏启动后重新绑定跳跃事件
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        jump();
    }
});

startButton.addEventListener('click', () => {
    if (!gameRunning) { // 只在游戏未运行时启动游戏
        gameRunning = true;
        frame = 0;
        obstacles.length = 0;
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
        update();
    }
});
