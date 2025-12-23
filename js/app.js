
const CONFIG = {
    WORD_LENGTH: 5,
    MAX_ATTEMPTS: 6,
    CAT_STAGES: 6
};


const WORD_BANK = [
    'KITTY', 'MEOWS', 'PURRS', 'FELINE', 'WHISK',
    'PAWED', 'TABBY', 'FURRY', 'CLAWS', 'SLEEP',
    'CATTY', 'MIAOW', 'PUSSY', 'PAWSY', 'MEOWY',
    'CATSY', 'SLEPY', 'SLEPT', 'PURRY', 'FURRS'
];


const CAT_MESSAGES = [
    "The cat bed is empty... guess letters to attract a cat! 🛏️",
    "A cute cat appeared! It's sleeping peacefully. 😴",
    "The cat woke up and found a yarn ball to play with! 🧶",
    "Now the cat has a bowl of milk! It's getting happier. 🥛",
    "Look! The cat is wearing a pretty pink bow! 🎀",
    "Purr-fect! The cat is so happy and giving you hearts! 💖"
];


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


function initGame() {
    selectRandomWord();
    setupEventListeners();
    renderWordDisplay();
    updateCatScene();
    updateUI();
    showMessage("Welcome to Cat Wordle! Guess a 5-letter cat word. 🐱", "info");
}


function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
    gameState.word = WORD_BANK[randomIndex];
    console.log("Word to guess:", gameState.word);
}


function setupEventListeners() {
    
    document.addEventListener('keydown', handleKeyPress);
    
    document.querySelectorAll('.key[data-key]').forEach(key => {
        key.addEventListener('click', () => {
            if (!gameState.gameOver) {
                handleLetterInput(key.dataset.key);
            }
        });
    });
    
    
    elements.enter.addEventListener('click', submitGuess);
    
    
    elements.backspace.addEventListener('click', deleteLetter);
    
    
    elements.newGameBtn.addEventListener('click', resetGame);
    
    
    elements.hintBtn.addEventListener('click', giveHint);
}


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


function handleLetterInput(letter) {
    if (gameState.gameOver) return;
    if (gameState.currentGuess.length < CONFIG.WORD_LENGTH) {
        gameState.currentGuess += letter;
        renderWordDisplay();
    }
}


function deleteLetter() {
    if (gameState.gameOver) return;
    if (gameState.currentGuess.length > 0) {
        gameState.currentGuess = gameState.currentGuess.slice(0, -1);
        renderWordDisplay();
    }
}

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

        
    if (!WORD_BANK.includes(guess)) {
        showMessage("Not a valid cat word! Try again. 🐱", "error");
        elements.wordDisplay.classList.add('shake');
        setTimeout(() => {
            elements.wordDisplay.classList.remove('shake');
        }, 500);
        return;
    }

       
    if (gameState.guesses.includes(guess)) {
        showMessage("You already tried that word! 😅", "error");
        return;
    }
    
    gameState.guesses.push(guess);





        
    if (guess === gameState.word) {
        gameWon();
        return;
    }



    
    gameState.attemptsLeft--;
    elements.attempts.textContent = gameState.attemptsLeft;

    
    const correctPositions = countCorrectPositions(guess);
    if (correctPositions > 0) {
        updateCatStage(false);
    }


    guess.split('').forEach(letter => gameState.usedLetters.add(letter));


        
    if (gameState.attemptsLeft === 0) {
        gameLost();
        return;
    }

      
   
    showMessage(getFeedbackMessage(guess), "info");
    

    gameState.currentGuess = '';
    renderWordDisplay();
    updateKeyboard();
    updateUI();
}


function gameWon() {
    gameState.gameWon = true;
    gameState.gameOver = true;
    gameState.score += gameState.attemptsLeft * 100 + 500;
    gameState.stage = CONFIG.CAT_STAGES;
    
    showMessage(`🎉 You won! The word was ${gameState.word}! 🐱`, "success");

     
    gameState.currentGuess = '';
    renderWordDisplay();
    updateKeyboard();
    updateCatScene();
    updateUI();
    
   
    disableGameControls();
}


function gameLost() {
    gameState.gameOver = true;
    
    
    showMessage(`😿 Game over! The word was ${gameState.word}.`, "error");


        
    gameState.currentGuess = '';
    renderWordDisplay();
    updateKeyboard();
    updateUI();

$    
    disableGameControls();
}


function disableGameControls() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = true;
    });
    elements.hintBtn.disabled = true;
    elements.enter.disabled = true;
    elements.backspace.disabled = true;
}


function enableGameControls() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'present', 'absent', 'used');
    });
    elements.hintBtn.disabled = false;
    elements.enter.disabled = false;
    elements.backspace.disabled = false;
}


function countCorrectPositions(guess) {
    let count = 0;
    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
        if (guess[i] === gameState.word[i]) {
            count++;
        }
    }
    return count;
}







function updateCatStage(isWin) {
    if (isWin) {
        gameState.stage = CONFIG.CAT_STAGES;
    } else {
        
        let totalCorrect = 0;
        gameState.guesses.forEach(guess => {
            totalCorrect += countCorrectPositions(guess);
        });
        
        
        gameState.stage = Math.min(CONFIG.CAT_STAGES, Math.floor(totalCorrect / 2) + 1);
    }
    updateCatScene();
}


function updateCatScene() {
    elements.catScene.textContent = CAT_MESSAGES[gameState.stage - 1];
    elements.stage.textContent = gameState.stage;
}




function renderWordDisplay() {
    elements.wordDisplay.innerHTML = '';
    
    
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

function updateKeyboard() {
    document.querySelectorAll('.key[data-key]').forEach(key => {
        const letter = key.dataset.key;
        
        
        key.className = 'key';
        
        if (gameState.usedLetters.has(letter)) {
            key.classList.add('used');
            
            if (gameState.word.includes(letter)) {
                
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


function updateUI() {
    elements.score.textContent = gameState.score;
}



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

function giveHint() {
    if (gameState.gameOver) {
        showMessage("Game over! Start a new game for a hint. 🎮", "error");
        return;
    }
    
    if (gameState.guesses.length === 0) {
        showMessage("Try at least one guess first! 😺", "info");
        return;
    }
    
    
    const guessedLetters = new Set();
    gameState.guesses.forEach(guess => {
        guess.split('').forEach(letter => guessedLetters.add(letter));
    });
    
    const unguessedLetters = gameState.word.split('').filter(letter => !guessedLetters.has(letter));
    
    if (unguessedLetters.length > 0) {
        const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        const position = gameState.word.indexOf(hintLetter) + 1;
        showMessage(`Hint: The letter "${hintLetter}" is in position ${position} 🐾`, "info");
    
        gameState.score = Math.max(0, gameState.score - 50);
        updateUI();
    } else {
        showMessage("You've already found all letters! Keep guessing! 🎯", "info");
    }
}


function resetGame() {
    
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
            
    

    selectRandomWord();
    
 
    elements.attempts.textContent = gameState.attemptsLeft;
    elements.score.textContent = gameState.score;
    elements.stage.textContent = gameState.stage;
    
    renderWordDisplay();
    updateCatScene();
    updateUI();
    updateKeyboard();
    elements.message.textContent = '';
    
    
    enableGameControls();
    
    showMessage("New game! Guess a 5-letter cat word. 🐱", "info");
}










    











