//Physics.js
//Physics engine helpers

//Universal Constants
let G; //Gravitational constant (simulation units) - set by data.js

('use strict');

/**
 * Updates acceleration and position for one body due to all others
 * This is using Leapfrog Integration (I have explained these in the documentation)
 */
function updateBodies(allBodies) {
	//First half-kick v(t + 0.5)
	for (let b of allBodies) {
		const [ax, ay] = computeAcceleration(b, allBodies);
		b.velocity[0] += 0.5 * ax;
		b.velocity[1] += 0.5 * ay;
	}

	//Drifts x(t + 1)
	for (let b of allBodies) {
		b.pos[0] += b.velocity[0];
		b.pos[1] += b.velocity[1];

		if (typeof TRAIL_LENGTH !== `undefined`) {
			b.trail.push([...b.pos]);
			if (b.trail.length >= TRAIL_LENGTH) b.trail.shift();
		}
	}

	//Second half-kick v(t + 1)
	for (let b of allBodies) {
		const [ax, ay] = computeAcceleration(b, allBodies);
		b.velocity[0] += 0.5 * ax;
		b.velocity[1] += 0.5 * ay;
	}
}

/**
 * Computes gravitational acceleration on one body due to all other
 */
function computeAcceleration(body, allBodies) {
	let ax = 0;
	let ay = 0;
	const [bx, by] = body.pos;

	for (let other of allBodies) {
		//Ignore this body
		if (other === body) continue;

		//Distances
		const dx = other.pos[0] - bx;
		const dy = other.pos[1] - by;
		let distSq = dx * dx + dy * dy;
		const minDist = body.radius + other.radius;
		const minDistSq = minDist * minDist;

		// Soften collisions
		if (distSq < minDistSq) distSq = minDistSq;
		if (distSq === 0) continue;

		//Calculate force
		const invDist = 1 / Math.sqrt(distSq);
		const force = (G * other.mass) / distSq;

		//Calculate acceleration
		ax += force * dx * invDist;
		ay += force * dy * invDist;
	}

	return [ax, ay];
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

			//Collision?
			if (distSq < minDist * minDist) {
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
