import "@babylonjs/core/Audio/audioEngine";
import { Engine } from "@babylonjs/core";
import createMainMenu from "./createMainMenu";
import "./main.css";

const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
document.body.appendChild(canvas);

// Only one Engine, with audio enabled
let engine = new Engine(canvas, true, { audioEngine: true }, true);

const mainMenu = createMainMenu(engine);
engine.runRenderLoop(() => {
  mainMenu.scene.render();
});
