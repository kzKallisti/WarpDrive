// @ts-check
// WarpDrive — Application bootstrap and animation loop
//
// Architecture: State is centralized here. Pure functions compute new values.
// Side effects (DOM, Three.js) happen only through explicit render calls.
// No other module mutates state. Ship and route objects are owned here.

import * as THREE from 'three';
import { bodies as planets } from './bodies.js';
import { moons } from './moons.js';
import { dwarfPlanets, asteroids, nearEarthAsteroids, comets } from './asteroids.js';
import {
  dateToJulianCenturies, julianCenturiesToDate, getAllPositions,
  distance3D, auToScene,
} from './orbits.js';
import { findRoute, formatTime, computePhaseProgress } from './pathfinder.js';
import { createScene } from './scene.js';
import {
  createBodies, updateBodyPositions, updateLabelScales,
  drawAllOrbitTrails, drawBeltZones,
  drawRoute, clearRoute,
  createShip, updateShipPosition, hideShip, getShipScenePosition,
} from './renderer.js';
import {
  initUI, displayJumpPlan, highlightJump,
  updateTimeDisplay, updatePlayPauseButton, updateShipStatus, showStatus,
  updateBodyInfo, selectBody, clearSelection,
  setOrigin, setDestination,
} from './ui.js';
import { C_KM_S, AU_KM, SECONDS_PER_DAY, DAYS_PER_CENTURY, SCALE, HELIOCENTER, CAMERA } from './constants.js';

const bodies = [...planets, ...moons, ...dwarfPlanets, ...asteroids, ...nearEarthAsteroids, ...comets];

// ============================================================
// State — single source of truth, modified only via transition functions below
// ============================================================
const state = Object.seal({
  // Time
  tau: dateToJulianCenturies(new Date()),
  playing: false,
  speedMultiplier: 10,

  // Positions (Map of body name -> {x,y,z} in AU)
  positions: null,

  // Camera
  cameraTarget: 'Earth',   // body name, 'SHIP', or null (free)
  cameraLerpPos: null,      // THREE.Vector3 target for smooth camera transition
  cameraLerpLookAt: null,   // THREE.Vector3 target for smooth controls.target transition

  // Route
  route: null,
  currentJumpIndex: 0,
  jumpElapsed: 0,
  enRoute: false,
});

// ============================================================
// State transitions — the ONLY places state is mutated
// ============================================================

function setTime(tau) {
  state.tau = tau;
}

function setPlaying(playing) {
  state.playing = playing;
  updatePlayPauseButton(playing);
}

function setSpeed(speed) {
  state.speedMultiplier = speed;
}

function setCameraTarget(name) {
  state.cameraTarget = name;
}

function engageRoute(route) {
  // Clear any previous route
  clearRoute(scene, routeObjects);
  hideShip(ship);

  // Set new route state atomically
  state.route = route;
  state.currentJumpIndex = 0;
  state.jumpElapsed = 0;
  state.enRoute = true;
  state.cameraTarget = 'SHIP';

  // Render side effects
  displayJumpPlan(route);
  routeObjects = drawRoute(scene, route);
  highlightJump(0);

  // Smooth zoom to ship at route start
  startCameraLerp(auToScene(route[0].from), CAMERA.ROUTE_START_DIST);

  if (!state.playing) setPlaying(true);
}

function disengageRoute() {
  clearRoute(scene, routeObjects);
  routeObjects = [];
  hideShip(ship);
  state.route = null;
  state.enRoute = false;
  state.currentJumpIndex = 0;
  state.jumpElapsed = 0;
}

function advanceJump() {
  state.currentJumpIndex++;
  state.jumpElapsed = 0;
}

function setPositions(positions) {
  state.positions = positions;
}

function advanceJumpElapsed(deltaS) {
  state.jumpElapsed += deltaS;
}

/** Start a smooth camera transition toward an AU-space position */
function startCameraLerp(scenePos, dist) {
  state.cameraLerpLookAt = new THREE.Vector3(scenePos.x, scenePos.y, scenePos.z);
  state.cameraLerpPos = new THREE.Vector3(
    scenePos.x + dist * CAMERA.OFFSET.x,
    scenePos.y + dist * CAMERA.OFFSET.y,
    scenePos.z + dist * CAMERA.OFFSET.z
  );
}

// ============================================================
// Pure functions — no side effects, compute derived values
// ============================================================

/** Compute body info for the detail panel */
function computeBodyInfo(name, positions) {
  const bodyEntry = bodies.find(b => b.name === name);
  if (!bodyEntry) return null;
  const pos = positions.get(name);
  const earthPos = positions.get('Earth');
  return {
    body: bodyEntry,
    pos,
    distFromSun: distance3D(pos, HELIOCENTER),
    distFromEarth: distance3D(pos, earthPos),
    lightTime: (distance3D(pos, earthPos) * AU_KM) / C_KM_S,
  };
}

/** Determine current transit phase index and remaining time from elapsed time */
function getCurrentPhase(transit, elapsed) {
  let remaining = elapsed;
  for (let i = 0; i < transit.phases.length; i++) {
    const phase = transit.phases[i];
    if (remaining <= phase.timeS) {
      return { index: i, name: phase.name, remaining: phase.timeS - remaining };
    }
    remaining -= phase.timeS;
  }
  const lastIdx = transit.phases.length - 1;
  return { index: lastIdx, name: transit.phases[lastIdx]?.name || '', remaining: 0 };
}

/** Compute total remaining time for a route from current position */
function computeRouteETA(route, jumpIndex, jumpElapsed) {
  const currentJump = route[jumpIndex];
  const remainingInJump = Math.max(0, currentJump.timeSeconds - jumpElapsed);
  const remainingAfter = route.slice(jumpIndex + 1).reduce((s, j) => s + j.timeSeconds, 0);
  return remainingInJump + remainingAfter;
}

/** Resolve camera target to a scene position */
function resolveCameraTarget(target, positions) {
  if (!target) return null;
  if (target === 'SHIP') return getShipScenePosition(ship);
  const pos = positions.get(target);
  if (!pos) return null;
  return auToScene(pos);
}

/** Find which body was hit by a raycast */
function findHitBody(hitObject) {
  return bodies.find(b => meshMap.get(b.name)?.hitMesh === hitObject) || null;
}

/** Update mouse coordinates from event */
function mouseFromEvent(e) {
  return {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1,
  };
}

// ============================================================
// Scene initialization (side effects, runs once)
// ============================================================

const canvas = document.getElementById('viewport');
const { scene, camera, renderer, controls } = createScene(canvas);
const meshMap = createBodies(scene, bodies);

setPositions(getAllPositions(bodies, state.tau));
updateBodyPositions(meshMap, state.positions);

// Initial camera position centered on Earth
const earthScene = auToScene(state.positions.get('Earth'));
controls.target.set(earthScene.x, earthScene.y, earthScene.z);
const camOffset = SCALE * 5;
camera.position.set(earthScene.x, earthScene.y + camOffset * 0.6, earthScene.z + camOffset);

drawAllOrbitTrails(scene, bodies, state.tau, state.positions);
drawBeltZones(scene);

const bodyHitMeshes = bodies.map(b => meshMap.get(b.name)?.hitMesh).filter(Boolean);

// Ship and route objects — owned by main.js, passed to renderer functions
const ship = createShip(scene);
let routeObjects = [];

// ============================================================
// UI wiring (side effects, runs once)
// ============================================================

initUI(bodies, {
  onRouteRequest: (originName, destName) => {
    const originPos = state.positions.get(originName);
    const destPos = state.positions.get(destName);
    if (!originPos || !destPos) {
      showStatus('Unknown body selected', 'warn');
      return;
    }
    const route = findRoute(originPos, destPos, originName, destName, bodies, state.positions);
    engageRoute(route);

    const totalTime = route.reduce((s, j) => s + j.timeSeconds, 0);
    const totalDist = route.reduce((s, j) => s + j.distanceAU, 0);
    showStatus(
      `Route: ${route.length} jump${route.length > 1 ? 's' : ''} | ${totalDist.toFixed(4)} AU | ETA ${formatTime(totalTime)}`,
      'info'
    );
  },
  onTimeChange: (date) => {
    setTime(dateToJulianCenturies(date));
    syncPositions();
  },
  onPlayPause: () => setPlaying(!state.playing),
  onSpeedChange: setSpeed,
  onBodySelect: (name) => {
    const info = computeBodyInfo(name, state.positions);
    if (info) selectBody(info.body, info.pos, info.distFromSun, info.distFromEarth, info.lightTime);
  },
  onCameraFocus: (name) => {
    setCameraTarget(name);
    const scenePos = resolveCameraTarget(name, state.positions);
    if (scenePos) controls.target.set(scenePos.x, scenePos.y, scenePos.z);
    showStatus(`Camera: ${name}`, 'info');
  },
});

updateTimeDisplay(julianCenturiesToDate(state.tau));
updatePlayPauseButton(state.playing);
updateBodyInfo(bodies, state.positions);

document.getElementById('track-ship').addEventListener('click', () => {
  setCameraTarget('SHIP');
  const scenePos = getShipScenePosition(ship);
  if (scenePos) controls.target.set(scenePos.x, scenePos.y, scenePos.z);
  showStatus('Camera: SHIP', 'info');
});

// ============================================================
// Input handlers (read events, call state transitions)
// ============================================================

const raycaster = new THREE.Raycaster();
let isDragging = false;
let mouseDownPos = { x: 0, y: 0 };

// Right-click detaches camera tracking
canvas.addEventListener('pointerdown', (e) => {
  if (e.button === 2) setCameraTarget(null);
});

canvas.addEventListener('mousedown', (e) => {
  mouseDownPos.x = e.clientX;
  mouseDownPos.y = e.clientY;
  isDragging = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (Math.abs(e.clientX - mouseDownPos.x) > 3 || Math.abs(e.clientY - mouseDownPos.y) > 3) {
    isDragging = true;
  }
  const m = mouseFromEvent(e);
  raycaster.setFromCamera(m, camera);
  const hits = raycaster.intersectObjects(bodyHitMeshes, false);
  canvas.style.cursor = hits.length > 0 ? 'pointer' : '';
});

canvas.addEventListener('click', (e) => {
  if (isDragging) return;
  const m = mouseFromEvent(e);
  raycaster.setFromCamera(m, camera);
  const hits = raycaster.intersectObjects(bodyHitMeshes, false);

  if (hits.length > 0) {
    const body = findHitBody(hits[0].object);
    if (body) {
      const info = computeBodyInfo(body.name, state.positions);
      if (info) selectBody(info.body, info.pos, info.distFromSun, info.distFromEarth, info.lightTime);
      if (e.shiftKey) { setDestination(body.name); showStatus(`Destination: ${body.name}`, 'info'); }
      else if (e.ctrlKey || e.metaKey) { setOrigin(body.name); showStatus(`Origin: ${body.name}`, 'info'); }
    }
  } else {
    clearSelection();
  }
});

canvas.addEventListener('dblclick', (e) => {
  const m = mouseFromEvent(e);
  raycaster.setFromCamera(m, camera);
  const hits = raycaster.intersectObjects(bodyHitMeshes, false);
  if (hits.length > 0) {
    const body = findHitBody(hits[0].object);
    if (body) {
      setCameraTarget(body.name);
      const scenePos = resolveCameraTarget(body.name, state.positions);
      if (scenePos) controls.target.set(scenePos.x, scenePos.y, scenePos.z);
      showStatus(`Camera: ${body.name}`, 'info');
    }
  }
});

// ============================================================
// Position sync — recompute positions, push to renderer + UI
// ============================================================

// Throttle UI table updates (expensive DOM rebuild) to 2Hz
let lastUIUpdate = 0;
const UI_UPDATE_INTERVAL = 500; // ms

function syncPositions() {
  setPositions(getAllPositions(bodies, state.tau));
  updateBodyPositions(meshMap, state.positions);
  updateTimeDisplay(julianCenturiesToDate(state.tau));

  const now = performance.now();
  if (now - lastUIUpdate > UI_UPDATE_INTERVAL) {
    updateBodyInfo(bodies, state.positions);
    lastUIUpdate = now;
  }

  // Camera tracking
  const scenePos = resolveCameraTarget(state.cameraTarget, state.positions);
  if (scenePos) controls.target.set(scenePos.x, scenePos.y, scenePos.z);
}

// ============================================================
// Tick functions — each handles one concern per frame
// ============================================================

/** Advance simulation clock and sync body positions */
function tickSimulation(dtReal) {
  if (!state.playing) return;
  const simSeconds = dtReal * state.speedMultiplier;
  setTime(state.tau + simSeconds / (SECONDS_PER_DAY * DAYS_PER_CENTURY));
  syncPositions();
}

/** Advance ship along route, handle phase transitions and jump completion */
function tickShipTransit(dtReal) {
  if (!state.enRoute || !state.route) return;

  const jump = state.route[state.currentJumpIndex];
  const prevPhase = getCurrentPhase(jump.transit, state.jumpElapsed);

  advanceJumpElapsed(dtReal * state.speedMultiplier);

  const progress = computePhaseProgress(jump.transit, Math.min(state.jumpElapsed, jump.timeSeconds));
  updateShipPosition(ship, jump, progress);

  // Phase tracking and UI
  const phase = getCurrentPhase(jump.transit, state.jumpElapsed);
  highlightJump(state.currentJumpIndex, phase.index);

  // Smooth zoom to destination when entering deceleration phase
  const brakePhases = ['BRAKE', 'INSERTION', 'DECEL'];
  if (brakePhases.includes(phase.name) && !brakePhases.includes(prevPhase.name)) {
    startCameraLerp(auToScene(jump.to), CAMERA.DECEL_ZOOM_DIST);
  }

  // Status display
  const eta = computeRouteETA(state.route, state.currentJumpIndex, state.jumpElapsed);
  updateShipStatus(
    `Jump ${state.currentJumpIndex + 1}/${state.route.length} | ` +
    `${jump.fromName} \u2192 ${jump.toName} | ` +
    `${phase.name} ${formatTime(phase.remaining)} | ` +
    `ETA: ${formatTime(eta)}`
  );

  // Jump completion
  if (progress >= 1) {
    advanceJump();
    if (state.currentJumpIndex >= state.route.length) {
      completeRoute();
    }
  }
}

/** Smooth camera transitions — exponential ease toward target position */
function tickCamera(dtReal) {
  if (!state.cameraLerpPos) return;

  const t = 1 - Math.exp(-CAMERA.LERP_SPEED * dtReal);
  camera.position.lerp(state.cameraLerpPos, t);
  if (state.cameraLerpLookAt) {
    controls.target.lerp(state.cameraLerpLookAt, t);
  }

  // Stop lerping when close enough
  if (camera.position.distanceTo(state.cameraLerpPos) < 1) {
    state.cameraLerpPos = null;
    state.cameraLerpLookAt = null;
  }
}

/** Handle route completion — disengage, update UI, re-target camera */
function completeRoute() {
  const arrivedAt = state.route[state.route.length - 1].toName;
  disengageRoute();
  setOrigin(arrivedAt);
  setCameraTarget(arrivedAt);
  updateShipStatus(`ARRIVED at ${arrivedAt}`);
  showStatus('Navigation complete \u2014 destination reached', 'info');
}

// ============================================================
// Animation loop — tick each concern, then render
// ============================================================

let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dtReal = (now - lastTime) / 1000;
  lastTime = now;

  tickSimulation(dtReal);
  tickShipTransit(dtReal);
  tickCamera(dtReal);

  updateLabelScales(meshMap, camera);
  controls.update();
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
