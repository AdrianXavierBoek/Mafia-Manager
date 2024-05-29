document.addEventListener("DOMContentLoaded", (event) => {
  window.Bridge.loadData("initialData", data => {
    console.log("Initial data loaded")
    for (let i = 0; i > data.length; i++) {
      addPlayerToDOM(data[i].name, data[i].role, data[i].status);
    }
  })
});

// Function to add a player to the DOM from initial data
function addPlayerToDOM(name, role, status) {
  var playerList = document.getElementById("player-list");
  var newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `
    <input type="text" placeholder="Player Name" value="${name}">
    <select>
        <option value="Mafia" ${role === "Mafia" ? "selected" : ""}>Mafia</option>
        <option value="Lege" ${role === "Lege" ? "selected" : ""}>Lege</option>
        <option value="Borger" ${role === "Borger" ? "selected" : ""}>Borger</option>
        <option value="Detektiv" ${role === "Detektiv" ? "selected" : ""}>Detektiv</option>
    </select>
    <div class="status-toggle">
        <label>Status:</label>
        <label class="toggle-switch">
            <input type="checkbox" ${status ? "checked" : ""}>
            <span class="toggle-slider"></span>
        </label>
    </div>
    <button class="delete-player">Delete</button>
  `;
  playerList.appendChild(newPlayerBox);
}


//function for saving player data to data.json
function savePlayerData() {
    let playerBoxes = document.querySelectorAll(".player-box");
    let playerDataArray = [];

    playerBoxes.forEach(function (playerBox) {
      let name = playerBox.querySelector("input[type='text']").value;
      let role = playerBox.querySelector("select").value;
      let status = playerBox.querySelector("input[type='checkbox']").checked;

      playerDataArray.push({name, role, status});
    });

    console.log(playerDataArray)

    //sends player data to preloader
    window.Bridge.saveData(playerDataArray);

  }

  var playerCount = 1; // Initial player count

  // Add event listener for the "Add Player" button
  document
    .getElementById("add-player")
    .addEventListener("click", function () {
      var playerList = document.getElementById("player-list");
      var newPlayerBox = document.createElement("div");
      newPlayerBox.classList.add("player-box");
      newPlayerBox.innerHTML = `
          <input type="text" placeholder="Player Name" name="spillerNavn${playerCount}">
          <select>
              <option value="Mafia">Mafia</option>
              <option value="Lege">Lege</option>
              <option value="Borger">Borger</option>
              <option value="Detektiv">Detektiv</option>
          </select>
          <div class="status-toggle">
              <label>Status:</label>
              <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
              </label>
          </div>
          <button class="delete-player">Delete</button>
      `;
      playerList.appendChild(newPlayerBox);

      playerCount++; // Increment player count for the next player
    });


    
  // Add event listener for player deletion
  document
    .getElementById("player-list")
    .addEventListener("click", function (event) {
      if (event.target && event.target.className === "delete-player") {
        event.target.parentElement.remove();
        //savePlayerInfo(); // Save player info after deletion
      }
    });