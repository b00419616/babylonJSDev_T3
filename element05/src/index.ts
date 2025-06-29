import "@babylonjs/core/Audio/audioEngine";
import { Engine } from "@babylonjs/core";
import { scene, initScenes } from "./createScenes";
import guiScene from "./guiScene";
import "./main.css";

// Create and attach canvas
const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
document.body.appendChild(canvas);

// Single Engine instance with audio
const engine = new Engine(canvas, true, { audioEngine: true }, true);

// Initialise all 4 scenes and load the first one
initScenes(engine);

// Create GUI overlay scene (scene switch buttons)
const gui = guiScene(engine);
gui.autoClear = false;

// Render loop: render both current main scene and GUI overlay
engine.runRenderLoop(() =>
{
    scene.render();
    gui.render();
});
