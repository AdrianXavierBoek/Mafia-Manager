const { app, BrowserWindow, Tray, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

//Create main window
let mainWindow;

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

  mainWindow.loadFile("index.html");

  fs.readFile("data/data.json", "utf8", (error, data) => {
    if (error) {
      console.error("Could not read JSON data", error)
    } else {
      mainWindow.webContents.send("initialData", JSON.parse(data));
    }
  })
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
