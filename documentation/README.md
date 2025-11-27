# Project Documentation

This folder holds some reference material for the space-system simulator project. Each document focuses on one pillar of the system.

---

## Index

### 1. **Physics Engine**

- `physics.md`
  Describe the maths and physics behind the code - forces, collisions, masses, momuntums, etc

### 2. **Rendering**

- `rendering.md`
  Explains how bodies, tails and UI is drawn in p5 and will include three

### 3. **Scaling & Units**

- `scaling.md`
  Details the unit and physics approximations used

### 4. **System Integration**

- `integration.md`
  Covers how the bodies are updated and different versions of integration (eg. Euler vs Verlet)

### 5. **Tooling**

- `tooling.md`
  Explanation of the simple `Node.js` toolchain

---

## Conventions

- All documentation assumes an ES module environment
- Implementation reflect current version _(see `/versions` or tags for historical snapshots)_
- Code examples follow the project's ESLint + Prettier rules

For additional toolchain information, see `/tooling.md`
