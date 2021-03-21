import {app, BrowserWindow, ipcMain} from "electron";
import path from "path";
import http from "http";

let data = "";
let win : BrowserWindow;

function createWindow(){
    win = new BrowserWindow({
        darkTheme: true,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        title: "Coin Tracer App",
        icon: path.join(__dirname, "assets/img/btc-icon.png")
    })

    win.loadFile("./pages/index.html");
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length == 0){
            createWindow();
        }
    })
})

app.on("window-all-closed", () => {
    if(process.platform != "darwin"){
        app.quit();
    }
})

ipcMain.on("message", (err, message) => {
    //console.log("Message: ", message);

    http.get(`http://localhost:5000/${message}`, (response) => {
        response.on("data", (responseData) => {
            //console.log(responseData);
            data = responseData;
        })

        response.on("error", (error) => {
            console.error(error);
        })

        response.on("end", () => {
            //console.log("Data: ", data);
            httpCallback(data);
        })
    }).end()
})

function httpCallback(data : string){
    const jsonData = JSON.parse(data);
    win.webContents.send("result", jsonData.price);
}
