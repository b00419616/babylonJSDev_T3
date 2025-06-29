#Dev Notes

##Element 01

Uses babylonJS to render five primitive shapes (box, sphere, torus, clinder and ground), each with textures. A hemispheric light couldn't cast shadows, so it was replaced by a directional light paired with a ShadowGenerator. The camera is angled diagonally to view the from the light side, and allow manual rotation to compare the shadowed side. the materials are located in public/textures.An applyTexture function was created to assign materials to each mesh to shorten and tidy the code.


##Element 02

Builds a 3D environment in BabylonJS using a heightmapped, textured terrain and a 360-degree skybox for spatial context. A createSpaceRock function generates polyhedron debris meshes with normal maps for surface detail. Clusters of rocks are created using mesh cloning, varied by scale, rotation, and type, then merged into single meshes for performance. A scatterRockClusters function populates the scene procedurally. Individual unmerged debris meshes are also placed to meet the assignment criteria. Lighting is handled by a combination of hemispheric and directional lights. with shadows. Camera motion is constrained to prevent inversion and underground rotation.


##Element 03

Uses a player character using a alien GLB model with added idle and walking animations using blender and mixamo. The character is controlled using a TransformNode parented to a capsule mesh with a physics impostor. Movement is handled using input mapping and updates the player’s rotation to face the movement direction. A collectible coin mesh is placed in the scene using a reusable function and respawns in a new position upon collision with the player.


##Element 04

Contains a user interface with Babylon GUI featuring a main menu and a in-game HUD element. The main menu contains a start button that transitions to the gameplay scene using scene disposal and reinitialization. A mute toggle button is overlaid on the side of the interactive scene, initialized in the muted state to meet audio requirements. This toggle updates its icon based on mute state and adjusts the volume of both background ambience and the coin sound effect. Audio playback is event-driven, with coin collection triggering the sound effect. The camera’s position and angle were adjusted using Inspector feedback to give a better overview of the playable space on scene load. A lot of debbuging was involved for the audio due to babylon updates, after hours of debugging, this was overcame.


##Element 05

Uses a scene-switching system to show off four previous elements within a single project. Each element scene is modular as and has its own function and is imported into a central createScenes.ts file, where they are stored and indexed using setSceneIndex. A GUI overlay is created in guiScene.ts using GUI, which includes buttons to switch between the scenes. The active scene is rendered alongside the GUI in the main render loop. Scene switching is handled using scene disposal similar to element 4, and a shared engine instance.

###Note: dev.md located in root public folder.