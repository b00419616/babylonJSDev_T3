import createScene1 from "./createScene1";
import createScene2 from "./createScene2";
import createScene3 from "./createScene3";
import createMainMenu from "./createMainMenu";
//import createScene4 from "./createScene4";

import { Engine, Scene } from "@babylonjs/core";

export let scene: Scene;
export let engine: Engine;
let scenes: { scene: Scene }[] = [];

export function initScenes(e: Engine): void
{
    engine = e;
    scenes[0] = createScene1(engine);
    scenes[1] = createScene2(engine);
    scenes[2] = createScene3(engine);
    scenes[3] = createMainMenu(engine);
    scene = scenes[0].scene;
}

export function setSceneIndex(i: number): void
{
    scene = scenes[i].scene;
}
