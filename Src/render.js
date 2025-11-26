//UI stats
const TRAIL_LENGTH = 50;

/**
 * Runs per draw frame
 * Handles Rendering a frame, & physics stepping
 */
function draw() {
	push();
	background(0);

	///Physics updates: perform `time` iterations per fraome when not paused
	if (!paused) {
		for (let t = 0; t < time; t++) {
			updateBodies(celestialBodies);
			celestialBodies = handleCollisions(celestialBodies);
		}
	}

	//Make changes to camera position and zoom
	applyCamera();

	//Loop through celestial bodies
	for (let idx = 0, n = celestialBodies.length; idx < n; idx++) {
		const body = celestialBodies[idx];
		drawTrail(body);
		drawCelestialBody(body);
	}

	pop();

	//Top UI Band (non-world)
	fill(200, 200);
	rect(0, 0, width, 40);

	if (paused) {
		fill(0);
		textAlign(CENTER, TOP);
		textSize(30);
		text(`PAUSED`, width / 2, 5);
	}

	//If following a body, draw its info overlay
	if (camera.following !== null && celestialBodies[camera.following])
		drawInformation(celestialBodies[camera.following]);

	//Draw fps counter
	textAlign(LEFT, TOP);
	textSize(10);
	fill(0, 255, 0);
	text(floor(frameRate()), 5, 2);
	textAlign(CENTER, CENTER);
}

/**
 * Draws a celestial body
 * @param {CelestialBody} body the celestial body
 */
function drawCelestialBody(body) {
	fill(body.colour);
	circle(body.pos[0], body.pos[1], body.radius * 2);
}

/**
 * Draws a trail behind each celestial body
 * @param {CelestialBody} body The body to draw the trail of
 */
function drawTrail(body) {
	const len = body.trail.length;
	for (let idx = 0; idx < len; idx++) {
		const p = body.trail[idx];
		//Alpha and size ramp: older points more transparent and smaller
		const alpha = map(idx, 0, len - 1, 40, 255);
		const size = map(idx, 0, len - 1, 0.2, 1);
		const [r, g, b] = body.colour;
		fill(r, g, b, alpha);
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
	if (target.label) text(target.label, 10, 10);
	const w = textWidth(target?.label ?? ``);
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
