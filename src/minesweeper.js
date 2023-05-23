const readline = require('readline');

const boardSize = 3;
const numOfMines = 2;

let board = [];
let reveal = [];
let mines = [];
let flagged = [];
let gameOver = false;
let gameWin = false;

function initBoard() { 
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        reveal[i] = [];
        flagged[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = 0;
                reveal[i][j] = false;
                flagged[i][j] = false;
        }
    }
}



function placeMines() {
    let minesPlaced = 0;
        while (minesPlaced < numOfMines) {
            const row = Math.floor(Math.random() * boardSize)
            const col = Math.floor(Math.random() * boardSize)
                if (board[row][col] !== "*") {
                    (board[row][col] = "*")
                    mines.push([row, col]);
                    minesPlaced++;
                }
        }
}


function calcMines() {
    for (let i = 0; i < mines.length; i++) {
        const [row, col] = mines[i];
        for (let axisX = -1; axisX <= 1; axisX++) {
            for (let axisY = -1; axisY <= 1; axisY++) {
                const newX = row + axisX;
                const newY = col + axisY;
                    if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && board[newX][newY] !== '*') {
                        board[newX][newY]++;
                    }
            }
        }
    }
}



function boardUpdate() {
    for (let i = 0; i < boardSize; i++) {
        let row = '';
        for (let j = 0; j < boardSize; j++) {
            if (reveal[i][j]) {
                row += board[i][j] + ' ';
            } else if (flagged[i][j]) {
                row += "^ ";
            } else {
                row += 'X ';
            }
        }
        console.log(row);
    }
}

function flagCell(row, col) {
    if (reveal[row][col]) {
        console.log("Cell has already been revealed, please try again");
    } else {
        flagged[row][col] = !flagged[row][col];
    }
}





function revealCells(row, col) {
    if (reveal[row][col]) {
        console.log("You have already selected this cell, please select a new one.");
        return;
    }

    if (board[row][col] === "*") {
        gameOver = true;
        console.log("Game over, unlucky.");
    }

    reveal[row][col] = true;
    if (board[row][col] === 0) {
        for (let axisX = -1; axisX <= 1; axisX++) {
            for (let axisY = -1; axisY <= 1; axisY++) {
                const newX = row + axisX;
                const newY = col + axisY;
                if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && !reveal[newX][newY]) {
                    revealCells(newX, newY);
                }
            }
        }
    }
}


function revealAllCellsOnBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            reveal[i][j] = true;
        }
    }
    boardUpdate();
}


function initGame() {
    initBoard();
    placeMines();
    calcMines();
    console.log("MINESWEEPER - to play, please type 'open' then select two numbers between 0 0 & 2 2. Don't forget the space after 'open' and the space between the numbers. To place a flag on a cell, repeat this process but type 'flag' instead of 'open'. GLHF.")
}
function startGame() {
    initGame();
    boardUpdate();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('line', (input) => {
        if (!gameOver && !gameWin) {
            const [command, row, col] = input.trim().split(' ');
            if (command === "open") {
                if (row !== undefined && col !== undefined && !isNaN(row) && !isNaN(col)) {
                    const rowPos = parseInt(row);
                    const colPos = parseInt(col);
                    if (rowPos >= 0 && rowPos < boardSize && colPos >= 0 && colPos < boardSize) {
                        revealCells(rowPos, colPos);
                        boardUpdate();
                        let revealAllCells = true;
                        for (let i = 0; i < boardSize; i++) {
                            for (let j = 0; j < boardSize; j++) {
                                if (!reveal[i][j] && board[i][j] !== "*") {
                                    revealAllCells = false;
                                    break;
                                }
                            }
                            if (!revealAllCells) {
                                break;
                            }
                        }
                        if (revealAllCells) {
                            gameWin = true;
                            console.log("Amazing, you just won a 3x3 Minesweeper. Incredible Work.");
                            revealAllCellsOnBoard();
                            rl.close();
                        }
                    } else {
                        console.log("This is not a valid cell, please try again using anything between: 0 0-2 2");
                    }
                } else {
                    console.log("Please try entering numbers between 0 0-2 2. Make sure you put a space between them.");
                }
            } else if (command === "flag") {
                if (row !== undefined && col !== undefined && !isNaN(row) && !isNaN(col)) {
                    const rowPos = parseInt(row);
                    const colPos = parseInt(col);
                    if (rowPos >= 0 && rowPos < boardSize && colPos >= 0 && colPos < boardSize) {
                        flagCell(rowPos, colPos);
                        boardUpdate();
                    } else {
                        console.log("This is not a valid cell, please try again using anything between: 0 0-2 2");
                    }
                } else {
                    console.log("Please try entering numbers between 0 0-2 2. Make sure you put a space between them.");
                }
            } else {
                console.log("Not a valid command, please try 'open' or 'flag'");
            }
        } else {
            rl.close();
        }
    
});
        console.log("Please select a cell by entering numbers between 0 0 and 2 2, right here.");
    }
startGame();