// ========================
// Imports
// ========================
import {
  Scene,
  ArcRotateCamera,
  Vector3,
  DirectionalLight,
  MeshBuilder,
  Mesh,
  Light,
  Color3,
  Engine,
  ShadowGenerator,
  StandardMaterial,
  CubeTexture,
  Texture,
  HemisphericLight,
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import "@babylonjs/loaders/glTF";
import { Sound } from "@babylonjs/core/Audio/sound";
import * as GUI from "@babylonjs/gui";
//import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";
//import "@babylonjs/inspector";
// ========================|
// Helper Functions        |
// ========================|



function createArcRotateCamera(scene: Scene): ArcRotateCamera {
  const camera = new ArcRotateCamera(
    "camera1",
    4.75,                  // alpha (horizontal orbit angle)
    1,                    // beta (vertical angle)
    50,                      // radius (distance from target)
    new Vector3(0, 5, 0),    // target
    scene
  );
  camera.attachControl(true);
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.lowerRadiusLimit = 15;
  camera.upperRadiusLimit = 100;
  return camera;
}


function applyTexture(mesh: Mesh, name: string, texturePath: string, scene: Scene) {
  const material = new StandardMaterial(name, scene);
  material.diffuseTexture = new Texture(texturePath, scene);
  mesh.material = material;
}

function createLight(scene: Scene): Light {
  // Ambient hemispheric light
  const hemiLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.1;
  hemiLight.diffuse = new Color3(0.6, 0.7, 1.0);
  hemiLight.groundColor = new Color3(0.2, 0.2, 0.3);

  // Directional (sun) light
  const dirLight = new DirectionalLight("light", new Vector3(1, -2, 1), scene);
  dirLight.position = new Vector3(-10, 100, -10);
  dirLight.intensity = 0.7;
  dirLight.diffuse = new Color3(0.6, 0.7, 1.0);
  dirLight.specular = new Color3(0.8, 0.9, 1.0);

  return dirLight;
}

function setupShadows(scene: Scene, light: DirectionalLight) {
  const shadowGen = new ShadowGenerator(2048, light);
  shadowGen.useBlurExponentialShadowMap = true;
  shadowGen.blurKernel = 16;

  // Add specific meshes as shadow casters if needed
  scene.meshes.forEach(mesh => {
    if (mesh.name.includes("rockCluster")) {
      shadowGen.addShadowCaster(mesh);
    }
  });

  const ground = scene.getMeshByName("ground");
  if (ground) {
    ground.receiveShadows = true;
  }
}

function createGround(scene: Scene): Mesh 
{
    const ground = MeshBuilder.CreateGroundFromHeightMap(
    "ground",
    "./textures/heightMap.png",
    { width: 128, height: 128, subdivisions: 128, minHeight:0, maxHeight: 5},
    scene
  );
  applyTexture(ground, "moonMat", "textures/moon.jpg", scene);
  return ground;
}

function createCoin(scene: Scene): Mesh
{
  let coin = MeshBuilder.CreateCylinder("coin",
  {
    diameter: 2,
    height: 0.08
  }, scene);

  const mat = new StandardMaterial("coinMat", scene);
  mat.diffuseColor = new Color3(1, 1, 0); // yellow
  coin.material = mat;

  //v coin position logic v
const x = (Math.random() - 0.5) * 50; // between -25 to 25
const z = Math.random() * 25 - 5; // between -5 and 20
  coin.position = new Vector3(x, 5, z); //
  coin.rotation.x = Math.PI / 2; // stands up the coin
  return coin;
}


function createSpaceRock(scene: Scene) {

    const allowedTypes = [1, 2, 3, 4, 8]; //this is my preferred polyhedron types for the space debris
    const polyType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    let spacerock = MeshBuilder.CreatePolyhedron("spacerock", {type: polyType, size: 1.5}, scene);

    spacerock.position = new Vector3(0, 0, 0);

    const mat = new StandardMaterial("rockMat", scene);
    mat.diffuseTexture = new Texture("./textures/spacedebris.png", scene);

    mat.bumpTexture = new Texture("./textures/spacedebris_n.png", scene);
    mat.bumpTexture.level = 1.25;
    console.log("Bump Level is:  ", mat.bumpTexture.level); 

    spacerock.material = mat;
    spacerock.setEnabled(false);

    return spacerock;
}

function createRockCluster(scene: Scene, count: number, origin: Vector3): Mesh {
    const baseRock = createSpaceRock(scene);
    baseRock.setEnabled(false);

    const rockClones: Mesh[] = [];

    for (let i = 0; i < count; i++) {
        const rock = baseRock.clone(`rockClone_${i}`);
        if (rock) {
            rock.setEnabled(true);
            rock.position = origin.add(new Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 10
            ));
            rock.scaling = new Vector3(
                0.3 + Math.random() * 0.4,
                0.3 + Math.random() * 0.4,
                0.3 + Math.random() * 0.4
            );
            rock.rotation = new Vector3(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rockClones.push(rock);
        }
    }

    const mergedCluster = Mesh.MergeMeshes(rockClones, true, true, undefined, false, true);
    if (mergedCluster) {
        mergedCluster.name = "rockCluster";

        //breathing animation
        const amplitude = 0.3 + Math.random() * 0.5;       //how much it moves
        const speed = 0.2 + Math.random() * 0.2;           //how fast it breathes
        const baseY = mergedCluster.position.y;
        const phaseOffset = Math.random() * Math.PI * 2;   //so they don't all sync

        scene.registerBeforeRender(() => {
            const t = performance.now() * 0.001;
            mergedCluster.position.y = baseY + Math.sin(t * speed + phaseOffset) * amplitude;
        });

        return mergedCluster;
    } else {
        console.warn("Failed to merge rock cluster.");
        return baseRock;
    }
}

function scatterRockClusters(scene: Scene, clusterCount: number, areaSize: number): void {
  for (let i = 0; i < clusterCount; i++) {
    const x = (Math.random() - 0.5) * areaSize;
    const z = (Math.random() - 0.5) * areaSize;
    const y = 2 + Math.random() * 3; //terrain elevation
    createRockCluster(scene, 5 + Math.floor(Math.random() * 6), new Vector3(x, y, z));
  }
}

function createSkybox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skybox", { size: 5000 }, scene);
  const mat = new StandardMaterial("skyboxMat", scene);
  mat.backFaceCulling = false;

  const texture = new CubeTexture("./textures/skybox/skybox", scene);
  mat.reflectionTexture = texture;
  mat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  mat.disableLighting = true;
  skybox.material = mat;

  console.log("Skybox created:", skybox);
  console.log("Skybox material:", skybox.material);
  return skybox;
}

function setupInput(scene: Scene, inputMap: { [key: string]: boolean }) {
  scene.actionManager = new ActionManager(scene);
  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, evt => {
      inputMap[evt.sourceEvent.key.toLowerCase()] = true;
    })
  );
  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, evt => {
      inputMap[evt.sourceEvent.key.toLowerCase()] = false;
    })
  );
}

function handleMovement(
  playerRoot: TransformNode,
  inputMap: { [key: string]: boolean },
  idleAnim: AnimationGroup | undefined,
  walkAnim: AnimationGroup | undefined
) {
  const speed = 0.4;                // World units per frame
  let moveX = 0;
  let moveZ = 0;
  if (inputMap["w"]) moveZ += 1;
  if (inputMap["s"]) moveZ -= 1;
  if (inputMap["a"]) moveX -= 1;
  if (inputMap["d"]) moveX += 1;

  const isMoving = moveX !== 0 || moveZ !== 0;
  if (isMoving) {
    const dir = new Vector3(moveX, 0, moveZ).normalize();
    playerRoot.rotation.y = Math.atan2(dir.x, dir.z);
    const forward = new Vector3(
      Math.sin(playerRoot.rotation.y),
      0,
      Math.cos(playerRoot.rotation.y)
    );
    playerRoot.position.addInPlace(forward.scale(speed));

    if (!walkAnim?.isPlaying) {
      idleAnim?.stop();
      walkAnim?.start(true);
    }
  } else {
    if (walkAnim?.isPlaying) {
      walkAnim.stop();
      idleAnim?.start(true);
    }
  }
}

function handleCoinCollection(playerRoot: TransformNode, coin: Mesh, scene: Scene, coinSound: Sound): Mesh
{
    if (coin && playerRoot.getChildMeshes().some(m => m.intersectsMesh(coin, false)))
    {
        console.log("PING!")
        coinSound.play()
        coin.dispose();
        coin = createCoin(scene);

    }
    return coin;
}

function createVolumeToggle(ambientSound: Sound, coinSound: Sound): GUI.Image
{
    const guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const volumeImage = new GUI.Image("volumeToggle", "./ui/vol_unmute.png");
    volumeImage.width = "60px";
    volumeImage.height = "60px";
    volumeImage.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    volumeImage.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    volumeImage.top = "800px";
    volumeImage.left = "0px";
    volumeImage.paddingRight = "10px";

    let isMuted = true;
    volumeImage.source = "ui/vol_mute.png";

    volumeImage.onPointerUpObservable.add(() =>
    {
        isMuted = !isMuted;
        volumeImage.source = isMuted ? "./ui/vol_mute.png" : "./ui/vol_unmute.png";
        console.log(isMuted ? "Muted" : "Unmuted");

        ambientSound.setVolume(isMuted ? 0 : 0.5);
        coinSound.setVolume(isMuted ? 0 : 0.25);
    });

    guiTexture.addControl(volumeImage);
    return volumeImage;
}



// ========================|
// Main Scene Setup        |
// ========================|



export default function createScene4(engine: Engine) {
  const scene = new Scene(engine);
  const camera = createArcRotateCamera(scene);
//  scene.debugLayer.show();
//  new AxesViewer(scene, 5);
  const canvas = engine.getRenderingCanvas()!;

  const light = createLight(scene);
  const ground = createGround(scene);
  const skybox = createSkybox(scene);
  let coin = createCoin(scene);

//START: this section was for testing against the modern browser audio rules, and babylon updates. 
console.log("AudioEngine present? →", Engine.audioEngine !== undefined);
console.log("Can use Web Audio? →", Engine.audioEngine?.canUseWebAudio);
console.log("AudioContext state →", Engine.audioEngine?.audioContext?.state);
console.log("AudioEngine.unlocked →", Engine.audioEngine?.unlocked);
Engine.audioEngine!.unlock();
console.log("Attempt 2: AudioEngine.unlocked →", Engine.audioEngine?.unlocked); 
//END
  setupShadows(scene, light as DirectionalLight);


      let coinSound = new Sound(
    "coin",
    "./audio/coin.wav",
    scene,
    () => console.log("Coin sound loaded successfully."),
    { autoplay: false, loop: false, volume: 0 }
  );


    let ambientSound = new Sound(
    "ambience",
    "./audio/spaceambience.mp3",
    scene,
    () => console.log("music loaded successfully."),
    { autoplay: true, loop: false, volume: 0 }
  );
  // Input map
  const inputMap: { [key: string]: boolean } = {};

  let volumeToggle = createVolumeToggle(ambientSound, coinSound);
  let isMuted = true; //scene start's with isMuted boolen true




  SceneLoader.ImportMesh(
    "",
    "./models/",
    "alien.glb",
    scene,
    (meshes, _, __, animationGroups) => {
      const playerRoot = new TransformNode("playerRoot", scene);
      meshes.forEach(mesh => (mesh.parent = playerRoot));

    // Initial transform
    playerRoot.position = new Vector3(0, 3, 0);
      playerRoot.scaling = new Vector3(0.05, 0.05, 0.05);   // Model scale
      playerRoot.rotation = new Vector3(Math.PI / 2, 0, 0); // Stand up

      // Animations
      const idleAnim = animationGroups.find(a => a.name.toLowerCase().includes("idle"));
      const walkAnim = animationGroups.find(a => a.name.toLowerCase().includes("walk"));
      idleAnim?.start(true);

      // Setup input handling
      setupInput(scene, inputMap);

    // ========================|
    // Main Update Loop        |
    // ========================|
      scene.onBeforeRenderObservable.add(() => {
        handleMovement(playerRoot, inputMap, idleAnim, walkAnim);
        coin = handleCoinCollection(playerRoot, coin, scene, coinSound);
          coin.rotation.z += 0.07; // coin rotation speed

      });
    }
  );
  scatterRockClusters(scene, 20, 128);  // or adjust count/area as needed




  return { scene, camera, light, ground, coinSound, ambientSound, volumeToggle};
}
