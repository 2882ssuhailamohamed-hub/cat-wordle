// Game Configuration
const CONFIG = {
    WORD_LENGTH: 5,
    MAX_ATTEMPTS: 6,
    CAT_STAGES: 6
};

// Word Bank - ONLY 5-letter cat-related words
const WORD_BANK = [
    'KITTY', 'MEOWS', 'PURRS', 'FELINE', 'WHISK',
    'PAWED', 'TABBY', 'FURRY', 'CLAWS', 'SLEEP',
    'CATTY', 'MIAOW', 'PUSSY', 'PAWSY', 'MEOWY',
    'CATSY', 'SLEPY', 'SLEPT', 'PURRY', 'FURRS'
];

// Cat scene messages for each stage
const CAT_MESSAGES = [
    "The cat bed is empty... guess letters to attract a cat! 🛏️",
    "A cute cat appeared! It's sleeping peacefully. 😴",
    "The cat woke up and found a yarn ball to play with! 🧶",
    "Now the cat has a bowl of milk! It's getting happier. 🥛",
    "Look! The cat is wearing a pretty pink bow! 🎀",
    "Purr-fect! The cat is so happy and giving you hearts! 💖"
];

// Game State
let gameState = {
    word: '',
    guesses: [],
    currentGuess: '',
    attemptsLeft: CONFIG.MAX_ATTEMPTS,
    gameOver: false,
    gameWon: false,
    score: 0,
    stage: 1,
    usedLetters: new Set(),
    startTime: null,
    timer: null,
    elapsedTime: 0
};

// DOM Elements
const elements = {
    wordDisplay: document.getElementById('word-display'),
    catScene: document.getElementById('cat-scene'),
    message: document.getElementById('message'),
    attempts: document.getElementById('attempts'),
    score: document.getElementById('score'),
    stage: document.getElementById('stage'),
    hintBtn: document.getElementById('hint'),
    newGameBtn: document.getElementById('new-game'),
    enter: document.getElementById('enter'),
    backspace: document.getElementById('backspace')
};

// Initialize Game
function initGame() {
    selectRandomWord();
    setupEventListeners();
    renderWordDisplay();
    updateCatScene();
    updateUI();
    showMessage("Welcome to Cat Wordle! Guess a 5-letter cat word. 🐱", "info");
}

// Select random word
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
    gameState.word = WORD_BANK[randomIndex];
    console.log("Word to guess:", gameState.word);
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard input
    document.addEventListener('keydown', handleKeyPress);
    
    // On-screen keyboard
    document.querySelectorAll('.key[data-key]').forEach(key => {
        key.addEventListener('click', () => {
            if (!gameState.gameOver) {
                handleLetterInput(key.dataset.key);
            }
        });
    });
    
    // Enter key
    elements.enter.addEventListener('click', submitGuess);
    
    // Backspace key
    elements.backspace.addEventListener('click', deleteLetter);
    
    // New game button
    elements.newGameBtn.addEventListener('click', resetGame);
    
    // Hint button
    elements.hintBtn.addEventListener('click', giveHint);
}

// Handle keyboard input
function handleKeyPress(e) {
    if (gameState.gameOver) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
        handleLetterInput(key);
    }
}

// Handle letter input
function handleLetterInput(letter) {
    if (gameState.gameOver) return;
    if (gameState.currentGuess.length < CONFIG.WORD_LENGTH) {
        gameState.currentGuess += letter;
        renderWordDisplay();
    }
}

// Delete last letter
function deleteLetter() {
    if (gameState.gameOver) return;
    if (gameState.currentGuess.length > 0) {
        gameState.currentGuess = gameState.currentGuess.slice(0, -1);
        renderWordDisplay();
    }
}
// Submit guess
function submitGuess() {
    if (gameState.gameOver) {
        showMessage("Game over! Start a new game. 🎮", "error");
        return;
    }
    
    if (gameState.currentGuess.length !== CONFIG.WORD_LENGTH) {
        showMessage("Word must be 5 letters! 📝", "error");
        elements.wordDisplay.classList.add('shake');
        setTimeout(() => {
            elements.wordDisplay.classList.remove('shake');
        }, 500);
        return;
    }
    
    const guess = gameState.currentGuess.toUpperCase();

        // Check if word is in our list
    if (!WORD_BANK.includes(guess)) {
        showMessage("Not a valid cat word! Try again. 🐱", "error");
        elements.wordDisplay.classList.add('shake');
        setTimeout(() => {
            elements.wordDisplay.classList.remove('shake');
        }, 500);
        return;
    }


