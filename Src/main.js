//main.js
// --bootstrapping, initial data, utils

'use strict';

//Imports
// import * as p5 from 'p5';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

import CameraController from './camera.js';
import { CelestialBody } from './celestialBody.js';
import InputController from './input.js';

// import { cameraMove, cameraRemove, cameraSelect, mouseWheel } from './camera.js';
import data from './data.json';
// import { setupInput } from './input.js';
import { handleCollisions, updateBodies } from './physics.js';
import { createRenderer, createScene, drawThree } from './render.js';

//====Create scene, camera, renderer====
const renderer = createRenderer();
const scene = createScene();
const camera = new CameraController(renderer);

const input = new InputController(renderer.domElement);

//====Lighting====
const sunLight = new THREE.PointLight(0xffffff, 50);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0xf0f0f0, 1);
scene.add(ambientLight);

//====Create Bodies====
const G = data.G;
let bodies = [];
for (let obj of data.bodies) {
	const b = new CelestialBody(
		THREE,
		obj.label,
		obj.nickname,
		obj.pos,
		obj.radius,
		obj.velocity,
		obj.density
	);
	bodies.push(b);
	scene.add(b.mesh);
}

//====Camera state====
const cameraState = {
	following: null,
	zoom: 500,
};

export const scrollSafeZone = 0.1;
export const dragSafeZone = 0.1;

//====Physics state====
let paused = false;
export function pausePlay() {
	paused = !paused;
}
let time = 1;

// let last = 0;
//====Animation loop====
function animate(/*t*/) {
	renderer.setClearColor(0xffffff);

	// const dt = (t - last) / 1000; // delta time calculation
	// last = t;

	//Pan
	camera.applyDrag(input.consumeDrag());

	//Zoom
	camera.applyZoom(input.consumeScroll());

	//Physics update
	if (!paused) {
		for (let idx = 0; idx < time; idx++) {
			updateBodies(bodies, { G });
			bodies = handleCollisions(bodies);
		}
	}

	//Draw loop
	drawThree(renderer, scene, camera.camera, bodies, { camera: cameraState });
	requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

//====Resize====
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.camera.aspect = window.innerWidth / window.innerHeight;
	camera.camera.updateProjectionMatrix();
});
