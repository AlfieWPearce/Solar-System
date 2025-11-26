# Three-js Experiments

This folder contains all tests and prototypes created while learning and integrating Three.js into the solar system simulator. It includes first-person navigation, starfield rendering, lighting setups, orbital views, and UI experiments.

## Features in this Folder

### First-Person Controls

Using `PointLockControl` to create an FPS-style free-flight mode. Clicking anywhere on the canvas locks the mouse and enables movement.

### Starfield Generator

A lightweight points-based starfield to provide depth and orientation, while flying through space.

### Lighting Tests

Experiments include:

- Point Light (Sun)
- Ambient Light (Universal Illumination)
- Hemisphere Light (soft global fill)

### Mini-Map

A secondary camera renders a small top-right view of the solar system. Clicking the mini-map snaps the main camera to an orbital view.

### Scene, Camera, and Renderer Setup

Base Three.js boilerplate code adapted to an ESM environment using:

```html
<script type="importmap">
	...
</script>
<script type="module">
	...
</script>
```

## Running the Tests

Because this project uses ES modules, run it throuhg local server.

### Options

1. **VS Code + Live Server**
   Recommended: I use.

2. **Python Local Server**

```bash
python3 -m http.server
```

3. **Node Static Server**

```bash
npx serve
```

## Purpose

This folder is a playground - safe space to build, break, and rebuild features before integration them into the full solar-system engine.
