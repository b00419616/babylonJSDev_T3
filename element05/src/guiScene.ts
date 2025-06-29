import { Engine, Scene, ArcRotateCamera, Vector3 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { setSceneIndex } from "./createScenes";

function createSceneButton(name: string, index: number, x: string, y: string, advtex: GUI.AdvancedDynamicTexture): GUI.Button
{
    const button = GUI.Button.CreateSimpleButton(name, name);
    button.left = x;
    button.top = y;
    button.width = "80px";
    button.height = "30px";
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "green";
    button.onPointerUpObservable.add(() =>
    {
        setSceneIndex(index);
    });
    advtex.addControl(button);
    return button;
}

export default function guiScene(engine: Engine): Scene
{
    const guiScene = new Scene(engine);
    new ArcRotateCamera("guiCam", 0, 0.8, 100, Vector3.Zero(), guiScene);

    const advTex = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true);

    createSceneButton("Scene 1", 0, "-150px", "120px", advTex);
    createSceneButton("Scene 2", 1, "-50px", "120px", advTex);
    createSceneButton("Scene 3", 2, "50px", "120px", advTex);
    createSceneButton("Scene 4", 3, "150px", "120px", advTex);

    return guiScene;
}
