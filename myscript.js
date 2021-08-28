var boardPattern = [];
var counter = 0;
var selectionIsEnabled = false;
var gameIsPaused = false;
var selectedRow = null;
var selectedCol = null;
var selectedButton = null;
var selectedField = null;
var timer;
var newGameButton = document.querySelector(".newGame");
var currentTime = document.querySelector(".current_time");
var keypadButtons = document.querySelectorAll(".keypad-button");
var sudokuFields = document.querySelectorAll('.sudoku-board__field');
var sudokuSquares;
window.onload = function () {
    newGameButton.addEventListener("click", startGame);
};
function updateTime() {
    if (!gameIsPaused) {
        counter += 1;
        var hours = Math.floor(counter / 3600);
        var minutes = Math.floor((counter - hours * 3600) / 60);
        var seconds = counter - (hours * 3600 + minutes * 60);
        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        currentTime.textContent = hours + ":" + minutes + ":" + seconds;
    }
}
function startGame() {
    var difficulties = document.querySelectorAll(".difficulty-option");
    difficulties.forEach(function (difficulty) {
        if (difficulty.checked === true) {
            fetchBoard(difficulty.id);
        }
    });
    keypadButtons.forEach(function (keypadButton) {
        keypadButton.addEventListener("click", activateKeypadButton);
    });
    sudokuFields.forEach(function (sudokuField) {
        sudokuField.addEventListener("click", activateBoardField);
    });
}
function endGame() {
    selectionIsEnabled = false;
    clearInterval(timer);
    validateSolution();
}
// Fetching data
function fetchBoard(selectedDifficulty) {
    fetch("https://sugoku.herokuapp.com/board?difficulty=" + selectedDifficulty)
        .then(function (response) {
        return response.json();
    }).then(function (response) {
        boardPattern = response.board;
        setBoard(boardPattern);
        selectionIsEnabled = true;
        timer = setInterval(updateTime, 1000);
    });
}
function validateSolution() {
    var boardSolution = { board: [] };
    for (var i = 0; i < 9; i++) {
        var row = document.querySelectorAll("sudoku-board__field-row-" + i);
        var rowContent = [];
        for (var i_1 = 0; i_1 < 9; i_1++) {
            rowContent.push(Number(row[i_1].textContent));
        }
        boardSolution.board.push(rowContent);
    }
    var encodeBoard = function (board) { return board.reduce(function (result, row, i) { return result + ("%5B" + encodeURIComponent(row) + "%5D" + (i === board.length - 1 ? '' : '%2C')); }, ''); };
    var encodeParams = function (params) {
        return Object.keys(params)
            .map(function (key) { return key + '=' + ("%5B" + encodeBoard(params[key]) + "%5D"); })
            .join('&');
    };
    fetch('https://sugoku.herokuapp.com/validate', {
        method: 'POST',
        body: encodeParams(boardSolution),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(function (response) { return response.json(); })
        .then(function (response) { return console.log(response); })["catch"](console.warn);
}
function setBoard(boardPattern) {
    // Clear previous board
    clearPrevious();
    for (var rowCount = 0; rowCount < 9; rowCount++) {
        var sudokuBoardRow = document.querySelectorAll(".sudoku-board__field-row-" + (rowCount + 1));
        var row = boardPattern[rowCount].toString().split(",");
        for (var fieldCount = 0; fieldCount < 9; fieldCount++) {
            if (row[fieldCount] !== '0') {
                sudokuBoardRow[fieldCount].textContent = row[fieldCount];
                sudokuBoardRow[fieldCount].classList.add('sudoku-board__field--locked');
            }
            else {
                sudokuBoardRow[fieldCount].classList.add('sudoku-board__field--unlocked');
            }
        }
    }
}
function clearPrevious() {
    sudokuFields.forEach(function (sudokuField) {
        sudokuField.textContent = "";
        sudokuField.classList.remove("sudoku-board__field--locked");
        sudokuField.classList.remove("sudoku-board__field--unlocked");
    });
    // Restart Timer
    counter = 0;
    currentTime.textContent = "00:00:00";
    clearInterval(timer);
    // Deselect all the numbers under numbers keypad
    keypadButtons.forEach(function (keypadButton) {
        keypadButton.classList.remove("keypad-button--selected");
    });
}
function activateKeypadButton(e) {
    // Save the clicked keypad button element in a variable
    var selecetedKeypadButton = e.target;
    // Checking if the selection is disabled
    if (selectionIsEnabled) {
        // Checking if the clicked button already contains the selected class
        if (selecetedKeypadButton.classList.contains("keypad-button--selected")) {
            // If yes, then remove the selected class 
            selecetedKeypadButton.classList.remove("keypad-button--selected");
            // And reset selectedNumber to null
            selectedButton = null;
        }
        // If the clicked button doesn't contain the selected class
        else {
            // Loop through all keypad buttons and remove the selected class 
            keypadButtons.forEach(function (keypadButton) {
                keypadButton.classList.remove("keypad-button--selected");
            });
            // After that, add the selected class to the clicked button
            selecetedKeypadButton.classList.add("keypad-button--selected");
            // Update the selectedNumber variable with the value of the clicked button
            selectedButton = selecetedKeypadButton;
            // Check if the board should be updated
            updateBoard();
        }
    }
}
function activateBoardField(e) {
    // Save the clicked board field element in a variable
    var selecetedBoardField = e.target;
    var selecetedBoardFieldRowName = document.querySelectorAll("." + selecetedBoardField.classList[1]);
    var selecetedBoardFieldColName = document.querySelectorAll("." + selecetedBoardField.classList[2]);
    // Checking if the selection is disabled
    if (selectionIsEnabled && selecetedBoardField.classList.contains("sudoku-board__field--unlocked")) {
        if (selecetedBoardField.classList.contains("sudoku-board__field--selected")) {
            selecetedBoardField.classList.remove("sudoku-board__field--selected");
            for (var i = 0; i < 9; i++) {
                selecetedBoardFieldRowName[i].classList.remove('sudoku-board__field-row--selected');
                selecetedBoardFieldColName[i].classList.remove('sudoku-board__field-col--selected');
            }
            selectedField = null;
        }
        else {
            sudokuFields.forEach(function (sudokuField) {
                sudokuField.classList.remove("sudoku-board__field--selected");
                sudokuField.classList.remove("sudoku-board__field-row--selected");
                sudokuField.classList.remove("sudoku-board__field-col--selected");
            });
            selecetedBoardField.classList.add("sudoku-board__field--selected");
            selectedField = selecetedBoardField;
            for (var i = 0; i < 9; i++) {
                selecetedBoardFieldRowName[i].classList.add('sudoku-board__field-row--selected');
                selecetedBoardFieldColName[i].classList.add('sudoku-board__field-col--selected');
            }
            selectedRow = selecetedBoardFieldRowName;
            selectedCol = selecetedBoardFieldColName;
            // Check if the board should be updated
            updateBoard();
        }
    }
}
// A function that checks if the board needs to be updated
function updateBoard() {
    // If neither of these variables is null
    if (selectedField && selectedButton) {
        // If the condition is met
        selectedField.textContent = selectedButton.textContent;
        // Remove the selected class from both elements
        selectedField.classList.remove("sudoku-board__field--selected");
        selectedButton.classList.remove("keypad-button--selected");
        if (selectedRow != null && selectedCol != null) {
            for (var i = 0; i < 9; i++) {
                selectedRow[i].classList.remove('sudoku-board__field-row--selected');
                selectedCol[i].classList.remove('sudoku-board__field-col--selected');
            }
        }
        // And reset the variables
        selectedButton = null;
        selectedField = null;
        checkBoardStatus();
    }
}
function checkBoardStatus() {
    var currentBoardStatus = "";
    sudokuFields.forEach(function (sudokuField) {
        if (sudokuField.textContent != "") {
            currentBoardStatus += sudokuField.textContent;
        }
        else {
            currentBoardStatus += "-";
        }
    });
    if (!currentBoardStatus.includes("-")) {
        endGame();
    }
}
/* A function that draws the sudoku board
function drawSudokuBoard() {
    // Select the sudoku board
    let sudokuBoard: any = document.querySelector(".sudoku-board");
    for (let box = 0; box < 9; box++) {
        // Create a 3x3 sudoku square
        let sudokuSquare = document.createElement('div');
        // Add the square class to it for styling purposes
        sudokuSquare.className = "sudoku-board__square";
        // Create a field
        for (let i = 0; i < 9; i++) {
            let sudokuField = document.createElement('div');
            if (((i + 1) % 2) == 1) {
                sudokuField.className = 'sudoku-board__field';
            }
            else if (((i + 1) % 2) == 0) {
                sudokuField.className = 'sudoku-board__field';
            }
            // Append the created field to the sudoku square
            sudokuSquare.appendChild(sudokuField);
        }
        // Append the created sudoku square with fields to the sudoku board
        sudokuBoard.appendChild(sudokuSquare);
    }
    sudokuFields = document.querySelectorAll('.sudoku-board__field');
    sudokuSquares = document.querySelectorAll('.sudoku-board__square');

}

drawSudokuBoard();
*/
