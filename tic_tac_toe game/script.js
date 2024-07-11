// script.js

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    const endButton = document.getElementById('end');
    const exitButton = document.getElementById('exit');
    const twoPlayerButton = document.getElementById('two-player');
    const singlePlayerButton = document.getElementById('single-player');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');

    let currentPlayer = 'X';
    let gameActive = false;
    let isSinglePlayer = false;
    let player1 = 'Player 1';
    let player2 = 'Player 2';
    let gameState = Array(9).fill('');

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function startTwoPlayerGame() {
        player1 = player1Input.value || 'Player 1';
        player2 = player2Input.value || 'Player 2';
        gameActive = true;
        isSinglePlayer = false;
        message.textContent = `${player1}'s turn (X)`;
        setupBoard();
    }

    function startSinglePlayerGame() {
        player1 = player1Input.value || 'Player 1';
        player2 = 'Computer';
        gameActive = true;
        isSinglePlayer = true;
        message.textContent = `${player1}'s turn (X)`;
        setupBoard();
    }

    function setupBoard() {
        board.innerHTML = '';
        gameState.fill('');
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-cell-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }

        restartButton.addEventListener('click', restartGame);
        endButton.addEventListener('click', endGame);
        exitButton.addEventListener('click', exitGame);
    }

    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        if (gameState[cellIndex] !== '' || !gameActive) return;

        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        if (checkWin()) {
            message.textContent = `${currentPlayer === 'X' ? player1 : player2} wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            message.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `${currentPlayer === 'X' ? player1 : player2}'s turn (${currentPlayer})`;

            if (isSinglePlayer && currentPlayer === 'O') {
                setTimeout(() => {
                    computerMove();
                }, 500);
            }
        }
    }

    function computerMove() {
        let emptyCells = gameState
            .map((value, index) => (value === '' ? index : null))
            .filter(value => value !== null);

        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = currentPlayer;
        let cell = document.querySelector(`[data-cell-index='${randomIndex}']`);
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        if (checkWin()) {
            message.textContent = `${player2} wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            message.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = 'X';
            message.textContent = `${player1}'s turn (X)`;
        }
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function checkDraw() {
        return gameState.every(cell => {
            return cell !== '';
        });
    }

    function restartGame() {
        gameActive = true;
        currentPlayer = 'X';
        message.textContent = `${player1}'s turn (X)`;
        gameState.fill('');
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
    }

    function endGame() {
        gameActive = false;
        message.textContent = 'Select game mode';
        gameState.fill('');
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
            cell.removeEventListener('click', handleCellClick);
        });
    }

    function exitGame() {
        window.location.href = 'index.html'; // Redirect to homepage
    }

    twoPlayerButton.addEventListener('click', startTwoPlayerGame);
    singlePlayerButton.addEventListener('click', startSinglePlayerGame);
});
