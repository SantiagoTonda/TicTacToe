let originBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none"
    originBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof originBoard[square.target.id] == 'number') {
        turn(square.target.id, humanPlayer);
        if (!checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    originBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == humanPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You win! :)" : "You lose! :(");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return originBoard.filter(s => typeof s == 'number');
}

/* Hacer función para cambiar de dificultad
   Hacer función para cambiar quién empieza
   Hacer función para que la IA no siga jugando si gané
   Cambiar color de los distintos players
   Centrar la tabla de una mejor forma
   La clase cell es necesaria?

EASY MODE

function bestSpot() {
    return emptySquares()[0];
} 
*/

function bestSpot() {
    return minimax(originBoard, aiPlayer).index;
}

function checkTie() {
    if (!checkWin(originBoard, humanPlayer)) {
        if (emptySquares().length == 0) {
            for (let i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = "green";
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner("It's a tie!")
            return true;
        }
        return false;
    }
}

function minimax(newBoard, player) {
    let availableSpots = emptySquares(newBoard);
    if (checkWin(newBoard, humanPlayer)) {  // Change "humanPlayer" to "player" to make a intermediate difficulty mode
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 20 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;
        if (player == aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }
    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}