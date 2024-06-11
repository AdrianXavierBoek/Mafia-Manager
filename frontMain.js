document.addEventListener("DOMContentLoaded", (event) => {
  // Listen for a call from the bridge - this function is called when the main process has loaded data
  window.Bridge.loadData((event, data) => {
    data.forEach((player) =>
      addPlayerToDOM(player.name, player.role, player.status)
    );
    // Call aliveMafiaCount after loading data to update the count
    aliveMafiaCount();
    reorderPlayers();
  });
});

// Function to add a player to the DOM from initial data
function addPlayerToDOM(name, role, status) {
  const playerList = document.getElementById("player-list");
  const newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `
  <input type="text" tabindex="1" oninput="savePlayerData();" placeholder="Player Name" value="${name}">
  <select id="roleSelect" tabindex="2" onchange="aliveMafiaCount(); savePlayerData();">
  <option value="Choose role" ${role === "role" ? "selected" : ""}>Choose role</option>
      <option value="Mafia" ${role === "Mafia" ? "selected" : ""}>Mafia</option>
      <option value="Lege" ${role === "Lege" ? "selected" : ""}>Lege</option>
      <option value="Borger" ${role === "Borger" ? "selected" : ""}>Borger</option>
      <option value="Detektiv" ${role === "Detektiv" ? "selected" : ""}>Detektiv</option>
  </select>
  <div class="status-toggle">
      <label>Status:</label>
      <label class="toggle-switch">
          <input type="checkbox" onchange="toggleStatus(this); aliveMafiaCount(); savePlayerData(); reorderPlayers();" ${status ? "checked" : ""}>
          <span class="toggle-slider"></span>
      </label>
  </div>
  <button class="delete-player" onclick="deletePlayer(this); aliveMafiaCount(); reorderPlayers();"><i class="fi fi-sr-trash"></i></button>
`;
  playerList.appendChild(newPlayerBox);

  // Remove the fade-in class after animation ends
  setTimeout(() => newPlayerBox.classList.remove('fade-in'), 500);
  
  // Call aliveMafiaCount after adding a player to update the count
  aliveMafiaCount();
  reorderPlayers();
}

// Function to handle player deletion
function deletePlayer(element) {
  element.parentElement.remove();
  // Call aliveMafiaCount after deleting a player to update the count
  aliveMafiaCount();
  savePlayerData();
  reorderPlayers();
}

// Add event listener for player deletion
document.getElementById("player-list").addEventListener("click", function (event) {
    if (event.target && event.target.className === "delete-player") {
      event.target.parentElement.remove();
      // Call aliveMafiaCount after deleting a player to update the count
      aliveMafiaCount();
      reorderPlayers();
    }
  });

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
  if (mafiaCount != null) {
    var Mcount = document.getElementById("mafiaCount");
    Mcount.textContent = "Mafia alive: " + mafiaCount;
    Mcount.style.display = "block";
    var Pcount = document.getElementById("playerCount");
    Pcount.textContent = "Citizens alive: " + citizens;
    Pcount.style.display = "block";
  }
}

var playerCount = 1; // Initial player count

// Add event listener for the "Add Player" button
document.getElementById("add-player").addEventListener("click", function () {
  var playerList = document.getElementById("player-list");
  var newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box", "fade-in");
  newPlayerBox.innerHTML = `
  <input type="text" tabindex="1" oninput="savePlayerData();" placeholder="Player Name" name="spillerNavn${playerCount}">
  <select id="roleSelect" tabindex="2" onchange="aliveMafiaCount(); savePlayerData();">
      <option value="Choose role">Choose role</option>
      <option value="Mafia">Mafia</option>
      <option value="Lege">Lege</option>
      <option value="Borger">Borger</option>
      <option value="Detektiv">Detektiv</option>
  </select>
  <div class="status-toggle gap-1">
      <label>Status:</label>
      <label class="toggle-switch">
          <input type="checkbox" onchange="toggleStatus(this); reorderPlayers(); aliveMafiaCount(); savePlayerData(); ">
          <span class="toggle-slider"></span>
      </label>
  </div>
  <button class="delete-player" onclick="deletePlayer(this); aliveMafiaCount(); reorderPlayers();"><i class="fi fi-sr-trash"></i></button>
  `;
  playerList.insertBefore(newPlayerBox, playerList.firstChild);

  playerCount++; // Increment player count for the next player

  // Remove the fade-in class after animation ends
  setTimeout(() => newPlayerBox.classList.remove('fade-in'), 500);

  // Call aliveMafiaCount after deleting a player to update the count
  reorderPlayers();
  aliveMafiaCount();
  savePlayerData(); 
});

// Function to reorder players based on their status (alive or dead)
function reorderPlayers() {
  console.log("Reorder players is called");
  const playerList = document.getElementById("player-list");
  const playerBoxes = Array.from(playerList.children);

  playerBoxes.sort((a, b) => {
    const aStatus = a.querySelector("input[type='checkbox']").checked;
    const bStatus = b.querySelector("input[type='checkbox']").checked;
    return aStatus - bStatus;
  });

  console.log('Reordering players:', playerBoxes.map(box => ({
    name: box.querySelector("input[type='text']").value,
    status: box.querySelector("input[type='checkbox']").checked
  })));

  // Append the reordered player boxes without the fade-in class
  playerBoxes.forEach(box => playerList.appendChild(box));
}

function toggleStatus(checkbox) {
  const playerBox = checkbox.closest('.player-box');
  if (checkbox.checked) { // If the player is marked as dead
    playerBox.classList.add('fade-in');
    setTimeout(() => playerBox.classList.remove('fade-in'), 500); // Remove fade-in after animation ends
  }
  aliveMafiaCount();
  reorderPlayers();
  savePlayerData();
}

let showRoles = true;
function hideRolesToggle() {
  let roleElements = document.querySelectorAll('#roleSelect');

  let element = document.querySelector('#hide-roles');
  let hiddenIcon = element.querySelector('.hide');
  let shownIcon = element.querySelector('.show');

  function iconToggle() {
    shownIcon.classList.remove('show');
    shownIcon.classList.add('hide');
    hiddenIcon.classList.remove('hide');
    hiddenIcon.classList.add('show');
  }
  if (showRoles === true) {
    showRoles = false;
    iconToggle();
    roleElements.forEach((el) => el.classList.add('hide'));
  } else {
    showRoles = true;
    iconToggle();
    roleElements.forEach((el) => el.classList.remove('hide'));
  }
}