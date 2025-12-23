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

        // Check if already guessed this word
    if (gameState.guesses.includes(guess)) {
        showMessage("You already tried that word! 😅", "error");
        return;
    }
    
    gameState.guesses.push(guess);





        // Check win condition
    if (guess === gameState.word) {
        gameWon();
        return;
    }



    // Update attempts
    gameState.attemptsLeft--;
    elements.attempts.textContent = gameState.attemptsLeft;

    // Update cat stage based on correct letters
    const correctPositions = countCorrectPositions(guess);
    if (correctPositions > 0) {
        updateCatStage(false);
    }

// Update used letters
    guess.split('').forEach(letter => gameState.usedLetters.add(letter));


        // Check lose condition
    if (gameState.attemptsLeft === 0) {
        gameLost();
        return;
    }

      
    // Continue game
    showMessage(getFeedbackMessage(guess), "info");
    
    // Reset current guess and update UI
    gameState.currentGuess = '';
    renderWordDisplay();
    updateKeyboard();
    updateUI();
}

// Handle win
function gameWon() {
    gameState.gameWon = true;
    gameState.gameOver = true;
    gameState.score += gameState.attemptsLeft * 100 + 500;
    gameState.stage = CONFIG.CAT_STAGES;
    
    // Show win message
    showMessage(`🎉 You won! The word was ${gameState.word}! 🐱`, "success");

     // Update UI
    gameState.currentGuess = '';
    renderWordDisplay();
    updateKeyboard();
    updateCatScene();
    updateUI();
    
    // Disable keyboard
    disableGameControls();
}

// Handle lose
function gameLost() {
    gameState.gameOver = true;
    
    // Show lose message
    showMessage(`😿 Game over! The word was ${gameState.word}.`, "error");


        // Update UI
    gameState.currentGuess = '';
    renderWordDisplay();
    updateKeyboard();
    updateUI();

$     // Disable keyboard
    disableGameControls();
}

// Disable game controls
function disableGameControls() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = true;
    });
    elements.hintBtn.disabled = true;
    elements.enter.disabled = true;
    elements.backspace.disabled = true;
}

// Enable game controls
function enableGameControls() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'present', 'absent', 'used');
    });
    elements.hintBtn.disabled = false;
    elements.enter.disabled = false;
    elements.backspace.disabled = false;
}

// Count correct positions in guess
function countCorrectPositions(guess) {
    let count = 0;
    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
        if (guess[i] === gameState.word[i]) {
            count++;
        }
    }
    return count;
}






// Update cat stage
function updateCatStage(isWin) {
    if (isWin) {
        gameState.stage = CONFIG.CAT_STAGES;
    } else {
        // Calculate stage based on correct letters in all guesses
        let totalCorrect = 0;
        gameState.guesses.forEach(guess => {
            totalCorrect += countCorrectPositions(guess);
        });
        
        // Each correct letter advances stage (max 6 stages)
        gameState.stage = Math.min(CONFIG.CAT_STAGES, Math.floor(totalCorrect / 2) + 1);
    }
    updateCatScene();
}

// Update cat scene display
function updateCatScene() {
    elements.catScene.textContent = CAT_MESSAGES[gameState.stage - 1];
    elements.stage.textContent = gameState.stage;
}



// Render word display - FIXED VERSION
function renderWordDisplay() {
    elements.wordDisplay.innerHTML = '';
    
    // Render previous guesses
    gameState.guesses.forEach(guess => {
        const row = document.createElement('div');
        row.className = 'word-row';
        
        for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            
            if (guess[i] === gameState.word[i]) {
                tile.classList.add('correct');
            } else if (gameState.word.includes(guess[i])) {
                tile.classList.add('present');
            } else {
                tile.classList.add('absent');
            }
            
            tile.textContent = guess[i];
            row.appendChild(tile);
        }
        
        elements.wordDisplay.appendChild(row);
    });
    
    // Render current guess
    if (!gameState.gameOver && gameState.currentGuess.length > 0) {
        const row = document.createElement('div');
        row.className = 'word-row';
        
        for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            
            if (i < gameState.currentGuess.length) {
                tile.textContent = gameState.currentGuess[i];
                tile.classList.add('filled');
            }
            
            row.appendChild(tile);
        }
        
        elements.wordDisplay.appendChild(row);
    }


        // Add empty rows for remaining attempts
    if (!gameState.gameOver) {
        const rowsToShow = gameState.attemptsLeft - (gameState.currentGuess.length > 0 ? 1 : 0);
        
        for (let row = 0; row < rowsToShow; row++) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'word-row';
            
            for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                emptyRow.appendChild(tile);
            }
            
            elements.wordDisplay.appendChild(emptyRow);
        }
    }
}
// Update keyboard colors
function updateKeyboard() {
    document.querySelectorAll('.key[data-key]').forEach(key => {
        const letter = key.dataset.key;
        
        // Reset classes
        key.className = 'key';
        
        if (gameState.usedLetters.has(letter)) {
            key.classList.add('used');
            
            if (gameState.word.includes(letter)) {
                // Check if it's in correct position in any guess
                let isCorrect = false;
                for (const guess of gameState.guesses) {
                    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
                        if (guess[i] === letter && gameState.word[i] === letter) {
                            isCorrect = true;
                            break;
                        }
                    }
                    if (isCorrect) break;
                }
                
                if (isCorrect) {
                    key.classList.add('correct');
                } else {
                    key.classList.add('present');
                }
            } else {
                key.classList.add('absent');
            }
        }
    });
}

// Update UI
function updateUI() {
    elements.score.textContent = gameState.score;
}


// Show message
function showMessage(text, type) {
    elements.message.textContent = text;
    elements.message.className = 'message';
    
    if (type === 'error') {
        elements.message.classList.add('error-message');
    } else if (type === 'success') {
        elements.message.classList.add('success-message');
    } else {
        elements.message.classList.remove('error-message', 'success-message');
    }
}

// Get feedback message
function getFeedbackMessage(guess) {
    const correctPositions = countCorrectPositions(guess);
    const correctLetters = new Set();
    
    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
        if (gameState.word.includes(guess[i])) {
            correctLetters.add(guess[i]);
        }
    }
    
    if (correctPositions === 0 && correctLetters.size === 0) {
        return "No matches. Keep trying! 💪";
    } else if (correctPositions >= 3) {
        return "Almost there! So many correct letters! ✨";
    } else if (correctLetters.size >= 3) {
        return "Good! Several correct letters! 🌟";
    } else if (correctPositions > 0) {
        return `Nice! ${correctPositions} letter(s) in the right spot! 👍`;
    } else {
        return `Good! ${correctLetters.size} letter(s) are in the word! 👏`;
    }
}
// Give hint
function giveHint() {
    if (gameState.gameOver) {
        showMessage("Game over! Start a new game for a hint. 🎮", "error");
        return;
    }
    
    if (gameState.guesses.length === 0) {
        showMessage("Try at least one guess first! 😺", "info");
        return;
    }
    
    // Find an unguessed letter in the target word
    const guessedLetters = new Set();
    gameState.guesses.forEach(guess => {
        guess.split('').forEach(letter => guessedLetters.add(letter));
    });
    
    const unguessedLetters = gameState.word.split('').filter(letter => !guessedLetters.has(letter));
    
    if (unguessedLetters.length > 0) {
        const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        const position = gameState.word.indexOf(hintLetter) + 1;
        showMessage(`Hint: The letter "${hintLetter}" is in position ${position} 🐾`, "info");
    // Small penalty for using hint
        gameState.score = Math.max(0, gameState.score - 50);
        updateUI();
    } else {
        showMessage("You've already found all letters! Keep guessing! 🎯", "info");
    }
}

// Reset game
function resetGame() {
    // Reset game state
    gameState = {
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
            
    
    // Select new word
    selectRandomWord();
    
    // Reset UI
    elements.attempts.textContent = gameState.attemptsLeft;
    elements.score.textContent = gameState.score;
    elements.stage.textContent = gameState.stage;
    
    renderWordDisplay();
    updateCatScene();
    updateUI();
    updateKeyboard();
    elements.message.textContent = '';
    
    // Enable keyboard
    enableGameControls();
    
    showMessage("New game! Guess a 5-letter cat word. 🐱", "info");
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);


    











