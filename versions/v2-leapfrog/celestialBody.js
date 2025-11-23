//celestialBody.js
// -- celestialBody class (planet / moon / star / asteroid / ...)

class CelestialBody {
	/**
	 * @param {string} label formal name
	 * @param {string} nickname short / display name (may be empty)
	 * @param {{x:number,y:number}} pos initial position
	 * @param {number} radius rendered radius (and mass proxy)
	 * @param {[number,number]} initialVelocity initial velocity vectpr
	 */
	constructor(label, nickname, pos, radius, initialVelocity, density = planetDensity) {
		this.label = label;
		this.nickname = nickname;

		this.colour = [
			floor(random(100, 255)),
			floor(random(100, 255)),
			floor(random(100, 255)),
		];

		this.pos = [pos.x, pos.y];
		this.radius = radius;

		//Simple mass estimate
		this.density = density;
		this.mass = this.density * this.radius * this.radius * this.radius;

		//Copy velocity to avid aliasing
		this.velocity = [...initialVelocity];

		//Trail - small buffer of previous positions
		this.trail = [];
	}
	/**
	 * updates velocity about each body
	 */
	update(allBodies) {
		updateBody(this, allBodies);
	}
}
