//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    DirectionalLight,
    MeshBuilder,
    Mesh,
    Light,
    Color3,
    Camera,
    Engine,
    ShadowGenerator,
    StandardMaterial,
    Texture
  } from "@babylonjs/core";
  
  function applyTexture(mesh: Mesh, name: string, texturePath: string, scene: Scene) {
    const material = new StandardMaterial(name, scene);
    material.diffuseTexture = new Texture(texturePath, scene);
    mesh.material = material;
}

function createBox(scene: Scene) 
{
    let box = MeshBuilder.CreateBox(
    "box",
    {size: 1}, scene);
    box.scaling = new Vector3(2, 2, 2);
    box.position = new Vector3(3, 1, 0);
  applyTexture(box, "moonMat", "textures/moon.jpg", scene);
    return box;
}
  
function createLight(scene: Scene) 
{
  const light = new DirectionalLight("light", new Vector3(1, -2, 1), scene);
  light.position = new Vector3(-10, 10, -10);
  light.intensity = 0.7;
  light.diffuse = new Color3(1.0, 0.8, 0.2);
  light.specular = new Color3(0.9, 0.9, 1.0);
  return light;
}

function setupShadows(scene: Scene, light: DirectionalLight) 
{
  const shadowGen = new ShadowGenerator(1024, light);
  shadowGen.useExponentialShadowMap = true;

  const shadowCasters = ["box", "sphere", "torus", "cylinder"];

  for (const name of shadowCasters) {
    const mesh = scene.getMeshByName(name);
    if (mesh) shadowGen.addShadowCaster(mesh);
  }
}

function createSphere(scene: Scene) 
{
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene);
    sphere.position.y = 1;
  applyTexture(sphere, "saturnMat", "textures/saturn.jpg", scene);
    return sphere;
}

function createTorus(scene: Scene) 
{
    let torus = MeshBuilder.CreateTorus(
      "torus", 
      { diameter: 2.5, thickness: 0.3 },
       scene);
    torus.position.y = 1;
  applyTexture(torus, "saturnMat", "textures/saturn.jpg", scene);
    return torus;
}
  
function createGround(scene: Scene)
{
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 12, height: 12 },
      scene);
  applyTexture(ground, "grassMat", "textures/grass.jpg", scene);
    return ground;
}

function createCylinder(scene: Scene)
{
    let cylinder = MeshBuilder.CreateCylinder(
      "cylinder",
      { diameter: 2, height: 2},
      scene);
    cylinder.position = new Vector3(-3, 1, 0);
  applyTexture(cylinder, "radioactiveMat", "textures/radioactive.jpg", scene);
    return cylinder;
}
  
function createArcRotateCamera(scene: Scene)
{
    let camAlpha = (5 * Math.PI) / 4,
      camBeta = Math.PI / 3,
      camDist = 12,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
}
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      light?: Light;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
      torus?: Mesh;
      cylinder?: Mesh;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    //that.scene.debugLayer.show();
  
    that.box = createBox(that.scene);
    that.light = createLight(that.scene);
    that.sphere = createSphere(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    that.torus = createTorus(that.scene);
    that.cylinder = createCylinder(that.scene);
    that.scene.registerBeforeRender(() =>
{
    if (that.sphere)
    {
        that.sphere.rotation.y += 0.01; // Simple Y-axis rotation
    }
        if (that.torus)
    {
        that.torus.rotation.y -= 0.01; // Simple Y-axis rotation
    }
});
    setupShadows(that.scene, that.light as DirectionalLight);
    
    return that;
  }
