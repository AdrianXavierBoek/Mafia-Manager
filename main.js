const { app, BrowserWindow, Tray, ipcMain, ipcRenderer } = require("electron");
const fs = require('fs');
const os = require('os');
const path = require('path');

// Get the home directory of the current user
const homeDirectory = os.homedir();

// Construct the directory path within the user's home directory
const directoryPath = path.join(homeDirectory, 'AppData', 'Local', 'Programs', 'mafiajs', 'data');
if (!fs.existsSync(directoryPath)) {
  // The 'recursive: true' option creates the directory path if any directories in the path do not exist
  fs.mkdirSync(directoryPath, { recursive: true });
}

// Create data file
if(!fs.existsSync(directoryPath, 'data.json')){
  const filePath = path.join(directoryPath, 'data.json');
  const fileContent = '[]';

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) throw err;
    console.log('data.json file created successfully!');
  });
}

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
