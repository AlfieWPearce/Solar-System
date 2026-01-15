//Scene.js

'use strict';

export default function createScene(THREE, info) {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		info.camera.fov,
		window.innerWidth / window.innerHeight,
		info.camera.near,
		info.camera.far
	);

	return { renderer, scene, camera };
}
