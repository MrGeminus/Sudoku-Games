// defining variables 
let sudokuBoard = document.querySelector(".sudoku_board");
let sudokuBox = document.querySelector(".sudoku_box");
let currentTime = document.querySelector(".current_time");
let continueGameButton = document.querySelector(".continueGame");
let pauseGameButton = document.querySelector(".pauseGame");
let musicPlayButton = document.getElementById("music_play");
let musicMuteButton = document.getElementById("music_mute");
let newGame = document.getElementById("newGame");
let difficultyOptions = document.querySelectorAll(".difficulty_option");
let numbersKeypad = document.getElementById("numbers_Keypad");
let checkTime;
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];
let timerTime = 0;
let selectedNumber = null;
let selectedCell = null;
let gamePaused = false;
let musicPaused = false;
let enableSelection = true;
window.onload = function () {
    pauseGameButton.addEventListener("click", pauseGame);
    musicPlayButton.addEventListener("click", pauseMusic);
    newGame.addEventListener("click", startGame);
    for (let i = 0; i < numbersKeypad.children.length; i++) {
        numbersKeypad.children[i].addEventListener("click", activateNumbersKeypad)
    }
}
function activateNumbersKeypad() {
    // Checking if the selection is disabled
    if (enableSelection) {
        // Checking if an another number is already selected
        if (this.classList.contains("selected")) {
            this.classList.remove("selected");
            selectedNumber = null;
        }
        else {
            for (let i = 0; i < numbersKeypad.children.length; i++) {
                numbersKeypad.children[i].classList.remove("selected")
            }
            this.classList.add("selected");
            selectedNumber = this;
        }
    }
}
// unpausing the game and showing the pause button
function continueGame() {
    continueGameButton.removeEventListener("click", continueGame);
    continueGameButton.style.display = "none";
    gamePaused = false;
    pauseGameButton.addEventListener("click", pauseGame);
    pauseGameButton.style.display = "inline-block";
}
function playMusic() {
    musicMuteButton.removeEventListener("click", playMusic);
    musicMuteButton.style.display = "none";
    gamePaused = false;
    musicPlayButton.addEventListener("click", pauseMusic);
    musicPlayButton.style.display = "inline-block";
}
// pausing the game and showing the play button
function pauseGame() {
    pauseGameButton.removeEventListener("click", pauseGame);
    pauseGameButton.style.display = "none";
    gamePaused = true;
    continueGameButton.addEventListener("click", continueGame);
    continueGameButton.style.display = "inline-block";
}
function pauseMusic() {
    musicPlayButton.removeEventListener("click", pauseMusic);
    musicPlayButton.style.display = "none";
    musicPaused = true;
    musicMuteButton.addEventListener("click", playMusic);
    musicMuteButton.style.display = "inline-block";
}
// function which calculates and displays the pasted time
function updateTime() {
    if (!gamePaused) {
        timerTime += 1;
        let hours = Math.floor(timerTime / 3600);
        let minutes = Math.floor((timerTime - hours * 3600) / 60);
        let seconds = timerTime - (hours * 3600 + minutes * 60);
        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        currentTime.textContent = hours + ":" + minutes + ":" + seconds;
    }
}
// function which generates the sudoku board and the random number inside the cells
function drawSudokuBoard() {
    for (let b = 0; b < 9; b++) {
        if (!b == 0) {
            sudokuBox = document.createElement('div');
            sudokuBox.className = "sudoku_box";
            sudokuBoard.appendChild(sudokuBox);
        }
        for (let i = 0; i < 9; i++) {
            sudokuCell = document.createElement('div');
            if (((i + 1) % 2) == 1) {
                sudokuCell.className = ' gray_cell ' + ' cell' + ' empty_cell';
            }
            else if (((i + 1) % 2) == 0) {
                sudokuCell.className = ' cell' + ' empty_cell';
            }
            sudokuBox.appendChild(sudokuCell);
        }
    }
    let createdCells = document.querySelectorAll('.cell');
    for (let i = 0; i < createdCells.length; i++) {
        createdCells[i].textContent = "";
    }
}
function activateCell() {
    if (enableSelection) {
        if (this.classList.contains("selected")) {
            this.classList.remove("selected");
            selectedCell = null;
        }
        else {
            let createdCells = document.querySelectorAll('.cell');
            for (let i = 0; i < 81; i++) {
                createdCells[i].classList.remove("selected")
            }
            this.classList.add("selected");
            selectedCell = this;
        }
    }
}
function generateSudokuBoard(board) {
    // Clear previous board in case there was any
    clearPrevious();
    let createdCells = document.querySelectorAll('.cell');
    for (let i = 0; i < 81; i++) {
        if (board.charAt(i) != "-") {
            createdCells[i].textContent = board.charAt(i);
        }
        else {
            createdCells[i].textContent = "";
            createdCells[i].addEventListener("click", activateCell);
        }
    }
}
function clearPrevious() {
    // Clear all tiles
    let createdCells = document.querySelectorAll('.cell');
    for (let i = 0; i < createdCells.length; i++) {
        createdCells[i].textContent = "";
    }
    // Restart Timer
    timerTime = 0
    currentTime.textContent = "00:00:00"
    clearInterval(checkTime);
    // Deselect all the numbers under numbers keypad
    for (let i = 0; i < numbersKeypad.children.length; i++) {
        numbersKeypad.children[i].classList.remove("selected")
    }
}
function startGame() {
    let board;
    if (difficultyOptions[0].checked) {
        board = easy[0];
    }
    else if (difficultyOptions[1].checked) {
        board = medium[0];
    }
    else {
        board = hard[0]
    }
    generateSudokuBoard(board);
    checkTime = setInterval(updateTime, 1000);
}
drawSudokuBoard();
