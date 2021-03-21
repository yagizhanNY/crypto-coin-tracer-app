"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var data = "";
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        darkTheme: true,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        title: "Coin Tracer App",
        icon: path_1.default.join(__dirname, "assets/img/btc-icon.png")
    });
    win.loadFile("./pages/index.html");
}
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length == 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform != "darwin") {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.on("message", function (err, message) {
    //console.log("Message: ", message);
    http_1.default.get("http://localhost:5000/" + message, function (response) {
        response.on("data", function (responseData) {
            //console.log(responseData);
            data = responseData;
        });
        response.on("error", function (error) {
            console.error(error);
        });
        response.on("end", function () {
            //console.log("Data: ", data);
            httpCallback(data);
        });
    }).end();
});
function httpCallback(data) {
    var jsonData = JSON.parse(data);
    win.webContents.send("result", jsonData.price);
}
