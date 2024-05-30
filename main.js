const { app, BrowserWindow, Tray, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");


/*
// Create data directory
const directoryPath = path.join(__dirname, 'data');

if (!fs.existsSync(directoryPath)){
  fs.mkdirSync(directoryPath);
}

// Create data file
const filePath = path.join(directoryPath, 'data.json');

fs.writeFile(filePath, (err) => {
  if (err) throw err;
  console.log('data.json file created successfully!');
});
*/

//Create main window
let mainWindow;

// Load saved data from a JSON file
function loadData() {
  fs.readFile("data/data.json", "utf-8", (err, data) => {
    if (err) {
      console.error('Cannot load data', err)
    } else {
      // Send the data to the bridge
      mainWindow.webContents.send("loadData", JSON.parse(data))
    }
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preloader.js"), 
    },
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadFile("index.html")
    .then(() => loadData())
    .then(() => mainWindow.show())
    .catch(e => console.error('Could not load main window', e))
}


app.on("ready", createWindow);




//recive player data from preloader and write to data.json
ipcMain.on("saveData", (sender, data) => {
  console.log(data);
  let sData = JSON.stringify(data);
  fs.writeFileSync("data/data.json", sData);
  console.log("Data Saved");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
