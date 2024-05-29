const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Bridge", {
  // Handler for receiving initial data
  receiveInitialData: (handler) => {
    ipcRenderer.on("initialData", (event, data) => handler(data));
  },
  // Handler for saving data
  saveData: (playerDataArray) => {
    ipcRenderer.send("saveData", playerDataArray);
  }
});
