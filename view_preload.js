const { ipcRenderer } = require("electron")
const settings = require("./settings");

window.alert = (text) => {
    ipcRenderer.sendSync("alert", text);
}

window.prompt = null;

carbonAPI = {};

carbonAPI.getSearchEngine = () => {
    return settings.readKeyFromFile("general.conf.json", "searchEngine");
}

carbonAPI.getVersion = () => {
    return ipcRenderer.sendSync("getVersion");
}

carbonAPI.getSearchString = () => {
    return ipcRenderer.sendSync("searchString");
}

function isHomePage() {
    console.log(location.href);
    var homeURL = ipcRenderer.sendSync("getHomeURL");
    console.log(homeURL);
    if (new URL(homeURL).href == new URL(location.href).href) {
        return true;
    } else {
        return false;
    }
}

carbonAPI.getHistory = () => {
    return new Promise((resolved) => {
        if (isHomePage()) {
            const data = JSON.parse(settings.readData("history.json", "{}"));
            resolved(data);
        }
    });
}

carbonAPI.clearHistory = () => {
    if(isHomePage()) {
        settings.saveData("history.json", "{}");
    }
}

carbonAPI.experimental = {}

const ColorThief = require('colorthief');

carbonAPI.experimental.ColorThief = ColorThief;

function wc_hex_is_light(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}

carbonAPI.experimental.wc_hex_is_light = wc_hex_is_light;

console.log("Gutten tag! Preload loaded");
