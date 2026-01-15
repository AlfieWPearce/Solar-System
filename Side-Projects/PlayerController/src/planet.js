import * as THREE from 'three';

export default function createPlanet(radius = 100) {
	const geometry = new THREE.SphereGeometry(radius, 64, 64);
	const material = new THREE.MeshBasicMaterial({ color: 0x336633 });
	return new THREE.Mesh(geometry, material);
}
