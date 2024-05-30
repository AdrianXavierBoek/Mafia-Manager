document.addEventListener("DOMContentLoaded", (event) => {
  // Listen for a call from the bridge - this function is called when the main process has loaded data
  window.Bridge.loadData((event, data) => {
    data.forEach((player) =>
      addPlayerToDOM(player.name, player.role, player.status)
    );
    // Call aliveMafiaCount after loading data to update the count
    aliveMafiaCount();
  });
});

// Function to add a player to the DOM from initial data
function addPlayerToDOM(name, role, status) {
  var playerList = document.getElementById("player-list");
  var newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `
  <input type="text" placeholder="Player Name" value="${name}">
  <select onchange="aliveMafiaCount()">
  <option value="Choose role" ${role === "role" ? "selected" : ""
    }>Choose role</option>
      <option value="Mafia" ${role === "Mafia" ? "selected" : ""
    }>Mafia</option>
      <option value="Lege" ${role === "Lege" ? "selected" : ""}>Lege</option>
      <option value="Borger" ${role === "Borger" ? "selected" : ""
    }>Borger</option>
      <option value="Detektiv" ${role === "Detektiv" ? "selected" : ""
    }>Detektiv</option>
  </select>
  <div class="status-toggle">
      <label>Status:</label>
      <label class="toggle-switch">
          <input type="checkbox" onchange="aliveMafiaCount()" ${status ? "checked" : ""}>
          <span class="toggle-slider"></span>
      </label>
  </div>
  <button class="delete-player" onclick="deletePlayer(this); aliveMafiaCount();">Delete</button>
`;
  playerList.appendChild(newPlayerBox);

  // Call aliveMafiaCount after adding a player to update the count
  aliveMafiaCount();
}

// Function to handle player deletion
function deletePlayer(element) {
  element.parentElement.remove();
  // Call aliveMafiaCount after deleting a player to update the count
  aliveMafiaCount();
}

//function for saving player data to data.json
function savePlayerData() {
  let playerBoxes = document.querySelectorAll(".player-box");
  let playerDataArray = [];

  playerBoxes.forEach(function (playerBox) {
    let name = playerBox.querySelector("input[type='text']").value;
    let role = playerBox.querySelector("select").value;
    let status = playerBox.querySelector("input[type='checkbox']").checked;

    playerDataArray.push({ name, role, status });
  });

  console.log(playerDataArray);

  //sends player data to preloader
  window.Bridge.saveData(playerDataArray);


  // Call aliveMafiaCount after saving data to update the count
  aliveMafiaCount();
}

function aliveMafiaCount() {
  let totalPlayers = 0;
  let mafiaCount = 0;
  let citizens = 0;

  // Get all player boxes
  let playerBoxes = document.querySelectorAll(".player-box");

  // Loop through each player box
  playerBoxes.forEach((playerBox) => {
    // Get role and status of each player
    let role = playerBox.querySelector("select").value;
    let status = playerBox.querySelector("input[type='checkbox']").checked;

    // Increment total player count
    totalPlayers++;


    // Check if the player is Mafia and alive
    if (role === "Mafia") {
      mafiaCount++; // Increment Mafia count
      if (status) {
        mafiaCount--;
      }
    }

    // Check if the player is player and alive
    if (role !== "Mafia") {
      citizens++; // Increment Mafia count
      if (status) {
        citizens--;
      }
    }
  });
  

  // Update the mafia and player count in the HTML
  var Mcount = document.getElementById("mafiaCount");
  Mcount.innerHTML = `<h6 id="mafiaCount">Mafia alive: ${mafiaCount}</h6>`;
  var Pcount = document.getElementById("playerCount");
  Pcount.innerHTML = `<h6 id="playerCount">Citizens alive: ${citizens}</h6>`;
}

var playerCount = 1; // Initial player count

// Add event listener for the "Add Player" button
document.getElementById("add-player").addEventListener("click", function () {
  var playerList = document.getElementById("player-list");
  var newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `
  <input type="text" placeholder="Player Name" name="spillerNavn${playerCount}">
  <select onchange="aliveMafiaCount()">
      <option value="Choose role">Choose role</option>
      <option value="Mafia">Mafia</option>
      <option value="Lege">Lege</option>
      <option value="Borger">Borger</option>
      <option value="Detektiv">Detektiv</option>
  </select>
  <div class="status-toggle">
      <label>Status:</label>
      <label class="toggle-switch">
          <input type="checkbox" onchange="aliveMafiaCount()">
          <span class="toggle-slider"></span>
      </label>
  </div>
  <button class="delete-player" onclick="deletePlayer(this); aliveMafiaCount();">Delete</button>
  `;
  playerList.appendChild(newPlayerBox);

  playerCount++; // Increment player count for the next player

  // Call aliveMafiaCount after deleting a player to update the count
  aliveMafiaCount();
});

// Add event listener for player deletion
document
  .getElementById("player-list")
  .addEventListener("click", function (event) {
    if (event.target && event.target.className === "delete-player") {
      event.target.parentElement.remove();
      // Call aliveMafiaCount after deleting a player to update the count
      aliveMafiaCount();
    }
  });