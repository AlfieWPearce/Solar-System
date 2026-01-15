//Main.js

'use strict';

import * as THREE from 'three';
import createPlanet from './planet.js';
import Player from './player.js';
import createScene from './scene.js';
import createStars from './stars.js';

import info from '../info.json' with { type: 'json' };

const { renderer, scene, camera } = createScene(THREE, info);

//Create Planet
scene.add(createPlanet(info.planet.radius));
scene.add(createStars());

//Light
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(200, 200, 100);
scene.add(light);

//Player
const player = new Player(camera, renderer, info);
scene.add(player.mesh);

//Draw Loop
let last = 0;
function animate(t) {
	const dt = (t - last) / 1000;
	last = t;

	player.update(dt);

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
