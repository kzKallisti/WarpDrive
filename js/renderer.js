// @ts-check
// Visual object management: body meshes, orbit trails, route lines, ship

import * as THREE from 'three';
import { SCALE, AU_KM, BODY_EXAGGERATION_FACTOR as BEF, CHARTED_SPACE_AU, COLORS } from './constants.js';
import { keplerianToCartesian, auToScene } from './orbits.js';

/**
 * Apply auToScene result to a Three.js Vector3 or Object3D position
 */
function applyScenePos(target, auPos) {
  const s = auToScene(auPos);
  target.set(s.x, s.y, s.z);
}

function auToVec3(auPos) {
  const s = auToScene(auPos);
  return new THREE.Vector3(s.x, s.y, s.z);
}

/**
 * Compute display radius for a body — true proportions, no caps.
 * At SCALE=25000 with BEF=1, everything is to real scale.
 */
function getDisplayRadius(body) {
  return (body.radius / AU_KM) * SCALE * BEF;
}

/**
 * Create meshes for all solar system bodies
 * Returns Map of body name -> { mesh, displayRadius, body }
 */
export function createBodies(scene, bodiesData) {
  const meshMap = new Map();

  for (const body of bodiesData) {
    const displayRadius = getDisplayRadius(body);
    let material;

    if (body.type === 'star') {
      material = new THREE.MeshBasicMaterial({ color: body.color });

      // Glow shell
      const glowGeo = new THREE.SphereGeometry(displayRadius * 2, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: body.color,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      scene.add(glow);
      meshMap.set(body.name + '_glow', { mesh: glow });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: body.color,
        roughness: 0.7,
        metalness: 0.1,
      });
    }

    const geometry = new THREE.SphereGeometry(displayRadius, 32, 24);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Invisible hit-test sphere — guarantees clickable area regardless of body scale.
    // Moons get smaller hit spheres to avoid overlapping with their parent planet.
    const minHit = body.parent ? 100 : 500;
    const hitRadius = Math.max(displayRadius * 3, minHit);
    const hitGeo = new THREE.SphereGeometry(hitRadius, 8, 6);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    mesh.add(hitMesh);

    // Always-visible marker sprite
    const markerSize = { star: 2, planet: 3, dwarf: 2.5, moon: 2, asteroid: 1.5, nea: 2, comet: 2 }[body.type] || 2;
    const marker = createMarker(body.color, markerSize);
    mesh.add(marker);

    // Text label (sprite)
    const label = createLabel(body.name, body.color);
    label.position.y = Math.max(displayRadius * 1.5, 1);
    mesh.add(label);

    meshMap.set(body.name, { mesh, hitMesh, marker, displayRadius, body });
  }

  return meshMap;
}

// Texture cache: bodies sharing the same color reuse one marker texture (~50 → ~20)
const markerTextureCache = new Map();

function getMarkerTexture(color) {
  const key = new THREE.Color(color).getHexString();
  if (markerTextureCache.has(key)) return markerTextureCache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const hex = new THREE.Color(color).getStyle();
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, hex);
  gradient.addColorStop(0.15, hex);
  gradient.addColorStop(0.5, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  markerTextureCache.set(key, texture);
  return texture;
}

/**
 * Create a fixed-screen-size marker dot for a body.
 * Uses cached texture — bodies with the same color share one GPU texture.
 */
function createMarker(color, size = 3) {
  const material = new THREE.SpriteMaterial({
    map: getMarkerTexture(color),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    sizeAttenuation: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size / 200, size / 200, 1);
  sprite.renderOrder = 999;
  return sprite;
}

/**
 * Create a text sprite label (fixed screen size)
 */
function createLabel(text, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;

  ctx.font = '24px monospace';
  ctx.fillStyle = '#' + new THREE.Color(color).getHexString();
  ctx.globalAlpha = 0.8;
  ctx.textAlign = 'center';
  ctx.fillText(text, 128, 36);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.06, 0.015, 1);
  sprite.userData.isLabel = true;
  return sprite;
}

/**
 * Update body mesh positions from computed orbital positions
 */
export function updateBodyPositions(meshMap, positions) {
  for (const [name, pos] of positions) {
    const entry = meshMap.get(name);
    if (!entry) continue;
    applyScenePos(entry.mesh.position, pos);

    const glow = meshMap.get(name + '_glow');
    if (glow) glow.mesh.position.copy(entry.mesh.position);
  }
}

/**
 * Scale labels based on camera distance and body size.
 * Larger bodies get proportionally larger labels.
 * Clamped so labels never vanish or overwhelm.
 */
export function updateLabelScales(meshMap, camera) {
  const MIN_SCALE = 0.03;
  const MAX_SCALE = 0.2;
  const REF_DIST = 5000;
  const REF_RADIUS = 20; // Earth-ish display radius as baseline

  for (const [name, entry] of meshMap) {
    if (!entry.mesh || !entry.displayRadius) continue;
    const label = entry.mesh.children.find(c => c.userData.isLabel);
    if (!label) continue;

    const dist = camera.position.distanceTo(entry.mesh.position);
    const distFactor = REF_DIST / Math.max(dist, 1);
    // Body size factor: sqrt to dampen the range (Sun won't be 100x bigger than Pluto)
    const sizeFactor = Math.sqrt(entry.displayRadius / REF_RADIUS);
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, 0.06 * distFactor * sizeFactor));
    label.scale.set(s * 4, s, 1);
    label.position.y = Math.max(entry.displayRadius * 1.5, 1) + s * 500;
  }
}

/**
 * Draw orbit trail for a body (one full orbit period sampled).
 * For moons, the trail is drawn centered on the parent's current position.
 * @param {Map} [positions] - current positions map (needed for moon parent offset)
 */
function drawOrbitTrail(scene, body, T, positions) {
  if (!body.elements) return null;

  const e = body.elements.e0;
  const a = body.elements.a0;
  const periodCenturies = Math.sqrt(a * a * a) / 100;

  // More sample points for eccentric orbits (comets need dense sampling near perihelion)
  const numPoints = e > 0.8 ? 2000 : e > 0.3 ? 720 : 360;

  // For moons, offset trail by parent's current position and scale by BEF
  // (same scaling as getAllPositions in orbits.js — keeps trail outside exaggerated parent)
  const parentOffset = body.parent && positions
    ? positions.get(body.parent)
    : null;
  const moonScale = body.parent ? BEF : 1;

  const points = [];
  let prevPos = null;

  for (let i = 0; i <= numPoints; i++) {
    const t = T + (i / numPoints) * periodCenturies;
    const localPos = keplerianToCartesian(body, t);

    // Validate — skip NaN/Infinity from solver edge cases
    if (!isFinite(localPos.x) || !isFinite(localPos.y) || !isFinite(localPos.z)) continue;

    const pos = parentOffset
      ? { x: parentOffset.x + localPos.x * moonScale, y: parentOffset.y + localPos.y * moonScale, z: parentOffset.z + localPos.z * moonScale }
      : localPos;

    // Skip wild jumps (artifact from solver failures on extreme eccentricity)
    if (prevPos) {
      const dx = pos.x - prevPos.x, dy = pos.y - prevPos.y, dz = pos.z - prevPos.z;
      const jump = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (jump > a * 2) { prevPos = pos; continue; }
    }

    points.push(auToVec3(pos));
    prevPos = pos;
  }

  if (points.length < 2) return null;

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: body.color,
    transparent: true,
    opacity: body.parent ? 0.15 : 0.2,
  });

  const line = new THREE.Line(geometry, material);
  line.userData.isOrbitTrail = true;
  scene.add(line);
  return line;
}

/**
 * Draw all orbit trails
 * @param {Map} [positions] - current positions (for moon parent offsets)
 */
export function drawAllOrbitTrails(scene, bodiesData, T, positions) {
  return bodiesData
    .map(body => drawOrbitTrail(scene, body, T, positions))
    .filter(Boolean);
}

/**
 * Draw asteroid belt and Kuiper belt as translucent ring zones
 */
export function drawBeltZones(scene) {
  // Belt regions (flat rings on ecliptic)
  const beltDefs = [
    { innerAU: 2.2, outerAU: 3.2, color: 0x554433, opacity: 0.04 },  // Asteroid belt
    { innerAU: 30, outerAU: 50, color: 0x334455, opacity: 0.025 },    // Kuiper belt
  ];

  for (const belt of beltDefs) {
    const geo = new THREE.RingGeometry(belt.innerAU * SCALE, belt.outerAU * SCALE, 128);
    const mat = new THREE.MeshBasicMaterial({
      color: belt.color,
      transparent: true,
      opacity: belt.opacity,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
  }

  // Charted space boundary — wireframe sphere at 1000 AU
  const boundaryRadius = CHARTED_SPACE_AU * SCALE;
  const boundaryGeo = new THREE.SphereGeometry(boundaryRadius, 64, 32);
  const boundaryMat = new THREE.MeshBasicMaterial({
    color: 0x003322,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
  scene.add(boundary);

  // Boundary ring on ecliptic (brighter, marks the equator of charted space)
  const ringGeo = new THREE.RingGeometry(boundaryRadius - 200, boundaryRadius + 200, 256);
  const ringMat = new THREE.MeshBasicMaterial({
    color: COLORS.route,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  scene.add(ring);

  // Label at boundary edge
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512;
  labelCanvas.height = 64;
  const ctx = labelCanvas.getContext('2d');
  ctx.font = '24px monospace';
  ctx.fillStyle = '#00ff8866';
  ctx.textAlign = 'center';
  ctx.fillText('CHARTED SPACE BOUNDARY — 1000 AU', 256, 36);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const labelMat = new THREE.SpriteMaterial({
    map: labelTex,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: false,
  });
  const label = new THREE.Sprite(labelMat);
  label.scale.set(0.25, 0.03, 1);
  label.position.set(boundaryRadius, 0, 0);
  scene.add(label);
}


// --- Route visualization ---
// Route objects are returned to the caller (main.js owns the lifecycle).

/**
 * Draw route as a series of line segments with waypoint markers.
 * Returns an array of Three.js objects for the caller to manage.
 */
export function drawRoute(scene, jumps) {
  const objects = [];

  for (let i = 0; i < jumps.length; i++) {
    const jump = jumps[i];
    const from = auToVec3(jump.from);
    const to = auToVec3(jump.to);

    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({
      color: i % 2 === 0 ? COLORS.route : COLORS.routeAlt,
      linewidth: 2,
      transparent: true,
      opacity: 0.8,
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    objects.push(line);

    if (jump.fromName.startsWith('WP-')) {
      const wpGeo = new THREE.OctahedronGeometry(0.3, 0);
      const wpMat = new THREE.MeshBasicMaterial({ color: COLORS.route });
      const wpMesh = new THREE.Mesh(wpGeo, wpMat);
      wpMesh.position.copy(from);
      scene.add(wpMesh);
      objects.push(wpMesh);
    }
  }

  return objects;
}

/**
 * Remove route visualization. Caller passes the array returned by drawRoute.
 */
export function clearRoute(scene, routeObjects) {
  for (const obj of routeObjects) {
    obj.geometry?.dispose();
    obj.material?.dispose();
    scene.remove(obj);
  }
}

// --- Ship ---
// Ship state is encapsulated in a controller object returned by createShip.
// Trail uses a pre-allocated Float32Array buffer (zero allocations per frame).

const MAX_TRAIL_POINTS = 500;

/**
 * Create ship mesh and trail buffer. Returns a ship controller object.
 * All ship functions take this object — no module-level mutable state.
 */
export function createShip(scene) {
  const geo = new THREE.ConeGeometry(0.3, 1.2, 6);
  geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: COLORS.ship });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.visible = false;
  scene.add(mesh);

  // Crosshair reticle — always visible at any zoom
  const reticle = createShipReticle(COLORS.ship);
  mesh.add(reticle);

  // Label
  const label = createLabel('SHIP', COLORS.ship);
  label.position.y = 1;
  reticle.add(label);

  // Pre-allocated trail buffer (zero alloc per frame)
  const trailBuffer = new Float32Array(MAX_TRAIL_POINTS * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailBuffer, 3));
  trailGeo.setDrawRange(0, 0);
  const trailMat = new THREE.LineBasicMaterial({
    color: COLORS.ship,
    transparent: true,
    opacity: 0.3,
  });
  const trail = new THREE.Line(trailGeo, trailMat);
  trail.frustumCulled = false;
  scene.add(trail);

  return { mesh, trail, trailBuffer, trailCount: 0 };
}

/**
 * Create the ship's crosshair reticle sprite (ring + dot + crosshairs)
 */
function createShipReticle(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const hex = new THREE.Color(color).getStyle();

  ctx.strokeStyle = hex;
  ctx.fillStyle = hex;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(32, 32, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(32, 32, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(32, 8); ctx.lineTo(32, 18);
  ctx.moveTo(32, 46); ctx.lineTo(32, 56);
  ctx.moveTo(8, 32); ctx.lineTo(18, 32);
  ctx.moveTo(46, 32); ctx.lineTo(56, 32);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.05, 0.05, 1);
  sprite.renderOrder = 1000;
  return sprite;
}

/**
 * Update ship position along a jump segment.
 * Uses pre-allocated trail buffer — no allocations per frame.
 */
export function updateShipPosition(ship, jump, progress) {
  ship.mesh.visible = true;

  const from = auToVec3(jump.from);
  const to = auToVec3(jump.to);
  ship.mesh.position.lerpVectors(from, to, progress);
  ship.mesh.lookAt(to);

  // Append to pre-allocated trail ring buffer (wraps at MAX_TRAIL_POINTS)
  const i = ship.trailCount % MAX_TRAIL_POINTS;
  ship.trailBuffer[i * 3]     = ship.mesh.position.x;
  ship.trailBuffer[i * 3 + 1] = ship.mesh.position.y;
  ship.trailBuffer[i * 3 + 2] = ship.mesh.position.z;
  ship.trailCount++;
  ship.trail.geometry.attributes.position.needsUpdate = true;
  ship.trail.geometry.setDrawRange(0, Math.min(ship.trailCount, MAX_TRAIL_POINTS));
}

/**
 * Get the ship's current scene position (for camera tracking).
 * Returns null if ship is not visible.
 */
export function getShipScenePosition(ship) {
  if (!ship.mesh.visible) return null;
  const p = ship.mesh.position;
  return { x: p.x, y: p.y, z: p.z };
}

/**
 * Hide ship and reset trail buffer.
 */
export function hideShip(ship) {
  ship.mesh.visible = false;
  ship.trailCount = 0;
  ship.trail.geometry.setDrawRange(0, 0);
}

