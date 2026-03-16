// @ts-check
// DOM interaction layer: controls, jump plan display, status, body selection
// Uses lit-html for declarative rendering of data-driven panels.
// Event listeners on static elements are attached once in initUI.

import { html, render } from 'lit-html';
import { formatTime } from './pathfinder.js';
import { AU_KM, HELIOCENTER, SHIP_ACCEL_MS2 } from './constants.js';
import { distance3D } from './orbits.js';

let bodySelectCallback = null;
let cameraFocusCallback = null;

/**
 * Set the origin dropdown value
 */
export function setOrigin(name) {
  document.getElementById('origin').value = name;
}

/**
 * Set the destination dropdown value
 */
export function setDestination(name) {
  document.getElementById('destination').value = name;
}

/**
 * Initialize UI elements and wire up event listeners (runs once)
 */
export function initUI(bodiesData, callbacks) {
  const originSelect = document.getElementById('origin');
  const destSelect = document.getElementById('destination');
  const engageBtn = document.getElementById('engage');
  const playPauseBtn = document.getElementById('play-pause');
  const speedSlider = document.getElementById('speed-slider');
  const speedLabel = document.getElementById('speed-value');
  const dateInput = document.getElementById('date-input');

  bodySelectCallback = callbacks.onBodySelect;
  cameraFocusCallback = callbacks.onCameraFocus;

  populateGroupedSelect(originSelect, bodiesData);
  populateGroupedSelect(destSelect, bodiesData);

  originSelect.value = 'Earth';
  destSelect.value = 'Mars';

  engageBtn.addEventListener('click', () => {
    const origin = originSelect.value;
    const dest = destSelect.value;
    if (origin === dest) {
      showStatus('Origin and destination must differ', 'warn');
      return;
    }
    engageBtn.classList.add('engaged');
    engageBtn.textContent = 'CALCULATING...';
    setTimeout(() => {
      callbacks.onRouteRequest(origin, dest);
      engageBtn.classList.remove('engaged');
      engageBtn.textContent = 'ENGAGE';
    }, 100);
  });

  playPauseBtn.addEventListener('click', () => callbacks.onPlayPause());

  speedSlider.addEventListener('input', () => {
    const val = parseFloat(speedSlider.value);
    const speed = Math.pow(10, (val / 100) * 5);
    speedLabel.textContent = formatSpeedMultiplier(speed);
    callbacks.onSpeedChange(speed);
  });

  dateInput.addEventListener('change', () => {
    const date = new Date(dateInput.value);
    if (!isNaN(date.getTime())) callbacks.onTimeChange(date);
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') {
      e.preventDefault();
      callbacks.onPlayPause();
    }
  });
}

/**
 * Populate a <select> with bodies grouped by category
 */
function populateGroupedSelect(select, bodiesData) {
  const groups = [
    { label: 'Star & Planets', types: ['star', 'planet'] },
    { label: 'Moons', types: ['moon'] },
    { label: 'Dwarf Planets & TNOs', types: ['dwarf'] },
    { label: 'Asteroids', types: ['asteroid'] },
    { label: 'Near-Earth Asteroids', types: ['nea'] },
    { label: 'Comets', types: ['comet'] },
  ];

  for (const group of groups) {
    const members = bodiesData.filter(b => group.types.includes(b.type));
    if (members.length === 0) continue;

    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;
    for (const body of members) {
      optgroup.appendChild(new Option(body.name, body.name));
    }
    select.appendChild(optgroup);
  }
}

function formatSpeedMultiplier(speed) {
  if (speed < 1000) return `${speed.toFixed(0)}x`;
  if (speed < 1000000) return `${(speed / 1000).toFixed(0)}Kx`;
  return `${(speed / 1000000).toFixed(1)}Mx`;
}

function formatLargeNum(n) {
  if (n > 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n > 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n > 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toFixed(0);
}

function colorHex(color) {
  return '#' + color.toString(16).padStart(6, '0');
}

// ============================================================
// Stellar Cartography (lit-html, re-rendered at 2Hz)
// ============================================================

// View-layer state: tracks which table sections are collapsed.
// This is presentation-only state (not app state) — acceptable to keep in ui.js.
const collapsedGroups = new Set();

// Cache last bodies/positions so toggleGroup can re-render immediately
let lastBodies = null;
let lastPositions = null;

function toggleGroup(groupId) {
  if (collapsedGroups.has(groupId)) {
    collapsedGroups.delete(groupId);
  } else {
    collapsedGroups.add(groupId);
  }
  // Re-render immediately so fold toggle feels instant
  if (lastBodies && lastPositions) {
    renderBodyTable(lastBodies, lastPositions);
  }
}

function bodyRowTemplate(body, positions, isMoon, foldGroupId) {
  const pos = positions.get(body.name);
  if (!pos) return '';
  const dist = distance3D(pos, HELIOCENTER);
  const color = colorHex(body.color);

  const arrow = foldGroupId
    ? html`<span class="fold-arrow" @click=${(e) => { e.stopPropagation(); toggleGroup(foldGroupId); }}>${collapsedGroups.has(foldGroupId) ? '\u25B6' : '\u25BC'}</span> `
    : '';
  const prefix = isMoon ? '\u00B7 ' : '';

  return html`
    <tr class="${isMoon ? 'body-row moon-row' : 'body-row'}"
        data-body-name="${body.name}"
        @click=${() => bodySelectCallback?.(body.name)}>
      <td style="color: ${color}">${arrow}${prefix}${body.name}</td>
      <td>${dist.toFixed(4)}</td>
      <td>${formatLargeNum(dist * AU_KM)}</td>
    </tr>
  `;
}

function sectionRowTemplate(label, groupId) {
  const collapsed = collapsedGroups.has(groupId);
  return html`
    <tr class="section-row" style="cursor: pointer" @click=${() => toggleGroup(groupId)}>
      <td colspan="3">
        <span class="fold-arrow">${collapsed ? '\u25B6' : '\u25BC'}</span>
        ${label}
      </td>
    </tr>
  `;
}

function foldableSectionTemplate(groupId, label, items, positions) {
  if (items.length === 0) return '';
  const collapsed = collapsedGroups.has(groupId);
  return html`
    ${sectionRowTemplate(label, groupId)}
    ${collapsed ? '' : items.map(b => bodyRowTemplate(b, positions, false, null))}
  `;
}

function renderBodyTable(bodies, positions) {
  const tbody = document.getElementById('body-table-body');
  if (!tbody) return;

  const parentBodies = bodies.filter(b => !b.parent && b.type !== 'asteroid' && b.type !== 'comet' && b.type !== 'nea');
  const moonsByParent = new Map();
  for (const b of bodies) {
    if (!b.parent) continue;
    if (!moonsByParent.has(b.parent)) moonsByParent.set(b.parent, []);
    moonsByParent.get(b.parent).push(b);
  }

  const asteroidsAndDwarfs = bodies.filter(b => !b.parent && (b.type === 'asteroid' || b.type === 'dwarf'));
  const neaList = bodies.filter(b => b.type === 'nea');
  const cometList = bodies.filter(b => b.type === 'comet');

  const template = html`
    ${parentBodies.map(body => {
      const childMoons = moonsByParent.get(body.name);
      const hasMoons = childMoons && childMoons.length > 0;
      const moonGroupId = `moons-${body.name}`;
      const moonsCollapsed = collapsedGroups.has(moonGroupId);
      return html`
        ${bodyRowTemplate(body, positions, false, hasMoons ? moonGroupId : null)}
        ${hasMoons && !moonsCollapsed ? childMoons.map(m => bodyRowTemplate(m, positions, true, null)) : ''}
      `;
    })}
    ${foldableSectionTemplate('ast', 'Asteroids & Dwarf Planets', asteroidsAndDwarfs, positions)}
    ${foldableSectionTemplate('nea', 'Near-Earth Asteroids', neaList, positions)}
    ${foldableSectionTemplate('com', 'Comets', cometList, positions)}
  `;

  render(template, tbody);
}

export function updateBodyInfo(bodies, positions) {
  lastBodies = bodies;
  lastPositions = positions;
  renderBodyTable(bodies, positions);
}

// ============================================================
// Jump Plan (lit-html for initial render, imperative highlight)
// ============================================================

export function displayJumpPlan(jumps) {
  const panel = document.getElementById('jump-plan');
  const tbody = document.getElementById('jump-table-body');

  let totalDist = 0;
  let totalTime = 0;
  const gForce = (SHIP_ACCEL_MS2 / 9.80665).toFixed(0);
  const convPhases = ['LAUNCH', 'ACCEL', 'DECEL', 'ESCAPE', 'INSERTION', 'BRAKE'];

  const rows = jumps.map((j, i) => {
    totalDist += j.distanceAU;
    totalTime += j.timeSeconds;
    const modeLabel = j.transit.warpCapable ? 'WARP' : 'CONV';
    const modeClass = j.transit.warpCapable ? 'phase-warp' : 'phase-conv';

    return html`
      <tr id="jump-row-${i}">
        <td>${i + 1} <span class="${modeClass}" style="font-size:8px">${modeLabel}</span></td>
        <td>${j.fromName}</td>
        <td>${j.toName}</td>
        <td>${j.distanceAU.toFixed(4)}</td>
        <td>${formatLargeNum(j.distanceKM)}</td>
        <td>${formatTime(j.timeSeconds)}</td>
      </tr>
      ${j.transit.phases.map((phase, p) => {
        const phaseClass = phase.name === 'CRUISE' ? 'phase-warp' :
                           phase.name.includes('WARP') ? 'phase-transition' : 'phase-conv';
        const gLabel = convPhases.includes(phase.name) ? ` (${gForce}g)` : '';
        return html`
          <tr class="phase-row" data-jump="${i}" data-phase="${p}">
            <td></td>
            <td colspan="2" class="${phaseClass}">${phase.name}${gLabel}</td>
            <td></td>
            <td>${phase.distKM > 0 ? formatLargeNum(phase.distKM) : '\u2014'}</td>
            <td>${formatTime(phase.timeS)}</td>
          </tr>
        `;
      })}
    `;
  });

  const template = html`
    ${rows}
    <tr class="summary-row">
      <td colspan="3">TOTAL</td>
      <td>${totalDist.toFixed(4)}</td>
      <td>${formatLargeNum(totalDist * AU_KM)}</td>
      <td>${formatTime(totalTime)}</td>
    </tr>
  `;

  render(template, tbody);
  panel.classList.add('visible');
}

// highlightJump stays imperative — it's called every frame during transit
// and only toggles two CSS classes. Re-rendering the whole table would be wasteful.
export function highlightJump(jumpIndex, phaseIndex = -1) {
  document.querySelectorAll('#jump-table-body tr').forEach(tr => {
    tr.classList.remove('active');
    tr.classList.remove('active-phase');
  });

  const target = document.getElementById(`jump-row-${jumpIndex}`);
  if (target) target.classList.add('active');

  if (phaseIndex >= 0) {
    const phaseRow = document.querySelector(`tr[data-jump="${jumpIndex}"][data-phase="${phaseIndex}"]`);
    if (phaseRow) phaseRow.classList.add('active-phase');
  }
}

// ============================================================
// Body Detail Panel (lit-html)
// ============================================================

export function selectBody(body, pos, distFromSun, distFromEarth, lightTime) {
  const panel = document.getElementById('body-detail');
  const color = colorHex(body.color);

  const template = html`
    <div class="detail-header" style="border-left: 3px solid ${color}">
      <span class="detail-name" style="color: ${color}">${body.name}</span>
      <span class="detail-type">${body.type.toUpperCase()}</span>
      <button class="detail-close" @click=${clearSelection}>&times;</button>
    </div>
    <div class="detail-grid">
      <div class="detail-item"><span class="detail-label">Radius</span><span class="detail-value">${formatLargeNum(body.radius)} km</span></div>
      <div class="detail-item"><span class="detail-label">From Sun</span><span class="detail-value">${distFromSun.toFixed(4)} AU</span></div>
      <div class="detail-item"><span class="detail-label">From Earth</span><span class="detail-value">${distFromEarth.toFixed(4)} AU</span></div>
      <div class="detail-item"><span class="detail-label">Light delay</span><span class="detail-value">${formatTime(lightTime)}</span></div>
      <div class="detail-item"><span class="detail-label">X</span><span class="detail-value">${pos.x.toFixed(4)} AU</span></div>
      <div class="detail-item"><span class="detail-label">Y</span><span class="detail-value">${pos.y.toFixed(4)} AU</span></div>
      <div class="detail-item"><span class="detail-label">Z</span><span class="detail-value">${pos.z.toFixed(4)} AU</span></div>
      <div class="detail-item"><span class="detail-label">Dist (km)</span><span class="detail-value">${formatLargeNum(distFromEarth * AU_KM)} km</span></div>
    </div>
    <div class="detail-actions">
      <button class="center-cam-btn" @click=${() => cameraFocusCallback?.(body.name)}>Center Camera</button>
      <button class="set-origin-btn" @click=${() => { setOrigin(body.name); showStatus(`Origin: ${body.name}`, 'info'); }}>Set Origin</button>
      <button class="set-dest-btn" @click=${() => { setDestination(body.name); showStatus(`Destination: ${body.name}`, 'info'); }}>Set Dest</button>
    </div>
  `;

  render(template, panel);
  panel.classList.add('visible');

  // Highlight corresponding row in stellar cartography
  document.querySelectorAll('.body-row').forEach(tr => {
    tr.classList.toggle('selected', tr.dataset.bodyName === body.name);
  });
}

export function clearSelection() {
  const panel = document.getElementById('body-detail');
  if (panel) panel.classList.remove('visible');
  document.querySelectorAll('.body-row').forEach(tr => tr.classList.remove('selected'));
}

// ============================================================
// Time & Status (simple text updates, no lit-html needed)
// ============================================================

export function updateTimeDisplay(date) {
  const display = document.getElementById('current-time');
  display.textContent = date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  const dateInput = document.getElementById('date-input');
  if (document.activeElement !== dateInput) {
    dateInput.value = date.toISOString().substring(0, 10);
  }
}

export function updatePlayPauseButton(isPlaying) {
  const btn = document.getElementById('play-pause');
  btn.textContent = isPlaying ? '\u23F8' : '\u25B6';
  btn.title = isPlaying ? 'Pause time' : 'Advance time';
}

export function updateShipStatus(text) {
  document.getElementById('ship-status').textContent = text;
}

export function showStatus(msg, level = 'info') {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.className = `status-msg ${level}`;
  el.style.opacity = 1;
  setTimeout(() => { el.style.opacity = 0; }, 3000);
}
