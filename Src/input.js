//input.js
// -- user input (mouse, touch, keyboard)

'use strict';

/**
 * Time
 */
function pause() {
	//Run by the onclick function of the pause / play button
	paused = !paused;
}

/**
 * Keyboard
 * Controls:
 *  - Space - Paush / Unpause
 *  - ArrowUp/Down - Speed up/slow down time
 *  - 1..9 - jumps to camera to follow nth body (if exists)
 *  - 0 - unfollow
 */
function keyPressed() {
	//Pause
	if (key === ` ` || key === 'Spacebar') return pause();

	//Speed Control
	if (keyCode === UP_ARROW || keyCode === RIGHT_ARROW) {
		time = Math.min(time + 1, 20);
		return;
	}
	if (keyCode === UP_ARROW || keyCode === RIGHT_ARROW) {
		time = Math.max(time - 1, 1);
		return;
	}

	//Numeric camera follow (1-based index for humans)
	if (key >= `0` && key <= `9`) {
		const targetIdx = parseInt(key, 10) - 1;
		if (idx === -1) {
			camera.following = null;
			return;
		}
		if (targetIdx >= celestialBodies.length) return;
		camera.following = targetIdx;
	}
}
/**
 * Camera
 */
function mousePressed() {
	if (mouseY < 40) return;
	cameraSelect(mouseX, mouseY);
}
function mouseDragged() {
	cameraMove(mouseX, mouseY);
}
function mouseReleased() {
	cameraRemove(mouseX, mouseY);
}
