//render.js
//Pure rendering
'use strict';

//UI stats
export const TRAIL_LENGTH = 50;

/**
 * Runs per draw frame
 * s: p5 instance (scene)
 * options: { celestialBodies, camera, applyCamera(), paused }
 */
export function draw(s, options) {
	const { celestialBodies = [], camera, applyCamera, paused } = options;

	s.push();

	//Make changes to camera position and zoom
	applyCamera(s, celestialBodies);

	//Loop through celestial bodies
	for (let idx = 0, n = celestialBodies.length; idx < n; idx++) {
		//Draw trail then body
		const body = celestialBodies[idx];
		drawTrail(s, body);
		drawCelestialBody(s, body);
	}

	s.pop();

	//Top UI Band
	s.fill(200, 200);
	s.rect(0, 0, window.innerWidth, 40);

	if (paused) {
		s.fill(0);
		s.textAlign(s.CENTER, s.TOP);
		s.textSize(30);
		s.text(`PAUSED`, window.innerWidth / 2, 5);
	}

	//If following a body, draw its info overlay
	if (camera.following !== null && celestialBodies[camera.following])
		drawInformation(s, celestialBodies[camera.following]);

	//FPS
	s.textAlign(s.LEFT, s.TOP);
	s.textSize(10);
	s.fill(0, 255, 0);
	s.text(Math.floor(s.frameRate()), 5, 2);
	s.textAlign(s.CENTER, s.CENTER);
}

/**
 * Draws a celestial body
 * @param {CelestialBody} body the celestial body
 */
export function drawCelestialBody(s, body) {
	s.ellipseMode(s.CENTER);
	s.fill(...body.colour);
	s.circle(body.pos[0], body.pos[1], body.radius * 2);
}

/**
 * Draws a trail behind each celestial body
 * @param {CelestialBody} body The body to draw the trail of
 */
export function drawTrail(s, body) {
	const len = body.trail?.length ?? 0;
	for (let idx = 0; idx < len; idx++) {
		const p = body.trail[idx];
		//Alpha and size ramp: older points more transparent and smaller
		const alpha = s.map(idx, 0, len - 1, 40, 255);
		const size = s.map(idx, 0, len - 1, 0.2, 1);
		const [r, g, b] = body.colour;
		s.fill(r, g, b, alpha);
		s.circle(p[0], p[1], body.radius * 2 * size);
	}
}

/**
 * Outputs some data about the follow target
 * @param {CelestialBody} target The target the camera is following
 */
export function drawInformation(s, target) {
	s.fill(0);
	s.textSize(20);
	s.textAlign(s.LEFT, s.TOP);
	if (target.label) s.text(target.label, 10, 10);
	const w = s.textWidth(target?.label ?? ``);
	s.textSize(15);
	s.textStyle(s.ITALIC);
	if (target.nickname) s.text(`(${target.nickname})`, 20 + w, 17);
	s.textStyle(s.NORMAL);

	s.fill(200, 200);
	s.text(`${target.mass / 1000}Mg`, 10, 50);
	s.text(`${target.radius}km`, 10, 70);
	s.text(
		`${s.round(target.velocity[0], 2)}i, ${s.round(target.velocity[1], 2)}j km/s`,
		10,
		90
	);
	s.text(
		`${s.round(Math.sqrt(target.velocity[0] ** 2 + target.velocity[1] ** 2), 2)} km/s`,
		10,
		110
	);
}
