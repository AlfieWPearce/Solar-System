//render.js
//Pure rendering
'use strict';

import * as THREE from 'three';

export function createRenderer() {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
	return renderer;
}

export function createScene() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	return scene;
}

export function drawThree(renderer, scene, camera, bodies, options) {
	renderer.clear();
	//Update sphere positions
	for (let b of bodies) {
		if (!b.mesh) continue;
		b.mesh.position.set(b.pos[0], b.pos[1], 0);
	}

	//Camera follow
	if (options.camera.following !== null) {
		const follow = bodies[options.camera.following];
		if (follow) camera.position.set(follow.pos[0], follow.pos[1], camera.position.z);
	}

	renderer.render(scene, camera);
}
