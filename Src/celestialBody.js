//celestialBody.js
// -- celestialBody class (planet / moon / star / asteroid / ...)

export class CelestialBody {
	/**
	 * @param {string} label formal name
	 * @param {string} nickname short / display name (may be empty)
	 * @param {{x:number,y:number}} pos initial position
	 * @param {number} radius rendered radius (and mass proxy)
	 * @param {[number,number]} initialVelocity initial velocity vectpr
	 */
	constructor(THREE, label, nickname, pos, radius, initialVelocity, density) {
		this.label = label;
		this.nickname = nickname;

		this.colour = [
			Math.floor(Math.random() * 155) + 100,
			Math.floor(Math.random() * 155) + 100,
			Math.floor(Math.random() * 155) + 100,
		];

		this.pos = [pos.x, pos.y];
		this.radius = radius;

		//Simple mass estimate
		this.density = density;
		this.mass = this.density * this.radius * this.radius * this.radius;

		//Copy velocity to avid aliasing
		this.velocity = [...initialVelocity];

		const geom = new THREE.SphereGeometry(this.radius, 32, 32);
		const mat = new THREE.MeshStandardMaterial({
			color: new THREE.Color().setRGB(
				this.colour[0] / 255,
				this.colour[1] / 255,
				this.colour[2] / 255
			),
		});
		this.mesh = new THREE.Mesh(geom, mat);
	}
}
