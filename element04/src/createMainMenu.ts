// ========================
// Imports
// ========================
import {
  Scene,
  FreeCamera,
  Vector3,
  MeshBuilder,
  CubeTexture,
  Engine,
  StandardMaterial,
  Texture,
  SceneLoader,
} from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import createStartScene from "./createStartScene";

// ========================
// Helper Functions
// ========================

export function createStartButton(engine: Engine): GUI.Button {

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const button = GUI.Button.CreateSimpleButton("startBtn", "Start Game");
    button.width = "150px";
    button.height = "40px";
    button.color = "red";
    button.background = "black";
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    button.onPointerUpObservable.add(() => {
  Engine.audioEngine?.unlock();   // now the real AudioEngine is unlocked
  console.log("Audio unlocked via menu click");
  switchToGame(engine);
});


    advancedTexture.addControl(button);
    
    return button;
}

function createSkybox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skybox", { size: 5000 }, scene);
  const mat = new StandardMaterial("skyboxMat", scene);
  mat.backFaceCulling = false;

  const texture = new CubeTexture("/textures/skybox/skybox", scene);
  mat.reflectionTexture = texture;
  mat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  mat.disableLighting = true;
  skybox.material = mat;

  console.log("Skybox created:", skybox);
  console.log("Skybox material:", skybox.material);
  return skybox;
}

function createMainMenuCamera(scene: Scene): FreeCamera {
  const camera = new FreeCamera("menuCamera", new Vector3(0, 10, -30), scene);
  camera.setTarget(new Vector3(0, 10, 0)); // Looks at the menu area
  camera.inputs.clear(); // Disable all user input
  return camera;
}

function switchToGame(engine: Engine)
{
    const gameScene = createStartScene(engine);
    engine.runRenderLoop(() => {
        gameScene.scene.render();
    });
}

// ========================
// Main Scene Setup
// ========================

export default function createMainMenu(engine: Engine) {
    
    const scene = new Scene(engine);
    const skybox = createSkybox(scene);
    const camera = createMainMenuCamera(scene);
    const startButton = createStartButton(engine);
    
    return { scene,skybox,camera,startButton};
  
};
