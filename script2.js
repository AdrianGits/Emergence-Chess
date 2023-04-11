
const newPlayerFormEl = document.querySelector('#new-player-form');
const tbodyEl = document.querySelector('tbody');
const tableEl = document.querySelector('table');
const ratingHeader = document.getElementById("rating-header");
const ratingArrow = document.getElementById("rating-arrow");

ratingHeader.addEventListener("click", sortTable);






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
  
function onAddPlayer(e) {
    e.preventDefault();
    const nameInput = document.getElementById('name').value;
    const eloInput = document.getElementById('elo').value;
    const tbodyEl = document.querySelector('#leaderboard-table tbody');
    const newRow = `
      <tr>
        <td></td>
        <td>${nameInput}</td>
        <td>${eloInput}</td>
        <td>0</td>
        <td>0</td>
        <td></td>
        <td>
          <button class="win-btn">Add Win</button>
          <button class="lose-btn">Add Loss</button>
          <button class="delete-btn">Delete</button>
        </td>
      </tr>
    `;
    tbodyEl.insertAdjacentHTML('beforeend', newRow);
  
    // Add event listeners to new row
    const winBtn = tbodyEl.querySelector('tr:last-child .win-btn');
    const loseBtn = tbodyEl.querySelector('tr:last-child .lose-btn');
    const deleteBtn = tbodyEl.querySelector('tr:last-child .delete-btn');
    winBtn.addEventListener('click', onAddWin);
    loseBtn.addEventListener('click', onAddLose);
    deleteBtn.addEventListener('click', onDeleteRow);
  
    // Save player to local storage
    const player = {
      name: nameInput,
      elo: eloInput,
      wins: 0,
      losses: 0
    };
    const players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : [];
    players.push(player);
    localStorage.setItem('players', JSON.stringify(players));
    // Clear input fields
    document.getElementById('name').value = '';
    location.reload();
  }


// Load players from local storage and display them in the table
document.addEventListener('DOMContentLoaded', function() {
    const players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : [];
    const tbodyEl = document.querySelector('#leaderboard-table tbody');
    for (const player of players) {
      const newRow = `
        <tr>
          <td></td>
          <td>${player.name}</td>
          <td>${player.elo}</td>
          <td>${player.wins}</td>
          <td>${player.losses}</td>
          <td></td>
          <td>
            <button class="win-btn">Add Win</button>
            <button class="lose-btn">Add Loss</button>
            <button class="delete-btn">Delete</button>
          </td>
        </tr>
      `;
      tbodyEl.insertAdjacentHTML('beforeend', newRow);
    }
  });
  
  

function onAddWin(e) {
    if (!e.target.classList.contains("win-btn")) {
        return;
    }
    const winBtn = e.target;
    const row = winBtn.closest("tr");
    const winsCell = row.querySelector("td:nth-child(4)");
    let wins = parseInt(winsCell.textContent);
    wins++;
    winsCell.textContent = wins;

    const lossesCell = row.querySelector("td:nth-child(5)");
    let losses = parseInt(lossesCell.textContent);

    const wlRatioCell = row.querySelector("td:nth-child(6)");
    wlRatioCell.textContent = calculateWLRatio(wins, losses);
}

function onAddLose(e) {
    if (!e.target.classList.contains("lose-btn")) {
        return;
    }
    const loseBtn = e.target;
    const row = loseBtn.closest("tr");
    const loseCell = row.querySelector("td:nth-child(5)");
    let lose = parseInt(loseCell.textContent);
    lose++;
    loseCell.textContent = lose;

    const winsCell = row.querySelector("td:nth-child(4)");
    let wins = parseInt(winsCell.textContent);

    const wlRatioCell = row.querySelector("td:nth-child(6)");
    wlRatioCell.textContent = calculateWLRatio(wins, lose);
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
    const playerName = row.querySelector('td:nth-child(2)').textContent;
    row.remove();

    // Remove player from localStorage
    const players = JSON.parse(localStorage.getItem('players'));
    const updatedPlayers = players.filter(player => player.name !== playerName);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
}

window.onload = function () {
    sortTable();
};

newPlayerFormEl.addEventListener('submit', onAddPlayer);
tableEl.addEventListener('click', onAddWin);
tableEl.addEventListener('click', onAddLose);
tableEl.addEventListener('click', onDeleteRow);

























//Clear LocalStorage code
document.getElementById('clear-btn').addEventListener('click', onClearLocalStorage);
function onClearLocalStorage() {
    localStorage.clear();
    location.reload();
}


/*
// Old onAddPlayer function (pre-localstorage)
// function onAddPlayer(e) {
//         e.preventDefault();
//         const nameInput = document.getElementById('name').value;
//         const eloInput = document.getElementById('elo').value;
//         const tbodyEl = document.querySelector('#leaderboard-table tbody');
//         const newRow = `
//           <tr>
//             <td></td>
//             <td>${nameInput}</td>
//             <td>${eloInput}</td>
//             <td>0</td>
//             <td>0</td>
//             <td></td>
//             <td>
//               <button class="win-btn">Add Win</button>
//               <button class="lose-btn">Add Loss</button>
//               <button class="delete-btn">Delete</button>
//             </td>
//           </tr>
//         `;
//         tbodyEl.insertAdjacentHTML('beforeend', newRow);
    
//         // Add event listeners to new row
//         const winBtn = tbodyEl.querySelector('tr:last-child .win-btn');
//         const loseBtn = tbodyEl.querySelector('tr:last-child .lose-btn');
//         const deleteBtn = tbodyEl.querySelector('tr:last-child .delete-btn');
//         winBtn.addEventListener('click', onAddWin);
//         loseBtn.addEventListener('click', onAddLose);
//         deleteBtn.addEventListener('click', onDeleteRow);
//         document.getElementById('name').value = '';
// }

// function onDeleteRow(e) {
//     if (!e.target.classList.contains("delete-btn")) {
//         return;
//     }
//     const delBtn = e.target;
//     delBtn.closest('tr').remove();
// }

*/