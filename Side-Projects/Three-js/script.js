import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

//Basic scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a0d, 1);
document.body.appendChild(renderer.domElement);

//Mini-map camera
const miniCamera = new THREE.PerspectiveCamera(
	90, //fov
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
miniCamera.position.set(0, 50, 0); //Above
miniCamera.lookAt(0, 0, 0);

const miniMapContainer = document.getElementById('minimap');
document.body.appendChild(miniMapContainer);
miniMapContainer.addEventListener('click', () => {
	miniMapContainer.classList.toggle('expanded');
});

const miniRenderer = new THREE.WebGLRenderer({ antialias: true });
miniRenderer.setSize(150, 150);
miniRenderer.setPixelRatio(window.devicePixelRatio);
miniMapContainer.appendChild(miniRenderer.domElement);

//HUD
const hud = document.getElementById('hud');
const ctx = hud.getContext('2d');

function resizeHud() {
	hud.width = window.innerWidth;
	hud.height = window.innerHeight;
}
resizeHud();

window.addEventListener('resize', resizeHud);
//Lighting
const sunLight = new THREE.PointLight(0xffffff, 50);
sunLight.position.set(0, 0, 0); //Sun position
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

//Sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//Single Planet
const planetGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.x = 5;
scene.add(planet);

//Single Planet
const planetGeometry2 = new THREE.SphereGeometry(0.8, 32, 32);
const planetMaterial2 = new THREE.MeshPhongMaterial({ color: 0xf00000 });
const planet2 = new THREE.Mesh(planetGeometry2, planetMaterial2);
planet2.position.x = 20;
scene.add(planet2);

//Single Moon
const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = 24;
scene.add(moon);

//First-person controls
const controls = new PointerLockControls(camera, renderer.domElement);

document.addEventListener('click', () => {
	controls.lock(); //Click to engage first-person view
});

//Movement Variable
const move = { forward: false, backward: false, left: false, right: false };
document.addEventListener('keydown', (e) => {
	if (e.code === 'KeyW') move.forward = true;
	if (e.code === 'KeyS') move.backward = true;
	if (e.code === 'KeyA') move.left = true;
	if (e.code === 'KeyD') move.right = true;
});
document.addEventListener('keyup', (e) => {
	if (e.code === 'KeyW') move.forward = false;
	if (e.code === 'KeyS') move.backward = false;
	if (e.code === 'KeyA') move.left = false;
	if (e.code === 'KeyD') move.right = false;
});

function createStars(count) {
	const geometry = new THREE.BufferGeometry();
	const positions = [];

	for (let idx = 0; idx < count; idx++) {
		const x = (Math.random() - 0.5) * 1000; //Spead in X
		const y = (Math.random() - 0.5) * 1000; //Spead in Y
		const z = (Math.random() - 0.5) * 1000; //Spead in Z
		positions.push(x, y, z);
	}

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

	const material = new THREE.PointsMaterial({
		color: 0xdddddd,
		size: 0.5, //tiny dots
		sizeAttenuation: true,
	});

	const stars = new THREE.Points(geometry, material);
	scene.add(stars);
}
createStars(1000);

function drawHUD() {
	const cx = hud.width - 120;
	const cy = hud.height - 120;

	const size = 20;

	const angle = -camera.rotation.y;

	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate(angle);

	ctx.beginPath();
	ctx.moveTo(0, -size);
	ctx.lineTo(size * 0.6, size);
	ctx.lineTo(-size * 0.6, size);
	ctx.closePath();

	ctx.fillStyle = 'red';
	ctx.fill();

	ctx.restore();
}

function animate() {
	requestAnimationFrame(animate);

	//Main Movement
	const speed = 0.1;
	if (move.forward) controls.moveForward(speed);
	if (move.backward) controls.moveForward(-speed);
	if (move.left) controls.moveRight(-speed);
	if (move.right) controls.moveRight(speed);

	//Mini-map data
	const miniWidth = window.innerWidth / 4;
	const miniHeight = window.innerHeight / 4;
	const x = window.innerWidth - miniWidth - 10;
	const y = window.innerHeight - miniHeight - 10;

	//Rendering
	//Main scene
	renderer.render(scene, camera);

	//Mini-map
	miniRenderer.render(scene, miniCamera); //Draws into ciruclar container

	drawHUD();
}
animate();
