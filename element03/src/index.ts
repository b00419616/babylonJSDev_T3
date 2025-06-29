import { Engine } from "@babylonjs/core";
import createStartScene from "./createStartScene";
import './main.css';
import "@babylonjs/loaders/glTF";
const CanvasName = "renderCanvas";
console.log("Running index.ts from element03");
let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);
//console.log("Canvas appended:", canvas);
//canvas.style.border = "2px solid red";
let eng = new Engine(canvas, true, {}, true);
let startScene = createStartScene(eng);
eng.runRenderLoop(() => {
    startScene.scene.render();
});                  
