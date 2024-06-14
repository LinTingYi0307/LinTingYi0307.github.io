    let snake; // 宣告 snake 物件
    let rez = 40; // 更改為40像素的格子大小
    let food; // 宣告食物位置
    let w; // 畫布寬度
    let h; // 畫布高度
    let gameOver = false; // 遊戲結束標記
    let speed = 5; // 基本速度
    let boostedSpeed = 12; // 加速時的速度
    let paused = false; // 暫停標記
    let score = 0; // 分數
    let highScore = 0; // 最高分數
    let pointsPerFood = 10; // 每次吃到食物增加的分數
    let grassJpg; // 草地圖片
    let snakeHeadJpg; // 蛇頭的圖片
    let snakeBodyJpg; // 蛇身體的圖片
    let snakeTailJpg; // 蛇尾巴的圖片
    let foodJpg; // 食物的圖片
    // let eatSound; // 吃到食物的音效
    let eatSound = document.getElementById('eatSound');
    let gameOverSound = document.getElementById('gameOverSound');
    // JavaScript 控制音訊元素的範例
    let backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.05; // 調整音量（範圍從 0.0 到 1.0）
    // 你也可以使用 backgroundMusic.play()、backgroundMusic.pause() 等方法來控制播放、暫停等操作。
    // 音量滑桿事件處理
    document.getElementById('volumeSlider').addEventListener('input', (event) => {
    backgroundMusic.volume = event.target.value;
});
    // 預加載圖片
    function preload() {
        grassJpg = loadImage('grass.png'); // 加載草地圖片
        snakeHeadJpg = loadImage('snake_head.png'); // 加載蛇頭的圖片
        snakeBodyJpg = loadImage('snake_body.png'); // 加載蛇身體的圖片
        snakeTailJpg = loadImage('snake_tail.png'); // 加載蛇尾巴的圖片
        foodJpg = loadImage('food.png'); // 加載食物的圖片
        // eatSound = loadSound('eat.mp3'); // 加載吃到食物的音效
    }

    // 設置初始環境
    function setup() {
        let canvas = createCanvas(800, 600); // 創建畫布
        canvas.parent('gameContainer'); // 將畫布加入到指定的 HTML 元素中
        w = floor(width / rez); // 計算畫布寬度（單位為格子數）
        h = floor(height / rez); // 計算畫布高度（單位為格子數）
        frameRate(speed); // 設置畫面刷新率
        snake = new Snake(); // 創建蛇物件
        foodLocation(); // 設置食物位置
        updateScore(); // 更新分數顯示
        updateHighScore(); // 更新最高分數顯示

        // 按鈕事件處理
        document.getElementById('restartBtn').addEventListener('click', restartGame); // 重啟按鈕事件
        document.getElementById('returnBtn').addEventListener('click', () => {
            window.location.href = 'https://lintingyi0307.github.io/%E9%81%8A%E6%88%B2%E5%BA%AB/%E9%81%8A%E6%88%B2%E7%B6%B2%E7%AB%99/%E7%B6%B2%E9%A0%81.html'; // 返回按鈕事件
        });

        // 禁用箭頭鍵的默認行為
        window.addEventListener('keydown', function(e) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); // 阻止默認行為
            }
        });
    }

    // 設置食物位置
    function foodLocation() {
        let validLocation = false; // 設置初始位置為無效
        while (!validLocation) {
            let x = floor(random(w)); // 隨機生成 x 坐標
            let y = floor(random(h)); // 隨機生成 y 坐標
            food = createVector(x, y); // 設置食物位置

            validLocation = true;
            for (let part of snake.body) { // 確保食物位置不在蛇上
                if (part.x === food.x && part.y === food.y) {
                    validLocation = false; // 如果食物位置與蛇身位置重疊，則位置無效
                    break;
                }
            }
        }
    }

    // 按鍵事件處理
    function keyPressed() {
        if (keyCode === LEFT_ARROW && snake.xdir !== 1) {
            snake.setDir(-1, 0); // 左鍵：設置蛇的方向為左
        } else if (keyCode === RIGHT_ARROW && snake.xdir !== -1) {
            snake.setDir(1, 0); // 右鍵：設置蛇的方向為右
        } else if (keyCode === DOWN_ARROW && snake.ydir !== -1) {
            snake.setDir(0, 1); // 下鍵：設置蛇的方向為下
        } else if (keyCode === UP_ARROW && snake.ydir !== 1) {
            snake.setDir(0, -1); // 上鍵：設置蛇的方向為上
        } else if (keyCode === 80) { // 'P' 鍵
            paused = !paused; // 暫停或恢復遊戲
        } else if (keyCode === 82) { // 'R' 鍵
            restartGame(); // 重啟遊戲
        }
    }

    // 更新分數顯示
    function updateScore() {
        document.getElementById('score').innerText = '分數: ' + score;
    }

    // 更新最高分數顯示
    function updateHighScore() {
        document.getElementById('highScore').innerText = '最高分數: ' + highScore;
    }

    // 重啟遊戲
    function restartGame() {
        gameOver = false; // 遊戲未結束
        paused = false; // 遊戲未暫停
        score = 0; // 分數歸零
        snake = new Snake(); // 重建蛇物件
        foodLocation(); // 重新設置食物位置
        updateScore(); // 更新分數顯示
        loop(); // 繼續遊戲
    }

    // 畫面刷新
    function draw() {
        let currentSpeed = keyIsDown(SHIFT) ? boostedSpeed : speed; // 根據 Shift 鍵設置當前速度
        frameRate(currentSpeed); // 設置畫面刷新率

        if (paused) { // 若遊戲暫停則返回
            return;
        }

        scale(rez); // 設置縮放比例
        background(grassJpg); // 設置草地背景

        // 畫網格
        stroke(144, 238, 144); // 使用淡綠色
        strokeWeight(0.05); // 設置網格線的粗細
        for (let i = 0; i < w; i++) {
            line(i, 0, i, h); // 畫垂直線
        }
        for (let j = 0; j < h; j++) {
            line(0, j, w, j); // 畫水平線
        }

        if (gameOver) { // 若遊戲結束
            textSize(2); // 設置文字大小
            fill(255, 0, 0); // 設置文字顏色
            textAlign(CENTER, CENTER); // 設置文字對齊方式
            text('遊戲結束', w / 2, h / 2); // 顯示遊戲結束文字
            noLoop(); // 停止遊戲迴圈
            return;
        }

        if (snake.eat(food)) { // 若蛇吃到食物
            eatSound.play();
            foodLocation(); // 重新設置食物位置
            score += pointsPerFood; // 增加分數
            if (score > highScore) {
                highScore = score; // 更新最高分數
                updateHighScore(); // 更新最高分數顯示
            }
            updateScore(); // 更新分數顯示
        }
        snake.update(); // 更新蛇的位置
        snake.show(); // 顯示蛇

        if (snake.endGame()) { // 若遊戲結束
            gameOver = true; // 設置遊戲結束標記
            gameOverSound.play()
        }

        noStroke(); // 不畫邊框
        fill(255, 0, 0); // 設置顏色
        image(foodJpg, food.x, food.y, 1, 1); // 繪製食物的圖像
    }

    // 蛇類別
    class Snake {
        constructor() {
            this.body = [];
            this.body[0] = createVector(floor(w / 2), floor(h / 2)); // 設置蛇的初始位置
            this.directions = [];
            this.directions[0] = createVector(0, 0); // 設置蛇的初始方向
            this.xdir = 0; // 設置初始 x 方向
            this.ydir = 0; // 設置初始 y 方向
            this.len = 0; // 設置初始長度
        }

        setDir(x, y) {
            this.xdir = x; // 設置 x 方向
            this.ydir = y; // 設置 y 方向
        }

        update() {
            let head = this.body[this.body.length - 1].copy(); // 複製蛇頭
            this.body.shift(); // 刪除蛇尾
            this.directions.shift(); // 刪除蛇尾的方向
            head.x += this.xdir; // 更新蛇頭的 x 坐標
            head.y += this.ydir; // 更新蛇頭的 y 坐標
            this.body.push(head); // 增加新的蛇頭
            this.directions.push(createVector(this.xdir, this.ydir)); // 設置新的方向
        }

        grow() {
            let head = this.body[this.body.length - 1].copy(); // 複製蛇頭
            this.len++; // 增加長度
            this.body.push(head); // 增加新的蛇頭
            this.directions.push(createVector(this.xdir, this.ydir)); // 設置新的方向
        }

        endGame() {
            let x = this.body[this.body.length - 1].x; // 獲取蛇頭的 x 坐標
            let y = this.body[this.body.length - 1].y; // 獲取蛇頭的 y 坐標
            if (x > w - 1 || x < 0 || y > h - 1 || y < 0) { // 檢查蛇是否撞牆
                return true;
            }
            for (let i = 0; i < this.body.length - 1; i++) { // 檢查蛇是否撞到自己
                let part = this.body[i];
                if (part.x === x && part.y === y) {
                    return true;
                }
            }
            return false;
        }

        eat(pos) {
            let x = this.body[this.body.length - 1].x; // 獲取蛇頭的 x 坐標
            let y = this.body[this.body.length - 1].y; // 獲取蛇頭的 y 坐標
            if (x === pos.x && y === pos.y) { // 檢查蛇是否吃到食物
                this.grow(); // 增加蛇的長度
                return true;
            }
            return false;
        }

        show() {
            for (let i = 0; i < this.body.length; i++) { // 繪製蛇身
                let angle = 0;
                let dir = this.directions[i];

                if (dir.x === 1) {
                    angle = HALF_PI; // 向右旋轉90度
                } else if (dir.x === -1) {
                    angle = -HALF_PI; // 向左旋轉90度
                } else if (dir.y === 1) {
                    angle = PI; // 旋轉180度
                } else if (dir.y === -1) {
                    angle = 0; // 不旋轉
                }

                push();
                translate(this.body[i].x + 0.5, this.body[i].y + 0.5); // 中心點為格子中心
                rotate(angle); // 旋轉
                imageMode(CENTER); // 設置圖像模式為中心

                if (i === this.body.length - 1) {
                    image(snakeHeadJpg, 0, 0, 1, 1); // 繪製蛇頭的圖像
                } else if (i === 0) {
                    image(snakeTailJpg, 0, 0, 1, 1); // 繪製蛇尾巴的圖像
                } else {
                    image(snakeBodyJpg, 0, 0, 1, 1); // 繪製蛇身體的圖像
                }

                pop();
            }
        }
    }
