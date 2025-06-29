import { Scene, FreeCamera, Vector3, MeshBuilder, CubeTexture, Engine, StandardMaterial, Texture, } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import createScene4 from "./createScene4";
export function createStartButton(engine) {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const button = GUI.Button.CreateSimpleButton("startBtn", "Start Game");
    button.width = "150px";
    button.height = "40px";
    button.color = "red";
    button.background = "black";
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    button.onPointerUpObservable.add(() => {
        var _a;
        (_a = Engine.audioEngine) === null || _a === void 0 ? void 0 : _a.unlock();
        console.log("Audio unlocked via menu click");
        switchToGame(engine);
    });
    advancedTexture.addControl(button);
    return button;
}
function createSkybox(scene) {
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
function createMainMenuCamera(scene) {
    const camera = new FreeCamera("menuCamera", new Vector3(0, 10, -30), scene);
    camera.setTarget(new Vector3(0, 10, 0));
    camera.inputs.clear();
    return camera;
}
function switchToGame(engine) {
    const gameScene = createScene4(engine);
    engine.runRenderLoop(() => {
        gameScene.scene.render();
    });
}
export default function createMainMenu(engine) {
    const scene = new Scene(engine);
    const skybox = createSkybox(scene);
    const camera = createMainMenuCamera(scene);
    const startButton = createStartButton(engine);
    return { scene, skybox, camera, startButton };
}
;
