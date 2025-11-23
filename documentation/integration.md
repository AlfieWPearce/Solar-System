# Integration Methods

**-- Overview --**

Numerical integration is what allows the computation of advancing a position and a velocity.

- It is the only possible way for the location of celestial bodies to be calculated.

**--**

Below are several major integration schemes, their properties, and notes on usage. (as a rule these get more complex the further down the rabbit hole you go)

**Explicit Euler** - v1.0-basic

- Easiest to code.
- Updates velocity, then position.
- _Not energy conserving_, causin orbits to degrade.
- Good for simple demos; bad for long-term simulations.

**Semi-Implicit Euler (Symplectic Euler)**

- Updates velocity before position.
- More stable for gravtational systems.
- Slightly better energy behaviou

**Leapfrog** - v2.0-leapfrog

- Splits velocity update into half-steps.
- Very stable for orbital mechanics.
- _Symplectic_ - conserves energy over long times.
- Favoured for N-body physics.

**Velocity Verlet**

- Similar to Leapfrog but expresses updtaes in a slightly different form.
- Popular in molecular dynamics.

**Runge-Kutta (RK2, RK4)**

- Very accurate for the short-term.
- Not symplectic - long orbital runs drift.
- RK4 is the traditional "gold standard" for general ODE solving.

**Adaptive Time-Step Integration**

- Adjust timestep depending on acceleration.
- Often combined with RK methods.
- Good for eccentric orbits (where acceleration varies constantly).

**High-Order Simplectic Integrators**

- Specialised for stable long-term orbital simulation.
- Used in planetary simulation libraries
