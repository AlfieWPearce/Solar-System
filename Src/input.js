/**
 * Time
 */
function pause() {
	paused = !paused;
}

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
