document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelectorAll('.grid')
    const bestTileDisplay = document.getElementById('best-tile')
    const currentBestTileDisplay = document.getElementById('current-best-tile')
    const restartButton = document.getElementById('restart-button')
    const returnButton = document.getElementById('return-button')
    const width = 4
    let squares = []
    let currentBestTile = 0
    let bestTile = 0

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement('div')
            square.innerHTML = 0
            square.setAttribute('data-value', 0)
            gridDisplay[i].appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
        updateColors()
    }

    function restartGame() {
        squares.forEach(square => {
            square.innerHTML = 0
            square.setAttribute('data-value', 0)
        })
        currentBestTile = 0
        currentBestTileDisplay.innerHTML = currentBestTile
        generate()
        generate()
        updateColors()
    }

    function returnToWebsite() {
        window.location.href = 'https://lintingyi0307.github.io/%E9%81%8A%E6%88%B2%E5%BA%AB/%E9%81%8A%E6%88%B2%E7%B6%B2%E7%AB%99/%E7%B6%B2%E9%A0%81.html';
    }

    restartButton.addEventListener('click', restartGame)
    returnButton.addEventListener('click', returnToWebsite)

    createBoard()

    function generate() {
        let emptySquares = squares.filter(square => square.innerHTML == 0)
        if (emptySquares.length > 0) {
            let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]
            randomSquare.innerHTML = 2
            randomSquare.setAttribute('data-value', 2)
            checkBestTile(2)
        }
    }

    function updateColors() {
        squares.forEach(square => {
            let value = parseInt(square.innerHTML)
            square.setAttribute('data-value', value)
        })
    }

    function checkBestTile(tile) {
        if (tile > currentBestTile) {
            currentBestTile = tile
            currentBestTileDisplay.innerHTML = currentBestTile
        }
        if (tile > bestTile) {
            bestTile = tile
            bestTileDisplay.innerHTML = bestTile
        }
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)
                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)
                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + (width * 2)].innerHTML
            let totalFour = squares[i + (width * 3)].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)
            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + (width * 2)].innerHTML = newColumn[2]
            squares[i + (width * 3)].innerHTML = newColumn[3]
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + (width * 2)].innerHTML
            let totalFour = squares[i + (width * 3)].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)
            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + (width * 2)].innerHTML = newColumn[2]
            squares[i + (width * 3)].innerHTML = newColumn[3]
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML != 0) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + 1].innerHTML = 0
                checkBestTile(combinedTotal)
            }
        }
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML && squares[i].innerHTML != 0) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                checkBestTile(combinedTotal)
            }
        }
    }

    function control(e) {
        if (e.keyCode === 39) {
            keyRight()
        } else if (e.keyCode === 37) {
            keyLeft()
        } else if (e.keyCode === 38) {
            keyUp()
        } else if (e.keyCode === 40) {
            keyDown()
        }
        updateColors()
    }
    document.addEventListener('keyup', control)

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }
})
