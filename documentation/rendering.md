# Rendering

**-- Overview --**

Everything drawn on-screen is handled through the render system. It takes world coordinates, apply camera transforms, and displays the bodies.

**--**

**Rendering Library**

- _P5_ is great for drawing 2D graphics

**Rendering Tasks**

1. _Apply camera zoom and pan_ (follow mode or manual input)
2. _Draw bodies_ using their colour, position and radius
3. _Draw trails_ if enabled - decrease radius and alpha the further away from the body it is
4. _Render labels_ for any selected object
