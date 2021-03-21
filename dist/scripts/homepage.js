const electron = require("electron");

const { ipcRenderer } = electron;

let getButton = document.getElementById("get-btn");
const resultDiv = document.getElementById("result-div");
const resultText = document.getElementById("result-text");

resultDiv.style.display = "none";

getButton.addEventListener("click", () => {
  let coinName = document.getElementById("coin-name-input").value;
  let mainCurrency = document.getElementById("main-currency-name-input").value;

  let message = coinName + mainCurrency;

  ipcRenderer.send("message", message);
});

ipcRenderer.on("result", (err, data) => {
  resultDiv.style.display = "inline";
  resultText.innerText = data + "$";
});
