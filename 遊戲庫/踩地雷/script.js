const numRows = 10;
const numCols = 10;
const numMines = 10;
let board;
let gameOver;
let flagsLeft;
let timer;
let timeElapsed;
let bestTime = localStorage.getItem('bestTime') || '-';
let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const flagsLeftSpan = document.getElementById('flagsLeft');
    const timerSpan = document.getElementById('timer');
    const bestTimeDiv = document.getElementById('bestTime');
    document.getElementById('restartBtn').addEventListener('click', initGame);
    document.getElementById('returnBtn').addEventListener('click', () => {
        window.location.href = 'https://lintingyi0307.github.io/%E9%81%8A%E6%88%B2%E5%BA%AB/%E9%81%8A%E6%88%B2%E7%B6%B2%E7%AB%99/%E7%B6%B2%E9%A0%81.html';
    });

    bestTimeDiv.textContent = `最快時間：${bestTime === '-' ? '-' : bestTime + '秒'}`;

    function initGame() {
        gameContainer.innerHTML = '';
        board = createBoard(numRows, numCols, numMines);
        gameOver = false;
        flagsLeft = numMines;
        timeElapsed = 0;
        flagsLeftSpan.textContent = `剩餘旗幟：${flagsLeft}`;
        timerSpan.textContent = `時間：0秒`;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeElapsed++;
            timerSpan.textContent = `時間：${timeElapsed}秒`;
        }, 1000);

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', onCellClick);
                cell.addEventListener('contextmenu', onCellRightClick);
                cell.addEventListener('auxclick', onCellMiddleClick); // 新增中鍵點擊事件
                gameContainer.appendChild(cell);
            }
        }
    }

    function createBoard(rows, cols, mines) {
        const board = Array.from({ length: rows }, () => Array(cols).fill({}));
        let placedMines = 0;

        while (placedMines < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);

            if (!board[row][col].mine) {
                board[row][col] = { mine: true, revealed: false, flagged: false };
                placedMines++;
            }
        }

        for (let row = 0; row < rows; row++) {
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

        return board;
    }

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

    initGame();
});
