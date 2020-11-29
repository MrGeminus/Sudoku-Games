// defining variables 
let sudokuBoard = document.querySelector(".sudoku_board");
let currentTime = document.querySelector(".current_time");
let continueGameButton = document.querySelector(".continueGame");
let pauseGameButton = document.querySelector(".pauseGame");
let timerTime = 0;
let gamePaused = false;
// unpausing the game and showing the pause button
function continueGame() {
    continueGameButton.removeEventListener("click", continueGame);
    continueGameButton.style.display = "none";
    gamePaused = false;
    pauseGameButton.addEventListener("click", pauseGame);
    pauseGameButton.style.display = "inline-block";
}
// pausing the game and showing the play button
function pauseGame() {
    pauseGameButton.removeEventListener("click", pauseGame);
    pauseGameButton.style.display = "none";
    gamePaused = true;
    continueGameButton.addEventListener("click", continueGame);
    continueGameButton.style.display = "inline-block";
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
function generateSudokuBoard() {
    for (let i = 0; i < 81; i++) {
        sudokuCell = document.createElement('div');
        if (((i + 1) % 2) == 1) {
            sudokuCell.className = 'cell' + `${i + 1}` + ' gray_cell ' + ' cell';
        }
        else if (((i + 1) % 2) == 0) {
            sudokuCell.className = 'cell' + `${i + 1}` + ' cell';
        }
        sudokuBoard.appendChild(sudokuCell);
    }
    let createdCells = document.querySelectorAll('.cell');
    for (let i = 0; i < createdCells.length; i++) {
        createdCells[i].textContent = `${Math.round((Math.random() * 8) + 1)}`;
    }
}
generateSudokuBoard();
let checkTime = setInterval(updateTime, 1000);
pauseGameButton.addEventListener("click", pauseGame);
