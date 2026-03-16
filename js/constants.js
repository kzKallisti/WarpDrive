// @ts-check
// Physical constants and configuration
//
// Shared type definitions (JSDoc @typedef) for the codebase.

/**
 * @typedef {{ x: number, y: number, z: number }} Vec3
 */

/**
 * @typedef {Object} OrbitalElements
 * @property {number} a0
 * @property {number} aDot
 * @property {number} e0
 * @property {number} eDot
 * @property {number} I0
 * @property {number} IDot
 * @property {number} L0
 * @property {number} LDot
 * @property {number} wBar0
 * @property {number} wBarDot
 * @property {number} omega0
 * @property {number} omegaDot
 * @property {number} [b]
 * @property {number} [c]
 * @property {number} [s]
 * @property {number} [f]
 */

/**
 * @typedef {Object} Body
 * @property {string} name
 * @property {'star'|'planet'|'dwarf'|'moon'|'asteroid'|'nea'|'comet'} type
 * @property {number} radius
 * @property {number} color
 * @property {string} [parent]
 * @property {OrbitalElements|null} elements
 * @property {number} [escapeVelocityKMS]
 * @property {number} [orbitalVelocityKMS]
 * @property {number} [lowOrbitVelocityKMS]
 */

/**
 * @typedef {Object} Phase
 * @property {string} name
 * @property {number} timeS
 * @property {number} distKM
 * @property {number} v0
 * @property {number} v1
 */

/**
 * @typedef {Object} Transit
 * @property {number} distanceKM
 * @property {number} totalTimeS
 * @property {boolean} warpCapable
 * @property {Phase[]} phases
 */

/**
 * @typedef {Object} JumpSegment
 * @property {Vec3} from
 * @property {Vec3} to
 * @property {string} fromName
 * @property {string} toName
 * @property {number} distanceAU
 * @property {number} distanceKM
 * @property {number} timeSeconds
 * @property {Transit} transit
 */

export const AU_KM = 149597870.7;           // km per Astronomical Unit
export const C_KM_S = 299792.458;           // speed of light in km/s

// Heliocentric origin — shared zero-vector for distance-from-Sun calculations
export const HELIOCENTER = Object.freeze({ x: 0, y: 0, z: 0 });

// J2000.0 epoch: January 1, 2000 at 12:00 TT
export const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

// Scene scale: 1 AU = this many Three.js units.
// At 25000, everything is true proportion — bodies AND orbits use the same scale.
// Earth radius = ~1 unit, Earth orbit = 25000 units, Sun = 116 units,
// Mercury orbit = 9750 units. Sun is 1.2% of the way to Mercury — just like reality.
export const SCALE = 25000;

// Body exaggeration factor: uniform scale-up for visibility while keeping proportions.
// At 20x, Sun = 2320 units (24% of Mercury orbit), Earth = 21 units, Pluto = 4 units.
// Max before Sun hits Mercury orbit: ~83x.
export const BODY_EXAGGERATION_FACTOR = 20;

// Charted space boundary (AU) — beyond this is frontier/uncharted
export const CHARTED_SPACE_AU = 1000;

// Collision margin: multiplier on real body radius for safe corridor
// At 100x, Jupiter's corridor is ~0.048 AU — visible but realistic
export const COLLISION_MARGIN = 100;

// --- Ship propulsion model ---
// Conventional thrust: ship accelerates/decelerates at this rate (m/s²)
// 2g is "operational" — comfortable for trained crew, ~43 min to warp threshold
export const SHIP_ACCEL_MS2 = 2 * 9.80665;  // 2g in m/s²

// Warp threshold: minimum speed to engage the hypersonic drive (km/s)
// Based on speed of sound through the interplanetary medium (~50 km/s)
// Below this, the exotic matter can't form the gravity vacuum for warp
export const WARP_THRESHOLD_KMS = 50;

// Warp engage/disengage time (seconds) — the fictional drive transition
export const WARP_TRANSITION_S = 1;

// Distance covered during warp transition (average of entry/exit speed × time)
// WARP ON: avg of 50 km/s and c over 1s ≈ 149,921 km
export const WARP_TRANSITION_DIST_KM = ((WARP_THRESHOLD_KMS + C_KM_S) / 2) * WARP_TRANSITION_S;

// Time
export const SECONDS_PER_DAY = 86400;
export const DAYS_PER_CENTURY = 36525;
export const MS_PER_DAY = SECONDS_PER_DAY * 1000;

// Camera zoom profiles — all distances relative to SCALE
export const CAMERA = {
  ROUTE_START_DIST: SCALE * 0.0012,     // tight on ship at route start
  DECEL_ZOOM_DIST: SCALE * 0.008,       // zoom in for arrival
  OFFSET: { x: 0.2, y: 0.5, z: 0.8 },  // camera angle (unit direction)
  LERP_SPEED: 3.0,                      // exponential ease speed
};

// UI colors — body colors live in their own data files (bodies.js, moons.js, asteroids.js)
export const COLORS = {
  route:   0x00FF88,
  routeAlt:0xFF4488,
  ship:    0x00FFCC,
  grid:    0x112233,
};
