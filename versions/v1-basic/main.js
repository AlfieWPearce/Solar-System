//main.js
// --bootstrapping, initial data, utils

'use strict';

//Simulation globals
const planetDensity = 1; //mass proxy (kg per "pixel unit")

let celestialBodies = []; //array of CelestialBody instances

let paused = false;
let time = 1; //Physics sub-steps per frame (1..n)

/**
 * Runs on application setup (P5)
 */
function setup() {
	const canvas = createCanvas(window.innerWidth, window.innerHeight);
	canvas.parent(`container`);

	textAlign(CENTER);
	ellipseMode(CENTER);
	noStroke();

	loadSystem();
}

/**
 * Runs on resize window
 */
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
}

/**
 * Creates Bodies
 */
async function loadSystem() {
	const res = await fetch('Src/data.json');
	const json = await res.json();

	json.bodies.forEach((body) => {
		celestialBodies.push(
			new CelestialBody(
				body.label,
				body.nickname,
				body.pos,
				body.radius,
				body.velocity,
				body.density
			)
		);
	});
	G = json.G;

	//Center camera on first body
	if (celestialBodies.length > 0) camera.following = 0;
}
/**
 * @deprecated
 */
function initialiseCelestialBodies() {
	G = 0.0008;
	const data = [
		['Sólwyn-A', '', 0, 0, 500, [0, 0]],
		['Sólwyn-C', 'Bjarrûn', 10000, 0, 40, [0, -30]],
		['Sólwyn-CA', 'Rúnfael', 10080, 0, 2, [0, -40]],
		['Sólwyn-CB', 'Ruby', 9920, 0, 5, [0, -25]],
		['Sólwyn-Am', 'Várhuld', 17500, 0, 80, [0, -30]],
		['Sólwyn-B', 'Drósvald', -32000, 0, 90, [0, 30]],
		['Sólwyn-BB', '', -32150, 0, 2, [0, 50]],
		['Sólwyn-BA', '', -31800, 0, 12, [0, 10]],
	];
	data.forEach(([name, nick, x, y, radius, vel]) => {
		celestialBodies.push(new CelestialBody(name, nick, { x, y }, radius, vel));
	});

	//Center camera on first body
	if (celestialBodies.length > 0) {
		camera.pos = [...celestialBodies[0].pos];
	}
}

//====Helper====
/**
 * Converts coordinates from screen space to world space
 * @param {number} x x position
 * @param {number} y y position
 */
const screenToWorld = (x, y) => [
	(x - width / 2) / camera.scale + camera.pos[0],
	(y - height / 2) / camera.scale + camera.pos[1],
];
