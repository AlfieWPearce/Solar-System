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
	console.log(key, keyCode);
	//Pause
	if (key === ` ` || key === 'Spacebar') return pause();

	//Speed Control
	if (key == `ArrowUp` || key == `ArrowRight`) {
		time = Math.min(time + 1, 20);
		return;
	}
	if (key == `ArrowDown` || key == `ArrowLeft`) {
		time = Math.max(time - 1, 1);
		return;
	}

	//Numeric camera follow (1-based index for humans)
	if (key >= `0` && key <= `9`) {
		const targetIdx = parseInt(key, 10) - 1;
		camera.following =
			targetIdx >= 0 && targetIdx < celestialBodies.length ? targetIdx : null;
	}
}
/**
 * Camera
 */
function startInput(mouseX, mouseY) {
	if (mouseY < 40) return;
	cameraSelect(mouseX, mouseY);
}
function mousePressed() {
	startInput(mouseX, mouseY);
}
function touchStarted() {
	startInput(touchX, touchY);
}

function moveInput(mouseX, mouseY) {
	cameraMove(mouseX, mouseY);
}
function mouseDragged() {
	moveInput(mouseX, mouseY);
}
function touchMoved() {
	moveInput(touchX, touchY);
}

function endInput(mouseX, mouseY) {
	cameraRemove(mouseX, mouseY);
}
function mouseReleased() {
	endInput(mouseX, mouseY);
}
function touchEnded() {
	endInput(touchX, touchY);
}
