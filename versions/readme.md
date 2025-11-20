# Version Archive

Welcome to the **archive of past iterations** of the solar system project.
Each folder inside `versions/` contains a **fully executable snapshot** of the simulation at a specific stage of development, ranging from simple orbiting dots to a more advanced 3D traversable world.

This system exists so that the project can grow without leaving the older builds behind and without cluttering the main repository with 50+ branches.

**-- How the Versioning Works --**

This repo uses a **dual system**:

### 1. Git Tags (Official Milestones)
- Every Major version is stamped with an annotated Git tag
- Tags are the *canonical* record of releases
- Examples
  - `v1.0-basic` - first working 2D orbit viewer
  - `v1.5-pathing` - shows future paths of the 2D orbit viewer
  - `v2.0-leapfrog` - updates physics to use leapfrog integration
  - `v3.0-3d-alpha` - early three.js world experiments

Tags let you quickly check out a stable release without having to dig through folders.

### 2. `versions/` Folders (Reference Builds)
Each folder contains a **snapshot** that can be run directly, without requiring Git.

## Easiest way to use:
1. Open the version folder you want
2. Open the HTML entry point (index.html)
3. Run the simulation immediately

**--**
