// Isaac's Board Game - Main Game Logic

// Game State
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    actionsRemaining: 3,
    currentQuestion: null,
    gameStarted: false
};

// Constants
const ACTIONS_PER_TURN = 3;
const COINS_PER_CORRECT_ANSWER = 50;
const KEY_COST = 50;
const TICKET_COST = 50;
const WIN_SCORE = 1000;

const CHEST_CONFIG = {
    1: { keys: 1, minPoints: 50, maxPoints: 100 },
    2: { keys: 2, minPoints: 150, maxPoints: 200 },
    3: { keys: 3, minPoints: 250, maxPoints: 300 }
};

const WHEEL_OUTCOMES = [
    { roll: 1, reward: 'points', value: 100, label: '100 points!' },
    { roll: 2, reward: 'keys', value: 1, label: '1 Key!' },
    { roll: 3, reward: 'nothing', value: 0, label: 'Nothing...' },
    { roll: 4, reward: 'points', value: 50, label: '50 points!' },
    { roll: 5, reward: 'points', value: 10, label: '10 points!' },
    { roll: 6, reward: 'points', value: 50, label: '50 points!' },
    { roll: 7, reward: 'coins', value: 5, label: '5 coins!' },
    { roll: 8, reward: 'points', value: 50, label: '50 points!' },
    { roll: 9, reward: 'points', value: 500, label: '500 points!' },
    { roll: 10, reward: 'keys', value: 5, label: '5 Keys!' },
    { roll: 11, reward: 'points', value: 100, label: '100 points!' },
    { roll: 12, reward: 'tickets', value: 3, label: '3 Tickets!' }
];

// Player class
class Player {
    constructor(name, index) {
        this.name = name;
        this.index = index;
        this.points = 0;
        this.coins = 0;
        this.keys = 0;
        this.tickets = 0;
    }
}

// Setup Functions
function setPlayerCount(count) {
    const container = document.getElementById('player-names');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-${i}-name`;
        input.placeholder = `Player ${i} Name`;
        input.value = `Player ${i}`;
        container.appendChild(input);
    }

    document.getElementById('start-game-btn').style.display = 'block';
}

function startGame() {
    const inputs = document.querySelectorAll('#player-names input');
    gameState.players = [];

    inputs.forEach((input, index) => {
        const name = input.value.trim() || `Player ${index + 1}`;
        gameState.players.push(new Player(name, index));
    });

    gameState.currentPlayerIndex = 0;
    gameState.actionsRemaining = ACTIONS_PER_TURN;
    gameState.gameStarted = true;

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    renderPlayers();
    updateUI();
}

// UI Functions
function renderPlayers() {
    const container = document.getElementById('players-container');
    container.innerHTML = '';

    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.id = `player-card-${index}`;
        card.innerHTML = `
            <h4>${player.name}</h4>
            <div class="player-stats">
                <span class="points">Points: ${player.points}</span>
                <span class="coins">Coins: ${player.coins}</span>
                <span class="keys">Keys: ${player.keys}</span>
                <span class="tickets">Tickets: ${player.tickets}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateUI() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Update turn info
    document.getElementById('current-player-name').textContent = currentPlayer.name;
    document.getElementById('actions-remaining').textContent = gameState.actionsRemaining;

    // Update player cards
    document.querySelectorAll('.player-card').forEach((card, index) => {
        card.classList.toggle('active', index === gameState.currentPlayerIndex);
        const player = gameState.players[index];
        card.querySelector('.points').textContent = `Points: ${player.points}`;
        card.querySelector('.coins').textContent = `Coins: ${player.coins}`;
        card.querySelector('.keys').textContent = `Keys: ${player.keys}`;
        card.querySelector('.tickets').textContent = `Tickets: ${player.tickets}`;
    });

    // Update button states
    updateButtonStates();
}

function updateButtonStates() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const hasActions = gameState.actionsRemaining > 0;

    // Chest buttons
    document.querySelectorAll('.chest-btn').forEach((btn, index) => {
        const chestNum = index + 1;
        const config = CHEST_CONFIG[chestNum];
        btn.disabled = !hasActions || currentPlayer.keys < config.keys;
    });

    // Shop buttons
    document.querySelectorAll('.shop-btn').forEach(btn => {
        btn.disabled = !hasActions || currentPlayer.coins < 50;
    });

    // Wheel button
    document.querySelector('.spin-btn').disabled = !hasActions || currentPlayer.tickets < 1;

    // Question button
    document.getElementById('get-question-btn').disabled = !hasActions || gameState.currentQuestion !== null;
}

function showMessage(text, duration = 2000) {
    const msgEl = document.getElementById('game-message');
    msgEl.textContent = text;
    msgEl.classList.add('show');

    setTimeout(() => {
        msgEl.classList.remove('show');
    }, duration);
}

// Action Functions
function useAction() {
    gameState.actionsRemaining--;
    updateUI();

    if (gameState.actionsRemaining === 0) {
        showMessage('No actions left! Click "End Turn"', 2000);
    }
}

function endTurn() {
    // Clear any pending question
    gameState.currentQuestion = null;
    document.getElementById('question-text').textContent = 'Click "Answer Question" to get a question!';
    document.getElementById('answer-area').style.display = 'none';
    document.getElementById('get-question-btn').style.display = 'block';
    document.getElementById('question-result').textContent = '';
    document.getElementById('wheel-result').textContent = '';

    // Clear wheel highlighting
    document.querySelectorAll('.outcome').forEach(el => el.classList.remove('highlight'));

    // Move to next player
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    gameState.actionsRemaining = ACTIONS_PER_TURN;

    updateUI();
    showMessage(`${gameState.players[gameState.currentPlayerIndex].name}'s Turn!`, 1500);
}

// Math Question Functions
function generateQuestion() {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1, num2, answer;

    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 10;
            num2 = Math.floor(Math.random() * num1);
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            answer = num1 * num2;
            break;
        case '/':
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * answer;
            break;
    }

    const symbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation;

    return {
        text: `${num1} ${symbol} ${num2} = ?`,
        answer: answer
    };
}

function getQuestion() {
    if (gameState.actionsRemaining <= 0) {
        showMessage('No actions remaining!');
        return;
    }

    gameState.currentQuestion = generateQuestion();
    document.getElementById('question-text').textContent = gameState.currentQuestion.text;
    document.getElementById('answer-area').style.display = 'flex';
    document.getElementById('get-question-btn').style.display = 'none';
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('question-result').textContent = '';
}

function submitAnswer() {
    if (!gameState.currentQuestion) return;

    const userAnswer = parseInt(document.getElementById('answer-input').value);
    const correctAnswer = gameState.currentQuestion.answer;
    const resultEl = document.getElementById('question-result');
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (userAnswer === correctAnswer) {
        currentPlayer.coins += COINS_PER_CORRECT_ANSWER;
        resultEl.textContent = `Correct! +${COINS_PER_CORRECT_ANSWER} coins!`;
        resultEl.className = 'question-result correct';
    } else {
        resultEl.textContent = `Wrong! The answer was ${correctAnswer}`;
        resultEl.className = 'question-result incorrect';
    }

    gameState.currentQuestion = null;
    document.getElementById('answer-area').style.display = 'none';
    document.getElementById('get-question-btn').style.display = 'block';

    useAction();
    checkWinCondition();
}

// Shop Functions
function buyKey() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (gameState.actionsRemaining <= 0) {
        showMessage('No actions remaining!');
        return;
    }

    if (currentPlayer.coins < KEY_COST) {
        showMessage('Not enough coins!');
        return;
    }

    currentPlayer.coins -= KEY_COST;
    currentPlayer.keys += 1;
    showMessage('+1 Key!');
    useAction();
}

function buyTicket() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (gameState.actionsRemaining <= 0) {
        showMessage('No actions remaining!');
        return;
    }

    if (currentPlayer.coins < TICKET_COST) {
        showMessage('Not enough coins!');
        return;
    }

    currentPlayer.coins -= TICKET_COST;
    currentPlayer.tickets += 1;
    showMessage('+1 Ticket!');
    useAction();
}

// Chest Functions
function openChest(chestNum) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const config = CHEST_CONFIG[chestNum];

    if (gameState.actionsRemaining <= 0) {
        showMessage('No actions remaining!');
        return;
    }

    if (currentPlayer.keys < config.keys) {
        showMessage(`Need ${config.keys} key(s)!`);
        return;
    }

    currentPlayer.keys -= config.keys;
    const points = Math.floor(Math.random() * (config.maxPoints - config.minPoints + 1)) + config.minPoints;
    currentPlayer.points += points;

    showMessage(`Chest ${chestNum}: +${points} points!`, 2500);
    useAction();
    checkWinCondition();
}

// Wheel Functions
function spinWheel() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (gameState.actionsRemaining <= 0) {
        showMessage('No actions remaining!');
        return;
    }

    if (currentPlayer.tickets < 1) {
        showMessage('Need a ticket!');
        return;
    }

    currentPlayer.tickets -= 1;

    // Roll the 12-sided die
    const roll = Math.floor(Math.random() * 12) + 1;
    const outcome = WHEEL_OUTCOMES[roll - 1];

    // Highlight the outcome
    const outcomes = document.querySelectorAll('.outcome');
    outcomes.forEach((el, index) => {
        el.classList.toggle('highlight', index === roll - 1);
    });

    // Apply reward
    switch (outcome.reward) {
        case 'points':
            currentPlayer.points += outcome.value;
            break;
        case 'coins':
            currentPlayer.coins += outcome.value;
            break;
        case 'keys':
            currentPlayer.keys += outcome.value;
            break;
        case 'tickets':
            currentPlayer.tickets += outcome.value;
            break;
    }

    document.getElementById('wheel-result').textContent = `Rolled ${roll}: ${outcome.label}`;
    useAction();
    checkWinCondition();
}

// Win Condition
function checkWinCondition() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (currentPlayer.points >= WIN_SCORE) {
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('win-screen').style.display = 'flex';
        document.getElementById('winner-name').textContent = currentPlayer.name;
        document.getElementById('winner-score').textContent = `Final Score: ${currentPlayer.points} points!`;
    }
}

function newGame() {
    gameState = {
        players: [],
        currentPlayerIndex: 0,
        actionsRemaining: 3,
        currentQuestion: null,
        gameStarted: false
    };

    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('player-names').innerHTML = '';
    document.getElementById('start-game-btn').style.display = 'none';
}

// Enter key support for answer input
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
});
