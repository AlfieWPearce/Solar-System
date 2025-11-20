'use strict';

//Global Variables
//Universal Constants
//Gravitational constant of the universe
const G = 0.2;

//Approx density of planets
const planetDesnity = 1; //kg per pixel

//Array of bodies
const celestialBodies = [];

//Time
let paused = false;
let time = 1;

/**
 * Runs on application setup
 */
function setup() {
	const canvas = createCanvas(window.innerWidth, window.innerHeight);
	canvas.parent(`container`);

	textAlign(CENTER);
	ellipseMode(CENTER);
	noStroke();

	initialiseCelestialBodies();
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
function initialiseCelestialBodies() {
	const data = [
		['Sólwyn-A', '', 0, 0, 500, [0, 0]],
		['Sólwyn-D', '', 10000, 0, 500, [0, 20]],
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
