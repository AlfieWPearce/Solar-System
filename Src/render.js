//UI stats
const trailLength = 50;

/**
 * Runs per draw frame
 */
function draw() {
	push();
	background(0);

	if (!paused) {
		for (let t = 0; t < time; t++) {
			//Update physics
			celestialBodies.forEach((body) => {
				body.update(celestialBodies);
			});
		}
	}

	//Make changes to camera position and zoom
	applyCamera();

	//Draw trails
	celestialBodies.forEach((body) => {
		drawTrail(body);
	});

	//Draw paths
	// computeFuturePaths(1000, 1);
	// celestialBodies.forEach((body) => {
	// 	drawFuturePath(body);
	// });

	//Draw bodies
	celestialBodies.forEach((body) => {
		drawCelestialBody(body);
	});

	pop();

	//Draw no touch
	fill(200, 200);
	rect(0, 0, width, 40);

	if (paused) {
		fill(0);
		textAlign(CENTER, TOP);
		textSize(30);
		text(`PAUSED`, width / 2, 5);
	}
	//Draw information if there is information
	if (camera.following === null) return;
	drawInformation(celestialBodies[camera.following]);
}

/**
 * Draws a celestial body
 * @param {CelestialBody} body the celestial body
 */
function drawCelestialBody(body) {
	fill(body.colour);
	circle(body.pos[0], body.pos[1], body.radius * 2);
}

function drawFuturePath(body) {
	fill(body.colour);
	body.futurePath.forEach((p) => circle(p[0], p[1], body.radius));
}

/**
 * Draws a trail behind each celestial body
 * @param {CelestialBody} body The body to draw the trail of
 */
function drawTrail(body) {
	for (let idx in body.trail) {
		const p = body.trail[idx];
		const alpha = map(idx, -1, body.trail.length + 1, 0, 255);
		const size = map(idx, -1, body.trail.length + 1, 0, 1);
		fill(body.colour[0], body.colour[1], body.colour[2], alpha);
		circle(p[0], p[1], body.radius * 2 * size);
	}
}

/**
 * Outputs some data about the follow target
 * @param {CelestialBody} target The target the camera is following
 */
function drawInformation(target) {
	fill(0);
	textSize(20);
	textAlign(LEFT, TOP);
	text(target.label, 10, 10);
	const w = textWidth(target.label);
	textSize(15);
	textStyle(ITALIC);
	if (target.nickname) text(`(${target.nickname})`, 20 + w, 17);
	textStyle(NORMAL);
	fill(200, 200);
	text(`${target.mass / 1000}Mg`, 10, 50);
	text(`${target.radius}km`, 10, 70);
	text(`${round(target.velocity[0], 2)}i, ${round(target.velocity[1], 2)}j km/s`, 10, 90);
	text(
		`${round(Math.sqrt(target.velocity[0] ** 2 + target.velocity[1] ** 2), 2)} km/s`,
		10,
		110
	);
	const sun = celestialBodies[0];
	const distToSun = round(
		Math.sqrt((sun.pos[0] - target.pos[0]) ** 2 + (sun.pos[1] - target.pos[1]) ** 2) /
			1000,
		2
	);
	if (distToSun !== 0) text(`${distToSun}Mm to sol`, 10, 130);
}
