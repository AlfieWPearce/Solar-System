//input.js
// -- user input (mouse, touch, keyboard)

'use strict';

let togglePause;

//Exports a setupInput helper to wire input handlers into the p5 sketch
export function setupInput(opts = {}) {
	const { s, getTime, onCameraSelect, onCameraMove, onCameraRemove, onWheel, setTime } = opts;
	togglePause = opts.togglePause;

	s.mousePressed = () => {
		if (s.mouseY < 40) return;
		onCameraSelect?.(s.mouseX, s.mouseY);
	};
	s.mouseDragged = () => onCameraMove?.(s.mouseX, s.mouseY);
	s.mouseReleased = () => onCameraRemove?.(s.mouseX, s.mouseY);
	s.mouseWheel = (e) => onWheel?.(e);
	s.keyPressed = () => {
		const key = s.key;

		//Pause / unpause
		if (key === ` ` || key === `Spacebar`) togglePause?.();
		//Speed Control
		if (key == `ArrowUp` || key == `ArrowRight`) setTime?.(Math.min(getTime() + 1, 20));
		if (key == `ArrowDown` || key == `ArrowLeft`) setTime?.(Math.max(getTime() - 1, 1));
	};
}

const pauseBtn = document.getElementById('pause');
pauseBtn.addEventListener('click', togglePause);
