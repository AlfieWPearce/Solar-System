/**
 * A celestial body so all from asteroid to planet to sun
 */
class CelestialBody {
	/**
	 * @param {{x:number,y:number}} pos initial position of planet
	 * @param {number} radius radius of planet
	 */
	constructor(label, nickname, pos, radius, initialVelocity) {
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
		this.mass = planetDesnity * radius ** 3;

		this.velocity = [...initialVelocity];

		this.trail = [];
	}
	/**
	 * updates velocity about each body
	 */
	update(celestialBodies) {
		updateBody(this);
	}
}
