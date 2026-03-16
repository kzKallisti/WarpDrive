# WarpDrive Navigation System

## What this is
A browser-based simulated spacecraft navigation system for solar-system-scale travel at the speed of light ("Warp Speed"). Set in a speculative ~2058 timeline where humanity has emergent Moon/Mars colonies but hasn't broken the light-speed barrier.

## Architecture
Zero-build static web app. ES modules loaded via import map (Three.js + lit-html from CDN). Open with `python3 -m http.server` or any static file server. JSDoc type annotations with `// @ts-check` for editor type checking (no build step).

### File structure
```
index.html          — Shell, canvas, UI overlay, import map (Three.js + lit-html)
jsconfig.json       — TypeScript-style checking config for JSDoc annotations
css/style.css       — HUD aesthetic styling
js/
  constants.js      — Physical constants, scale factors, propulsion model, colors, JSDoc types
  bodies.js         — Planet definitions (JPL Keplerian elements, J2000 epoch)
  moons.js          — Moon definitions with parent-relative orbits + nav data
  asteroids.js      — Asteroids, dwarf planets, TNOs, NEAs, comets + nav data
  orbits.js         — Keplerian orbital mechanics engine, coordinate transforms
  pathfinder.js     — Collision-free route planning + transit physics + phase progress
  scene.js          — Three.js scene setup (camera, lighting, starfield, grid)
  renderer.js       — Body meshes, orbit trails, route lines, ship controller, belt zones
  ui.js             — lit-html templates for panels, foldable tables, grouped dropdowns
  main.js           — App bootstrap, tick functions, state, raycasting, camera lerp
```

### Key design decisions
- **True-scale proportions**: `SCALE = 25000` (1 AU = 25000 Three.js units). Bodies and orbits use the same scale factor. `BODY_EXAGGERATION_FACTOR = 20` inflates body radii uniformly for visibility while preserving exact ratios.
- **Always-visible markers**: Bodies have fixed-screen-size sprite markers so they can be found at any zoom level. Marker textures are cached by color (Map) to reduce GPU texture count.
- **Two-pass position resolution**: `getAllPositions()` resolves heliocentric bodies first, then offsets moons by their parent's position.
- **Coordinate transform**: Ecliptic J2000 (XY plane) maps to Three.js Y-up via `auToScene()` in orbits.js. All code uses this single function — never manually swap axes.
- **Camera tracks a body**: `state.cameraTarget` names the body the camera orbits around (default: Earth). Double-click any body to re-target. Camera transitions use exponential lerp (CAMERA config in constants.js).
- **Charted space boundary**: 1000 AU sphere. Beyond is frontier/uncharted.
- **Ship controller pattern**: `createShip()` returns an owned controller object (`{mesh, trail, trailBuffer, trailCount}`). main.js passes it to all ship functions — no module-level mutable state in renderer.js.
- **Route objects owned by main.js**: `drawRoute()` returns objects array, `clearRoute()` takes it. No hidden state in renderer.js.
- **Pre-allocated trail buffer**: Ship trail uses `Float32Array(500*3)` with ring-buffer indexing. Zero allocations per frame.
- **lit-html for UI panels**: Stellar cartography, jump plan, and body detail panel use lit-html declarative templates. Fold/collapse state is view-layer only (Set in ui.js). Simple text updates (time, status) stay vanilla.

## Transit physics model
Seven-phase propulsion model with gravity well awareness:

```
Phase 1: ESCAPE        0 → v_escape       Climb out of departure gravity well (2g)
Phase 2: LAUNCH        v_post → v_warp    Accelerate to warp threshold (may be 0 if already above)
Phase 3: WARP ON       v_warp → c         Fictional drive activation (~1s, ~150K km)
Phase 4: CRUISE        @ c                Constant velocity at speed of light
Phase 5: WARP OFF      c → v_warp         Drive shutdown (~1s, ~150K km)
Phase 6: BRAKE         v_warp → v_capture Decelerate to capture speed (may be 0)
Phase 7: INSERTION     v_capture → 0      Descend into destination gravity well (2g)
```

Ship position during transit uses `computePhaseProgress()` — distance-weighted interpolation
that accounts for acceleration/deceleration kinematics per phase. The ship visually crawls
during escape, leaps during warp cruise, and slows during braking.

The ship inherits orbital velocity from its departure body (prograde). For moons,
`orbitalVelocityKMS` is the parent planet's heliocentric velocity (what the ship inherits
after escaping the moon's gravity well).

Key parameters (in constants.js):
- `SHIP_ACCEL_MS2`: Ship thrust (default 2g = 19.6 m/s²)
- `WARP_THRESHOLD_KMS`: Drive activation speed (50 km/s heliocentric)
- `WARP_TRANSITION_DIST_KM`: Distance covered during 1s drive transition (~150K km)
- `CAMERA`: Zoom profiles with SCALE-relative distances and lerp speed

Each body defines (in bodies.js, moons.js, asteroids.js):
- `escapeVelocityKMS`: escape velocity from surface/low orbit
- `orbitalVelocityKMS`: body's heliocentric orbital velocity (parent's for moons)
- `lowOrbitVelocityKMS`: circular orbit velocity at low orbit altitude

For short distances where warp overhead exceeds trip distance, falls back to conventional
brachistochrone (accel to midpoint, decel to destination).

## State management
All state lives in `Object.seal(state)` in main.js. Mutations happen ONLY through named
transition functions (`setTime`, `setPlaying`, `setCameraTarget`, `engageRoute`, etc.).
Pure functions compute derived values. Side effects (DOM, Three.js) happen at boundaries.

The animation loop calls three tick functions:
- `tickSimulation(dt)` — advance tau, sync body positions
- `tickShipTransit(dt)` — phase tracking, ship position, jump completion
- `tickCamera(dt)` — smooth exponential lerp transitions

### Data sources
- Planet elements: JPL Solar System Dynamics Table 1 (1800-2050 valid range)
- Outer planet corrections: JPL Table 2a (b/c/s/f terms)
- Moon elements: JPL Horizons osculating elements at J2000
- Asteroid/comet elements: JPL Small-Body Database

## Body types
- `star` — Sun
- `planet` — Mercury through Neptune
- `dwarf` — Pluto, Ceres, Eris, Makemake, Haumea, Quaoar, Sedna
- `moon` — has `parent` field referencing parent body name
- `asteroid` — main belt (Vesta, Pallas, Hygiea)
- `nea` — near-Earth asteroids (Apophis, Bennu, Ryugu)
- `comet` — Halley, Encke, Hale-Bopp

## Type system
JSDoc type definitions in constants.js: `Vec3`, `OrbitalElements`, `Body`, `Phase`, `Transit`, `JumpSegment`. All files have `// @ts-check`. Types are checked by the editor via jsconfig.json — no build step.

## Conventions
- Distances in AU internally, displayed as AU and km
- All orbital elements in degrees (converted to radians in orbits.js)
- `HELIOCENTER` (frozen zero-vector) exported from constants.js for distance-from-Sun calculations
- Moons: `a0` is in AU from parent, not from Sun; `orbitalVelocityKMS` is parent's heliocentric velocity
- Stellar cartography groups bodies by orbital system with foldable sections
- Nav fields (`escapeVelocityKMS` etc.) required on all bodies; pathfinder warns if missing
- No module-level mutable state outside main.js (except view-layer `collapsedGroups` in ui.js)
- Renderer functions take explicit objects (ship controller, route objects array) — no closures over hidden state

## Common tasks

### Adding a new body
1. Add to `bodies.js` (planet), `moons.js` (moon with `parent` field), or `asteroids.js` (anything else)
2. Use the same element schema: `a0, aDot, e0, eDot, I0, IDot, L0, LDot, wBar0, wBarDot, omega0, omegaDot`
3. Include nav fields: `escapeVelocityKMS`, `orbitalVelocityKMS`, `lowOrbitVelocityKMS`
4. For moons: `a0` is in AU from parent; `orbitalVelocityKMS` is the parent planet's heliocentric velocity
5. Everything else (rendering, pathfinding, UI) picks it up automatically from the merged `bodies` array

### Running locally
```bash
cd /Users/kallisti/Documents/Claude/WarpDrive
python3 -m http.server 8042
# Open http://localhost:8042
```

## Known limitations
- Keplerian elements are approximations; no perturbation modeling
- High-eccentricity orbits (comets) may have visual artifacts in orbit trails
- Moon orbital elements are simplified (ecliptic-relative, no Laplace plane transforms)
- Single ship, no traffic simulation (planned for future version ~2078 timeline)
- No FTL: max speed is c. Breaking the warp barrier is the premise for a future version
- No relativistic effects (time dilation, Lorentz contraction, mass-energy)
- Body positions frozen at departure time during transit
