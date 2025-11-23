# Physics Engine

**-- Overview --**

The physics system drives motion, gravity, and collisions. Each update step applies Newtonian gravitation between every pair of bodies and integrates their motion. Bodies move according to their velocities, which themselves evolve under gravitational acceleration.

**--**

**Gravity**

- Uses Newton's law: `F = G·M·m / r²`,
- From this the acceleration on eac body is computed `a = F / m`,
- A minimum 'softening' distance prevents infinite forces when bodies overlap.

**Collision Handling**

- After each physics step, all bodies are checked for overlap,
- If two bodies collide, they merge, (coalesce)
- The merge conserves:
     - _Mass_ (added),
     - _Momentum_ `p = m·v`,
     - _Centre of mass_ position,
     - _Density_ averaged.
- The merged body's radius is computed consistently from mass and density.

**Trails**

- If trail length is defined (as of v2.0 it is 50), each update appends the current position to a trail array
- Old points are removed if the trail is now too long
