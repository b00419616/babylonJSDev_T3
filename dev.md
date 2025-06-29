#Dev Notes

##Element 01

Uses babylonJS to render five primitive shapes (box, sphere, torus, clinder and ground), each with textures. A hemispheric light couldn't cast shadows, so it was replaced by a directional light paired with a ShadowGenerator. The camera is angled diagonally to view the from the light side, and allow manual rotation to compare the shadowed side. the materials are located in public/textures.An applyTexture function was created to assign materials to each mesh to shorten and tidy the code.

##Element 02

Builds a 3D environment in BabylonJS using a heightmapped, textured terrain and a 360-degree skybox for spatial context. A createSpaceRock function generates polyhedron debris meshes with normal maps for surface detail. Clusters of rocks are created using mesh cloning, varied by scale, rotation, and type, then merged into single meshes for performance. A scatterRockClusters function populates the scene procedurally. Individual unmerged debris meshes are also placed to meet the assignment criteria. Lighting is handled by a combination of hemispheric and directional lights. with shadows. Camera motion is constrained to prevent inversion and underground rotation.

##Element 03
Uses a player character using a alien GLB model with added idle and walking animations using blender and mixamo. The character is controlled using a TransformNode parented to a capsule mesh with a physics impostor. Movement is handled using input mapping and updates the player’s rotation to face the movement direction. A collectible coin mesh is placed in the scene using a reusable function and respawns in a new position upon collision with the player.