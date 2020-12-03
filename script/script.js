// defining variables 
let sudokuBoard = document.querySelector(".sudoku_board");
let sudokuBox = document.querySelector(".sudoku_box");
let currentTime = document.querySelector(".current_time");
let continueGameButton = document.querySelector(".continueGame");
let pauseGameButton = document.querySelector(".pauseGame");
let timerTime = 0;
let gamePaused = false;
// unpausing the game and showing the pause button
window.onload = function () {
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
    function checkRowCorrectness() {
        if (i + 1 >= 1 && i + 1 <= 9) {

        }
    }
    function checkColumnCorrectness() {

    }
    function checkBoxCorrectness(x, y) {
        let createdBoxes = document.querySelectorAll('.sudoku_box');
        if (y >= 0 && y <= 8) {
            createdBoxes[0]
            console.log(createdBoxes[0])
        }
    }
    function generateNumber() {
        let createdCells = document.querySelectorAll('.cell');
        console.log(createdCells)
        for (let i = 0; i < createdCells.length; i++) {
            let generatedRandomNumber = Math.round((Math.random() * 8) + 1);
            checkBoxCorrectness(generatedRandomNumber, i)
            createdCells[i].textContent = generatedRandomNumber;
            //createdCells[i].textContent = `${Math.round((Math.random() * 8) + 1)} `;
        }
    }
    // function which generates the sudoku board and the random number inside the cells
    function generateSudokuBoard() {
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
        generateNumber();
    }
    generateSudokuBoard();
    let checkTime = setInterval(updateTime, 1000);
    pauseGameButton.addEventListener("click", pauseGame);
}