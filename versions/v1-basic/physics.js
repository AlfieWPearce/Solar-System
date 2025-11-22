//Physics.js
//Physics engine helpers

//Universal Constants
let G; //Gravitational constant (simulation units) - set by data.js

('use strict');

/**
 * Updates acceleration and position for one body due to all others
 * This is using Explicit Euler Integration (I have explained these in the documentation)
 */
function updateBody(body, allBodies) {
	//Local Alias for performance
	const [bx, by] = body.pos;
	const m = body.mass;

	//Accumulate Acceleration
	let ax = 0;
	let ay = 0;

	//Loops through all of the bodies
	for (let idx = 0, n = allBodies.length; idx < n; idx++) {
		const other = allBodies[idx];
		if (other === body) continue;

		//Vector to other body
		const dx = other.pos[0] - bx;
		const dy = other.pos[1] - by;

		//Squared distance and safe distance handling
		let distsq = dx * dx + dy * dy;
		const minDist = body.radius + other.radius;
		const minDistSq = minDist * minDist;

		//Safety: collision - soften overly-close interactions
		if (distsq < minDistSq) distsq = minDistSq;

		//Avoid division by 0 - shouldn't happen but just in case :)
		if (distsq == 0) continue;

		//Newtonian force magintude
		//F=G Mm/r^2
		const force = (G * m * other.mass) / distsq;

		//Compute inverse distance once for direction
		const invDist = 1 / Math.sqrt(distsq);
		const fx = force * dx * invDist;
		const fy = force * dy * invDist;

		//a = F/m
		ax += fx / m;
		ay += fy / m;
	}

	//Integrate Velocity and position (explicit Euler)
	body.velocity[0] += ax;
	body.velocity[1] += ay;

	body.pos[0] += body.velocity[0];
	body.pos[1] += body.velocity[1];

	if (typeof TRAIL_LENGTH !== `undefined`) {
		body.trail.push([...body.pos]);
		if (body.trail.length >= TRAIL_LENGTH) body.trail.shift();
	}
}

/**
 * Handle collisions between all bodies
 * Merges overlapping bodies into a single body
 */
function handleCollisions(allBodies) {
	const newBodies = [];

	const toRemove = new Set();

	for (let i = 0; i < allBodies.length; i++) {
		if (toRemove.has(i)) continue;
		let merged = allBodies[i];

		for (let j = i + 1; j < allBodies.length; j++) {
			if (toRemove.has(j)) continue;

			//Make alliases
			const a = merged;
			const b = allBodies[j];

			//Find distances
			const dx = b.pos[0] - a.pos[0];
			const dy = b.pos[1] - a.pos[1];
			const distSq = dx * dx + dy * dy;

			const minDist = a.radius + b.radius;
			const minDistSq = minDist * minDist;

			//Collision?
			if (distSq < minDistSq) {
				if (camera.following === j) camera.following = allBodies.length - 1;
				//Make new merged body
				merged = mergeBodies(a, b);

				//Remove the originals
				toRemove.add(j);
			}
		}

		newBodies.push(merged);
	}

	return newBodies;
}

/**
 * Merge two bodies via momentum + mass conservation
 */
function mergeBodies(a, b) {
	//new mass
	const massA = a.mass;
	const massB = b.mass;
	const M = massA + massB;

	//New position (Centre of mass)
	const newX = (a.pos[0] * massA + b.pos[0] * massB) / M;
	const newY = (a.pos[1] * massA + b.pos[1] * massB) / M;

	//New velocity (momentum conservation)
	const newVx = (a.velocity[0] * massA + b.velocity[0] * massB) / M;
	const newVy = (a.velocity[1] * massA + b.velocity[1] * massB) / M;

	//Average Density
	const newDensity = (a.density + b.density) * 0.5;

	//New radius - from volume formula
	//I use radius^3 * density - so keep consistent:
	const newRadius = Math.cbrt(M / newDensity);

	return new CelestialBody(
		`${a.label}+${b.label}`,
		``,
		{ x: newX, y: newY },
		newRadius,
		[newVx, newVy],
		newDensity
	);
}
