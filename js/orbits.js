// @ts-check
// Keplerian orbital mechanics engine
// Converts orbital elements to cartesian coordinates at any time T

import { J2000_MS, MS_PER_DAY, DAYS_PER_CENTURY, SCALE, BODY_EXAGGERATION_FACTOR } from './constants.js';

const DEG = Math.PI / 180;

/**
 * Convert a JS Date (or ms timestamp) to Julian centuries since J2000.0
 */
export function dateToJulianCenturies(date) {
  const ms = typeof date === 'number' ? date : date.getTime();
  return (ms - J2000_MS) / (MS_PER_DAY * DAYS_PER_CENTURY);
}

/**
 * Convert Julian centuries back to a JS Date
 */
export function julianCenturiesToDate(T) {
  return new Date(J2000_MS + T * DAYS_PER_CENTURY * MS_PER_DAY);
}

/**
 * Solve Kepler's equation M = E - e*sin(E) for eccentric anomaly E
 * using Newton-Raphson iteration.
 * M in radians, e dimensionless, returns E in radians.
 */
export function solveKepler(M, e, tol = 1e-10) {
  // Initial guess
  let E = M + e * Math.sin(M);

  for (let i = 0; i < 30; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < tol) break;
  }

  return E;
}

/**
 * Normalize angle to [-180, 180] degrees
 */
function normalizeDeg(angle) {
  let a = angle % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

/**
 * Compute heliocentric cartesian coordinates (AU) for a body at time T
 * T = Julian centuries since J2000.0
 * Returns {x, y, z} in the ecliptic J2000 frame
 * @param {import('./constants.js').Body} body
 * @param {number} T - Julian centuries since J2000.0
 * @returns {import('./constants.js').Vec3}
 */
export function keplerianToCartesian(body, T) {
  if (!body.elements) return { x: 0, y: 0, z: 0 }; // Sun

  const el = body.elements;

  // Compute current orbital elements
  const a     = el.a0     + el.aDot     * T;
  const e     = el.e0     + el.eDot     * T;
  const I     = (el.I0    + el.IDot     * T) * DEG;
  const L     = el.L0     + el.LDot     * T;
  const wBar  = el.wBar0  + el.wBarDot  * T;
  const omega = (el.omega0 + el.omegaDot * T) * DEG;

  // Argument of perihelion (wBar in degrees, omega already in radians)
  const w = wBar * DEG - omega;

  // Mean anomaly
  let M = normalizeDeg(L - wBar);

  // Additional correction for outer planets (Table 2a)
  if (el.b !== undefined) {
    const fT = el.f * T;
    M += el.b * T * T + el.c * Math.cos(fT * DEG) + el.s * Math.sin(fT * DEG);
  }

  M *= DEG; // to radians

  // Solve Kepler's equation for eccentric anomaly
  const E = solveKepler(M, e);

  // Heliocentric coordinates in the orbital plane
  const xPrime = a * (Math.cos(E) - e);
  const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Rotate to ecliptic J2000 frame
  const cosW = Math.cos(w), sinW = Math.sin(w);
  const cosO = Math.cos(omega), sinO = Math.sin(omega);
  const cosI = Math.cos(I), sinI = Math.sin(I);

  const x = (cosW * cosO - sinW * sinO * cosI) * xPrime +
            (-sinW * cosO - cosW * sinO * cosI) * yPrime;

  const y = (cosW * sinO + sinW * cosO * cosI) * xPrime +
            (-sinW * sinO + cosW * cosO * cosI) * yPrime;

  const z = (sinW * sinI) * xPrime +
            (cosW * sinI) * yPrime;

  return { x, y, z };
}

/**
 * Compute positions of all bodies at time T (Julian centuries since J2000)
 * Returns a Map of body name -> {x, y, z} in AU.
 *
 * Two-pass resolution:
 *  1. Heliocentric bodies (planets, asteroids, comets) — position relative to Sun
 *  2. Parent-relative bodies (moons) — offset by parent's heliocentric position
 * @param {import('./constants.js').Body[]} bodies
 * @param {number} T - Julian centuries since J2000.0
 * @returns {Map<string, import('./constants.js').Vec3>}
 */
export function getAllPositions(bodies, T) {
  const positions = new Map();

  // Pass 1: heliocentric bodies
  for (const body of bodies) {
    if (body.parent) continue;
    positions.set(body.name, keplerianToCartesian(body, T));
  }

  // Pass 2: moons — resolve relative to parent, then offset to heliocentric.
  // Moon orbital distances are scaled by BODY_EXAGGERATION_FACTOR so they stay
  // visually outside their parent's exaggerated sphere (same factor applied to both).
  const moonScale = BODY_EXAGGERATION_FACTOR;
  for (const body of bodies) {
    if (!body.parent) continue;
    const parentPos = positions.get(body.parent);
    if (!parentPos) continue;
    const localPos = keplerianToCartesian(body, T);
    positions.set(body.name, {
      x: parentPos.x + localPos.x * moonScale,
      y: parentPos.y + localPos.y * moonScale,
      z: parentPos.z + localPos.z * moonScale,
    });
  }

  return positions;
}

/**
 * Euclidean distance between two 3D points (AU)
 */
export function distance3D(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Convert ecliptic AU coordinates to Three.js scene coordinates.
 * Ecliptic XY plane -> Three.js XZ plane (Y-up).
 * Ecliptic Z (out of plane) -> scene Y.
 * Ecliptic Y -> scene -Z (right-hand rule).
 * @param {import('./constants.js').Vec3} pos - position in AU (ecliptic J2000)
 * @returns {import('./constants.js').Vec3} scene coordinates
 */
export function auToScene(pos) {
  return { x: pos.x * SCALE, y: pos.z * SCALE, z: -pos.y * SCALE };
}
