//camera.js
// -- Camera / view controls (panning, zoom, follow)

//Camera object holds view state
export const camera = {
	scale: 0.05,
	zoomBounds: { min: 0.01, max: 5 },

	pos: [0, 0], //world coordinate of camera
	dragging: false,
	lastMousePos: [0, 0], //screen-space last mouse position during drag

	following: null, //idx of celestialBodies being followed | null
};

/**
 * Camera Transform
 */
export function applyCamera(p5Instance, celestialBodies = []) {
	p5Instance.translate(window.innerWidth / 2, window.innerHeight / 2);
	p5Instance.scale(camera.scale);
	if (camera.following != null) camera.pos = [...celestialBodies[camera.following].pos];
	p5Instance.translate(-camera.pos[0], -camera.pos[1]);
}

/**
 * Zooming
 */
export function mouseWheel(event) {
	camera.scale *= event.delta > 0 ? 0.9 : 1.1;
	camera.scale = Math.max(
		camera.zoomBounds.min,
		Math.min(camera.zoomBounds.max, camera.scale)
	);

	//Prevent page scroll
	if (event && event.preventDefault) event.preventDefault();
}

/**
 * Panning
 */

/**
 * Camera Select & Begin drag
 */
export function cameraSelect(mouseX, mouseY, bodies = []) {
	//World space coordinates of click position
	const [wx, wy] = screenToWorld(mouseX, mouseY);

	//If not already following, check for click-on-body
	if (camera.following === null) {
		let clickedIdx = null;
		for (let idx = 0; idx < bodies.length; idx++) {
			const body = bodies[idx];
			const dx = wx - body.pos[0];
			const dy = wy - body.pos[1];
			const distSq = dx * dx + dy * dy;
			const hitDist = (body.radius + 10) * (body.radius + 10);

			if (distSq <= hitDist) {
				clickedIdx = idx;
				break;
			}
		}

		if (clickedIdx !== null) {
			camera.following = clickedIdx;
			camera.dragging = false;
			camera.lastMousePos = [mouseX, mouseY];
			return;
		}
	}
	//Start panning
	camera.following = null;
	camera.dragging = true;
	camera.lastMousePos = [mouseX, mouseY];
}

/**
 * Dragging
 */
export function cameraMove(mouseX, mouseY) {
	if (!camera.dragging) return;
	//Ajust camera position by mouse delta, scaled to world units
	camera.pos[0] -= (mouseX - camera.lastMousePos[0]) / camera.scale;
	camera.pos[1] -= (mouseY - camera.lastMousePos[1]) / camera.scale;

	camera.lastMousePos = [mouseX, mouseY];
}

/**
 * End drag
 */
export function cameraRemove() {
	camera.dragging = false;
}

/**
 * Converts coordinates from screen space to world space
 * @param {number} x x position
 * @param {number} y y position
 */
export const screenToWorld = (x, y) => [
	(x - window.innerWidth / 2) / camera.scale + camera.pos[0],
	(y - window.innerHeight / 2) / camera.scale + camera.pos[1],
];
