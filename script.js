window.onload = function () {
  sortTable();
};

const newPlayerFormEl = document.querySelector('#new-player-form');
const tbodyEl = document.querySelector('tbody');
const tableEl = document.querySelector('table');
const ratingHeader = document.getElementById("rating-header");
const ratingArrow = document.getElementById("rating-arrow");
const matchHistoryTable = document.getElementById("#match-history-table");

ratingHeader.addEventListener("click", sortTable);

// Load players from local storage and display them in the table
document.addEventListener('DOMContentLoaded', function () {
  const players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : [];
  const tbodyEl = document.querySelector('#leaderboard-table tbody');
  for (const player of players) {
    const newRow = `
        <tr>
          <td>${player.name}</td>
          <td>${player.elo}</td>
          <td>${player.wins}</td>
          <td>${player.losses}</td>
          <td>${player.draws}</td>
          <td>${player.wlRatio}%</td>
          <td>
            <button class="delete-btn">Delete</button>
          </td>
        </tr>
      `;
    tbodyEl.insertAdjacentHTML('beforeend', newRow);
  }
});

function sortTable() {
  const table = document.getElementById("leaderboard-table");
  const rows = Array.from(table.rows).slice(1); // exclude the header row
  const ratingHeader = document.getElementById("rating-header");
  const ratingArrow = document.getElementById("rating-arrow");
  const sortIndex = ratingHeader.cellIndex;
  const sortOrder = ratingHeader.getAttribute("data-order");

  if (sortOrder === "asc") { // Update the check for sortOrder
    rows.sort((a, b) => a.cells[sortIndex].textContent - b.cells[sortIndex].textContent);
    ratingHeader.setAttribute("data-order", "desc");
    ratingArrow.classList.remove("down");
    ratingArrow.classList.add("up");
  } else {
    rows.sort((a, b) => b.cells[sortIndex].textContent - a.cells[sortIndex].textContent);
    ratingHeader.setAttribute("data-order", "asc");
    ratingArrow.classList.remove("up");
    ratingArrow.classList.add("down");
  }
  // Update the table with sorted rows
  rows.forEach(row => table.appendChild(row));
}

// Add new player functionality
newPlayerFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('name').value;
  const eloInput = parseFloat(document.getElementById('elo').value); // Convert elo value to number
  const tbodyEl = document.querySelector('#leaderboard-table tbody');
  const players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : [];
  const player = {
    name: nameInput,
    elo: eloInput,
    wins: 0,
    losses: 0,
    draws: 0,
    wlRatio: 0.00.toFixed(2)
  };

  // Duplicate check for new users
  if (players.some(player => player.name.localeCompare(nameInput, undefined, { sensitivity: 'base' }) === 0)) {
    alert(`${nameInput}` + " already exists in the table. Please enter a new player.");
  } else {
    // Save player to local storage
    const newRow = `
    <tr>
      <td>${nameInput}</td>
      <td>${eloInput}</td>
      <td>0</td>
      <td>0</td>
      <td></td>
      <td></td>
      <td>
        <button class="delete-btn">Delete</button>
      </td>
    </tr>
  `;
tbodyEl.insertAdjacentHTML('beforeend', newRow);
const deleteBtn = tbodyEl.querySelector('tr:last-child .delete-btn');
deleteBtn.addEventListener('click', onDeleteRow);
players.push(player);
localStorage.setItem('players', JSON.stringify(players));
// Clear input fields
document.getElementById('name').value = '';
location.reload();
  }
});

function onAddWin(e) {
  if (!e.target.classList.contains("win-btn")) {
    return;
  }
  const winBtn = e.target;
  const row = winBtn.closest("tr");
  const winsCell = row.querySelector("td:nth-child(3)");
  let wins = parseInt(winsCell.textContent);
  wins++;
  winsCell.textContent = wins;

  const lossesCell = row.querySelector("td:nth-child(4)");
  let losses = parseInt(lossesCell.textContent);

  const wlRatioCell = row.querySelector("td:nth-child(5)");
  const playerName = row.querySelector("td:nth-child(1)").textContent;
  const players = JSON.parse(localStorage.getItem('players')) || [];
  const playerIndex = players.findIndex(player => player.name === playerName);

  if (playerIndex !== -1) {
    players[playerIndex].wins = wins;
    players[playerIndex].wlRatio = calculateWLRatio(wins, losses);
    localStorage.setItem('players', JSON.stringify(players));
    wlRatioCell.textContent = players[playerIndex].wlRatio;
  }
}

function onAddLose(e) {
  if (!e.target.classList.contains("lose-btn")) {
    return;
  }
  const loseBtn = e.target;
  const row = loseBtn.closest("tr");
  const lossesCell = row.querySelector("td:nth-child(4)");
  let losses = parseInt(lossesCell.textContent);
  losses++;
  lossesCell.textContent = losses;

  const winsCell = row.querySelector("td:nth-child(5)");
  let wins = parseInt(winsCell.textContent);

  const wlRatioCell = row.querySelector("td:nth-child(5)");
  const playerName = row.querySelector("td:nth-child(1)").textContent;
  const players = JSON.parse(localStorage.getItem('players')) || [];
  const playerIndex = players.findIndex(player => player.name === playerName);

  if (playerIndex !== -1) {
    players[playerIndex].losses = losses;
    players[playerIndex].wlRatio = calculateWLRatio(wins, losses);
    localStorage.setItem('players', JSON.stringify(players));
    wlRatioCell.textContent = players[playerIndex].wlRatio;
  }
}


document.getElementById('draw-button').addEventListener('click', onAddDraw);
function onAddDraw() {
  const winnerSelect = document.getElementById('winner-select');
  const loserSelect = document.getElementById('loser-select');

  const winnerName = winnerSelect.value;
  const loserName = loserSelect.value;

  if (winnerName === '' || loserName === '' || winnerName === loserName) {
    alert('Please select 2 valid players that drew their match.');
    return;
  }

  const players = JSON.parse(localStorage.getItem('players')) || [];
  const winner = players.find(player => player.name === winnerName);
  const loser = players.find(player => player.name === loserName);

  if (!winner || !loser) {
    alert('Error: Player not found.');
    return;
  }

  // Update ELO ratings
  calculateEloRating(winner, loser, 0.5); // Draw result = 0.5
  calculateEloRating(loser, winner, 0.5); // Draw result = 0.5

  // Update player's draws
  winner.draws++;
  loser.draws++;

  // Update win/loss/draw ratio
  if (winner.losses === 0) {
    winner.wlRatio = winner.wins.toFixed(2);
  } else {
    winner.wlRatio = (winner.wins / winner.losses).toFixed(2);
  }

  if (loser.losses === 0) {
    loser.wlRatio = loser.wins.toFixed(2);
  } else {
    loser.wlRatio = (loser.wins / loser.losses).toFixed(2);
  }

  winner.wlRatio = (winner.wins / (winner.wins + winner.losses + winner.draws) * 100).toFixed(2);
  loser.wlRatio = (loser.wins / (loser.wins + loser.losses + loser.draws) * 100).toFixed(2);

  // Save updated players to local storage
  localStorage.setItem('players', JSON.stringify(players));

  // Clear winner and loser selects
  winnerSelect.value = '';
  loserSelect.value = '';

  // Reload the page to reflect the changes in the leaderboard table
  location.reload();
}

function calculateWLRatio(wins, losses) {
  if (losses === 0) {
    return wins.toFixed(2);
  } else {
    return (wins / losses).toFixed(2);
  }
}

function onDeleteRow(e) {
  if (!e.target.classList.contains("delete-btn")) {
    return;
  }

  const delBtn = e.target;
  const row = delBtn.closest('tr');
  const playerName = row.querySelector('td:nth-child(1)').textContent;
  
  const shouldDelete = confDel(playerName);

  if (shouldDelete) {
    row.remove();

    // Remove player from localStorage
    const players = JSON.parse(localStorage.getItem('players'));
    const updatedPlayers = players.filter(player => player.name !== playerName);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  }
}

tableEl.addEventListener('click', onAddWin);
tableEl.addEventListener('click', onAddLose);
tableEl.addEventListener('click', onDeleteRow);

// Function to calculate ELO rating
function calculateEloRating(player1, player2, result) {
  const k = 32; // K-factor for ELO calculation
  const expectedScorePlayer1 = 1 / (1 + Math.pow(10, (player2.elo - player1.elo) / 400));
  const expectedScorePlayer2 = 1 / (1 + Math.pow(10, (player1.elo - player2.elo) / 400));

  // Update player1's ELO rating
  player1.elo = player1.elo + k * (result - expectedScorePlayer1);
  player1.elo = Math.round(player1.elo);

  // Update player2's ELO rating
  player2.elo = player2.elo + k * ((1 - result) - expectedScorePlayer2);
  player2.elo = Math.round(player2.elo);
}

// Add event listener to form submit
const form = document.getElementById('result-form');
form.addEventListener('submit', onSubmitForm);

// Function to handle form submission
function onSubmitForm(e) {
  e.preventDefault();
  const winnerSelect = document.getElementById('winner-select');
  const loserSelect = document.getElementById('loser-select');

  // Grab value of winner and loser
  const winnerName = winnerSelect.value;
  const loserName = loserSelect.value;
  if (winnerName === '' || loserName === '' || winnerName === loserName) {
    alert('Please select a valid winner and loser.');
    return;
  }
  const players = JSON.parse(localStorage.getItem('players')) || [];
  const winner = players.find(player => player.name === winnerName);
  const loser = players.find(player => player.name === loserName);
  if (!winner || !loser) {
    alert('Error: Player not found.');
    return;
  }

  // Update ELO ratings
  calculateEloRating(winner, loser, 1); // Winner's result = 1
  calculateEloRating(loser, winner, 0); // Loser's result = 0

  // Update player's wins and losses
  winner.wins++;
  loser.losses++;

  // Win Rate Formulas
  winner.wlRatio = (winner.wins / (winner.wins + winner.losses + winner.draws) * 100).toFixed(2);
  loser.wlRatio = (loser.wins / (loser.wins + loser.losses + loser.draws) * 100).toFixed(2);

  // Store winner and loser in an array in localStorage
  const matches = JSON.parse(localStorage.getItem('matches')) || [];
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = currentDate.getFullYear();
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  let ampm = 'am';
  // Convert to 12-hour format and determine AM/PM
  if (hours >= 12) {
    ampm = 'pm';
    if (hours > 12) {
      hours -= 12;
    }
  }
  if (hours === 0) {
    hours = 12;
  }
  const formattedTimestamp = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year + ' ' + ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ampm;
  const match = {
    winner: winnerName,
    loser: loserName,
    timestamp: formattedTimestamp
  };
  matches.push(match);
  localStorage.setItem('matches', JSON.stringify(matches));

  // Save updated players to local storage
  localStorage.setItem('players', JSON.stringify(players));

  // Clear winner and loser selects
  winnerSelect.value = '';
  loserSelect.value = '';

  // Reload the page to reflect the changes in the leaderboard table
  location.reload();
}



// Hidden button sequence for developer buttons
const hiddenButtonSequence = ['1', '2', '3', 'a', 'd'];
// Keep track of the user's input
let userInput = [];
// Variable to keep track of whether the hidden buttons are visible or not
let hiddenButtonsVisible = false;
// Add event listener to listen for key presses
document.addEventListener('keydown', function (event) {
  // Check if the pressed key matches the next key in the hidden button sequence
  if (event.key === hiddenButtonSequence[userInput.length]) {
    // Add the pressed key to the user's input
    userInput.push(event.key);
    // Check if the user's input matches the hidden button sequence
    if (userInput.join('') === hiddenButtonSequence.join('')) {
      // If the hidden buttons are not visible, show them
      if (!hiddenButtonsVisible) {
        // Trigger the hidden buttons container by changing its display property to 'block'
        document.getElementById('secret-buttons').style.display = 'block';
        // Set hiddenButtonsVisible to true
        hiddenButtonsVisible = true;
      } else {
        // If the hidden buttons are already visible, hide them
        // Trigger the hidden buttons container by changing its display property to 'none'
        document.getElementById('secret-buttons').style.display = 'none';
        // Set hiddenButtonsVisible to false
        hiddenButtonsVisible = false;
      }
      // Clear the user's input
      userInput = [];
    }
  } else {
    // If the pressed key does not match the next key in the hidden button sequence, reset the user's input
    userInput = [];
  }
});


//Clear LocalStorage code
document.getElementById('clear-btn').addEventListener('click', onClearLocalStorage);
function onClearLocalStorage() {
  localStorage.clear();
  location.reload();
}

//Code for displaying empty table message
window.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('leaderboard-table');
  const emptyStateMessage = document.createElement('span');
  // emptyStateMessage.className = 'empty-state';
  emptyStateMessage.textContent = 'No data available. Add a player to get started!';
  if (table.rows.length <= 1) {
    document.querySelector('.leaderboard-div').appendChild(emptyStateMessage);
  }
});


// Function to save players data to a text file
function saveDataToTxtFile() {
  const players = JSON.parse(localStorage.getItem('players')) || [];
  const data = JSON.stringify(players, null, 2);
  const blob = new Blob([data], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'players.txt';
  downloadLink.click();
}

// Function to load players data from a text file
function loadDataFromTxtFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const data = event.target.result;
    const players = JSON.parse(data);
    localStorage.setItem('players', JSON.stringify(players));
    location.reload();
  };
  reader.readAsText(file);
}

// Add event listener to save button
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', saveDataToTxtFile);

// Add event listener to load button
const loadBtn = document.getElementById('load-btn');
loadBtn.addEventListener('click', function () {
  document.getElementById('load-file').click();
});

// Add event listener to file input
const loadFileInput = document.getElementById('load-file');
loadFileInput.addEventListener('change', loadDataFromTxtFile);

document.getElementById('seed-data-btn').addEventListener('click', onSeedDataButtonClick);
// Function to seed localStorage with initial player data
function seedLocalStorageData() {
  // Create an array of player objects with initial win/loss data
  const players = [
    { name: 'Nikil Deo', elo: 1200, wins: 1, losses: 0, draws: 0, wlRatio: 100 },
    { name: 'Adrian Chan', elo: 1000, wins: 4, losses: 1, draws: 0, wlRatio: 80 },
    { name: 'Aaron Calbert', elo: 800, wins: 1, losses: 2, draws: 0, wlRatio: 33.33 },
    { name: 'Chali Tillikaratne', elo: 1100, wins: 2, losses: 1, draws: 0, wlRatio: 66.66 }
  ];

  // Store the player data in localStorage
  localStorage.setItem('players', JSON.stringify(players));
}

// Function to handle button click event for seeding localStorage data
function onSeedDataButtonClick() {
  // Call the seedLocalStorageData function to seed localStorage data
  seedLocalStorageData();
  location.reload();
}

// Populate winner and loser dropdown boxes
const players = JSON.parse(localStorage.getItem('players')) || [];
players.sort((a, b) => a.name.localeCompare(b.name));
const winnerSelect = document.getElementById('winner-select');
const loserSelect = document.getElementById('loser-select');
players.forEach(player => {
  const winnerOption = document.createElement('option');
  const loserOption = document.createElement('option');
  winnerOption.value = player.name;
  winnerOption.textContent = player.name;
  loserOption.value = player.name;
  loserOption.textContent = player.name;
  winnerSelect.appendChild(winnerOption);
  loserSelect.appendChild(loserOption);
});

// Confirmation message to delete player from table
function confDel(playerName) {
  return confirm(`Are you sure you want to delete ${playerName}?`);
}

//Modal Code
const matchHistoryButton = document.getElementById('matchHistoryButton');
const modal = document.getElementById('modal');
const matchHistoryTableBody = document.querySelector('#matchHistoryTable tbody');
const closeBtn = document.getElementById('close-btn');

matchHistoryButton.addEventListener('click', () => {
  const matches = JSON.parse(localStorage.getItem('matches')) || [];
  populateMatchHistoryTable(matches);
  modal.showModal();
});
modal.addEventListener('click', (e) => {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close();
  }
});
closeBtn.addEventListener('click', function() {
  modal.close();
});


// Function to populate the match history table
function populateMatchHistoryTable(matches) {
  matchHistoryTableBody.innerHTML = '';

  matches.forEach((match) => {
    const row = document.createElement('tr');
    const mhCell = document.createElement('td');

    mhCell.textContent = match.timestamp + " - " + match.winner + " has won against " + match.loser + "!";

    row.appendChild(mhCell);

    matchHistoryTableBody.insertBefore(row, matchHistoryTableBody.firstChild);
  });
}