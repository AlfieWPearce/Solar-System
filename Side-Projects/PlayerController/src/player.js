import * as THREE from 'three';

('use strict');

export default class Player {
	constructor(camera, renderer, info) {
		this.camera = camera;
		this.renderer = renderer;

		this.planet = info.planet;
		this.G = info.physics.G;

		this.height = info.player.height;

		//Start position
		this.position = new THREE.Vector3(0, info.planet.radius + info.player.height, 0);
		this.velocity = new THREE.Vector3();

		//Visual mesh
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(2, 2, 2),
			new THREE.MeshStandardMaterial({ color: 0x00aaff })
		);
		this.mesh.position.copy(this.position);

		this.speed = info.player.walkSpeed;
		this.jumpStrength = info.player.jumpStrength;

		//Camera rotation
		this.pitch = 0;
		this.yaw = 0;

		//Input state
		this.keys = { w: false, s: false, a: false, d: false, space: false, shift: false };

		//Keyboard input
		window.addEventListener('keydown', (e) => (this.keys[e.key.toLowerCase()] = true));
		window.addEventListener('keyup', (e) => (this.keys[e.key.toLowerCase()] = false));

		//Pointer lock
		renderer.domElement.addEventListener(
			'click',
			renderer.domElement.requestPointerLock
		);
		//Rotate
		window.addEventListener('mousemove', (e) => {
			if (document.pointerLockElement != renderer.domElement) return;
			this.yaw -= e.movementX * 0.002;
			this.pitch -= e.movementY * 0.002;

			//Clamp pitch
			this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
		});

		//Track if we are grounded
		this.isGrounded = false;
	}
	update(dt) {
		//Get the up direction
		const up = this.position.clone().normalize();

		//Build local coordinate frame on the planet surface
		//Need stable tangent frame
		let tangent = new THREE.Vector3(1, 0, 0);
		if (Math.abs(up.x) > 0.9) tangent.set(0, 1, 0);

		//Right vector (tangent to surface)
		const right = new THREE.Vector3().crossVectors(tangent, up).normalize();

		//Forward vector (tangent to surface & perpendicular to right)
		const forward = new THREE.Vector3().crossVectors(up, right).normalize();

		//Apply yaw around up
		const yawQuat = new THREE.Quaternion().setFromAxisAngle(up, this.yaw);

		//Rotated forwar dna right by yaw
		const rotatedForward = forward.clone().applyQuaternion(yawQuat);
		const rotatedRight = right.clone().applyQuaternion(yawQuat);

		//Apply pitch rotation around new right
		const pitchQuat = new THREE.Quaternion().setFromAxisAngle(rotatedRight, this.pitch);

		//Final camera orientation
		const finalQuat = new THREE.Quaternion().multiplyQuaternions(yawQuat, pitchQuat);

		//Calculate camera look direction
		const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(finalQuat);

		//For movement, project look direction onto the tangent plane
		const moveForward = lookDir.clone().projectOnPlane(up).normalize();
		const moveRight = rotatedRight.clone();

		//Handle inputs for movement (in tangent plane)
		const moveInput = new THREE.Vector3();
		if (this.keys.w) moveInput.addScaledVector(moveForward, this.speed * dt);
		if (this.keys.s) moveInput.addScaledVector(moveForward, -this.speed * dt);
		if (this.keys.a) moveInput.addScaledVector(moveRight, -this.speed * dt);
		if (this.keys.d) moveInput.addScaledVector(moveRight, this.speed * dt);

		this.position.add(moveInput);

		//Apply gravity
		const distanceFromCenter = this.position.length();
		const surfaceDistance = distanceFromCenter - this.planet.radius;

		//Check if we are grounded
		this.isGrounded = surfaceDistance <= this.height;

		if (this.isGrounded) {
			const velocityIntoGround = this.velocity.dot(up);
			if (velocityIntoGround < 0) {
				this.velocity.addScaledVector(up, -velocityIntoGround);
			}

			this.position.setLength(this.planet.radius + this.height);

			if (this.keys.space) this.velocity.addScaledVector(up, this.jumpStrength);
		}

		this.position.add(this.velocity.clone().multiplyScalar(dt));

		this.mesh.position.copy(this.position);

		this.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);

		this.camera.position.copy(this.position);
		this.camera.quaternion.copy(finalQuat);
	}
}
