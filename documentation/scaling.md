# Scaling

**-- Overview --**

Certain approximations had to be made to allow the code to work.

**--**

**Units**

The simulation doesn't use real metres - instead it uses _simultion units_.

1 simulation unit is 1 pixel on the canvas when the camera is at the scale of 1.

**Some Approximations**

- Actual astronomical masses are not used. Instead, density & radius define mass
- G (gravitational constant) is tuned for stability and aesthetics rather than realism.
- Distance and velocites are scaled to avoid extreme numbers
- No relativistic effects, axial tilts, precession, or orbital perturbation models
