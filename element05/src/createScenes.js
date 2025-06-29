import createScene1 from "./createScene1";
import createScene2 from "./createScene2";
import createScene3 from "./createScene3";
import createScene4 from "./createScene4";
export let scene;
export let engine;
let scenes = [];
export function initScenes(e) {
    engine = e;
    scenes[0] = createScene1(engine);
    scenes[1] = createScene2(engine);
    scenes[2] = createScene3(engine);
    scenes[3] = createScene4(engine);
    scene = scenes[0].scene;
}
export function setSceneIndex(i) {
    scene = scenes[i].scene;
}
