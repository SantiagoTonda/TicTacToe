let originBoard;
let difficulty;
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
            gameWon.player == humanPlayer ? "green" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You win! 🤗" : "You lose! 🙁");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return originBoard.filter(s => typeof s == 'number');
}

/*
   Hacer función para cambiar quién empieza
   Hacer función para que la IA no siga jugando si gané (porque sino cuando juego en modo easy podemos ganar los dos 11111111)
   Cambiar color de los distintos players
   La clase cell es necesaria?
   Solucionar error en consola cuando gano en dificultad media y fácil?
   Ver cómo hacer para que funcione bien en celu (tarda en hacer el primer movimiento en dificultad intermedia o difícil)
   Por qué puedo pasar en medio de una partida de intermedio a hard pero no de easy a intermedio???
*/

function bestSpot() {
    difficulty = Array.from(document.querySelectorAll('input:checked')).map(element => element.value);
    if (difficulty == 'intermediate') {
        return intermediate(originBoard, aiPlayer).index;
    } else if (difficulty == 'hard') {
        return hard(originBoard, aiPlayer).index;
    } else {
        return emptySquares()[0];
    }
}

function checkTie() {
    if (!checkWin(originBoard, humanPlayer)) {
        if (emptySquares().length == 0) {
            for (let i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = "yellow";
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner("It's a tie! 😐")
            return true;
        }
        return false;
    }
}

function intermediate(newBoard, player) {
    let availableSpots = emptySquares(newBoard);
    if (checkWin(newBoard, player)) {
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
            let result = intermediate(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = intermediate(newBoard, aiPlayer);
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

function hard(newBoard, player) {
    let availableSpots = emptySquares(newBoard);
    if (checkWin(newBoard, humanPlayer)) {
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
            let result = hard(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = hard(newBoard, aiPlayer);
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