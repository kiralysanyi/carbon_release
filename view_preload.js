const {ipcRenderer} = require("electron")
const settings = require("./settings");

window.alert = (text) => {
    ipcRenderer.sendSync("alert", text);
}

carbonAPI = {};

carbonAPI.getSearchEngine = () => {
    return settings.readKeyFromFile("general.conf.json", "searchEngine");
}

carbonAPI.getVersion = () => {
    return ipcRenderer.sendSync("getVersion");
}

console.log("Gutten tag! Preload loaded");