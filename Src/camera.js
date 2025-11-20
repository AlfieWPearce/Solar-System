//Camera / view
const camera = {
	scale: 0.05,
	zoomBounds: { min: 0.01, max: 5 },

	pos: [0, 0],
	dragging: false,
	lastMousePos: [0, 0],

	following: null,
};

/**
 * Camera Transform
 */
function applyCamera() {
	translate(width / 2, height / 2);
	scale(camera.scale);
	if (camera.following != null)
		camera.pos = [
			celestialBodies[camera.following].pos[0],
			celestialBodies[camera.following].pos[1],
		];
	translate(-camera.pos[0], -camera.pos[1]);
}

/**
 * Zooming
 */
function mouseWheel(event) {
	camera.scale *= event.delta > 0 ? 0.9 : 1.1;
	camera.scale = constrain(camera.scale, camera.zoomBounds.min, camera.zoomBounds.max);
}

/**
 * Panning
 */

/**
 * Begin drag
 */
function cameraSelect(mouseX, mouseY) {
	//World space coordinates of click position
	const [wx, wy] = screenToWorld(mouseX, mouseY);
	if (camera.following === null) {
		let clickedIdx = null;
		for (let idx in celestialBodies) {
			const body = celestialBodies[idx];
			const dx = wx - body.pos[0];
			const dy = wy - body.pos[1];
			const dist = Math.sqrt(dx ** 2 + dy ** 2);

			if (dist <= body.radius + 10) {
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
	camera.following = null;
	camera.dragging = true;
	camera.lastMousePos = [mouseX, mouseY];
}

/**
 * Dragging
 */
function cameraMove(mouseX, mouseY) {
	if (!camera.dragging) return;
	//Adjsus camera position by mouse delta but scaled to zoom
	camera.pos[0] -= (mouseX - camera.lastMousePos[0]) / camera.scale;
	camera.pos[1] -= (mouseY - camera.lastMousePos[1]) / camera.scale;

	camera.lastMousePos = [mouseX, mouseY];
}

/**
 * End drag
 */
function cameraRemove(mouseX, mouseY) {
	camera.dragging = false;
}
