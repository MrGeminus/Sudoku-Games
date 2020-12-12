<?php
$connection = mysqli_connect('localhost', 'root', 's0h111ed95Ow.W1u2lF!57', 'sudoku_game');
if(mysqli_connect_errno()){
    echo 'Failed to connect to the server' . ' ' . mysqli_connect_errno();
}
if(isset($_GET['q'])){
//Get chosen difficulty from url
$chosenDifficulty =  $_GET['q'];
//Generate random id
$randomNumber = 1;
//Create query
$query = "SELECT * FROM $chosenDifficulty WHERE id=$randomNumber ";
//Get result
$result = mysqli_query($connection, $query);
$result = mysqli_query($connection,$query);
if($result === false){
    throw new Exception(mysqli_error($connection));
}
//Fetching board data from server
$boardInformation = mysqli_fetch_assoc($result);
//Free result
mysqli_free_result($result);
//Close connection
mysqli_close($connection);
echo $boardPattern = $boardInformation['board_pattern'];
}
?>