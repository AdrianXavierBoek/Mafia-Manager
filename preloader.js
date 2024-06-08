const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Bridge", {
  // This function is called from the main process when data is loaded from the JSON storage
  loadData: (fn, data) => {
    ipcRenderer.on('loadData', fn, data)
  },

  // sends player data to main process
  saveData: (playerDataArray) => {
    ipcRenderer.send("saveData", playerDataArray);
  },

  // opens the settings page in the main process
  SettingsPage: () => {
    ipcRenderer.send("SettingsPage");
  }
});
