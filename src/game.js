if (!document.getElementById) document.write('<link rel="stylesheet" type="text/css" href="./style.css">');
import { initView, drawGame } from "./gameOfLife/view.js";
import { Model } from "./gameOfLife/model.js";
import { controllerStart, controllerStop, controllerReset } from "./gameOfLife/controller.js";

initView();

const model = new Model();

model.init();
drawGame(model);

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

startButton.addEventListener("click", () => {
    console.log("start clicked");
    controllerStart(model);
})

stopButton.addEventListener("click", () => {
    console.log("stop clicked");
    controllerStop(model);
})

resetButton.addEventListener("click", () => {
    console.log("reset clicked");
    controllerReset(model);
})