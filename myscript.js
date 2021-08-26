var boardPattern = [];
var counter = 0;
var selectionIsEnabled = false;
var gameIsPaused = false;
var selectedButton = null;
var selectedField = null;
var timer;
var newGameButton = document.querySelector(".newGame");
var currentTime = document.querySelector(".current_time");
var keypadButtons = document.querySelectorAll(".keypad-button");
var difficulties = document.querySelectorAll(".difficulty-option");
var sudokuFields;
var sudokuSquares;
window.onload = function () {
    newGameButton.addEventListener("click", startGame);
    keypadButtons.forEach(function (keypadButton) {
        keypadButton.addEventListener("click", activateKeypadButton);
    });
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
    difficulties.forEach(function (difficulty) {
        if (difficulty.checked === true) {
            fetchBoard(difficulty.id);
        }
    });
}
function endGame() {
    selectionIsEnabled = false;
    clearInterval(timer);
}
// Fetching data
function fetchBoard(difficulty) {
    fetch("https://sugoku.herokuapp.com/board?difficulty=" + difficulty)
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
    sudokuSquares.forEach(function (sudokuSquare) {
        var boardSquareFields = sudokuSquare.children;
        var square = [];
        for (var i = 0; i < boardSquareFields.length; i++) {
            square.push(Number(boardSquareFields[i].textContent));
        }
        boardSolution.board.push(square);
    });
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
    var fieldsCounter = 0;
    var squareCounter = 0;
    sudokuSquares.forEach(function (sudokuSquare) {
        var boardSquareFields = sudokuSquare.children;
        var fetchedSquareValues = boardPattern[squareCounter];
        for (var i = 0; i < boardSquareFields.length; i++) {
            if (fetchedSquareValues[fieldsCounter] != 0) {
                boardSquareFields[i].textContent = fetchedSquareValues[fieldsCounter].toString();
            }
            fieldsCounter += 1;
        }
        squareCounter += 1;
        fieldsCounter = 0;
    });
}
function clearPrevious() {
    sudokuFields.forEach(function (sudokuField) {
        sudokuField.textContent = "";
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
    // Checking if the selection is disabled
    if (selectionIsEnabled) {
        if (selecetedBoardField.classList.contains("sudoku-board__field--selected")) {
            selecetedBoardField.classList.remove("sudoku-board__field--selected");
            selectedField = null;
        }
        else {
            sudokuFields.forEach(function (sudokuField) {
                sudokuField.classList.remove("sudoku-board__field--selected");
            });
            selecetedBoardField.classList.add("sudoku-board__field--selected");
            selectedField = selecetedBoardField;
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
        selectedField.classList.remove("selected");
        selectedButton.classList.remove("selected");
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
        validateSolution();
        endGame();
    }
}
// A function that draws the sudoku board
function drawSudokuBoard() {
    // Select the sudoku board
    var sudokuBoard = document.querySelector(".sudoku-board");
    for (var box = 0; box < 9; box++) {
        // Create a 3x3 sudoku square
        var sudokuSquare = document.createElement('div');
        // Add the square class to it for styling purposes
        sudokuSquare.className = "sudoku-board__square";
        // Create a field
        for (var i = 0; i < 9; i++) {
            var sudokuField = document.createElement('div');
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
    sudokuFields.forEach(function (sudokuField) {
        sudokuField.addEventListener("click", activateBoardField);
    });
}
drawSudokuBoard();
