# WarpDrive: Asteroid Mining Tycoon

## Concept

Asteroid mining tycoon set in procedurally generated solar systems. Each new game creates a unique star with orbiting bodies — planets, moons, asteroids, comets — with real Keplerian orbital mechanics. The player builds a mining and shipping empire by exploiting orbital dynamics: timing launch windows, managing transit costs driven by gravity wells, and running trade routes across a living system where everything moves.

**Core thesis: orbital mechanics IS the economy.** Physics creates natural scarcity, timing pressure, and strategic depth without artificial game mechanics. A player who understands launch windows and gravity wells outperforms one who brute-forces routes.

## What WarpDrive already provides

The existing navigation simulator is the game engine:

- Keplerian orbital mechanics (bodies move on elliptical orbits, positions change over time)
- 7-phase transit physics with gravity-well-aware fuel/time costs
- Collision-free pathfinding with waypoint insertion
- Tidal-limit danger zones derived from body mass
- Phase-aware ship animation (accel → warp → decel)
- 3D visualization with Three.js, lit-html UI panels
- Time simulation with play/pause/speed controls

## Procedural Solar System Generation

Each new game generates a unique system. The generator produces Keplerian orbital elements in the same format the engine already consumes — no engine changes needed.

### Star generation

- Spectral class (M/K/G/F) determines: luminosity, habitable zone distance, color, mass
- Mass sets the gravitational parameter → all orbital velocities derive from it
- Habitable zone determines where colonies are viable without life support premiums

### Body generation

The generator creates bodies by rolling orbital elements within physically plausible ranges:

```
For each body:
  a0    — semi-major axis (AU): sampled from distribution per zone
  e0    — eccentricity: 0.001–0.1 (planets), 0.1–0.4 (asteroids), 0.5–0.99 (comets)
  I0    — inclination: small for planets, wider for asteroids/comets
  L0    — mean longitude: random 0–360
  wBar0 — longitude of perihelion: random 0–360
  omega0 — longitude of ascending node: random 0–360
  radius — determines gravity well depth, display size
  escapeVelocityKMS — derived from radius + density
  orbitalVelocityKMS — derived from a0 and star mass: v = sqrt(GM_star / a)
```

Rates (aDot, eDot, etc.) can be zero for game timescales — bodies maintain stable orbits within a single campaign.

### System archetypes (seeded randomness, not pure random)

- **Dense inner system**: Many rocky bodies close to star. Short transits, lots of competition for routes. Orbital congestion.
- **Gas giant empire**: One or two massive planets with rich moon systems. High escape costs but concentrated resources.
- **Scattered disk**: Bodies spread across wide orbits. Long transits, high fuel costs, but less competition. Frontier feel.
- **Binary companion**: A distant second star perturbs outer orbits. Unpredictable long-period bodies.
- **Resource jackpot**: One body with extraordinary composition. Gold rush dynamics — everyone converges.

### Constraints to ensure playability

- At least one body in the habitable zone (starting colony)
- At least 3–5 minable asteroid-class bodies within reasonable transit range
- No body inside the star's tidal danger zone
- Orbital stability check: no crossing orbits that would cause collisions within campaign length
- Minimum spacing between adjacent orbits (resonance avoidance)

## Resources

### Resource types (tied to body composition)

| Resource | Found on | Used for | Value driver |
|----------|----------|----------|-------------|
| Iron/Nickel | Rocky bodies, M-type asteroids | Construction, hull plating | Base industrial metal, always in demand |
| Platinum group | Rocky bodies, M-type asteroids | Electronics, catalysts | High value per ton, Earth import |
| Water ice | Icy moons, C-type asteroids, comets | Fuel (electrolysis → H₂/O₂), life support | Critical for deep-space operations |
| Rare earths | Rocky planets, some asteroids | Advanced electronics, drives | Scarce, premium pricing |
| Silicates | S-type asteroids, rocky bodies | Construction, glass, ceramics | Bulk material, low margin |
| Volatiles | Comets, icy bodies, gas giant moons | Fuel, atmosphere processing | Seasonal (comet perihelion windows) |
| Helium-3 | Gas giant atmospheres (via moons) | Fusion fuel (endgame) | Extremely high value, extremely high extraction cost |

### Body composition generation

Each body gets a composition profile based on type:
- **M-type asteroid**: 80% iron/nickel, 15% platinum, 5% rare earths
- **S-type asteroid**: 60% silicates, 30% iron/nickel, 10% misc
- **C-type asteroid**: 40% water ice, 30% silicates, 20% volatiles, 10% organics
- **Icy moon**: 60% water ice, 20% silicates, 15% volatiles, 5% rare earths
- **Rocky planet**: varied, but deep gravity well makes extraction expensive
- **Comet**: 70% volatiles, 25% water ice, 5% dust — but tiny mass, depletes fast

Resource quantity scales with body radius³ (volume proxy). Large bodies have more but cost more to leave.

## Economy

### Market model

Colonies (habitable-zone bodies, stations) are market nodes with:
- **Demand curves**: price increases as local supply depletes, decreases as deliveries arrive
- **Production**: colonies slowly produce some resources locally (can't be fully dependent on imports)
- **Population growth**: successful colonies grow, increasing demand
- **New colony founding**: at certain wealth thresholds, new outposts appear on other bodies

### Price dynamics

```
price = base_price × demand_multiplier × distance_premium × urgency_bonus
```

- `demand_multiplier`: rises when stockpile < threshold, falls when oversupplied
- `distance_premium`: remote colonies pay more (transport cost baked into price expectation)
- `urgency_bonus`: contracts with tight deadlines pay more

### The orbital economics insight

The same route has different profitability at different times:
- Earth–Mars at opposition (closest approach): 3-minute light-time transit, cheap fuel
- Earth–Mars at conjunction (far side of Sun): 22-minute transit, expensive fuel, may need waypoints around the Sun
- Smart players plan seasonal trade routes — "run platinum to Mars during opposition, run water to Jupiter during Earth-Jupiter alignment"

## Ships & Fleet

### Ship properties (map to existing physics constants)

| Property | Game effect | Physics mapping |
|----------|-----------|----------------|
| Engine thrust | Acceleration, escape time | `SHIP_ACCEL_MS2` |
| Drive quality | Warp threshold speed | `WARP_THRESHOLD_KMS` |
| Hull length | Cargo capacity, tidal tolerance | `SHIP_LENGTH_KM` |
| Fuel capacity | Max range without refueling | New field |
| Mining equipment | Extraction rate at asteroids | New field |

### Progression

1. **Starter**: Slow freighter, small cargo, basic drive. Can run inner-system routes.
2. **Upgraded engines**: Better thrust → cheaper escapes from gravity wells. Opens moon mining.
3. **Warp drive upgrade**: Lower threshold → faster warp engage. Cuts transit overhead.
4. **Heavy hauler**: More cargo capacity. Bulk routes become profitable.
5. **Mining rig**: Can extract resources directly (not just transport). Passive income.
6. **Fleet expansion**: Buy additional ships. Assign them to routes. Manage logistics.

### Multi-ship state

The existing `state.route` / `state.enRoute` pattern extends to a fleet:

```js
state.fleet = [
  { id: 'ship-1', route: [...], jumpIndex: 0, elapsed: 0, cargo: {...}, ... },
  { id: 'ship-2', route: null, docked: 'Ceres', cargo: {...}, ... },
];
```

Each ship gets its own `tickShipTransit()` call. Camera can track any ship.

## Contracts & Missions

### Contract types

- **Delivery**: Move X tons of resource from A to B within T days. Pay on completion.
- **Supply run**: Recurring delivery contract. Stable income but ties up a ship.
- **Rush order**: High pay, very tight deadline. Requires optimal launch window.
- **Exploration**: Visit a newly discovered body. Reveals its composition for future mining.
- **Rescue**: Ship stranded at body X. Get there within T days. Reputation reward.
- **Speculation**: Buy low at source, sell at market price. No guaranteed buyer — player takes price risk.

### Reputation

- Completing contracts builds reputation with factions/colonies
- Higher reputation → access to better contracts, lower docking fees, insider market info
- Failed contracts damage reputation
- Different colonies track reputation independently

## UI Extensions (on top of existing WarpDrive UI)

### New panels needed

- **Fleet overview**: List of ships, their status, routes, cargo
- **Market view**: Prices at each colony, demand levels, price history charts
- **Contract board**: Available contracts, requirements, deadlines, pay
- **Ship yard**: Buy/upgrade ships
- **Finance**: Revenue, expenses, profit/loss, net worth over time

### Existing panels that evolve

- **Stellar cartography** → adds resource icons, market prices per body
- **Jump plan** → adds fuel cost, cargo manifest, profit projection
- **Body detail** → adds composition, market prices, available contracts
- **Navigation** → origin/destination selection becomes "assign ship to route"

## Technical Architecture

### What changes from WarpDrive

| Component | Current | Game version |
|-----------|---------|-------------|
| Body data | Static imports | Procedural generator output |
| State | Single ship | Fleet + economy + contracts |
| Time | Simulation only | Game clock with consequences |
| UI | Observation | Interactive (buy/sell/assign) |
| Bodies list | ~50 real bodies | 20–60 generated bodies |

### What stays the same

- Keplerian orbital engine (orbits.js)
- Transit physics (pathfinder.js) — per-ship thrust/drive stats
- Three.js rendering (renderer.js, scene.js)
- Coordinate transforms (auToScene)
- Collision avoidance with tidal limits

### New modules needed

```
js/
  generator.js    — Procedural solar system generation
  economy.js      — Markets, prices, supply/demand simulation
  contracts.js    — Contract generation, tracking, completion
  fleet.js        — Multi-ship state management
  save.js         — Game state serialization (localStorage or file)
```

## Open Questions

- **Multiplayer?** Real-time or async? Shared system or separate? (Probably out of scope for v1)
- **AI competitors?** NPC mining companies running their own routes? Adds pressure but complexity.
- **Campaign length?** How many game-years before "winning"? Or is it endless sandbox?
- **Difficulty tuning?** Star system archetype = difficulty setting? Dense inner = easy, scattered = hard?
- **Name generation?** Procedural star/body names? Or let player name discoveries?
- **Tutorial?** The orbital mechanics learning curve is steep. Guided first contract?
- **Mobile?** Three.js works on mobile but the UI density is challenging.
- **Sound?** Ambient, notification sounds, engine hum during transit?

## MVP Scope (Minimum Playable Game)

1. Procedural system generator (star + 15–25 bodies with orbits and resources)
2. Single ship with cargo hold
3. Two colonies with buy/sell markets
4. Delivery contracts with deadlines
5. Money counter, basic progression (engine upgrade)
6. Win condition: accumulate $X net worth

Everything else is depth added after the core loop works.
