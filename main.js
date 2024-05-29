const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs").promises;

//Create main window
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preloader.js"), // corrected path
    },
  });

  mainWindow.loadFile("index.html");

  // Load data from data.json and send it to the renderer process
  fs.readFile("data/data.json", "utf-8")
    .then((data) => {
      mainWindow.webContents.send("initialData", JSON.parse(data));
    })
    .catch((err) => console.error(err));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

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
