//input.js
// -- user input (mouse, touch, keyboard)

import { pausePlay } from './main.js';

('use strict');

export default class InputController {
	constructor(dom) {
		this.dom = dom;

		window.addEventListener('keydown', (e) => {
			if (e.key == ` `) pausePlay();
		});

		// Panning via mouse drag
		this.dragging = false;
		this.last = { x: 0, y: 0 };
		this.drag = { x: 0, y: 0 };

		dom.addEventListener('mousedown', (e) => {
			this.dragging = true;
			this.last.x = e.clientX;
			this.last.y = e.clientY;
		});
		dom.addEventListener('mousemove', (e) => {
			if (!this.dragging) return;
			this.drag.x = e.clientX - this.last.x;
			this.drag.y = e.clientY - this.last.y;
			this.last.x = e.clientX;
			this.last.y = e.clientY;
		});
		dom.addEventListener('mouseup', () => {
			this.dragging = false;
			this.drag = { x: 0, y: 0 };
		});

		// Touch support
		dom.addEventListener(
			'touchstart',
			(e) => {
				this.dragging = true;
				const t = e.touches[0];
				this.last.x = t.clientX;
				this.last.y = t.clientY;
			},
			{ passive: true }
		);

		dom.addEventListener(
			'touchmove',
			(e) => {
				if (!this.dragging) return;
				const t = e.touches[0];
				this.drag.x = t.clientX - this.last.x;
				this.drag.y = t.clientY - this.last.y;
				this.last.x = t.clientX;
				this.last.y = t.clientY;
			},
			{ passive: true }
		);

		dom.addEventListener(
			'touchend',
			() => {
				this.dragging = false;
				this.drag = { x: 0, y: 0 };
			},
			{ passive: true }
		);

		// Used by camera
		this.consumeDrag = () => {
			const d = { x: this.drag.x, y: this.drag.y };
			this.drag.x = 0;
			this.drag.y = 0;
			return d;
		};

		//Zoom
		this.scrollDelta = 0;
		dom.addEventListener(
			'wheel',
			(e) => {
				this.scrollDelta = e.deltaY;
			},
			{ passive: true }
		);
	}

	consumeDrag() {
		const d = { ...this.dragDelta };
		this.dragDelta.x = 0;
		this.dragDelta.y = 0;
		return d;
	}

	consumeScroll() {
		const s = this.scrollDelta;
		this.scrollDelta = 0;
		return s;
	}
}
