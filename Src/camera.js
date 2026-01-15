//camera.js
// -- Camera / view controls (panning, zoom, follow)

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';
import { dragSafeZone, scrollSafeZone } from './main.js';

export default class CameraController {
	constructor(renderer, initialSettings = {}) {
		this.renderer = renderer;

		//Controls how large the world will appear
		this.baseSize = initialSettings.baseSize ?? 1000;

		//Controls zoom
		this.zoom = {
			current: initialSettings.zoom ?? 0.5,
			min: initialSettings.zoomMin ?? 0.05,
			max: initialSettings.zoomMax ?? 2000,
			speed: initialSettings.zoomSpeed ?? 1.2,
		};

		//Creates initial camera
		this.camera = this.createCamera(window.innerWidth, window.innerHeight);
	}

	createCamera(w, h) {
		const aspect = w / h;

		//Builds the orthograthic camera
		const camera = new THREE.OrthographicCamera(
			-this.baseSize * aspect,
			this.baseSize * aspect,
			this.baseSize,
			-this.baseSize,
			-1e12,
			1e12
		);

		//Flat downward
		camera.position.set(0, 0, 1);
		camera.up.set(0, 1, 0);
		camera.lookAt(0, 0, 0);

		return camera;
	}

	resize(w, h) {
		// this.camera.aspect = w / h;
		this.renderer.setSize(w, h);
		this.updateProjection(w, h);
	}

	// wheel delta provided by InputController
	applyZoom(delta) {
		if (Math.abs(delta) <= scrollSafeZone) return;
		const factor = delta > 0 ? this.zoom.speed : 1 / this.zoom.speed;

		this.zoom.current *= factor;
		this.zoom.current = Math.max(
			this.zoom.min,
			Math.min(this.zoom.max, this.zoom.current)
		);

		this.updateProjection(window.innerWidth, window.innerHeight);
	}
	applyDrag(drag) {
		if (!drag || (Math.abs(drag.x) <= dragSafeZone && Math.abs(drag.y) <= dragSafeZone))
			return;

		// Convert pixel movement → world movement
		const size = this.baseSize / this.zoom.current;
		const aspect = window.innerWidth / window.innerHeight;

		const worldPerPixelX = (size * aspect * 8) / window.innerWidth;
		const worldPerPixelY = (size * 8) / window.innerHeight;

		this.camera.position.x -= drag.x * worldPerPixelX;
		this.camera.position.y += drag.y * worldPerPixelY;
	}
	updateProjection(w, h) {
		const aspect = w / h;

		const size = this.baseSize / this.zoom.current;

		this.camera.left = -size * aspect;
		this.camera.right = size * aspect;
		this.camera.top = size;
		this.camera.bottom = -size;

		this.camera.updateProjectionMatrix();
	}

	getCamera() {
		return this.camera;
	}
}
