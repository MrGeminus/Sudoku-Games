let boardPattern: number[] = [];
let counter: number = 0;
let selectionIsEnabled: boolean = false;
let gameIsPaused: boolean = false;
let selectedRow: null | NodeListOf<Element> = null;
let selectedCol: null | NodeListOf<Element> = null;
let selectedButton: null | Element = null;
let selectedField: null | Element = null;
let timer: any;
let newGameButton: any = document.querySelector(".newGame");
let currentTime: any = document.querySelector(".current_time");
let keypadButtons: NodeListOf<Element> = document.querySelectorAll(".keypad-button")
let sudokuFields: NodeListOf<Element> = document.querySelectorAll('.sudoku-board__field');
let sudokuSquares: NodeListOf<Element>;
window.onload = function () {
    newGameButton.addEventListener("click", startGame);
}
function updateTime() {
    if (!gameIsPaused) {
        counter += 1;
        let hours: string | number = Math.floor(counter / 3600);
        let minutes: string | number = Math.floor((counter - hours * 3600) / 60);
        let seconds: string | number = counter - (hours * 3600 + minutes * 60);
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
    let difficulties: NodeListOf<HTMLInputElement> = document.querySelectorAll(".difficulty-option")
    difficulties.forEach(difficulty => {
        if (difficulty.checked === true) {
            fetchBoard(difficulty.id)
        }
    });
    keypadButtons.forEach(keypadButton => {
        keypadButton.addEventListener("click", activateKeypadButton)
    });
    sudokuFields.forEach(sudokuField => {
        sudokuField.addEventListener("click", activateBoardField);
    });
}
function endGame() {
    selectionIsEnabled = false;
    clearInterval(timer);
    validateSolution();
}
// Fetching data
function fetchBoard(selectedDifficulty: string) {
    fetch(`https://sugoku.herokuapp.com/board?difficulty=${selectedDifficulty}`)
        .then(response =>
            response.json()
        ).then(response => {
            boardPattern = response.board
            setBoard(boardPattern);
            selectionIsEnabled = true;
            timer = setInterval(updateTime, 1000);
        })
}
function validateSolution() {
    let boardSolution: any = { board: [] }
    for (let i = 0; i < 9; i++) {
        let row: NodeListOf<Element> = document.querySelectorAll(`sudoku-board__field-row-${i}`)
        let rowContent: number[] = []
        for (let i = 0; i < 9; i++) {
            rowContent.push(Number(row[i].textContent))
        }
        boardSolution.board.push(rowContent)
    }
    const encodeBoard = (board: any) => board.reduce((result: any, row: any, i: any) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')
    const encodeParams = (params: any) =>
        Object.keys(params)
            .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
            .join('&');
    fetch('https://sugoku.herokuapp.com/validate', {
        method: 'POST',
        body: encodeParams(boardSolution),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(console.warn)
}
function setBoard(boardPattern: number[]) {
    // Clear previous board
    clearPrevious();
    for (let rowCount = 0; rowCount < 9; rowCount++) {
        let sudokuBoardRow: NodeListOf<Element> = document.querySelectorAll(`.sudoku-board__field-row-${rowCount + 1}`)
        let row: string[] = boardPattern[rowCount].toString().split(",")
        for (let fieldCount = 0; fieldCount < 9; fieldCount++) {
            if (row[fieldCount] !== '0') {
                sudokuBoardRow[fieldCount].textContent = row[fieldCount]
                sudokuBoardRow[fieldCount].classList.add('sudoku-board__field--locked')
            }
            else {
                sudokuBoardRow[fieldCount].classList.add('sudoku-board__field--unlocked')
            }
        }
    }

}
function clearPrevious() {
    sudokuFields.forEach(sudokuField => {
        sudokuField.textContent = ""
        sudokuField.classList.remove("sudoku-board__field--locked")
        sudokuField.classList.remove("sudoku-board__field--unlocked")
    });
    // Restart Timer
    counter = 0
    currentTime.textContent = "00:00:00"
    clearInterval(timer);
    // Deselect all the numbers under numbers keypad
    keypadButtons.forEach(keypadButton => {
        keypadButton.classList.remove("keypad-button--selected")
    })
}
function activateKeypadButton(e: any) {
    // Save the clicked keypad button element in a variable
    let selecetedKeypadButton = e.target
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
            keypadButtons.forEach(keypadButton => {
                keypadButton.classList.remove("keypad-button--selected")
            })
            // After that, add the selected class to the clicked button
            selecetedKeypadButton.classList.add("keypad-button--selected");
            // Update the selectedNumber variable with the value of the clicked button
            selectedButton = selecetedKeypadButton;
            // Check if the board should be updated
            updateBoard();
        }
    }
}
function activateBoardField(e: any) {
    // Save the clicked board field element in a variable
    let selecetedBoardField = e.target
    let selecetedBoardFieldRowName = document.querySelectorAll(`.${selecetedBoardField.classList[1]}`)
    let selecetedBoardFieldColName = document.querySelectorAll(`.${selecetedBoardField.classList[2]}`)

    // Checking if the selection is disabled
    if (selectionIsEnabled && selecetedBoardField.classList.contains("sudoku-board__field--unlocked")) {
        if (selecetedBoardField.classList.contains("sudoku-board__field--selected")) {
            selecetedBoardField.classList.remove("sudoku-board__field--selected");
            for (let i = 0; i < 9; i++) {
                selecetedBoardFieldRowName[i].classList.remove('sudoku-board__field-row--selected')
                selecetedBoardFieldColName[i].classList.remove('sudoku-board__field-col--selected')
            }
            selectedField = null;
        }
        else {
            sudokuFields.forEach(sudokuField => {
                sudokuField.classList.remove("sudoku-board__field--selected")
                sudokuField.classList.remove("sudoku-board__field-row--selected")
                sudokuField.classList.remove("sudoku-board__field-col--selected")
            });
            selecetedBoardField.classList.add("sudoku-board__field--selected");
            selectedField = selecetedBoardField;
            for (let i = 0; i < 9; i++) {
                selecetedBoardFieldRowName[i].classList.add('sudoku-board__field-row--selected')
                selecetedBoardFieldColName[i].classList.add('sudoku-board__field-col--selected')
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
        selectedField.classList.remove("sudoku-board__field--selected")
        selectedButton.classList.remove("keypad-button--selected")
        if (selectedRow != null && selectedCol != null) {
            for (let i = 0; i < 9; i++) {
                selectedRow[i].classList.remove('sudoku-board__field-row--selected')
                selectedCol[i].classList.remove('sudoku-board__field-col--selected')
            }
        }
        // And reset the variables
        selectedButton = null;
        selectedField = null;
        checkBoardStatus();
    }
}
function checkBoardStatus() {
    let currentBoardStatus: string = ""
    sudokuFields.forEach(sudokuField => {
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
