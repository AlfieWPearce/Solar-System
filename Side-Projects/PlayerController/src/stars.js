import * as THREE from 'three';

export default function createStars(count = 5000, radius = 5000) {
	const position = new Float32Array(count * 3);

	for (let i = 0; i < count; i++) {
		position[i * 3 + 0] = (Math.random() - 0.5) * 2 * radius;
		position[i * 3 + 1] = (Math.random() - 0.5) * 2 * radius;
		position[i * 3 + 2] = (Math.random() - 0.5) * 2 * radius;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

	const material = new THREE.PointsMaterial({
		size: 5,
		sizeAttenuation: true,
		color: 0xffffff,
	});

	return new THREE.Points(geometry, material);
}
