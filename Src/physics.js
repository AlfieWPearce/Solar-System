function updateBody(body) {
	for (let other of celestialBodies) {
		if (other == body) continue;

		//Vector to other body
		const dx = other.pos[0] - body.pos[0];
		const dy = other.pos[1] - body.pos[1];

		let dist = Math.sqrt(dx ** 2 + dy ** 2);

		//Safety: collision
		if (dist < body.radius + other.radius) dist = body.radius + other.radius;

		//Avoid div by 0
		if (dist == 0) continue;

		//Newtonian force magintude softened
		const force = (G * body.mass * other.mass) / dist ** 2;

		//Direction
		const fx = force * (dx / dist);
		const fy = force * (dy / dist);

		//a = F/m
		const ax = fx / body.mass;
		const ay = fy / body.mass;

		//Update velocity
		body.velocity[0] += ax;
		body.velocity[1] += ay;
	}
	//Update position
	body.pos[0] += body.velocity[0];
	body.pos[1] += body.velocity[1];

	body.trail.push([...body.pos]);
	if (body.trail.length >= trailLength) body.trail.shift();
}

function computeFuturePaths(steps = 1000, dt = 1) {
	//copy positions/velocities of all bodies
	const clones = celestialBodies.map((body) => ({
		pos: [...body.pos],
		vel: [...body.velocity],
		mass: body.mass,
		futurePath: [],
	}));

	//fast forward sim
	for (let s = 0; s < steps; s++) {
		clones.forEach((a, i) => {
			let ax = 0,
				ay = 0;
			clones.forEach((b, j) => {
				if (i == j) return;
				let dx = b.pos[0] - a.pos[0];
				let dy = b.pos[1] - a.pos[1];
				let r2 = dx * dx + dy * dy;
				let r = Math.sqrt(r2) + 0.0001;

				if (r < 1) r = 1;

				let f = (G * b.mass) / r2;

				ax += (f * dx) / r;
				ay += (f * dy) / r;
			});
			a.acc = [ax, ay];
		});

		clones.forEach((c) => {
			c.vel[0] += c.acc[0] * dt;
			c.vel[1] += c.acc[1] * dt;

			c.pos[0] += c.vel[0] * dt;
			c.pos[1] += c.vel[1] * dt;

			c.futurePath.push([c.pos[0], c.pos[1]]);
		});
	}

	clones.forEach((clone, i) => {
		celestialBodies[i].futurePath = clone.futurePath;
	});
}
