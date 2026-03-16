// @ts-check
// Three.js scene setup: camera, renderer, controls, lighting, starfield

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SCALE, COLORS } from './constants.js';

/**
 * Create and configure the Three.js scene
 */
export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000408);

  // Camera — far plane must reach Neptune orbit (~750k units) and beyond
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000000);
  camera.position.set(0, SCALE * 2, SCALE * 3);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;

  // Controls — zoom range from planet surface to full system view
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.panSpeed = 1.0;
  controls.minDistance = 0.5;
  controls.maxDistance = 2000000;
  controls.zoomSpeed = 1.5;

  // Suppress context menu so right-click pan works uninterrupted
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // Ambient: faint starlight so dark sides of planets are barely visible
  scene.add(new THREE.AmbientLight(0x334455, 0.35));

  // Sun — inverse-square falloff (decay=2).
  // At SCALE=25000, Earth is 25000 units away.
  // Intensity = SCALE^2 * 1.2 gives ~1.2 illumination at Earth's orbit.
  const sunIntensity = SCALE * SCALE * 2.0;
  const sunLight = new THREE.PointLight(0xFFF5E0, sunIntensity, 0, 2);
  scene.add(sunLight);

  // Starfield background
  createStarfield(scene);

  // Ecliptic grid — scaled to the solar system
  createEclipticGrid(scene);

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls };
}

function createStarfield(scene) {
  const count = 6000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const starfieldRadius = 3000000;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = starfieldRadius + Math.random() * starfieldRadius * 0.3;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const temp = Math.random();
    colors[i * 3]     = 0.8 + temp * 0.2;
    colors[i * 3 + 1] = 0.8 + temp * 0.15;
    colors[i * 3 + 2] = 0.85 + temp * 0.15;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 5000,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });

  scene.add(new THREE.Points(geo, mat));
}

function createEclipticGrid(scene) {
  // Grid covers ~40 AU radius, 1 AU per division
  const gridSize = SCALE * 40;
  const divisions = 40;

  const grid = new THREE.GridHelper(gridSize * 2, divisions, COLORS.grid, COLORS.grid);
  grid.material.opacity = 0.15;
  grid.material.transparent = true;
  scene.add(grid);
}
