//main.js
// --bootstrapping, initial data, utils

'use strict';

//Imports
import p5 from 'p5';
import {
	applyCamera,
	camera,
	cameraMove,
	cameraRemove,
	cameraSelect,
	mouseWheel,
} from './camera.js';
import { CelestialBody } from './celestialBody.js';
import { setupInput } from './input.js';
import { handleCollisions, updateBodies } from './physics.js';
import { draw as renderDraw, TRAIL_LENGTH } from './render.js';

//Globals
export let celestialBodies = []; //array of CelestialBody instances

export let paused = false;
export let time = 1; //Physics sub-steps per frame (1..n)

export const planetDensity = 1; //mass proxy (kg per "pixel unit")

export let G = 0.0008; //Gravitational constant (simulation units) - set by data.js

//====P5 Sketch====
const sketch = (s) => {
	window.s = s;
	/**
	 * Runs on application setup
	 */
	((s.setup = () => {
		const canvas = s.createCanvas(window.innerWidth, window.innerHeight);
		canvas.parent('container');

		//Inputs
		setupInput({
			s,
			getTime: () => time,
			onCameraSelect: (mx, my) => cameraSelect(mx, my, celestialBodies),
			onCameraMove: (mx, my) => cameraMove(mx, my),
			onCameraRemove: () => cameraRemove(),
			onWheel: (e) => mouseWheel(e),
			togglePause: () => {
				paused = !paused;
			},
			setTime: (v) => {
				time = v;
			},
		});

		loadSystem();
	}),
		/**
		 * Runs on resize window
		 */
		(s.windowResized = () => {
			s.resizeCanvas(window.innerWidth, window.innerHeight);
		}),
		/**
		 * Runs every drawing frame
		 */
		(s.draw = () => {
			//Clear Background
			s.background(0);

			//Physics update
			if (!paused) {
				for (let idx = 0; idx < time; idx++) {
					//returns updated bodies
					updateBodies(celestialBodies, { G }, TRAIL_LENGTH);
					celestialBodies = handleCollisions(celestialBodies);
				}
			}

			renderDraw(s, {
				celestialBodies,
				camera,
				applyCamera,
				paused,
			});
		}));
};
new p5(sketch);

export default window.s;

/**
 * Creates Bodies
 */
async function loadSystem() {
	try {
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
		G = json.G ?? G;

		//Center camera on first body
		if (celestialBodies.length > 0) camera.following = 0;
	} catch (err) {
		console.error(`Failed to load system data:`, err);
	}
}
/**
 * @deprecated
 */
// function initialiseCelestialBodies() {
// 	G = 0.0008;
// 	const data = [
// 		['Sólwyn-A', '', 0, 0, 500, [0, 0]],
// 		['Sólwyn-C', 'Bjarrûn', 10000, 0, 40, [0, -30]],
// 		['Sólwyn-CA', 'Rúnfael', 10080, 0, 2, [0, -40]],
// 		['Sólwyn-CB', 'Ruby', 9920, 0, 5, [0, -25]],
// 		['Sólwyn-Am', 'Várhuld', 17500, 0, 80, [0, -30]],
// 		['Sólwyn-B', 'Drósvald', -32000, 0, 90, [0, 30]],
// 		['Sólwyn-BB', '', -32150, 0, 2, [0, 50]],
// 		['Sólwyn-BA', '', -31800, 0, 12, [0, 10]],
// 	];
// 	data.forEach(([name, nick, x, y, radius, vel]) => {
// 		celestialBodies.push(new CelestialBody(name, nick, { x, y }, radius, vel));
// 	});

// 	//Center camera on first body
// 	if (celestialBodies.length > 0) {
// 		camera.pos = [...celestialBodies[0].pos];
// 	}
// }
