const { contextBridge, ipcRenderer } = require("electron");

// ipcRenderer.on("initialData", (evt, data) => {
//   console.log(data)
// })

contextBridge.exposeInMainWorld("Bridge", {
  loadData: (channel, data) => {
    ipcRenderer.on(channel, (event, ...args) => data(...args))
  },

  // sends player data to main process
  saveData: (playerDataArray) => {
    ipcRenderer.send("saveData", playerDataArray);
  }
});
