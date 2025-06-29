import { Scene, ArcRotateCamera, Vector3, DirectionalLight, MeshBuilder, Mesh, Color3, ShadowGenerator, StandardMaterial, Texture, CubeTexture, HemisphericLight } from "@babylonjs/core";
function createArcRotateCamera(scene) {
    let camAlpha = (5 * Math.PI) / 4;
    let camBeta = Math.PI / 4;
    let camDist = 50;
    let camTarget = new Vector3(0, 20, 0);
    const camera = new ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
    camera.attachControl(true);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.lowerRadiusLimit = 15;
    camera.upperRadiusLimit = 100;
    return camera;
}
function applyTexture(mesh, name, texturePath, scene) {
    const material = new StandardMaterial(name, scene);
    material.diffuseTexture = new Texture(texturePath, scene);
    mesh.material = material;
}
function createLight(scene) {
    const hemiLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.1;
    hemiLight.diffuse = new Color3(0.6, 0.7, 1.0);
    hemiLight.groundColor = new Color3(0.2, 0.2, 0.3);
    hemiLight.specular = new Color3(0.5, 0.5, 0.6);
    const dirLight = new DirectionalLight("light", new Vector3(1, -2, 1), scene);
    dirLight.position = new Vector3(-10, 100, -10);
    dirLight.intensity = 0.7;
    dirLight.diffuse = new Color3(0.6, 0.7, 1.0);
    dirLight.specular = new Color3(0.8, 0.9, 1.0);
    return dirLight;
}
function setupShadows(scene, light) {
    const shadowGen = new ShadowGenerator(2048, light);
    shadowGen.useExponentialShadowMap = false;
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 16;
    scene.meshes.forEach(mesh => {
        if (mesh.name.includes("rockCluster")) {
            shadowGen.addShadowCaster(mesh);
        }
    });
    const ground = scene.getMeshByName("ground");
    if (ground)
        ground.receiveShadows = true;
}
function createGround(scene) {
    let ground = MeshBuilder.CreateGroundFromHeightMap("ground", "textures/heightMap.png", { width: 512, height: 512, subdivisions: 512, minHeight: 0, maxHeight: 20 }, scene);
    applyTexture(ground, "moonMat", "textures/moon.jpg", scene);
    return ground;
}
export default function createScene2(engine) {
    function createSpaceRock(scene) {
        const allowedTypes = [1, 2, 3, 4, 8];
        const polyType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
        let spacerock = MeshBuilder.CreatePolyhedron("spacerock", { type: polyType, size: 1.5 }, scene);
        spacerock.position = new Vector3(0, 0, 0);
        const mat = new StandardMaterial("rockMat", scene);
        mat.diffuseTexture = new Texture("/textures/spacedebris.png", scene);
        mat.bumpTexture = new Texture("/textures/spacedebris_n.png", scene);
        mat.bumpTexture.level = 1.25;
        console.log("Bump Level is:  ", mat.bumpTexture.level);
        spacerock.material = mat;
        spacerock.setEnabled(false);
        return spacerock;
    }
    function createRockCluster(scene, count, origin) {
        const baseRock = createSpaceRock(scene);
        baseRock.setEnabled(false);
        const rockClones = [];
        for (let i = 0; i < count; i++) {
            const rock = baseRock.clone(`rockClone_${i}`);
            if (rock) {
                rock.setEnabled(true);
                rock.position = origin.add(new Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 10));
                rock.scaling = new Vector3(0.6 + Math.random() * 0.8, 0.6 + Math.random() * 0.8, 0.6 + Math.random() * 0.8);
                rock.rotation = new Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                rockClones.push(rock);
            }
        }
        const mergedCluster = Mesh.MergeMeshes(rockClones, true, true, undefined, false, true);
        if (mergedCluster) {
            mergedCluster.name = "rockCluster";
            const amplitude = 0.3 + Math.random() * 0.5;
            const speed = 0.2 + Math.random() * 0.2;
            const baseY = mergedCluster.position.y;
            const phaseOffset = Math.random() * Math.PI * 2;
            scene.registerBeforeRender(() => {
                const t = performance.now() * 0.001;
                mergedCluster.position.y = baseY + Math.sin(t * speed + phaseOffset) * amplitude;
            });
            return mergedCluster;
        }
        else {
            console.warn("Failed to merge rock cluster.");
            return baseRock;
        }
    }
    function scatterRockClusters(scene, clusterCount, areaSize) {
        for (let i = 0; i < clusterCount; i++) {
            const x = (Math.random() - 0.5) * areaSize;
            const z = (Math.random() - 0.5) * areaSize;
            const y = 15 + Math.random() * 3;
            createRockCluster(scene, 5 + Math.floor(Math.random() * 6), new Vector3(x, y, z));
        }
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
    let that = { scene: new Scene(engine) };
    that.skybox = createSkybox(that.scene);
    that.light = createLight(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    that.spacerock = createSpaceRock(that.scene);
    scatterRockClusters(that.scene, 60, 500);
    const soloRock1 = createSpaceRock(that.scene);
    soloRock1.position = new Vector3(0, 20, 0);
    const soloRock2 = createSpaceRock(that.scene);
    soloRock2.position = new Vector3(0, 15, 0);
    const soloRock3 = createSpaceRock(that.scene);
    soloRock3.position = new Vector3(0, 25, 0);
    soloRock1.setEnabled(true);
    soloRock2.setEnabled(true);
    soloRock3.setEnabled(true);
    setupShadows(that.scene, that.light);
    return that;
}
