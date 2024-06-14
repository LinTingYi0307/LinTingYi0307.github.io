// 遊戲初始化設定
const numRows = 10; // 遊戲板的行數
const numCols = 10; // 遊戲板的列數
const numMines = 10; // 遊戲板上的地雷數量
let board; // 用來存放遊戲板狀態的變數
let gameOver; // 用來追蹤遊戲是否結束
let flagsLeft; // 剩餘的旗幟數量
let timer; // 用來追蹤遊戲計時器的變數
let timeElapsed; // 已經經過的時間
let bestTime = localStorage.getItem('bestTime') || '-'; // 儲存並讀取最佳時間
let timerInterval; // 計時器間隔變數

// 等待 DOM 加載完畢後初始化
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container'); // 遊戲容器元素
    const flagsLeftSpan = document.getElementById('flagsLeft'); // 顯示剩餘旗幟數量的元素
    const timerSpan = document.getElementById('timer'); // 顯示計時器的元素
    const bestTimeDiv = document.getElementById('bestTime'); // 顯示最佳時間的元素
    document.getElementById('restartBtn').addEventListener('click', initGame); // 重新開始按鈕
    document.getElementById('returnBtn').addEventListener('click', () => {
        window.location.href = 'https://lintingyi0307.github.io/%E9%81%8A%E6%88%B2%E5%BA%AB/%E9%81%8A%E6%88%B2%E7%B6%B2%E7%AB%99/%E7%B6%B2%E9%A0%81.html'; // 返回按鈕
    });

    bestTimeDiv.textContent = `最快時間：${bestTime === '-' ? '-' : bestTime + '秒'}`; // 顯示最佳時間

// 初始化遊戲
    function initGame() {
        gameContainer.innerHTML = ''; // 清空遊戲容器
        board = createBoard(numRows, numCols, numMines); // 創建遊戲板
        gameOver = false; // 設置遊戲未結束
        flagsLeft = numMines; // 重置旗幟數量
        timeElapsed = 0; // 重置時間
        flagsLeftSpan.textContent = `剩餘旗幟：${flagsLeft}`; // 更新旗幟數量顯示
        timerSpan.textContent = `時間：0秒`; // 更新計時器顯示

        clearInterval(timerInterval); // 清除先前的計時器
        timerInterval = setInterval(() => { // 設置新的計時器
            timeElapsed++;
            timerSpan.textContent = `時間：${timeElapsed}秒`;
        }, 1000);

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = document.createElement('div'); // 創建格子
                cell.classList.add('cell'); // 添加 CSS 類
                cell.dataset.row = row; // 設置格子的行屬性
                cell.dataset.col = col; // 設置格子的列屬性
                cell.addEventListener('click', onCellClick); // 點擊事件
                cell.addEventListener('contextmenu', onCellRightClick); // 右鍵事件
                cell.addEventListener('auxclick', onCellMiddleClick); // 中鍵事件
                gameContainer.appendChild(cell); // 將格子添加到遊戲容器
            }
        }
    }

// 創建遊戲板
    function createBoard(rows, cols, mines) {
        const board = Array.from({ length: rows }, () => Array(cols).fill({})); // 創建一個空的遊戲板
        let placedMines = 0; // 已放置的地雷數量

        while (placedMines < mines) { // 隨機放置地雷
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);

            if (!board[row][col].mine) {
                board[row][col] = { mine: true, revealed: false, flagged: false };
                placedMines++;
            }
        }

        for (let row = 0; row < rows; row++) { // 設置每個格子的地雷數量
            for (let col = 0; col < cols; col++) {
                if (!board[row][col].mine) {
                    let minesCount = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const newRow = row + i;
                            const newCol = col + j;
                            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].mine) {
                                minesCount++;
                            }
                        }
                    }
                    board[row][col] = { mine: false, revealed: false, count: minesCount, flagged: false };
                }
            }
        }

        return board; // 返回創建好的遊戲板
    }

// 格子點擊事件
    function onCellClick(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (gameOver || board[row][col].revealed || board[row][col].flagged) return;

        revealCell(row, col);
        if (board[row][col].mine) {
            gameOver = true;
            clearInterval(timerInterval);
            revealMines();
            alert('遊戲結束！');
        } else if (board[row][col].count === 0) {
            revealAdjacentCells(row, col);
        }

        checkWin();
    }

// 右鍵點擊事件
    function onCellRightClick(event) {
        event.preventDefault();
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (gameOver || board[row][col].revealed) return;

        if (!board[row][col].flagged && flagsLeft > 0) {
            cell.classList.add('flagged');
            board[row][col].flagged = true;
            flagsLeft--;
        } else if (board[row][col].flagged) {
            cell.classList.remove('flagged');
            board[row][col].flagged = false;
            flagsLeft++;
        }

        document.getElementById('flagsLeft').textContent = `剩餘旗幟：${flagsLeft}`;
    }

// 中鍵點擊事件
    function onCellMiddleClick(event) {
        if (event.button !== 1) return; // 確保是中鍵點擊
        event.preventDefault();
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (gameOver || !board[row][col].revealed) return;

        let adjacentMines = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && board[newRow][newCol].mine) {
                    adjacentMines++;
                }
            }
        }

        if (adjacentMines === board[row][col].count) {
            revealAdjacentCells(row, col, true);
            checkWin();
        }
    }

// 揭示格子
    function revealCell(row, col) {
        const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        cell.classList.add('revealed');
        board[row][col].revealed = true;

        if (board[row][col].mine) {
            cell.classList.add('mine');
            cell.textContent = '💣';
        } else if (board[row][col].count > 0) {
            cell.textContent = board[row][col].count;
        }
    }

// 揭示相鄰格子
    function revealAdjacentCells(row, col, excludeFlags = false) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && !board[newRow][newCol].revealed) {
                    if (excludeFlags && board[newRow][newCol].flagged) continue;
                    if (board[newRow][newCol].mine) {
                        gameOver = true;
                        clearInterval(timerInterval);
                        revealMines();
                        alert('遊戲結束！');
                        return;
                    }
                    revealCell(newRow, newCol);
                    if (board[newRow][newCol].count === 0) {
                        revealAdjacentCells(newRow, newCol, excludeFlags);
                    }
                }
            }
        }
    }

// 揭示所有地雷
    function revealMines() {
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (board[row][col].mine) {
                    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                }
            }
        }
    }

// 檢查是否獲勝
    function checkWin() {
        let revealedCells = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (board[row][col].revealed) {
                    revealedCells++;
                }
            }
        }

        if (revealedCells === numRows * numCols - numMines) {
            gameOver = true;
            clearInterval(timerInterval);

            if (bestTime === '-' || timeElapsed < bestTime) {
                bestTime = timeElapsed;
                localStorage.setItem('bestTime', bestTime);
                document.getElementById('bestTime').textContent = `最快時間：${bestTime}秒`;
            }

            alert('你贏了！');
        }
    }

    initGame(); // 初始化遊戲
});
