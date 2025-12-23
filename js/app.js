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


