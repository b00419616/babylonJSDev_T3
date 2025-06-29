import "@babylonjs/core/Audio/audioEngine";
import { Engine } from "@babylonjs/core";
import { scene, initScenes } from "./createScenes";
import guiScene from "./guiScene";
import "./main.css";
const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
document.body.appendChild(canvas);
const engine = new Engine(canvas, true, { audioEngine: true }, true);
initScenes(engine);
const gui = guiScene(engine);
gui.autoClear = false;
engine.runRenderLoop(() => {
    scene.render();
    gui.render();
});
