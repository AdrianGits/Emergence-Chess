// Get references to the ELO, wins, and losses cells for each player
const player1ELOCell = document.getElementById("player1ELO");
const player1WinsCell = document.getElementById("player1Wins");
const player1LossesCell = document.getElementById("player1Losses");
const player2ELOCell = document.getElementById("player2ELO");
const player2WinsCell = document.getElementById("player2Wins");
const player2LossesCell = document.getElementById("player2Losses");
const resetButton = document.getElementById("resetButton");



        // add event listener to form submit
        document.getElementById("addPlayerForm").addEventListener("submit", function(event) {
            event.preventDefault(); // prevent default form behavior
      
            // get input field values
            var playerName = document.getElementById("playerName").value;
            var playerELO = document.getElementById("playerELO").value;
      
            // create new row in leaderboard table
            var leaderboardTable = document.getElementById("leaderboard");
            var newRow = leaderboardTable.insertRow(-1);
      
            // create cells for new row
            var playerCell = newRow.insertCell(0);
            var eloCell = newRow.insertCell(1);
            var winsCell = newRow.insertCell(2);
            var lossesCell = newRow.insertCell(3);
            var buttonCell = newRow.insertCell(4);
      
            // set values for new row cells
            playerCell.innerHTML = playerName;
            eloCell.innerHTML = playerELO;
            winsCell.innerHTML = 0;
            lossesCell.innerHTML = 0;
            buttonCell.innerHTML = '<button id="' + playerName.replace(/\s+/g, '') + 'WinsButton">' + playerName + ' Wins</button> <button id="' + playerName.replace(/\s+/g, '') + 'ResetButton">Reset</button>';
          });

// Set the initial ELO, wins, and losses values for each player
let player1ELO = 1200;
let player1Wins = 0;
let player1Losses = 0;
let player2ELO = 1200;
let player2Wins = 0;
let player2Losses = 0;

// Function to update the scoreboard with the latest player data
function updateScoreboard() {
    player1ELOCell.textContent = player1ELO;
    player1WinsCell.textContent = player1Wins;
    player1LossesCell.textContent = player1Losses;
    player2ELOCell.textContent = player2ELO;
    player2WinsCell.textContent = player2Wins;
    player2LossesCell.textContent = player2Losses;
}

// Function to update the player data when player 1 wins
function player1WinsGame() {
    // Calculate the expected score for player 1
    const R1 = player1ELO;
    const R2 = player2ELO;
    const We1 = 1 / (1 + Math.pow(10, (R2 - R1) / 400));

    // Update the ELO ratings, wins, and losses for both players
    const K = 32;
    player1ELO += Math.round(K * (1 - We1));
    player1Wins += 1;
    player2ELO += Math.round(K * (0 - (1 - We1)));
    player2Losses += 1;
    updateScoreboard();
}

// Function to update the player data when player 2 wins
function player2WinsGame() {
    // Calculate the expected score for player 2
    const R1 = player2ELO;
    const R2 = player1ELO;
    const We2 = 1 / (1 + Math.pow(10, (R2 - R1) / 400));

    // Update the ELO ratings, wins, and losses for both players
    const K = 32;
    player2ELO += Math.round(K * (1 - We2));
    player2Wins += 1;
    player1ELO += Math.round(K * (0 - (1 - We2)));
    player1Losses += 1;
    updateScoreboard();
}

// Add event listeners to the buttons to update player data when a game is won
document.getElementById("player1WinsButton").addEventListener("click", player1WinsGame);
document.getElementById("player2WinsButton").addEventListener("click", player2WinsGame);

// Update the scoreboard with the initial player data
updateScoreboard();

function reset() {
    player1ELO = 1200;
    player1Wins = 0;
    player1Losses = 0;
    player2ELO = 1200;
    player2Wins = 0;
    player2Losses = 0;
    updateScoreboard();
}

document.getElementById("player1ResetButton").addEventListener("click", reset);
document.getElementById("player2ResetButton").addEventListener("click", reset);

// Get references to the form and its elements
const form = document.querySelector('#add-player-form');
const nameInput = form.querySelector('#name-input');
const scoreInput = form.querySelector('#score-input');
const winsInput = form.querySelector('#wins-input');
const lossesInput = form.querySelector('#losses-input');

// Get a reference to the table body
const tableBody = document.querySelector('tbody');

// Define a function to handle form submissions
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the values from the form inputs
  const name = nameInput.value;
  const score = Number(scoreInput.value);
  const wins = Number(winsInput.value);
  const losses = Number(lossesInput.value);

  // Create a new row for the table
  const row = document.createElement('tr');

  // Create cells for the row
  const nameCell = document.createElement('td');
  const scoreCell = document.createElement('td');
  const winsCell = document.createElement('td');
  const lossesCell = document.createElement('td');

  // Set the text content of the cells
  nameCell.textContent = name;
  scoreCell.textContent = score;
  winsCell.textContent = wins;
  lossesCell.textContent = losses;

  // Add the cells to the row
  row.appendChild(nameCell);
  row.appendChild(scoreCell);
  row.appendChild(winsCell);
  row.appendChild(lossesCell);

  // Add the row to the table body
  tableBody.appendChild(row);

  // Clear the form inputs
  nameInput.value = '';
  scoreInput.value = '';
  winsInput.value = '';
  lossesInput.value = '';
}

// Add an event listener to the form
form.addEventListener('submit', handleFormSubmit);