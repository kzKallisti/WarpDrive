// @ts-check
// Collision-free route planning through the solar system
// Uses visibility graph approach with waypoint insertion around blocking bodies
// Transit model: Launch (conventional) → Warp Engage → Cruise @ c → Warp Disengage → Approach (conventional)

import {
  AU_KM, C_KM_S, COLLISION_MARGIN, SECONDS_PER_DAY, HELIOCENTER,
  SHIP_ACCEL_MS2, WARP_THRESHOLD_KMS, WARP_TRANSITION_S,
  WARP_TRANSITION_DIST_KM,
} from './constants.js';
import { distance3D } from './orbits.js';

/**
 * Compute time and distance for a constant-acceleration burn.
 * @param {number} deltaVKMS - delta-v in km/s
 * @returns {{ timeS: number, distKM: number }}
 */
function accelPhase(deltaVKMS) {
  const deltaV_ms = deltaVKMS * 1000;
  const timeS = deltaV_ms / SHIP_ACCEL_MS2;
  const distKM = (deltaV_ms * timeS / 2) / 1000; // d = v_avg * t = (deltaV/2) * t
  return { timeS, distKM };
}

/**
 * Look up a body definition by name from the bodies list passed to findRoute.
 * Returns nav-relevant fields with safe defaults for waypoints.
 */
function getBodyNav(name, bodiesList) {
  if (name.startsWith('WP-')) {
    // Waypoint in open space — no gravity well, ship maintains warp threshold speed.
    // Only warp transitions needed (drop out, change heading, re-engage).
    return { escapeVelocityKMS: 0, orbitalVelocityKMS: WARP_THRESHOLD_KMS, lowOrbitVelocityKMS: 0 };
  }
  const body = bodiesList.find(b => b.name === name);
  if (!body) {
    console.warn(`[pathfinder] Unknown body "${name}" — treating as zero gravity`);
    return { escapeVelocityKMS: 0, orbitalVelocityKMS: 0, lowOrbitVelocityKMS: 0 };
  }
  if (body.escapeVelocityKMS === undefined) {
    console.warn(`[pathfinder] ${name} missing nav data — treating as zero gravity`);
  }
  return {
    escapeVelocityKMS: body.escapeVelocityKMS ?? 0,
    orbitalVelocityKMS: body.orbitalVelocityKMS ?? 0,
    lowOrbitVelocityKMS: body.lowOrbitVelocityKMS ?? 0,
  };
}

/**
 * Compute transit phases for a jump segment.
 *
 * The ship inherits orbital velocity from its departure body (prograde departure assumed).
 * Combined with low-orbit velocity, this gives an initial heliocentric speed.
 * The ship must reach the warp threshold (50 km/s heliocentric) to engage the drive.
 * On arrival, it must match the destination's orbital velocity and insert into orbit.
 *
 * Phases:
 *   ESCAPE    — climb out of departure gravity well (0 → v_escape at 2g)
 *   LAUNCH    — accelerate from post-escape speed to warp threshold (may be 0 if already above)
 *   WARP ON   — drive activation (v_warp → c, ~1s)
 *   CRUISE    — constant velocity at c
 *   WARP OFF  — drive shutdown (c → v_warp, ~1s)
 *   BRAKE     — decelerate from warp threshold to capture speed (may be 0)
 *   INSERTION — descend into destination gravity well (v_escape → 0 at 2g)
 *
 * Falls back to conventional brachistochrone when distance < overhead (body-specific).
 * @param {number} distanceKM
 * @param {string} originName
 * @param {string} destName
 * @param {import('./constants.js').Body[]} bodiesList
 * @returns {import('./constants.js').Transit}
 */
function computeTransit(distanceKM, originName, destName, bodiesList) {
  const origin = getBodyNav(originName, bodiesList);
  const dest = getBodyNav(destName, bodiesList);

  const result = { distanceKM, totalTimeS: 0, warpCapable: false, phases: [] };

  // Heliocentric speed after escaping departure gravity well (prograde).
  // The escape burn spends lowOrbitVelocity climbing out of the well;
  // the ship's heliocentric speed post-escape ≈ the body's orbital velocity.
  const postEscapeSpeed = origin.orbitalVelocityKMS;

  // Heliocentric speed at which the ship must arrive to be captured by destination.
  // Symmetric: the ship must match the destination's orbital velocity before insertion.
  const preInsertSpeed = dest.orbitalVelocityKMS;

  // Total overhead distance for warp (escape + launch-to-threshold + transitions + brake + insertion)
  const escapeDeltaV = origin.escapeVelocityKMS;
  const launchDeltaV = Math.max(0, WARP_THRESHOLD_KMS - postEscapeSpeed);
  const brakeDeltaV = Math.max(0, WARP_THRESHOLD_KMS - preInsertSpeed);
  const insertDeltaV = dest.escapeVelocityKMS;

  const escapePhase = accelPhase(escapeDeltaV);
  const launchPhase = accelPhase(launchDeltaV);
  const brakePhase = accelPhase(brakeDeltaV);
  const insertPhase = accelPhase(insertDeltaV);

  const overheadDist = escapePhase.distKM + launchPhase.distKM +
                       2 * WARP_TRANSITION_DIST_KM +
                       brakePhase.distKM + insertPhase.distKM;

  result.warpCapable = distanceKM >= overheadDist;

  if (!result.warpCapable) {
    // Conventional brachistochrone (no warp)
    const dMeters = distanceKM * 1000;
    const totalTime = 2 * Math.sqrt(dMeters / SHIP_ACCEL_MS2);
    const halfTime = totalTime / 2;
    const maxSpeedKMS = (SHIP_ACCEL_MS2 * halfTime) / 1000;

    result.totalTimeS = totalTime;
    result.phases = [
      { name: 'ACCEL', timeS: halfTime, distKM: distanceKM / 2, v0: 0, v1: maxSpeedKMS },
      { name: 'DECEL', timeS: halfTime, distKM: distanceKM / 2, v0: maxSpeedKMS, v1: 0 },
    ];
    return result;
  }

  // Warp transit — full phase breakdown
  const cruiseDistKM = distanceKM - overheadDist;
  const cruiseTimeS = cruiseDistKM / C_KM_S;

  const phases = [];

  // Departure
  if (escapePhase.timeS > 0) {
    phases.push({ name: 'ESCAPE', timeS: escapePhase.timeS, distKM: escapePhase.distKM,
      v0: 0, v1: escapeDeltaV });
  }
  if (launchPhase.timeS > 0) {
    phases.push({ name: 'LAUNCH', timeS: launchPhase.timeS, distKM: launchPhase.distKM,
      v0: postEscapeSpeed, v1: WARP_THRESHOLD_KMS });
  }

  // Warp
  phases.push({ name: 'WARP ON', timeS: WARP_TRANSITION_S, distKM: WARP_TRANSITION_DIST_KM,
    v0: WARP_THRESHOLD_KMS, v1: C_KM_S });
  phases.push({ name: 'CRUISE', timeS: cruiseTimeS, distKM: cruiseDistKM,
    v0: C_KM_S, v1: C_KM_S });
  phases.push({ name: 'WARP OFF', timeS: WARP_TRANSITION_S, distKM: WARP_TRANSITION_DIST_KM,
    v0: C_KM_S, v1: WARP_THRESHOLD_KMS });

  // Arrival
  if (brakePhase.timeS > 0) {
    phases.push({ name: 'BRAKE', timeS: brakePhase.timeS, distKM: brakePhase.distKM,
      v0: WARP_THRESHOLD_KMS, v1: preInsertSpeed });
  }
  if (insertPhase.timeS > 0) {
    phases.push({ name: 'INSERTION', timeS: insertPhase.timeS, distKM: insertPhase.distKM,
      v0: dest.escapeVelocityKMS, v1: 0 });
  }

  result.totalTimeS = phases.reduce((s, p) => s + p.timeS, 0);
  result.phases = phases;
  return result;
}

/**
 * Build a jump segment object from two points, with full transit physics.
 * Accepts bodiesList to look up gravity well data for origin/destination.
 * @param {import('./constants.js').Vec3} from
 * @param {import('./constants.js').Vec3} to
 * @param {string} fromName
 * @param {string} toName
 * @param {import('./constants.js').Body[]} bodiesList
 * @returns {import('./constants.js').JumpSegment}
 */
function makeSegment(from, to, fromName, toName, bodiesList) {
  const d = distance3D(from, to);
  const distanceKM = d * AU_KM;
  const transit = computeTransit(distanceKM, fromName, toName, bodiesList);

  return {
    from, to, fromName, toName,
    distanceAU: d,
    distanceKM,
    timeSeconds: transit.totalTimeS,
    transit,
  };
}

/**
 * Get the collision radius for a body in AU
 */
function collisionRadius(body) {
  return (body.radius / AU_KM) * COLLISION_MARGIN;
}

/**
 * Get position for a body (Sun is always at origin)
 */
function bodyPosition(body, positions) {
  return body.name === 'Sun' ? HELIOCENTER : positions.get(body.name);
}

/**
 * Test if a line segment from A to B intersects a sphere at center C with radius r.
 * Returns { intersects, distance } where distance is closest approach.
 */
function segmentSphereIntersect(a, b, center, radius) {
  const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
  const fx = a.x - center.x, fy = a.y - center.y, fz = a.z - center.z;

  const segLenSq = dx * dx + dy * dy + dz * dz;
  if (segLenSq < 1e-20) return { intersects: false, distance: Infinity };

  const t = Math.max(0, Math.min(1, -(fx * dx + fy * dy + fz * dz) / segLenSq));

  const cx = a.x + t * dx - center.x;
  const cy = a.y + t * dy - center.y;
  const cz = a.z + t * dz - center.z;
  const distance = Math.sqrt(cx * cx + cy * cy + cz * cz);

  return { intersects: distance < radius, distance };
}

/**
 * Check if a segment from A to B is clear of all body collision spheres.
 */
function checkSegmentClear(a, b, bodies, positions, excludeNames = new Set()) {
  for (const body of bodies) {
    if (excludeNames.has(body.name)) continue;
    const pos = bodyPosition(body, positions);
    if (!pos) continue;
    const result = segmentSphereIntersect(a, b, pos, collisionRadius(body));
    if (result.intersects) return { clear: false, blocker: body, distance: result.distance };
  }
  return { clear: true };
}

/**
 * Generate waypoints to route around a blocking body.
 */
function generateWaypoints(a, b, blockerPos, safeRadius) {
  const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const dir = { x: dx / len, y: dy / len, z: dz / len };

  let perp;
  if (Math.abs(dir.x) < 0.9) {
    perp = { x: 0, y: -dir.z, z: dir.y };
  } else {
    perp = { x: -dir.z, y: 0, z: dir.x };
  }
  const pLen = Math.sqrt(perp.x ** 2 + perp.y ** 2 + perp.z ** 2);
  perp.x /= pLen; perp.y /= pLen; perp.z /= pLen;

  const perp2 = {
    x: dir.y * perp.z - dir.z * perp.y,
    y: dir.z * perp.x - dir.x * perp.z,
    z: dir.x * perp.y - dir.y * perp.x,
  };

  const offset = safeRadius * 1.5;
  const waypoints = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    waypoints.push({
      x: blockerPos.x + offset * (cos * perp.x + sin * perp2.x),
      y: blockerPos.y + offset * (cos * perp.y + sin * perp2.y),
      z: blockerPos.z + offset * (cos * perp.z + sin * perp2.z),
    });
  }
  return waypoints;
}

/**
 * Find a collision-free route from origin to destination.
 * Returns array of jump segments with full transit physics.
 * @param {import('./constants.js').Vec3} origin
 * @param {import('./constants.js').Vec3} destination
 * @param {string} originName
 * @param {string} destName
 * @param {import('./constants.js').Body[]} bodies
 * @param {Map<string, import('./constants.js').Vec3>} positions
 * @param {number} [maxDepth]
 * @returns {import('./constants.js').JumpSegment[]}
 */
export function findRoute(origin, destination, originName, destName, bodies, positions, maxDepth = 5) {
  const exclude = new Set([originName, destName]);
  return findRouteRecursive(origin, destination, originName, destName, bodies, positions, exclude, 0, maxDepth);
}

function findRouteRecursive(from, to, fromName, toName, bodies, positions, exclude, depth, maxDepth) {
  const check = checkSegmentClear(from, to, bodies, positions, exclude);
  if (check.clear || depth >= maxDepth) {
    return [makeSegment(from, to, fromName, toName, bodies)];
  }

  const blocker = check.blocker;
  const blockerPos = bodyPosition(blocker, positions);
  const safeRadius = collisionRadius(blocker);
  const waypoints = generateWaypoints(from, to, blockerPos, safeRadius);

  let bestWP = null;
  let bestCost = Infinity;

  for (const wp of waypoints) {
    let insideBody = false;
    for (const body of bodies) {
      if (exclude.has(body.name)) continue;
      const bPos = bodyPosition(body, positions);
      if (bPos && distance3D(wp, bPos) < collisionRadius(body)) {
        insideBody = true;
        break;
      }
    }
    if (insideBody) continue;

    const cost = distance3D(from, wp) + distance3D(wp, to);
    if (cost < bestCost) {
      bestCost = cost;
      bestWP = wp;
    }
  }

  if (!bestWP) {
    return [makeSegment(from, to, fromName, toName, bodies)];
  }

  const wpName = `WP-${blocker.name}`;
  const leg1 = findRouteRecursive(from, bestWP, fromName, wpName, bodies, positions, exclude, depth + 1, maxDepth);
  const leg2 = findRouteRecursive(bestWP, to, wpName, toName, bodies, positions, exclude, depth + 1, maxDepth);
  return [...leg1, ...leg2];
}

/**
 * Compute distance-weighted progress (0–1) along a transit at a given elapsed time.
 *
 * Unlike time/totalTime (which produces constant visual speed), this uses
 * accumulated phase distances so the ship appears to accelerate during
 * ESCAPE/LAUNCH, leap forward during CRUISE at c, and slow during BRAKE/INSERTION.
 *
 * Within constant-acceleration phases: d(t) = v0*t + (v1-v0)/(2T) * t²
 * Within constant-velocity phases (CRUISE): d(t) = v * t (linear)
 * @param {import('./constants.js').Transit} transit
 * @param {number} elapsed - seconds elapsed
 * @returns {number} progress 0–1
 */
export function computePhaseProgress(transit, elapsed) {
  const totalDist = transit.distanceKM;
  if (totalDist <= 0) return 1;

  let cumulativeDist = 0;
  let cumulativeTime = 0;

  for (const phase of transit.phases) {
    const phaseEnd = cumulativeTime + phase.timeS;

    if (elapsed < phaseEnd) {
      const t = elapsed - cumulativeTime;
      const T = phase.timeS;
      let phaseDistCovered;

      if (T <= 0) {
        phaseDistCovered = phase.distKM;
      } else if (phase.v0 === phase.v1) {
        // Constant velocity (CRUISE) — linear
        phaseDistCovered = phase.distKM * (t / T);
      } else {
        // Constant acceleration: d(t) = v0*t + (v1-v0)/(2T) * t²
        const v0 = phase.v0;
        const v1 = phase.v1;
        phaseDistCovered = v0 * t + (v1 - v0) / (2 * T) * t * t;
      }

      return Math.min(1, (cumulativeDist + phaseDistCovered) / totalDist);
    }

    cumulativeDist += phase.distKM;
    cumulativeTime = phaseEnd;
  }

  return 1;
}

/**
 * Format time duration in human-readable form
 */
export function formatTime(seconds) {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < SECONDS_PER_DAY) return `${(seconds / 3600).toFixed(2)} hrs`;
  return `${(seconds / SECONDS_PER_DAY).toFixed(2)} days`;
}

/**
 * Format speed in human-readable form
 */
export function formatSpeed(kms) {
  if (kms >= C_KM_S * 0.99) return 'c';
  if (kms >= 1000) return `${(kms / 1000).toFixed(0)}K km/s`;
  return `${kms.toFixed(1)} km/s`;
}
