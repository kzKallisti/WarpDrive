// Asteroids, dwarf planets, TNOs, and comets
// All use heliocentric Keplerian elements (same format as planets)
// Source: JPL Small-Body Database, osculating elements near J2000
//
// Navigation fields:
//   escapeVelocityKMS — escape velocity from surface (km/s)
//   orbitalVelocityKMS — heliocentric orbital velocity (km/s), computed as 29.8/sqrt(a)
//   lowOrbitVelocityKMS — circular orbit velocity at low altitude (km/s)

// --- Dwarf planets and trans-Neptunian objects ---

export const dwarfPlanets = [
  {
    name: 'Eris',
    type: 'dwarf',
    radius: 1163,
    color: 0xDDDDCC,
    escapeVelocityKMS: 1.37,
    orbitalVelocityKMS: 3.62,
    lowOrbitVelocityKMS: 0.97,
    elements: {
      a0: 67.781,      aDot: 0,
      e0: 0.44068,     eDot: 0,
      I0: 44.040,      IDot: 0,
      L0: 204.16,      LDot: 644.96,      // ~558 yr period
      wBar0: 187.55,   wBarDot: 0,
      omega0: 35.87,   omegaDot: 0,
    },
  },
  {
    name: 'Makemake',
    type: 'dwarf',
    radius: 715,
    color: 0xCC9977,
    escapeVelocityKMS: 0.84,
    orbitalVelocityKMS: 4.42,
    lowOrbitVelocityKMS: 0.59,
    elements: {
      a0: 45.430,      aDot: 0,
      e0: 0.16126,     eDot: 0,
      I0: 28.983,      IDot: 0,
      L0: 84.56,       LDot: 1175.46,     // ~306 yr period
      wBar0: 297.81,   wBarDot: 0,
      omega0: 79.38,   omegaDot: 0,
    },
  },
  {
    name: 'Haumea',
    type: 'dwarf',
    radius: 816,
    color: 0xDDCCBB,
    escapeVelocityKMS: 0.91,
    orbitalVelocityKMS: 4.53,
    lowOrbitVelocityKMS: 0.64,
    elements: {
      a0: 43.218,      aDot: 0,
      e0: 0.19489,     eDot: 0,
      I0: 28.201,      IDot: 0,
      L0: 211.77,      LDot: 1267.03,     // ~284 yr period
      wBar0: 240.20,   wBarDot: 0,
      omega0: 122.17,  omegaDot: 0,
    },
  },
  {
    name: 'Quaoar',
    type: 'dwarf',
    radius: 555,
    color: 0xBB8866,
    escapeVelocityKMS: 0.56,
    orbitalVelocityKMS: 4.51,
    lowOrbitVelocityKMS: 0.40,
    elements: {
      a0: 43.694,      aDot: 0,
      e0: 0.03979,     eDot: 0,
      I0: 7.991,       IDot: 0,
      L0: 189.50,      LDot: 1245.35,     // ~289 yr period
      wBar0: 337.62,   wBarDot: 0,
      omega0: 188.79,  omegaDot: 0,
    },
  },
  {
    name: 'Sedna',
    type: 'dwarf',
    radius: 498,
    color: 0xDD6644,
    escapeVelocityKMS: 0.42,
    orbitalVelocityKMS: 1.32,
    lowOrbitVelocityKMS: 0.30,
    elements: {
      a0: 506.8,       aDot: 0,
      e0: 0.84287,     eDot: 0,
      I0: 11.929,      IDot: 0,
      L0: 358.01,      LDot: 31.56,       // ~11,400 yr period
      wBar0: 91.89,    wBarDot: 0,        // normalized from 451.89 (omega + w)
      omega0: 144.51,  omegaDot: 0,
    },
  },
];

// --- Main belt asteroids ---

export const asteroids = [
  {
    name: 'Ceres',
    type: 'asteroid',
    radius: 473,
    color: 0x888877,
    escapeVelocityKMS: 0.51,
    orbitalVelocityKMS: 17.91,
    lowOrbitVelocityKMS: 0.36,
    elements: {
      a0: 2.7691652,   aDot: 0,
      e0: 0.0760090,   eDot: 0,
      I0: 10.59338,    IDot: 0,
      L0: 60.3225,     LDot: 78175.08,
      wBar0: 73.5975,  wBarDot: 0,
      omega0: 80.3055, omegaDot: 0,
    },
  },
  {
    name: 'Vesta',
    type: 'asteroid',
    radius: 262.7,
    color: 0x998877,
    escapeVelocityKMS: 0.36,
    orbitalVelocityKMS: 19.40,
    lowOrbitVelocityKMS: 0.25,
    elements: {
      a0: 2.3615079,   aDot: 0,
      e0: 0.0887458,   eDot: 0,
      I0: 7.14174,     IDot: 0,
      L0: 20.864,      LDot: 99156.58,
      wBar0: 149.841,  wBarDot: 0,
      omega0: 103.915, omegaDot: 0,
    },
  },
  {
    name: 'Pallas',
    type: 'asteroid',
    radius: 256,
    color: 0x777788,
    escapeVelocityKMS: 0.32,
    orbitalVelocityKMS: 17.90,
    lowOrbitVelocityKMS: 0.22,
    elements: {
      a0: 2.7724,      aDot: 0,
      e0: 0.2313,      eDot: 0,
      I0: 34.832,      IDot: 0,
      L0: 310.15,      LDot: 78002.64,
      wBar0: 310.424,  wBarDot: 0,
      omega0: 173.096, omegaDot: 0,
    },
  },
  {
    name: 'Hygiea',
    type: 'asteroid',
    radius: 217,
    color: 0x666655,
    escapeVelocityKMS: 0.21,
    orbitalVelocityKMS: 16.82,
    lowOrbitVelocityKMS: 0.15,
    elements: {
      a0: 3.1392,      aDot: 0,
      e0: 0.1146,      eDot: 0,
      I0: 3.842,       IDot: 0,
      L0: 270.07,      LDot: 64738.68,
      wBar0: 312.21,   wBarDot: 0,
      omega0: 283.41,  omegaDot: 0,
    },
  },
];

// --- Near-Earth asteroids (mining targets / collision hazards) ---

export const nearEarthAsteroids = [
  {
    name: 'Apophis',
    type: 'nea',
    radius: 0.185,     // ~370m diameter
    color: 0xFF6644,
    escapeVelocityKMS: 0.0002,
    orbitalVelocityKMS: 31.03,
    lowOrbitVelocityKMS: 0.0001,
    elements: {
      a0: 0.9224,      aDot: 0,
      e0: 0.19105,     eDot: 0,
      I0: 3.331,       IDot: 0,
      L0: 204.43,      LDot: 131963.0,    // ~0.886 yr period
      wBar0: 126.40,   wBarDot: 0,
      omega0: 204.45,  omegaDot: 0,
    },
  },
  {
    name: 'Bennu',
    type: 'nea',
    radius: 0.245,     // ~490m diameter
    color: 0x665544,
    escapeVelocityKMS: 0.0002,
    orbitalVelocityKMS: 28.08,
    lowOrbitVelocityKMS: 0.0001,
    elements: {
      a0: 1.1264,      aDot: 0,
      e0: 0.20375,     eDot: 0,
      I0: 6.035,       IDot: 0,
      L0: 101.70,      LDot: 101084.0,    // ~1.196 yr period
      wBar0: 66.22,    wBarDot: 0,
      omega0: 2.06,    omegaDot: 0,
    },
  },
  {
    name: 'Ryugu',
    type: 'nea',
    radius: 0.435,     // ~870m diameter
    color: 0x554433,
    escapeVelocityKMS: 0.0002,
    orbitalVelocityKMS: 27.32,
    lowOrbitVelocityKMS: 0.0002,
    elements: {
      a0: 1.1896,      aDot: 0,
      e0: 0.19025,     eDot: 0,
      I0: 5.884,       IDot: 0,
      L0: 251.59,      LDot: 93668.0,     // ~1.298 yr period
      wBar0: 211.43,   wBarDot: 0,
      omega0: 251.62,  omegaDot: 0,
    },
  },
];

// --- Notable periodic comets ---

export const comets = [
  {
    name: 'Halley',
    type: 'comet',
    radius: 5.5,
    color: 0x99DDFF,
    escapeVelocityKMS: 0.001,
    orbitalVelocityKMS: 7.06,
    lowOrbitVelocityKMS: 0.001,
    elements: {
      a0: 17.834,      aDot: 0,
      e0: 0.96714,     eDot: 0,
      I0: 162.263,     IDot: 0,
      L0: 170.01,      LDot: 4780.69,
      wBar0: 169.75,   wBarDot: 0,
      omega0: 58.42,   omegaDot: 0,
    },
  },
  {
    name: 'Encke',
    type: 'comet',
    radius: 2.4,
    color: 0x88CCEE,
    escapeVelocityKMS: 0.001,
    orbitalVelocityKMS: 20.0,
    lowOrbitVelocityKMS: 0.001,
    elements: {
      a0: 2.2154,      aDot: 0,
      e0: 0.8483,      eDot: 0,
      I0: 11.78,       IDot: 0,
      L0: 160.5,       LDot: 108990.0,
      wBar0: 186.546,  wBarDot: 0,
      omega0: 334.568, omegaDot: 0,
    },
  },
  {
    name: 'Hale-Bopp',
    type: 'comet',
    radius: 30,
    color: 0xAADDFF,
    escapeVelocityKMS: 0.003,
    orbitalVelocityKMS: 2.18,
    lowOrbitVelocityKMS: 0.002,
    elements: {
      a0: 186.0,       aDot: 0,
      e0: 0.99508,     eDot: 0,
      I0: 89.43,       IDot: 0,
      L0: 129.3,       LDot: 141.79,
      wBar0: 198.0,    wBarDot: 0,
      omega0: 283.37,  omegaDot: 0,
    },
  },
];
