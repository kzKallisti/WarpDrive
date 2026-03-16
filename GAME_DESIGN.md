# WarpDrive: Asteroid Mining Tycoon

## 1. Concept

An asteroid mining tycoon set in procedurally generated solar systems. Real Keplerian
orbital mechanics drive the economy: distances change, launch windows open and close,
gravity wells impose real costs. The player runs a corporation — managing fleets, supply
chains, infrastructure, and relationships across a living system where everything moves.

**Core thesis: orbital mechanics IS the economy.** Physics creates scarcity, timing
pressure, and strategic depth. A player who understands launch windows and gravity wells
outperforms one who brute-forces routes.

**The player is a corporation.** Not a pilot — a board of directors. Ships and drones
execute. Human crews and AI managers operate facilities. The player makes strategic
decisions: where to mine, what to build, which routes to run, who to partner with.

**Sandbox.** No fixed win condition. Success is measured by net worth, trade volume,
infrastructure empire, political influence — whatever the player values.

## 2. Setting

**Year 2058.** Humanity has achieved warp speed (c) but not faster-than-light travel.
Advanced AI and robotics are mature — autonomous mining rigs, AI-piloted freighters, and
algorithmic trading are standard. Cryptographic smart contracts and pseudonymous
reputation systems are solved infrastructure.

**One race: humans.** No aliens, no tech trees spanning millennia. Drama comes from human
institutions: corporations competing, contracts honored or broken, governance struggling
to keep up with a frontier expanding faster than law can follow.

**The system is not empty.** Humanity has been in space for decades. The initial gamestate
has existing colonies, trade routes, and incumbent corporations. The player is a new
entrant, not a pioneer (though frontier mode puts you closer to the beginning).

## 3. System Scale & Procedural Generation

### System Scale

The system radius determines transit times, frontier depth, and economic geography.

| Zone | Distance | Light-time | Feel |
|------|----------|-----------|------|
| Inner system | 0.2–5 AU | 2–40 min | Dense, competitive, responsive |
| Main belt | 2–4 AU | 15–30 min | Resource heartland |
| Outer system | 5–50 AU | 40 min–7 hrs | Needs local infrastructure |
| Frontier | 50–200 AU | 7–28 hrs | Operationally isolated |
| Deep frontier | 200–1000 AU | 1–6 days | Endgame exploration |

Plus escape/insertion phases (minutes to hours per body, depending on gravity well).
A 1 AU hop is ~8 minutes of cruise plus departure/arrival overhead.

**Total: ~200 AU for core gameplay, up to 1000 AU for frontier endgame.**

### Body Count

| Zone | Bodies | Types |
|------|--------|-------|
| Inner (0.2–2 AU) | 3–5 | Rocky planets, moons |
| Belt (2–4 AU) | 15–30 | Asteroids, dwarf planets |
| Outer (5–50 AU) | 3–5 giants | Gas/ice giants with 3–8 moons each |
| Frontier (50–200 AU) | 5–10 | TNOs, dwarf planets, comets |
| Deep frontier (200+ AU) | 2–5 | Scattered, rare, high-value |

**Total: 40–80 bodies.** The existing WarpDrive engine handles ~50 at 60fps.

### Star Properties

Star spectral class (M/K/G/F) determines mass, luminosity, habitable zone distance, and
color. Mass sets the gravitational parameter — all orbital velocities derive from it.

- **Heavy star (F-type)**: Fast orbital periods. Windows open and close quickly.
  Reactive economy.
- **Light star (M-type)**: Slow orbits. Stable distances. Strategic long-term planning.
  But cramped inner system (habitable zone very close to star).
- **Sun-like (G-type)**: Balanced. Earth-like periods. The default experience.

### Procedural Generation

The generator produces Keplerian orbital elements in the same format the engine already
consumes — no engine changes needed. Per body:

```
a0       — semi-major axis (AU), sampled per zone
e0       — eccentricity: 0.001–0.1 (planets), 0.1–0.4 (asteroids), 0.5–0.99 (comets)
I0       — inclination: small for planets, wider for asteroids/comets
L0       — mean longitude: random 0–360
wBar0    — longitude of perihelion: random 0–360
omega0   — longitude of ascending node: random 0–360
radius   — determines gravity, display size, resource volume
density  — determines composition type and escape velocity
```

Nav fields (`escapeVelocityKMS`, `orbitalVelocityKMS`) are derived from radius, density,
and orbital distance. Rate terms (aDot, eDot) are zero — orbits are stable within a
campaign.

### System Archetypes

Seeded randomness produces recognizable system shapes:

- **Dense inner**: Many rocky bodies close to star. Short transits, competitive routes.
- **Gas giant empire**: One or two massive planets with rich moon systems.
- **Scattered disk**: Wide orbits. Long transits, high margins, less competition.
- **Binary companion**: Distant second star perturbs outer orbits.
- **Resource jackpot**: One extraordinary body. Gold rush dynamics.

### Terra & Luna (Constants)

The homeworld is always **Terra** (Earth-like planet) with its moon **Luna**. Only humans
exist in this universe — Terrans. Terra's orbital parameters are placed in the star's
habitable zone (distance varies by star mass/luminosity). Terra and Luna have fixed
physical properties (radius, mass, escape velocity, composition) matching real Earth and
Moon. Everything else in the system is procedurally generated.

This gives every game a familiar starting point — players always know what Terra and Luna
are, what they cost to escape, and what resources are available locally. The alien part
is everything beyond Luna's orbit.

### Terran Political Landscape (2058)

By 2058, 3–5 spacefaring blocs have established off-world presence. Rather than naming
real nations (ages poorly, geopolitically fraught), the game uses abstracted blocs that
are recognizable without being literal:

**The Commonwealth** — Western democratic alliance. First to commercialize space through
public-private partnerships. Dominant in launch capability and orbital industry. Culture
of entrepreneurship and corporate independence. The player's corp most likely originates
here (or from the independent corporate sector it spawned).

**The Collective** — Eastern state-directed program. Independent capability, centrally
planned expansion. Operates through large state-backed megacorps rather than independent
companies. Strong in heavy industry and infrastructure. Methodical, resource-focused.

**The Coalition** — Southern hemisphere / emerging powers alliance. Cost-efficient, fast-
growing. Came to space later but adapted quickly. Strong in applied science, biotech,
and sustainable systems. Less capital, more ingenuity.

**The Consortium** — European technical partnership. Deep expertise in instruments,
components, and precision manufacturing. Not a territorial power — a supplier and
partner to everyone. Controls critical component supply chains.

**Independent Megacorps** — By 2058, some corporations have evolved beyond national
allegiance. Own launch capability, own stations, own workforce. Effectively stateless
spacefaring entities. The player is one of these (or aspires to become one).

**How this affects the game:**
- The starting political landscape is seeded from these blocs. Each has a presence on
  Terra and possibly Luna. In Expansion+ modes, they've established competing colonial
  footholds in the system.
- NPC corps generated at game start are affiliated with a bloc (or independent). This
  gives them behavioral tendencies: Commonwealth corps are entrepreneurial, Collective
  corps are methodical and state-backed, Coalition corps are scrappy and efficient.

**Bloc reputation works like colony standing** — same system, bigger scale. Two rivalry
axes constrain alignment:

```
Commonwealth ←rivals→ Collective
Consortium   ←rivals→ Coalition
```

Serving one side of a rivalry costs rep with the other side. The two axes are
independent — Commonwealth alignment doesn't affect your Consortium/Coalition standing.
This means four natural alignment combinations:

- **Commonwealth + Consortium**: Entrepreneurial + precision manufacturing
- **Commonwealth + Coalition**: Entrepreneurial + scrappy/efficient
- **Collective + Consortium**: State-backed + precision components
- **Collective + Coalition**: State-backed + cost-efficient
- **Independent**: Neutral everywhere, no bonuses, no obligations

Alignment emerges from who you do business with — there's no faction selection screen.

Reputation shifts based on observable actions:

- Fulfill Commonwealth contracts → Commonwealth rep rises, Collective drifts down
- Supply a Collective colony → Collective rep rises, Commonwealth drifts down
- Serve both equally on one axis → both stay roughly neutral (but you get neither's
  premium benefits)
- The other axis (Consortium/Coalition) shifts independently based on your dealings there

**Reputation effects (same gradient as colony standing):**
- High bloc rep → preferred contracts from bloc-affiliated colonies, better docking
  terms at bloc ports, access to bloc supply chains, political backing in disputes
- Neutral → standard market access, no special treatment
- Low bloc rep → bloc-affiliated colonies distrust you, contracts dry up, docking
  fees increase, bloc-affiliated NPC corps may refuse to trade

**No restrictions, only incentives.** The player is never locked out of anything by
bloc affiliation. You can walk into a Collective port with rock-bottom Collective rep
and dock (if they let you — colony governance decides, not a game rule). You can take
Commonwealth contracts while supplying the Coalition. Every action has reputation
consequences, but the player has absolute corporate freedom.

**Blocs are not governments in space.** They're Terran political entities with off-world
interests. Colonial governance is local (as described in Governance section). A
Commonwealth-affiliated colony is culturally and economically tied to the Commonwealth,
but governs itself. The bloc provides starting capital, immigration, and political
backing — not laws.

**Late-game dynamics:** A corp powerful enough to be critical to multiple blocs can
play them against each other — or transcend bloc politics entirely. An independent
megacorp that controls the system's Casimir matter supply doesn't need bloc approval.
The blocs need *them*.

### Playability Constraints

- Terra placed in the habitable zone
- At least 3–5 minable asteroids within reasonable transit range
- No body inside the star's tidal danger zone
- **Orbital stability**: No two bodies close enough to gravitationally perturb each other
  out of stable orbits within the campaign timescale. Adjacent planet orbits should
  respect Hill sphere separation (typically 10+ mutual Hill radii apart). Crossing orbits
  are fine — Pluto crosses Neptune's orbit in reality. What matters is that bodies at
  crossing points aren't at the same place at the same time. The generator checks for
  close-approach minimums and rejects configurations where minimum separation < sum of
  tidal danger zones. Crossing orbits (especially comets dipping into inner system)
  actually create interesting gameplay — seasonal resource windows and periodic
  close-approach events where transit between two bodies is briefly cheap.
- Procedural names for star, planets, moons, and notable asteroids

### Start Modes

The generator runs a fast-forward economic simulation to produce a plausible initial
world state. The player chooses how much simulated history precedes them:

**Frontier (T+5 years)**: One homeworld colony. 1–2 small NPC corps prospecting. Most
bodies unsurveyed. No governance infrastructure. Pure frontier capitalism.

**Expansion (T+20 years)**: Homeworld is a small city. 2–3 outpost colonies. 5–8 NPC
corps. Inner system mostly surveyed. Nascent trade confederations forming.

**Established (T+50 years)**: Multiple colonies with real economies. Major NPC corps.
Mature governance. Supply chains exist. Shipyards build from components. The canonical
2058 experience.

**Late Stage (T+100 years)**: Heavily developed. Megacorporations dominate. Complex
regulation and tariffs. Opportunities in niches, disruption, and frontier. Hardest mode.

The fast-forward simulation uses the same economic rules as the live game, compressed.
It produces: colony locations/populations, NPC corp portfolios, market equilibria,
infrastructure placement, governance structures, and survey coverage.

## 4. Resources & Supply Chain

Resources don't teleport from asteroid to market. The supply chain is the game.

### Resource Types

**Raw materials** (mined, must be processed):

| Resource | Found on | Processed into |
|----------|----------|----------------|
| Iron/Nickel ore | Rocky bodies, M-type asteroids | Refined metals → structural, hull |
| Platinum ore | Rocky bodies, M-type asteroids | Refined platinum → electronics, sensors |
| Rare earth ore | Rocky bodies, some asteroids | Processed RE → drives, actuators, superconductors |
| Silicates | S-type asteroids, rocky bodies | Glass/ceramics → optics, habs |
| Copper/Aluminum ore | Rocky bodies | Refined conductors → wiring, antennas |
| Uranium/Thorium ore | Rocky bodies, some asteroids | Reactor fuel rods |
| Water ice | Icy moons, C-type asteroids, comets | H₂/O₂ (propellant), purified water (life support) |
| Volatiles | Comets, icy bodies, gas giant moons | Chemical feedstock → propellant, polymers |
| Helium-3 | Gas giant atmospheres (via moons) | Fusion fuel (expensive to extract, natural endgame) |

**Casimir matter:**

| Resource | Source | Used for |
|----------|--------|----------|
| Casimir fuel rods | Manufactured at Casimir condensers | Warp drive fuel — consumed during WARP ON, CRUISE, WARP OFF phases |

Casimir matter is the substance that makes warp travel possible. It's a stabilized form
of **negative vacuum energy** — derived from the Casimir effect (a real quantum phenomenon
where restricted vacuum fluctuations between closely-spaced surfaces create measurable
force). By 2058, physicists learned to amplify this effect at industrial scale: extracting
negative energy from the quantum vacuum, condensing it into stable matter with exotic
gravitational properties, and packaging it into containment rods.

The warp drive uses Casimir matter to create a localized gravity vacuum — a region of
negative energy density that warps spacetime around the ship. This is the theoretical
basis of the Alcubierre drive, grounded in real general relativity. The Casimir effect
is the real-physics hook that makes it plausible.

**Production requires both power AND materials:**
- **Power** (enormous amounts): Vacuum energy manipulation is extremely energy-intensive.
  The Casimir condenser needs sustained multi-gigawatt input.
- **Rare earths** → superconducting containment arrays (confine the negative energy)
- **Platinum** → quantum resonance plates (the actual Casimir surfaces)
- **Refined conductors** → wiring for the electromagnetic infrastructure

This dual dependency means Casimir matter production competes for BOTH power AND
materials. Every unit produced drains the power grid and consumes rare earths and
platinum that could go to electronics or drive components.

**Production economics follow the power gradient with a material floor:**
- **Inner system** is the natural production hub. Cheap solar power and proximity to
  homeworld (where the technology was developed). But still needs material inputs
  shipped from mining operations.
- **Outer system** imports Casimir fuel rods from the inner system. Local production
  is possible but doubly expensive — fission power costs uranium AND the material
  inputs cost more to ship inward then back out as fuel rods.
- **Endgame**: Fusion-powered Casimir condensers in the outer system break the inner
  system monopoly — but still need the material supply chain.

**The core trade pattern:** Inner system exports Casimir fuel rods outward. Outer system
exports raw materials inward. The trade routes between them are the economic backbone.

A ship without Casimir matter can still fly conventionally (fusion torch) — it just can't
warp. Control the Casimir matter supply and you control who can warp.

### Resource Depletion

Resource quantity scales with body radius³ (volume proxy). Large bodies have more
resources but deeper gravity wells — more expensive to leave.

**Depletion is real but slow for large bodies.** A 100km asteroid contains more iron than
humanity has ever mined on Earth. At game-scale extraction rates, planets and large
asteroids are effectively inexhaustible — the constraint is extraction rate and
infrastructure, not total supply.

**Small bodies deplete within campaign timescales.** Sub-kilometer asteroids, comets, and
small moons can be mined out. This creates natural economic cycles: gold rush when a
rich small body is discovered → infrastructure boom → depletion → ghost town → corps
relocate. Comets are especially volatile (pun intended) — huge volatile supply during
perihelion passage, but the comet is small and depletes across a few passes.

The economic game is primarily about **extraction rate and logistics**, not about running
out of stuff. But small-body depletion adds drama and keeps the map dynamic.

### Power

Every facility, colony, and ship needs power. Power generation is distance-dependent,
creating a fundamental economic gradient across the system.

**Solar power**: Cheap, zero fuel cost, but output falls off with the inverse square of
distance from the star. At 1 AU, a solar array is efficient. At 5 AU (Jupiter), output
is 4% of that. At 30 AU (Neptune), 0.1%. Solar is dominant in the inner system and
useless in the outer system.

**Fission reactors**: Reliable at any distance. Fuel is refined uranium/thorium (actinide
supply chain — separate from rare earths). Moderate output. Standard for outer system
facilities and crewed stations. Needs periodic refueling and maintenance.

**Fusion reactors** (He-3): Endgame power source. Enormous output, compact, long-lived.
Requires He-3 fuel from gas giant moons — the most expensive resource to extract. A
facility with a fusion reactor has effectively unlimited power but the fuel supply chain
is a major ongoing cost.

**Ship power**: All ships run fission reactors (can't depend on solar during warp or at
arbitrary distances). Reactor quality is a ship stat — better reactors mean more power
for drives, sensors, and life support.

**Propulsion technology**: Ships use **high-performance fusion torch drives** for
conventional thrust — the only technology that delivers both 2g acceleration and viable
cargo economics. Specific impulse ~3,000s (exhaust velocity ~29.4 km/s). This yields
~10:1 propellant-to-cargo ratios for typical interplanetary transits — expensive enough
that fuel logistics matter, cheap enough that freight is economically viable. Chemical
rockets (Isp 450s) are hopelessly inadequate. Basic fusion (Isp 1200s) gives 276:1
ratios — ships would be 99% fuel. The Tsiolkovsky equation is unforgiving.

**Three ship consumables:**
- **Reactor fuel** (uranium/thorium rods): Powers the ship's reactor. Consumed slowly,
  limits total operational time before refueling.
- **Propellant** (H₂ from water electrolysis): Consumed during conventional thrust
  phases (ESCAPE, LAUNCH, BRAKE, INSERTION) by the fusion torch. At Isp 3000s, a
  typical interplanetary trip costs ~10× the cargo mass in propellant. This is why
  **propellant depots** are critical infrastructure — ships refuel at every stop.
- **Casimir fuel rods**: Consumed during warp phases (WARP ON, CRUISE, WARP OFF). Limits
  how far you can warp per trip. The expensive one.

**Fuel economics shape the game:**
- A ship without propellant is stranded in orbit.
- A ship without Casimir fuel can still fly conventionally (fusion torch only) but
  takes weeks/months instead of minutes for interplanetary transits.
- A ship without reactor fuel is dead in space.
- **Propellant depots** at colonies and stations are essential. A corp that controls
  propellant supply at a remote body controls access to that body. Running out of
  propellant at a body with no depot means calling for a tanker — expensive and slow.
- Deep gravity wells are genuinely expensive. The propellant cost of escaping a body
  scales exponentially with escape velocity (Tsiolkovsky). Small asteroids (escape <1
  km/s) are nearly free to leave. Gas giant moons require burning through the parent's
  massive gravity well — the fuel tax is real.

### Mass, Volume & Cargo Physics

Everything has mass and volume. Both constrain what a ship can carry and how much fuel
it burns. All units in Earth Metric Standard (SI-derived: kg, m³, km/s).

**Resource densities (real-world values):**

| Resource | Density (kg/m³) | 1,000 m³ hold = | Character |
|----------|----------------|-----------------|-----------|
| Refined platinum | 21,450 | 21,450 tonnes | Extreme mass, compact |
| Iron ore | 5,000 | 5,000 tonnes | Heavy bulk |
| Refined iron | 7,870 | 7,870 tonnes | Heavy |
| Copper ore | 4,200 | 4,200 tonnes | Heavy |
| Silicate rock | 2,650 | 2,650 tonnes | Medium bulk |
| Water ice | 917 | 917 tonnes | Light bulk |
| Volatile ices | 800 | 800 tonnes | Light bulk |
| Electronics (packaged) | ~500 | 500 tonnes | Light, high-value |
| Liquid hydrogen (propellant) | 70 | 70 tonnes | Ultra-light, bulky |
| Casimir fuel rods | ~2,000 (est) | 2,000 tonnes | Dense, high-value |

**Cargo affects fuel cost.** The Tsiolkovsky equation means propellant scales with
total mass (ship + cargo + fuel for remaining burns). Heavier cargo = exponentially
more propellant. At Isp 3000s:

| Cargo load | Propellant (typical 1 AU trip) | Ratio |
|-----------|-------------------------------|-------|
| Empty run | ~8,000 tonnes | — |
| 500t electronics | ~13,000 tonnes | 26:1 |
| 2,000t water ice | ~24,000 tonnes | 12:1 |
| 5,000t iron ore | ~51,000 tonnes | 10:1 |

**Ships are volume-limited OR mass-limited depending on cargo:**
- Dense cargo (iron ore, platinum, refined metals): hits the ship's structural mass
  limit before filling the hold. You have empty space but can't add more weight.
- Light cargo (hydrogen, volatiles, electronics): fills the hold before hitting mass
  limits. You have structural capacity left but no room.
- Optimal loads mix dense and light cargo to maximize both volume and mass utilization.

**Gameplay consequences:**
- **Route profitability depends on cargo density.** Hauling iron ore is cheap per tonne
  (common resource) but each tonne costs proportionally more fuel. Hauling electronics
  is expensive per unit but light — fuel costs are lower per unit of value.
- **Return trips matter.** Running empty burns almost as much propellant as running full
  (the ship's dry mass dominates). Smart corps arrange return cargo to avoid deadheading.
- **Tankers are special.** Liquid hydrogen is extremely light by volume — a tanker's
  hold is mostly empty space. But the hydrogen IS the product, so fuel cost is low
  relative to cargo value. Tanker economics are inverted: the cargo reduces its own
  delivery cost.
- **Crew adds mass.** Each crew member needs ~1 tonne of life support equipment, food
  stores, and hab space. A 20-person crew adds 20 tonnes of non-negotiable mass to
  every burn calculation. Drone ships avoid this overhead.

**Power as infrastructure investment:**
- Inner system: Solar arrays are cheap. Low barrier to establishing operations.
- Belt: Solar still viable but marginal. Hybrid solar+fission is common.
- Outer system: Fission required. Reactor fuel becomes a critical supply chain item.
  Corps need reliable fuel deliveries or local refining capability.
- Frontier: Fission only. Fuel logistics are the limiting factor for how far out you
  can profitably operate.

This creates a natural economic gradient: inner system operations are cheap to power,
outer system operations require serious infrastructure investment just to keep the
lights on. A corp expanding outward must solve power before it solves anything else.

### Body Composition

Each body gets a composition profile based on type:

- **M-type asteroid**: 80% iron/nickel, 15% platinum, 5% rare earths
- **S-type asteroid**: 60% silicates, 30% iron/nickel, 10% misc
- **C-type asteroid**: 40% water ice, 30% silicates, 20% volatiles, 10% organics
- **Icy moon**: 60% water ice, 20% silicates, 15% volatiles, 5% rare earths
- **Rocky planet**: Varied, but deep gravity well makes extraction expensive
- **Comet**: 70% volatiles, 25% water ice, 5% dust — tiny mass, depletes fast

### The Supply Chain

```
RAW EXTRACTION          PROCESSING              MANUFACTURING           CONSUMER
───────────────────────────────────────────────────────────────────────────────
Iron ore         →   Refined iron         →   Hull plating        →   Shipyard
                                          →   Structural frame    →   Stations
Platinum ore     →   Refined platinum     →   Electronics         →   Everything
                                          →   Sensor arrays       →   Ships, Relays
Water ice        →   H₂ (propellant)      →   (consumed)          →   Ships (thrust phases)
                     Purified water       →   Life support        →   Colonies
Silicates        →   Glass/ceramics       →   Hab modules         →   Colonies
                                          →   Optics              →   Relays, Sensors
Rare earth ore   →   Processed RE         →   Drive components    →   Shipyard
                                          →   Actuators           →   Drone factory
                                          →   Superconductors     →   Relays, Power
Volatiles        →   Chemical feedstock   →   Propellant          →   Ships
                                          →   Polymers            →   Drones, Habs
He-3 (gas giant) →   Fusion fuel          →   (consumed)          →   Fusion reactors
Copper/Aluminum  →   Refined conductor    →   Wiring              →   Everything
                                          →   Antenna arrays      →   Relays
Uranium/Thorium  →   Reactor fuel rods    →   (consumed)          →   Fission reactors

POWER + Platinum   → Casimir condenser   →   Casimir fuel rods   → Ships (warp phases)
 + Rare earths       (quantum vacuum         THE critical resource
 + Conductors         manipulation)
```

Note: Casimir matter production competes for BOTH power AND materials. Every unit
produced drains the power grid AND consumes platinum/rare earths that could go to
electronics or drive components. In the inner system where solar power is abundant,
the material cost dominates. In the outer system where power is expensive, both costs
compound. This dual dependency makes Casimir fuel rods the most supply-chain-intensive
product in the game.

### Quality & Technology Progression

There is no tech tree. Technology improves through **quality propagation** — a continuous
scalar that flows through the entire supply chain. Every resource, component, facility,
and worker has a quality level. At each processing stage, output quality is a weighted
function of inputs:

```
output_quality = (input_material × 0.4) + (facility × 0.35) + (labor × 0.25)
```

Because facility and labor outweigh material (60% combined vs 40% material), **each
processing stage lifts quality above its inputs when facility and labor are good.**
Refinement IS value-add. Quality climbs through the supply chain as each stage adds
value:

```
EXAMPLE: Ore-50 through three stages of quality-80 processing

Stage 1 — Refinery:  (50 × 0.4) + (80 × 0.35) + (80 × 0.25) = 68
Stage 2 — Factory:   (68 × 0.4) + (80 × 0.35) + (80 × 0.25) = 75.2
Stage 3 — Shipyard:  (75.2× 0.4) + (80 × 0.35) + (80 × 0.25) = 78.1
```

Ore-50 became a quality-78 ship. Each stage lifted it. With quality-90 facilities
and labor, the same ore-50 reaches even higher:

```
Stage 1: (50 × 0.4) + (90 × 0.35) + (90 × 0.25) = 74
Stage 2: (74 × 0.4) + (90 × 0.35) + (90 × 0.25) = 83.6
Stage 3: (83.6× 0.4) + (90 × 0.35) + (90 × 0.25) = 87.4
```

Ore-50 → quality-87 ship through excellent processing. Commercial-grade goods are
absolutely achievable from mediocre raw materials with a great processing chain.

**The critical result: bad ore, great processing.**
Ore-30 through three stages of quality-90 processing:

```
Stage 1: (30 × 0.4) + (90 × 0.35) + (90 × 0.25) = 66
Stage 2: (66 × 0.4) + (90 × 0.35) + (90 × 0.25) = 80.4
Stage 3: (80.4× 0.4) + (90 × 0.35) + (90 × 0.25) = 86.2
```

Ore-30 → quality-86. A corp with mediocre mining claims but world-class refineries,
factories, and workforce produces premium products. **Ore quality is the starting
point, not the destiny.**

**Full comparison with ore-50:**

| Processing chain | Stage 1 | Stage 2 | Stage 3 | Lift |
|-----------------|---------|---------|---------|------|
| All quality-30 (neglected) | 30 | 30 | 30 | 0 |
| All quality-50 (basic) | 50 | 50 | 50 | 0 |
| All quality-80 (good) | 68 | 75.2 | 78.1 | **+28** |
| All quality-90 (excellent) | 74 | 83.6 | 87.4 | **+37** |
| Improving: fac 50→70→90, lab 40→60→80 | 43.5 | 56.9 | 74.3 | **+34** |
| One weak final link (fac 80/80/30) | 59 | 69.1 | 48.1 | **-12** |

**Key lessons:**
- **Consistent quality across the chain matters most.** 80-80-80 beats 90-50-90.
- **One weak link at the end destroys value.** Quality-69 components into a quality-30
  shipyard produces quality-48 ships. All prior investment is wasted.
- **Processing investment has compound returns.** Each stage lifts quality, so three
  good stages compound into dramatic improvement from raw ore.
- **Great ore in a bad chain is wasted.** Ore-80 through quality-30 processing decays
  to quality-33. Great ore only matters if you can process it well.

**Inter-corp specialization:**

This quality model naturally creates deals between corps with complementary strengths:

```
Corp A: quality-90 refinery, quality-50 factory (great at refining, mediocre at mfg)
Corp B: quality-50 refinery, quality-90 factory + quality-80 shipyard

Separate: Corp A produces quality-74 refined material → quality-62 components → stuck
          Corp B produces quality-50 refined material → quality-70 components → quality-75 ships

Together: Corp A's quality-74 material → Corp B's quality-90 factory = quality-83 components
          → Corp B's quality-80 shipyard = quality-83 ships
```

Neither alone can produce quality-83 ships. Together they can. This creates genuine
economic incentive for long-term supply partnerships — not just price arbitrage, but
quality synergy that neither party can replicate alone.

The weights (40/35/25) are tuning parameters. The 60/40 split favoring facility+labor
over material means **processing investment is always worthwhile** — multiple viable
strategies exist rather than "find the best ore and win."

**How quality propagates through the full supply chain:**

```
Ore deposit (base quality — exploration finds better deposits)
  → Refinery: ore × 0.4 + refinery × 0.35 + labor × 0.25
    → Refined material (quality lifted by refining skill)
      → Factory: material × 0.4 + factory × 0.35 + labor × 0.25
        → Components (quality lifted again by manufacturing precision)
          → Assembly: components × 0.4 + yard × 0.35 + labor × 0.25
            → Finished product (quality lifted a third time)
              → Performance (quality scalar on efficiency stats)
```

**What quality affects:**

| Thing | Quality effect |
|-------|---------------|
| Ore deposit | Base quality — some deposits are simply better |
| Refined material | Purity, consistency. Higher quality = less waste in manufacturing |
| Drive components | Ship Isp and thrust efficiency. Quality-80 drives burn less fuel than quality-40 |
| Electronics | Sensor range, comms encryption grade, scanner precision |
| Hull plating | Structural integrity, maintenance interval |
| Hab modules | Life support efficiency, crew morale bonus |
| Mining equipment | Extraction rate, ore quality preservation |
| Drones | Operational reliability, task efficiency |
| Port scanners | Detection capability (directly affects smuggling counterplay) |
| Casimir fuel rods | Warp efficiency — higher quality = more AU per rod |

**Quality as infinite progression:**

Quality is unbounded in theory. In practice it's asymptotic — each step up requires
proportionally better inputs across the entire chain. Getting from quality-50 to
quality-60 is achievable. Getting from quality-90 to quality-100 requires near-perfect
inputs at every stage — any weak link caps the output. This creates natural diminishing
returns without a hard ceiling.

**Improving quality (no research button — just better inputs):**
- Find a higher-quality ore deposit (exploration pays off)
- Build a better refinery (requires better components, which require better inputs...)
- Hire better engineers (colony standing + wages attract top talent)
- Upgrade a facility (replace components with higher-quality ones)
- Specialize (a factory that only produces one thing can be optimized for quality)

**Economic implications:**
- **Quality is a competitive moat.** A corp with a high-quality supply chain produces
  better ships, better drones, better everything. Competitors can't just copy it — they
  need to build their own quality chain from the bottom up.
- **Quality costs compound.** Higher-quality ore may be farther away. Higher-quality
  facilities cost more to build. Better engineers demand higher wages. Premium products
  require premium investment at every level.
- **Niche markets emerge.** Not every customer needs quality-80 components. A frontier
  mining corp running disposable drones buys quality-30 and saves money. A shipyard
  building warships buys quality-80 and pays the premium. Different quality tiers
  serve different markets naturally.
- **Quality degrades if not maintained.** A facility's quality drops over time as
  components wear. Maintenance with high-quality replacement parts preserves it.
  Maintenance with whatever's available lets it decay. Neglect a quality-80 refinery
  and it becomes quality-50 over time.

### Maintenance

Ships, drones, and infrastructure all degrade over time and need maintenance. The system
is simple: everything consumes **maintenance components** from the same supply chain that
built it. No granular per-part tracking — just a periodic component cost.

- **Ships**: Consume a small amount of hull plating, electronics, and drive components
  per operational month. Skip maintenance → random system failures (drive malfunction,
  sensor degradation, hull breach risk). A neglected ship eventually becomes unflyable.
  Major maintenance requires docking at a shipyard (takes the ship out of service).
- **Drones**: Consume actuators, electronics, polymers. Higher attrition rate than ships
  (drones are expendable by design). Drone fleet size naturally decays without resupply.
- **Infrastructure** (refineries, factories, stations): Consume structural components,
  electronics, wiring. Less frequent than ship/drone maintenance but higher per-event
  cost. Neglected facilities lose throughput before failing entirely.

Maintenance creates steady demand for components at every level of the economy. A corp
with 20 ships and 100 drones has a significant ongoing maintenance bill — empire size
has a carrying cost.

### Processing Facilities

- **Refineries**: Ore → usable materials. Fixed installations on bodies.
- **Component factories**: Materials → components. Specialized: drive works, electronics
  fab, structural mill, hab works, actuator plant.
- **Shipyards**: Components → ships. The most complex facility. See Ships section.
- **Drone factories**: Components → drones. Simpler than shipyards. See Workforce section.

A corp can operate at any level:

| Role | What you do | Capital needed |
|------|------------|----------------|
| Pure miner | Extract, sell raw ore | Low |
| Integrated miner | Extract + refine on-site | Medium |
| Hauler | Buy materials, deliver | Low (just ships) |
| Component manufacturer | Refine → components | Medium-High |
| Shipbuilder | Components → ships | High |
| Drone manufacturer | Components → drones | Medium |
| Telecom | Build relays, sell bandwidth | Medium |
| Conglomerate | Everything | Massive |

### The Human Supply Chain

Colonies with humans need food, water, air, and medical supplies:

- **Hydroponics**: Water + power + nutrients + grow modules → produce (local, slow to build)
- **Protein synthesis**: Chemical feedstock + power + biotech → synthetic protein (shippable)
- **Homeworld imports**: Real agriculture → premium food (expensive, morale boost)
- **Water electrolysis**: Ice → O₂ (atmosphere) + H₂ (fuel)
- **Medical supplies**: Biotech + chemical feedstock (population growth depends on these)

Food is a strategic resource. Control a colony's food supply and you control its
workforce availability.

### Currency & Finance

**The credit (₵)** — a system-wide cryptocurrency inspired by Bitcoin Cash. Fixed supply
(sound money — no central bank can print more). All smart contracts, escrow, market
orders, and payments denominate in credits. Credits are mined by validators (not the
player's problem — it's infrastructure, like the internet existing).

**Loans**: Simple, collateralized, on-chain. Inspired by Rollercoaster Tycoon's loan
system but grounded in smart contracts:

- A corp can borrow credits from a **colony treasury** or from **another corp**.
- Loans are collateralized by registered assets (ships, facilities). The smart contract
  locks a lien on the collateral — if you default, the lender can seize the asset
  automatically via on-chain execution.
- Interest rate is set by the lender (colony treasuries offer standard rates; corp-to-corp
  loans are negotiated). Higher risk borrowers pay more — reputation history affects
  rates offered.
- **Default = asset seizure.** No bankruptcy protection. If you can't pay and the lender
  calls the loan, the collateral transfers. This is a real risk: over-leveraging to expand
  fast can result in losing your fleet.

Early game, loans are how you expand beyond your starting capital. Borrow against your
one ship to buy a refinery. Make the refinery profitable before the interest eats you.
Classic tycoon tension.

**Insurance**: Pay a premium to an insurance DAO (NPC-operated smart contract pool).
Coverage triggers on verifiable events: ship destroyed (transponder goes dark), cargo
lost at a certified port (scanner records), facility damaged. Premiums vary by route
danger, cargo value, and your operational history. Not a deep system — just a cost you
manage. High-risk frontier operations cost more to insure. You can choose to self-insure
(skip premiums, eat losses directly) if you have the capital reserves.

## 5. Communications & Information

Information moves at light speed. In a system spanning hundreds of AU, this means
**communication latency is a core gameplay system**, not a flavor detail.

### Relays

Comms relays are buildable infrastructure (antenna arrays + electronics + superconductors
+ power). A relay forwards signed messages between bodies. It doesn't reduce light-speed
delay — it ensures signals reach their destination (without relays, distant bodies may be
in radio shadow behind the star).

**Relay trust model (Nostr-style):** Every message is cryptographically signed at the
source. Relays are dumb forwarders — they can't forge messages, only delay, drop, or
refuse to forward. Verification happens at the receiver. The worst a hostile relay can
do is censor, and censorship is defeated by routing through an alternate path.

**Relay range:** Signal strength falls off with inverse square distance, just like solar
power. A standard relay can reach ~10 AU reliably. Beyond that, signal degrades — messages
may be lost or corrupted. To span the outer system (50+ AU) you need relay chains:
inner relay → belt relay → outer relay → frontier relay. Each link is infrastructure that
someone built, maintains, and charges for. This makes telecom a genuine business — the
corp that builds a relay chain to the frontier controls information access to that region.
Higher-grade relay equipment extends range but costs more to build and power.

**What relay owners control:**
- **Coverage**: Only relay in range of a frontier body? Monopoly pricing on bandwidth.
- **Priority**: Own traffic arrives slightly before competitors'. Not forgery — faster delivery.
- **Fees**: Micropayments per forwarded message. Passive income from traffic volume.
- **Access**: Can deny forwarding to specific corps (information warfare via censorship).

### Command Centers

The player sees everything (omniscient camera) but acts through **command centers** —
physical installations where orders originate. Orders propagate at light speed from the
nearest command center to the target.

- **Headquarters**: Starting command center at homeworld. All orders originate here initially.
- **Remote centers**: Built at other colonies. Each gives local-speed reaction in its region.
  Requires: hab modules, electronics, comms relay, power. Cost comparable to a small factory.
- **Order latency**: When issuing an order, the UI shows arrival delay before confirmation:
  "This order will arrive in 12m 34s. Confirm?"
- **Standing orders**: Execute at local speed regardless of command center distance. "Sell
  platinum whenever price > 500/ton." Zero latency, but can't adapt to context.

**Progression:**
- Early: One HQ. Slow everywhere except home. Favors local operations.
- Mid: Build a command center at your busiest remote region. Competitive there.
- Late: Network of command centers. Near-instant everywhere. But each costs capital
  and ongoing maintenance.

### All Communication is In-World

There is no out-of-band game communication channel. Player-to-player chat, AI-to-AI
negotiation, and player-to-AI diplomacy all use the relay infrastructure. Messages
travel at light speed from the sender's nearest command center.

- **Diplomacy has latency.** Earth-to-Jupiter negotiation: 40+ minutes per round trip.
- **Geography shapes politics.** Nearby corps negotiate faster, ally more easily.
- **Encrypted chat exposes metadata.** Content is private, but the relationship is
  observable (who's talking to whom, how much, how often).
- **War arrives with the news.** Attack fleet and declaration can arrive simultaneously.
- **AI corps obey the same physics.** No omniscience, no cheating. Fair by construction.

### Out-of-Band Communication Resistance

Players will use Discord, phone calls, etc. The game can't prevent this. The design
makes out-of-band comms **irrelevant to the mechanical outcome** rather than impossible:

- **Orders still travel at light speed.** Agreeing on a plan via Discord doesn't make your
  command center closer. You still can't issue orders faster than physics allows.
- **Contracts still require in-game escrow.** A verbal deal on Discord isn't enforceable.
  The smart contract must be executed through the game's systems.
- **Market orders go through game infrastructure.** Knowing a price via Discord doesn't
  let you trade faster — the buy/sell order still propagates from your command center.
- **Evidence is in-game.** Transponder logs, relay traffic records, port scanner data —
  the game's evidentiary systems don't care what you discussed on Discord.

What out-of-band comms DO give players: faster negotiation, secret coordination (no
encrypted relay metadata to observe), and real-time voice discussion at any distance.
This is a social advantage, not a mechanical one. The game's systems are designed so that
**knowing what to do and being able to do it are separate problems.** Discord solves the
first. Command centers solve the second.

### Information as Cargo

Data is a resource with its own logistics. Three ways to move it:

**Public broadcast**: Fast (light-speed), cheap, everyone can see it. Signed and
authenticated but not private. Used for: market data, contract offers, public announcements.

**Encrypted broadcast**: Same speed, higher cost. Private in theory, but encrypted traffic
is observable as metadata — who's talking to whom, volume, frequency. Vulnerable to relay
compromise, cryptanalysis, endpoint hacking. Used for: fleet orders, negotiations, intel.

**Physical transport (sneakernet)**: Slow (ship speed), free, completely dark — no relay
metadata, nothing to intercept. Vulnerable to physical piracy and ship capture. Used for:
the most sensitive data — survey results, strategic plans, black market intel.

### Fog of War: You Only Know What You've Observed

Information asymmetry is the game's fog of war. Unlike spatial fog in a traditional RTS,
this fog is **informational and time-decaying.** You don't know what your comms
infrastructure and ships haven't directly observed. And what you observed last month
might not be true anymore.

**What you know about a competitor is ONLY:**
- What your ships/drones saw near their operations (passive observation)
- What's publicly broadcast on relay channels (market transactions, contract postings)
- What you can infer from on-chain pseudonymous data (address → corp mapping is work)
- What your relays forwarded (traffic metadata, not content)
- What you bought from information brokers
- What they voluntarily disclosed

**Everything else shows as "unknown" in the UI.** Click on a competitor's facility:
you might see "Refinery — quality: unknown, throughput: unknown, owner: suspected
Corp B (confidence: 72%)." You know it's a refinery because your survey drone flew
past and saw the structure. You suspect it's Corp B because ships associated with
Corp B's known addresses dock there. But you don't know its quality level, production
rate, or what it's processing unless you have specific intelligence.

**Intelligence decays.** An observation from 30 game-days ago is labeled "STALE" in the
UI. The competitor may have upgraded their facility, hired new workers, or changed
production. Current intel requires ongoing observation — either regular ship flyovers,
a relay in the area monitoring traffic, or informants.

**What's observable vs hidden:**

| Information | How you learn it | Decay rate |
|------------|-----------------|------------|
| Facility exists (type, location) | Ship flyover, survey drone | Slow (buildings don't vanish) |
| Facility owner | Address association (observation + inference) | Slow |
| Facility quality level | Observe output quality on market, or informant | Medium |
| Workforce quality | Observe output quality trends, labor market monitoring | Medium |
| Fleet composition | Ship transponder sightings near their operations | Fast (ships move) |
| Cargo contents | Only if you scan them (ship scanner) or see market transactions | Immediate (per-trip) |
| Financial position | On-chain analysis of pseudonymous addresses (hard, noisy) | Fast (changes constantly) |
| Strategic plans | Informant, intercepted comms, or inference from behavior patterns | Instant decay |
| New hire quality | See posting on labor market → see it disappear → infer who hired | Medium |

**Labor market as intelligence source:** When a colony's labor market shows a quality-80
engineer available, then the listing disappears — someone hired them. If Corp B's
factory output quality improves shortly after, you can infer the connection. But only
if you were watching the labor market AND monitoring Corp B's output. Miss either
observation and you don't know.

**The intelligence investment loop:** Better comms infrastructure (more relays, command
centers in more regions) → more observations → better competitor intelligence → better
strategic decisions. A corp flying blind in a region they don't monitor is at a massive
disadvantage against one with deep intel. This is why command centers and relay networks
aren't just about order latency — they're about knowing what's happening.

### Passive Intelligence

Ships and drones observe as they travel:
- Bodies within sensor range (basic composition scan)
- Other ships' transponder broadcasts (identity, heading, speed)
- Relay traffic patterns (who's talking to whom)
- Port activity at colonies (ships docked, cargo loaded)
- Market prices at ports they dock at (firsthand, not relay-delayed)

Data accumulates on the ship's computer. The player decides: broadcast it (useful but
visible), hold for physical delivery (stale but secure), sell to brokers, or delete it
(sometimes knowing something is a liability).

### Counterintelligence

- **Comms security**: Higher-grade encryption. Ship upgrade, operating cost tradeoff.
- **Disinformation**: Broadcast false heading on public channels. Legal but burns trust.
- **Compartmentalization**: Ships only know their own orders, not strategic context.

## 6. Colonies, Workforce & Population

### Colonies vs Corps vs Private Installations

A **colony** is a place — shared infrastructure on a body. A **corp** is a tenant —
leasing dock space, building facilities, hiring workers. Multiple corps operate at one
colony. One corp operates at many colonies. Many-to-many.

- Shared: port (docking fees), life support, hab space, labor pool, market
- Separate: each corp's facilities (your refinery, their shipyard)
- Colony governance sets local rules: taxes, environmental standards, docking priority

A **private installation** is a corporate facility on an uninhabited body. No shared
infrastructure, no docking for others unless the owner permits it. Cheaper, but no
local market and you bear all costs.

**Colony ownership:**
- Established modes: colonies are self-governing. Corps are tenants.
- Frontier: first corp to build a hab effectively founds the colony and sets initial rules.
  Governance evolves as population grows and other corps arrive.

### Colony Types

**Drone Outpost** (unmanned): Automated extraction. No life support costs. Can't handle
novel situations — stops and waits for human visit. No population, no local market.

**Crewed Station** (10–200 people): Human supervisors + drones. Needs food, water, air,
medical, hab modules. Can adapt, make decisions, do light manufacturing. Small local market.

**Colony** (200–50,000): Self-sustaining community. Needs everything. Has real markets,
diverse demand. Can house shipyards, factories. Population grows if well-supplied.

**City** (50,000+): Economic hub. Deep markets, diverse industry. Mostly self-sufficient
but imports specialty items. Exports: manufactured goods, skilled labor, financial services.
Political influence. Only appears in Established/Late Stage modes or after decades of growth.

### Workforce

Humans are expensive but irreplaceable for complex tasks:

| Role | What they do | Drone alternative? |
|------|-------------|-------------------|
| Engineer | Build/repair complex systems, handle novel failures | Maintenance drones (routine only) |
| Pilot | Navigate edge cases, warp transit, emergency response | AI pilot (cheaper, slower) |
| Geologist | Assess deposits, optimize extraction | Survey drones (surface only) |
| Manager | Run facilities, negotiate, strategic decisions | None |
| Worker | General labor, loading, maintenance | Construction/mining drones |

**The drone-vs-human calculus:**
- All-drone: Zero crew cost. Can't adapt. Works for routine extraction of known deposits.
- Human-supervised: 3–5 crew + 50 drones. Expensive but handles surprises.
- Full crew: 20+ humans. Maximum flexibility, maximum cost. For complex operations.
- The trap: all-drone saves money until something breaks. Then you send humans on a
  multi-week transit to fix it. Opportunity cost can dwarf the savings.

Drones wear out. They need replacement parts from the same supply chain that manufactures
them. A drone fleet is an ongoing operating cost, not a one-time purchase.

### Worker Needs & Labor Quality

Workers have **three tiers of needs** that determine their quality, productivity, and
willingness to stay:

**Tier 1 — Survival** (must be met or workers leave/die):
- Food (hydroponics produce, synthetic protein, or imported)
- Water (purified, recycled at 95% — need 5% resupply)
- Air (atmosphere recycling, CO₂ scrubbers, filters)
- Medical supplies (biotech + chemical feedstock)
- Hab space (1 hab module per ~10 crew)

If survival needs aren't met, productivity collapses immediately. Prolonged shortage
triggers evacuation — workers leave on the next available transport. A colony that
can't feed its people empties fast.

**Tier 2 — Comfort** (affects morale and retention):
- **Recreation**: Entertainment goods, social spaces, comms access to home. Manufactured
  from electronics + polymers, or imported cultural goods from homeworld.
- **Personal goods**: Clothing, tools, creature comforts. Light manufactured goods.
- **Communications**: Relay access for personal messages home. Workers at a frontier
  body with no relay coverage have terrible morale — they're cut off from everyone
  they know.
- **Safety**: Quality of hab shielding, emergency systems, medical facility (not just
  supplies — a staffed clinic vs a first aid kit). Workers at a dangerous facility
  with poor safety record demand hazard pay or leave.

When comfort needs are unmet, workers don't leave immediately — but morale drops,
productivity drops, and the colony becomes unattractive to immigrants. You can run a
bare-survival operation, but you'll have a miserable, low-quality workforce that turns
over constantly.

**Tier 3 — Growth** (affects worker quality level over time):
- **Education**: Training facilities, educational materials, mentorship programs.
  Requires: electronics (simulators/terminals), specialized instructors (high-quality
  workers teaching others), and time (workers in training aren't producing).
- **Career advancement**: Promotion paths, skill development opportunities. Workers
  who see a future stay longer and work harder.
- **Research access**: For engineers and geologists — access to data, experimentation
  facilities. Improves their ability to solve novel problems.

Education is the key to the quality system's labor input. An uneducated worker is
quality-20. Basic training gets them to quality-40. A colony with a proper training
program produces quality-60 workers. A colony with a full educational infrastructure
(university-equivalent, research labs, simulators) produces quality-80+ workers.

**Worker quality is a colony property, not a corp property.** Corps hire from the colony's
labor pool. If the colony has invested in education, ALL corps operating there benefit
from higher-quality workers. This creates an interesting collective action problem:
education investment benefits everyone, so who pays for it?

- **Colony-funded**: Tax revenue funds education. Corps that pay more taxes indirectly
  invest in workforce quality. Fair but slow.
- **Corp-funded**: A corp can build training facilities at a colony (counts as
  infrastructure investment → standing boost). They get first pick of graduates.
  But other corps also benefit from the improved labor pool.
- **Poaching**: Instead of investing in education, hire quality-80 workers away from a
  colony that DID invest. Cheaper short-term but damages standing at the origin colony
  and doesn't scale.

### The Immigration Pipeline

Not all immigrants are equal. Who you attract depends on what you offer:

**Survival-only colony** → attracts desperate workers. Low quality, high turnover.
They come because they have no better option. They leave the moment one appears.

**Comfortable colony** → attracts stable workers. Medium quality, reasonable retention.
Families settle. Population grows organically. This is the baseline for a functional
colony.

**Growth colony** (education + opportunity) → attracts ambitious, skilled workers.
High quality, strong retention. The colony becomes a talent magnet. Engineers and
specialists actively choose to immigrate because the career opportunities are best here.
This is how you build a quality-80 labor force — not by paying more, but by building
a place where talented people want to live.

**The feedback loop:** High-quality workers → better production → more profit → more
investment in colony infrastructure → better living conditions → attracts more
high-quality workers. The virtuous cycle is the real mid-to-late-game progression.
The reverse is also true: neglect a colony and it spirals — workers leave, production
drops, less investment, worse conditions, more workers leave.

### Labor Supply Chain Summary

```
SURVIVAL GOODS (Tier 1)        → Workers alive and present
  Food, Water, Air, Medical,      Minimum for operation
  Hab space

COMFORT GOODS (Tier 2)         → Workers happy and staying
  Recreation, Personal goods,     Morale + retention + immigration
  Comms access, Safety

GROWTH INVESTMENT (Tier 3)     → Workers skilled and improving
  Education facilities,           Labor quality increases over time
  Training programs,              Colony becomes talent magnet
  Research access
```

Each tier has its own supply chain feeding into it. A corp that only supplies Tier 1
has a functioning but miserable workforce. A corp that invests through Tier 3 has a
competitive advantage that compounds over time — and it's an advantage that's hard for
competitors to replicate quickly, because workforce quality takes time to build.

### Colony Standing

Workers choose where to work. A corp's ability to hire depends on how the colony
perceives them:

**Affected by:** Wages relative to colony average. Safety record (one bad incident
tanks standing for months). Environmental impact (mining dust, refinery emissions,
water contamination). Infrastructure investment (power plants, medical facilities
that benefit the colony). Supply reliability (the corp that keeps water flowing is
popular). Employment (replacing humans with drones when unemployment is high costs you).

**Effects:** Excellent standing → priority hiring, best talent, tax breaks, policy
consultation. Neutral → market rate access. Poor → hiring penalty, docking deprioritized,
surcharges, protests. Hostile → can't hire locals, docking denied, forced evacuation.

**The productivity-liquidity tradeoff:** Happy workers (high wages, good conditions)
produce more but cost more. Lean operations free up cash for expansion but create
turnover, accidents, and resentment. The optimal point depends on local labor market
conditions.

### Environmental Dynamics

Colonies are fragile artificial ecosystems. Corporate activity can threaten them:
mining near colonies creates dust/vibration/breach risk. Refinery emissions must be
vented away from hab zones. Water contamination is catastrophic. Orbital debris from
careless operations creates collision hazards.

Corps choose: clean operations (expensive, slow, maintains standing) or cut corners
(cheap, fast, accumulates incidents). Off-site operations (refinery on uninhabited
body nearby) avoid environmental friction but add transit cost.

### Population Dynamics

Growth depends on: food supply, medical access, economic opportunity, morale. Thriving
colonies attract immigrants. Neglected ones hemorrhage population. Ghost towns are
possible. Immigration/emigration requires passenger transport — another ship type and
revenue stream.

## 7. Governance & Law

### Design Principle: No Game-Rule Restrictions

Nothing is forbidden by code. Every restriction is enforced by economics, physics, and
the political choices of other entities. You CAN attack a ship at a major colony's port.
But the port has defense drones, every ship has transponder logs with your cryptographic
identity, every colony in the system will see evidence within light-hours, your standings
will crash, and other corps may blacklist you. None of that is a game rule. It's emergent
from systems that exist for other reasons.

A player who attacks a major port, survives the defenses, escapes the fallout, fences
the cargo through frontier contacts, and rebuilds reputation over years — that's not
an exploit. That's a great story.

### Colony Governance Types

Each colony's governance emerges from its founding history and population:

**Independent Colony**: Elected council. Sets own taxes, fees, standards. Corps are
tenants. Most common at established settlements with diverse populations.

**Company Town**: Founded and governed by a single corp. Low taxes for the owner, higher
for competitors (or access denied). Efficient but brittle — if the owning corp collapses,
the colony is stranded. Common in frontier mode.

**Consortium**: Multiple corps jointly govern, decisions by investment-weighted vote.
Shared costs, shared defense. Stable but slow to decide. Common at strategic locations.

**Free Port**: No taxes, no regulations, no questions asked. No defense investment, no
port scanners for contract settlement. Attracts frontier operators and smugglers.
Dangerous but lucrative.

Governance evolves: first corp at a body → company town. Second corp arrives →
negotiation. Population grows → pressure for independent governance. Multiple independent
colonies → trade confederations form.

### Alliances & Confederations

**Trade Confederations**: Colonies agree on shared standards (cargo grades, scanner
calibration) so contracts are interoperable. Think ISO, not NATO.

**Defense Pacts**: Mutual defense. Attack one member, the others respond (within
light-speed delay). Expensive shared defense fund.

**Corporate Alliances**: Shared intelligence, trade preferences, coordinated pricing.
Reputation-based, not code-enforced. Betrayal always possible.

### The SCA (One Possible Institution)

In Established/Late Stage modes, a **System Commerce Authority** may exist — a voluntary
trade confederation that's grown powerful enough to feel like a governing body. But it's
not inherent to the game. It's a confederation of major colonies that sets widely-adopted
standards, operates a shared port oracle network, publishes market data, arbitrates
disputes, and maintains a bounty board for piracy.

It is NOT a sovereign government, not universal (frontier isn't a member), not militarily
powerful, and not incorruptible. In Frontier mode, it doesn't exist yet and may never form.

## 8. Contracts, Commerce & the Underground

### Privacy Model

The information environment reflects 2058 norms: encryption-by-default, pseudonymous
identity, and selective transparency. Decades of corporate espionage, nation-state
hacking, and activist movements through the 2030s–2050s pushed privacy tooling into
standard infrastructure.

**What's public (on-chain, auditable by anyone):**
- Contract structure — terms, conditions, deadlines, quality thresholds
- Contract outcomes — delivered/failed/disputed, scanner readings
- Transaction amounts and flows (but between pseudonymous addresses)
- Ship registrations (linked to pseudonymous keys, not corp names)
- Scanner attestations (signed readings, on-chain)
- Reputation history (per-address: deliveries completed, contracts abandoned, disputes)

**What's pseudonymous:**
- Participants are addresses, not names. `qz7x...3f` completed 847 deliveries. Which
  corp is that? You don't know unless they've publicly claimed it or you've done the
  intelligence work to associate the address with observed behavior.
- Corps can operate through multiple addresses. A conglomerate might use different
  addresses for different operations — one for legitimate hauling, one for frontier
  activities. Linking them requires traffic analysis, not a database lookup.
- CashFusion (credit mixing) is routine for general spending. Financial flows between
  addresses are obfuscated unless the parties choose transparency.
- Stealth addresses for everyday transactions — payroll, supplies, docking fees.

**What's private (encrypted, requires access or compromise):**
- Contract contents (parties can choose to publish or keep private — the structure
  is visible but specific values like price, quantity, quality specs can be encrypted
  with only the parties holding keys)
- Relay message contents (encrypted by default, metadata visible)
- Ship cargo manifests (signed but encrypted — port scanner reads locally, doesn't
  broadcast contents)
- Corp internal communications, fleet orders, strategic plans

**What this means for gameplay:**

- **"Who is that ship?"** is a real investigative question. Transponders broadcast a
  pseudonymous key, not a corp name. You identify ships by observation: this key docks
  at that corp's facilities, flies their routes, responds to their command center.
  Building a map of competitor fleets is intelligence work, not a UI label.
- **Reputation is per-address.** A corp can shed a bad address and start fresh — but
  loses all accumulated reputation history. Re-establishing trust on a new address
  takes time. There's a real cost to burning an identity.
- **Colony standing** tracks known addresses. A corp that operates through one public
  identity builds deep standing. A corp that rotates addresses appears as multiple
  unreliable newcomers. Transparency is rewarded in civilized space.
- **Financial intelligence** — tracking credit flows between addresses to map corporate
  structure, identify shell entities, or discover hidden partnerships — is a valuable
  skill. Pattern analysis can cluster addresses that behave as a fleet even without
  knowing the corp name.
- **Privacy is the default, transparency is a choice.** Corps that want to build public
  reputation voluntarily link their addresses to a public identity. Corps that want to
  operate in the shadows stay pseudonymous. Both are valid strategies with different
  tradeoffs.

### Smart Contract Escrow

Trustless commerce is the backbone. Buyer locks funds in escrow; port scanner confirms
delivery; funds release automatically. No arbitration needed for the happy path.

Contracts handle: payment on delivery, deadline enforcement (bond forfeit on expiry),
multi-party revenue splits, escrow for purchases.

Contracts CAN'T handle: quality disputes (scanner says 58, seller claims they loaded
62 — was it transit degradation, scanner miscalibration, or fraud? The contract only
sees the oracle output), exclusive dealing (can't prevent off-chain deals), territory
claims (social, not code-enforced), acts of god (ship breakdown), what's actually in
the cargo hold vs what the scanner reports is in the cargo hold.

### Reputation

Reputation is **observable history, not a score.** Every corp's trade record is public:
deliveries completed, contracts abandoned, disputes, combat incidents. Other corps and
colonies read this history and make their own judgments.

Different entities weight different factors. A water-starved frontier colony doesn't care
about your combat record. A shipyard consortium might. No game-imposed penalties — only
the collective response of entities that can see your history.

**Game-appropriate tuning:** Operational failures (ship breakdown, missed deadline) are
expected in space. Small impact. Recovery matters — sending a replacement partially
redeems the failure. Abandoned contracts (never tried) are a bigger deal. Deliberate
hostile acts are weighted heavily by most entities — but a frontier free port might not care.

### The Trust Spectrum

| Context | Trust mechanism | Failure mode |
|---------|----------------|-------------|
| Certified port delivery | Escrow + port scanner oracle | Scanner disputes |
| Uncertified port delivery | Escrow + manual buyer confirmation | Slower, disputable |
| Long-term supply agreement | Per-shipment escrow + reputational commitment | Soft terms unenforceable |
| Partnership / JV | Multi-sig treasury + mutual dependency | Messy dissolution |
| Frontier handshake | Reputation only | No recourse |

### Cargo Manifests, Scanners & Smuggling

Every ship has a **cargo manifest** (signed declaration). Every certified port has a
**scanner** (verifies manifest against actual cargo). This infrastructure exists for
contract settlement — the scanner is the oracle that triggers escrow release. But it
also creates conditions for smuggling.

**Why contraband exists:** Colonies set their own laws. What's legal at one may be
banned at another — environmental bans on chemical feedstock, company town bans on
competing products, defense restrictions on weapons components. The banned goods still
have demand.

**The scanner game:** Scanner quality varies by colony wealth. Counterplay includes:
shielded cargo containers (manufactured item, takes cargo space), manifest falsification
(declare platinum as iron — better scanners catch spectral mismatch), bribery at corrupt
ports, and compartmentalized holds (hidden compartment — ship modification, costs cargo
capacity).

No "smuggling skill." Just: you have cargo, the port has a scanner, can you get past it?

**Scanner warfare:**

Scanners are oracles — their signed readings settle contracts on-chain. This makes
them simultaneously critical infrastructure and attack surface.

**Ship-mounted scanners**: Corps can install their own scanners on ships or at private
facilities. A quality-100 ship scanner lets you independently verify cargo before
accepting delivery — your defense against a defective or malicious port scanner. If
the port reads quality-58 and your scanner reads quality-63, you have signed evidence
of a discrepancy to dispute the settlement.

**Hacked scanners**: A scanner reprogrammed to produce false readings. Enormously
valuable black market item. Uses:
- Fence stolen cargo (scans as legitimate origin/quality)
- Pass off low-quality goods as premium (contract pays out on false reading)
- Block competitor deliveries (false negative on quality, escrow withheld)
- Smuggling (contraband scans as legal goods)

**The catch**: Every scanner reading is cryptographically signed and recorded on-chain.
A hacked scanner produces **signed false attestations** — forged evidence. One
independent verification (buyer's own scanner, trade confederation audit, routine
cross-calibration check) exposes the discrepancy. The scanner's key is burned. Every
contract it ever settled becomes retroactively disputable.

A hacked scanner is a money printing machine until it's caught — then it's a liability
bomb that unravels every transaction it touched. The corp operating it faces: mass
contract disputes, colony standing collapse, potential seizure of assets, and permanent
loss of trust at every port that learns about it.

**Quality determines the arms race:**
- High-quality legitimate scanner: precise readings, hard to dispute, attracts commerce
- Low-quality legitimate scanner: noisy readings, borderline calls go either way,
  disputes are common even without malice
- Hacked scanner: reads whatever the owner wants, devastating until discovered
- High-quality ship scanner (defensive): your own source of truth, expensive but
  protects against both bad port scanners and hacked ones
- Scanner calibration data: knowing a port scanner's exact capabilities and tolerances
  is intelligence — it tells you exactly what you can slip past and what you can't

**Black markets:** Where there's contraband, there are black market contacts — NPCs who
post buy orders for banned goods at premium prices, offer information in exchange for
deliveries, and connect you to fixer networks. Operate through encrypted comms.

**Information brokering:** The most valuable contraband may not be physical — survey data,
competitor fleet movements, colony political intel, scanner calibration data. Information
doesn't trigger port scanners. The challenge is acquiring it and finding a buyer.

## 9. Ships, Fleet & Manufacturing

### Ship Properties

Ship stats map directly to existing physics constants:

| Property | Game effect | Physics mapping |
|----------|-----------|----------------|
| Engine thrust | Acceleration, escape time | `SHIP_ACCEL_MS2` |
| Drive quality | Warp threshold speed | `WARP_THRESHOLD_KMS` |
| Hull length / dry mass | Cargo capacity, tidal tolerance | `SHIP_LENGTH_KM` |
| Propellant capacity | How many Δv burns before refueling | Derived from mass ratio |
| Casimir fuel capacity | Max warp distance per trip | New field |
| Reactor | Power output, reactor fuel consumption rate | New field |
| Mining equipment | Extraction rate | New field |
| Drone bays | Combat/utility drone capacity | New field |

### Ship Classes

Built from the same components in different proportions:

- **Scout**: Light hull, big drive, small cargo. Fast, cheap. Exploration and courier.
- **Freighter**: Heavy hull, standard drive, huge cargo. Slow, expensive. Bulk hauler.
- **Mining vessel**: Medium hull, mining equipment, ore processing bay.
- **Tanker**: Specialized fuel transport. Critical for frontier refueling.
- **Colony ship**: Passenger transport. Hab modules instead of cargo. Immigration/evacuation.

### Ship Manufacturing

Ships are not bought from a menu. They're built at **shipyards** from components:

1. Shipyard needs: hull plating, drive components, electronics, hab modules, fuel
   tankage, wiring/cabling.
2. Owning corp sets price and build queue.
3. Orders placed via escrow — pay on delivery.
4. Construction time depends on component availability and yard capacity.
5. Component shortage stalls all orders until resupplied.

A corp that controls rare earth supply controls the shipbuilding pace.

### Drone Manufacturing

**Drone factories** (simpler than shipyards) produce:

- **Mining drones**: Deploy at asteroids, mine and stockpile autonomously.
- **Survey drones**: Sent to unsurveyed bodies. Cheap, expendable.
- **Maintenance drones**: Keep stations and rigs operational. Reduce crew needs.
- **Construction drones**: Build stations, refineries, habs. Slow but no crew risk.
- **Combat drones**: Repurposed mining/construction drones with weapons mounts.

Drone factories need the same rare earths as shipyards (actuators vs drive components) —
genuine resource tension.

### Fleet Management & Trade Routes

The single-ship state extends to a fleet:

```js
state.fleet = [
  { id: 'ship-1', route: [...], jumpIndex: 0, elapsed: 0, cargo: {...}, orders: {...} },
  { id: 'ship-2', route: null, docked: 'Ceres', cargo: {...}, orders: {...} },
];
```

Each ship gets its own transit tick. Camera can track any ship.

**Trade routes are emergent, not a game object.** A ship with standing orders — "load
platinum at Vesta, deliver to Homeworld, repeat" — is running a trade route. There's no
explicit "create trade route" action. You just give a ship orders and it executes them.
The player's fleet management screen shows each ship's current orders, position, cargo,
and fuel status. Optimization is about choosing which ships run which orders and when.

### Passenger Transport

Colony ships carry passengers instead of (or alongside) cargo. Immigration and emigration
are driven by economic conditions: colonies with jobs and good quality of life attract
immigrants from the homeworld and from declining colonies. Corps that run passenger
services earn per-head fees.

**Where immigrants come from:**
- **Homeworld**: The largest population reservoir. Effectively infinite supply at game
  timescales, but homeworld-to-colony transit is expensive (long distance, life support).
- **Other colonies**: Workers emigrate from declining colonies to thriving ones. This can
  cascade: a colony losing workers becomes less productive, loses more workers, eventually
  becomes a ghost town.

**Why passenger transport matters:**
- **Workforce supply**: A colony's labor pool only grows through immigration (natural
  growth is slow). Corps that need workers at a remote facility can fund immigrant
  transport to boost the local population.
- **Colony founding**: Establishing a new colony requires transporting the initial
  population. A corp that controls passenger transport decides where new colonies form.
- **Piracy stakes**: Attacking a freighter means lost cargo. Attacking a colony ship
  means lost lives. The political consequences are proportionally more severe — every
  colony in the system reacts harshly to civilian casualties.
- **Evacuation**: When a colony fails (resource depletion, environmental disaster,
  economic collapse), someone needs to evacuate the population. Emergency evacuation
  contracts pay well but require ships on short notice.
- **Political leverage**: A corp that controls immigration to a colony can throttle or
  boost its population growth. Combined with food supply control, this is enormous power
  over a colony's future.

## 10. Combat & Conflict

### Physical Constraints

**Combat only happens at low speed.** Ships at warp are untouchable. Engagements happen
during escape, insertion, docking, and mining operations. Historical analogy: piracy
happens in port or near shore, not mid-ocean.

**No stealth in space.** Every ship radiates heat, every drive has a signature, every
transponder broadcasts. You know someone's coming. The question is what you can do.

**Ships aren't warships.** Mining vessels and freighters with weapons retrofits. Combat
capability is a tradeoff against cargo capacity and efficiency.

### Graduated Escalation

All forms of conflict exist on a spectrum. Most stays at the bottom — not because the
game prevents escalation, but because the economic consequences are ruinous.

```
Level 0: Economic warfare     Undercutting, supply disruption, contract poaching
Level 1: Intimidation         Armed ships near competitor's operations
Level 2: Drone skirmish       Combat drones contest a mining claim
Level 3: Boarding & seizure   Disable ship, take cargo/vessel
Level 4: Destruction          Deliberate ship destruction — extreme, rare
```

**Consequences are emergent:**
- Level 0: Normal business.
- Level 1: Nearby colonies get nervous. Defense pacts may activate.
- Level 2: Transponder logs record it. Colonies adjust standing based on evidence.
- Level 3: Victim broadcasts signed evidence. Every colony re-evaluates. Insurance pays
  victim. Corps independently decide whether to blacklist you.
- Level 4: Same as 3 with casualties (if crewed). Ad-hoc coalitions form. Colony docking
  denied. Effectively outlaw status in civilized space.

Violence is almost always a losing trade in a connected economy. But on the frontier with
no witnesses and no colony dependencies, the math changes.

### Combat Mechanics

**Not twitch gameplay.** The player is a CEO watching a situation room, not flying a
fighter. Combat auto-resolves based on forces, positioning, and pre-set directives.

**What the player controls:**
- Pre-combat: fleet composition, drone loadout, escort assignments, engagement rules
  ("defend mining rig," "intercept freighters in this zone," "flee if outnumbered")
- During engagement (sim-time): "attack," "disengage," "redirect drones to target X,"
  "dump cargo and flee." Direct orders are allowed — you can react, but you're not
  clicking on individual units.
- Micro can have small impacts but this isn't StarCraft. Strategic preparation
  (better drones, more of them, better positioning) dominates tactical decisions.

**Resolution factors:** Number and quality of combat drones. Ship hull strength.
Electronic warfare capability. Crew quality (human crews improvise better; drone ships
can be hacked). Distance to nearest friendly port (determines who can reinforce/resupply).
Proximity to colony defense drones (don't fight near a defended port).

### Economic Warfare (Level 0)

The most common form of conflict, and the one that doesn't show up on anyone's
transponder logs:

- Undercut competitor's prices on their key route
- Buy up all rare earths before a competitor's shipyard order fills
- Vertically integrate to cut out a middleman
- Time contracts to exploit orbital windows
- Monopolize fuel supply at a remote station
- Consistently fulfill contracts a competitor abandoned (reputation warfare)
- Lobby colony governance for regulations that disadvantage competitors

## 11. AI Corporations

AI corps are first-class entities — same state, same API, same communication physics as
human players. They make the economy work in single player and fill seats in multiplayer.

### Decision Model

Each AI corp has a personality and runs a decision loop constrained by the same
information it can access through its command centers and relay network:

```
1. Evaluate available contracts (filter by capability and feasibility)
2. Estimate profit: pay - fuel cost - opportunity cost of ship time
3. Check market arbitrage opportunities
4. Assign idle ships to best opportunity
5. Consider fleet expansion if profitable routes exceed capacity
6. Manage colony relationships (wages, investment, supply reliability)
7. Occasionally: found a new colony, build infrastructure, form alliances
```

### Personality Archetypes

- **Hauler**: Safe, reliable deliveries. Avoids speculation. Large fleet.
- **Prospector**: Exploration and mining. First to reach new bodies. Volatile income.
- **Trader**: Market arbitrage. Few ships, high margins.
- **Monopolist**: Undercuts competitors, corners markets. Aggressive.
- **Frontier**: Distant high-value targets. Long transits, big payoffs.

### Why AI-First Matters

1. Economy works in single player from day one
2. Game API is proven — if AI can play, humans can play
3. Multiplayer is "replace some AI decision loops with WebSocket connections"
4. Balance testing is automated — run 8 AI corps overnight, check if economy collapses
5. AI corps handle baseline trade volume and price stability

## 12. Game Modes

### Single Player

Real-time strategy on simulator time. Player vs AI corporations. Single player IS
multiplayer where all other corps are NPCs. Same systems, same rules.

### Multiplayer

Same game, some corps are human players. Mixed mode: 2 humans + 4 AI corps.

**Architecture:** Authoritative server (Node.js — same `orbits.js` runs identically).
Clients send commands, server validates and broadcasts state diffs. Orbital mechanics
is deterministic — just sync time T, clients compute positions locally. Actions are
infrequent (minutes between commands), so bandwidth is minimal.

**Time speed:** Set per-lobby. Default **60x** (1 real minute = 1 game hour). At 60x,
inner system transits resolve in real minutes, outer system trips take ~10 real minutes,
and a play session of a few hours covers a game-month. Comms latency to Jupiter is
~41 real seconds — perceptible but not painful. Host controls speed, or majority vote.

**Async variant:** Game runs on server time (1 real hour = X game days). Players log in,
issue orders, log out. Ships execute. Markets tick. Contracts expire. Like a slower
Ogame with real orbital mechanics.

**Spectator mode:** Watch AI corps compete. Screensaver/demo.

## 13. Variant: All-Drone Universe

A different game with the same orbital engine. No human crews in space — players are
Earth-based corporations remotely operating drone fleets. Simpler supply chain (no food,
water, medical). Comms delay becomes THE constraint — you write standing orders, drones
execute, results arrive 40 minutes later. Cyberpunk tone: hacking, signal jamming,
electronic warfare replace human diplomacy. Faster pace, more aggressive play.

Probably a separate game, noted here for reference.

## 14. User Interface & Gameplay Flow

### The Map is the Game

The 3D navigation map is the primary interface — everything is accessed through it or
through panels that overlay it. The player is a CEO at a terminal. The map IS the
terminal.

**What the map shows at a glance:**
- All bodies with orbits (existing WarpDrive visualization)
- Your ships (icons + status: in transit, docked, mining, idle)
- Your facilities (icons at bodies: refineries, factories, depots, command centers)
- Active contracts (route lines, deadline indicators)
- Highlighted bodies with available opportunities (contracts, market alerts)
- Comms coverage (relay network overlay — toggle on/off)
- Bloc influence (color-coded territorial overlay — toggle on/off)

### Interaction Model

Click a thing → get a context panel. Everything is reachable in 1–2 clicks from the map.

**Click a body →** Body panel:
- Physical info (orbit, mass, escape cost, composition if surveyed)
- Colony info (if colonized): population, governance type, standing with you
- Market (if has port): prices, demand, supply levels for each resource
- Available contracts at this body
- Your facilities here (if any) with production status
- Docking info: ships you have docked here, docking fees
- Actions: "Send ship here," "Build facility," "Accept contract"

**Click your ship →** Ship panel:
- Status: docked / in transit / mining / idle
- Current orders and progress
- Cargo manifest (what's on board, quality, mass, volume fill %)
- Fuel status: propellant, Casimir fuel rods, reactor fuel (each as a gauge)
- Crew (if crewed): headcount, morale, specializations
- Ship stats: quality levels for each component, maintenance status
- Actions: "Set orders," "Load/unload cargo," "Refuel," "Assign to contract"

**Click your facility →** Facility panel:
- Production status: what's being produced, input/output rates, queue
- Inventory: raw materials in, processed goods out
- Quality level and maintenance status
- Workforce: crew assigned, labor needs
- Actions: "Adjust production," "Order supplies," "Upgrade components"

**Click a contract →** Contract panel:
- Terms: cargo type, quantity, quality spec, origin, destination, deadline
- Payment: escrow amount, your bond (if required)
- Status: open / accepted / in progress / completed / failed
- Feasibility: can any of your ships fulfill this? (auto-calculated: nearest
  ship, fuel cost, travel time, arrival estimate vs deadline)
- Actions: "Accept," "Assign ship," "Abandon" (with consequences shown)

**Click empty space →** Dismiss panels, return to map overview

### Contracts: How They Work

#### Where contracts come from

**Colony-generated (most common):** Colonies have needs — food, water, construction
materials, components, consumer goods. When supply drops below a threshold, the
colony's market generates a delivery contract automatically. Pay scales with urgency:
a colony about to run out of water pays a premium. These contracts are broadcast on
relay channels — any corp within comms range can see and accept them.

**Corp-generated (player or NPC):** Any corp can create a contract offering to buy or
sell goods. "Buying 500t iron ore quality ≥40, will pay 12₵/t, pickup at Vesta." This
is how inter-corp trade works — one corp posts an offer, another accepts. Created
through the market panel at any body where you have a presence.

**Standing orders (automated):** "Buy platinum whenever price < 50₵/t at this port."
Executes locally, no command center delay. This is how routine trade works — you don't
manually accept every contract, you set parameters and the smart contract engine
handles it.

**Facility demand (implicit):** Your shipyard needs 200t drive components to fill its
build queue. It doesn't generate a formal contract — but your fleet management shows
the deficit, and you can create a buy order or assign a ship to haul from your other
facilities. This is internal logistics, not a market contract.

#### Contract lifecycle (single player and multiplayer, same flow)

```
1. CREATED      Contract posted to local port's market board
                Broadcast via relay to other ports (light-speed propagation)

2. VISIBLE      Corps within comms range see it on their contract boards
                (Arrival time depends on relay distance from originating port)

3. ACCEPTED     First corp to accept (signed message arrives at origin port) wins
                Escrow locks: buyer's payment + seller's performance bond

4. IN PROGRESS  Seller assigns ship, loads cargo, departs
                Contract panel shows: ship position, ETA, deadline countdown

5. SETTLEMENT   Ship arrives at destination port
                Scanner verifies: cargo type, quantity, quality
                If pass → escrow releases automatically (payment to seller, bond returned)
                If fail → dispute process (depends on trust spectrum context)

6. COMPLETE     Both parties' transaction history updated on-chain
                Reputation effects visible to anyone who checks
```

#### The contract board

The contract board is the "job board" — a filterable, sortable list panel that shows
all contracts visible from the player's command centers.

**Filters:**
- By resource type (iron, water, platinum...)
- By origin/destination (body or zone)
- By deadline feasibility ("show only contracts I can fulfill in time")
- By pay (minimum ₵/tonne)
- By quality requirement (show only contracts my supply chain can meet)

**Auto-feasibility:** Each contract shows a feasibility indicator — green (a ship can
reach it in time with fuel to spare), yellow (tight but possible), red (impossible
with current fleet positions). This uses the same pathfinder the navigation system uses.

**Comms delay awareness:** Contracts from distant ports show when they were posted and
when you received them. A contract posted 2 hours ago at Jupiter might already be taken
by the time your acceptance message arrives. The UI shows: "Posted 2h ago. Your accept
will arrive in 41min. Risk: HIGH that another corp closer to Jupiter has already taken
this."

#### Creating contracts (player-initiated)

From any body where you have a port presence:

**Sell offer:** "I have 300t quality-55 refined platinum at Vesta. Asking 80₵/t.
Available for 30 days." → Creates a contract on the local market board, broadcast
via relay.

**Buy order:** "Need 1000t water ice quality ≥30 delivered to my station at Ceres.
Paying 25₵/t. Deadline: 60 days." → Escrow locks your payment. Broadcast via relay.
First seller to deliver collects.

**Haul request:** "Cargo at body A needs to reach body B. 500t iron ore. Paying 15₵/t
for transport." → You provide the cargo, someone else provides the ship.

### Notification System

The player can't watch everything. Events need to surface:

**Alert levels:**
- 🔴 **Critical**: Ship fuel critical, contract deadline imminent, facility offline,
  colony standing hostile, under attack
- 🟡 **Important**: Contract fulfilled, ship arrived, market price spike/crash, new
  high-value contract available, competitor activity near your operations
- 🟢 **Info**: Ship departed, production cycle complete, routine market update,
  standing change

**Alerts appear as:**
- Toast notifications (top of screen, fade after read)
- Alert log (scrollable panel, persists)
- Map highlights (body/ship flashes on relevant alerts)
- Sound cues (Critical = alarm, Important = chime, Info = subtle tick)

**Standing orders reduce alert noise.** A ship running automated trade route orders
only alerts on exceptions (fuel low, deadline risk, route blocked). Routine operations
don't spam the player.

### Information Panels (Always Available)

**Fleet overview:** All your ships in a sortable table. Status, location, cargo, fuel,
current orders. Quick-assign actions without clicking each ship on the map.

**Finance:** Credit balance, income/expenses breakdown, loan status, net worth graph
over time. "How am I doing?"

**Reputation:** Your standing with each bloc and each colony you've interacted with.
Recent changes and causes. "Who likes me and why?"

**Intel:** Observed competitor activity. Ship sightings, market moves, relay traffic
patterns. Built from your ships' and relays' passive intelligence gathering. "What do
I know about the competition?"

### Multiplayer-Specific UI

**Chat panel:** In-world messaging. Shows outbound message, estimated delivery time,
and response when it arrives. Conversations are inherently async — the UI makes this
feel natural rather than broken.

**Diplomatic panel:** Formal offers (alliance, trade agreement, ceasefire) are
structured messages with accept/reject. Not just chat — actionable proposals that can
be converted to smart contracts.

**Time controls:** In single player, full pause/play/speed control. In multiplayer,
the host sets speed (default 60x). Players can request speed changes, host approves.
Pause requires majority vote or host override.

## 15. Random Events & Emergencies

Deterministic economics + unpredictable events = interesting decisions. Without
randomness, the mid-game becomes spreadsheet optimization. Events force reactive play
and create stories.

### Event Philosophy

Events are **disruptions to plans, not punishments.** Every event creates a problem AND
an opportunity. A solar flare disables your mining rig — but it also disables your
competitor's. A disease outbreak at a colony spikes medical supply prices — if you have
medical supplies, you just got rich. The player who adapts fastest wins.

Events are **physically grounded**, not arbitrary. Nothing happens that couldn't happen
in the real world. The simulation rolls probability checks based on physical conditions,
not a "bad luck" timer.

### Event Categories

**Equipment failures** (most common, small impact):
- Drive malfunction: ship drops out of warp early, finishes trip on conventional thrust.
  Frequency scales inversely with quality level and maintenance status.
- Mining rig breakdown: extraction halts until repaired. Drones can't fix novel failures
  — need human crew or a maintenance ship.
- Reactor scram: facility loses power temporarily. Production stops. Life support switches
  to batteries (limited duration at crewed stations).
- Cargo container breach: partial cargo loss in transit. Insurance covers it if insured.

These are the "maintenance matters" events. A well-maintained quality-80 fleet rarely
sees them. A neglected quality-30 fleet sees them constantly. The player's investment
in quality and maintenance directly controls this risk.

**Stellar events** (rare, system-wide impact):
- Solar flare / coronal mass event: Radiation spike affects inner system operations.
  Ships in transit can shelter (minor delay). Unshielded facilities and drones take
  damage. Colonies with good hab shielding are fine. Frequency depends on star type
  (M-dwarfs flare more often — a real physics factor in star selection).
- Orbital resonance shift: A body's orbit changes slightly over long timescales.
  Not catastrophic but trade routes that were optimized for the old orbit become
  suboptimal. Recompute and adapt.

**Colony crises** (moderate frequency, localized impact):
- Disease outbreak: Colony medical demand spikes. Population growth halts or reverses.
  Workforce availability drops. Medical supply prices soar. Corps that can deliver
  medical supplies fast earn massive standing and profit.
- Labor strike: Workers at a colony refuse to work for corps below a certain wage or
  standing threshold. Facilities with poor standing go offline. Drone-operated
  facilities unaffected. Creates pressure to improve worker conditions.
- Environmental incident: Industrial accident contaminates colony water/air. Could be
  caused by player (corner-cutting) or NPC or random equipment failure. Colony standing
  hit for responsible corp. Emergency cleanup contracts generated.
- Political crisis: Governance transition (company town → independent, consortium
  deadlock, free port declaring regulations). Changes tax rates, docking policies,
  environmental rules. Creates winners and losers among corps operating there.

**Discovery events** (rare, high impact):
- Unsurveyed body turns out to have exceptional resource quality (quality-90+ deposit).
  Gold rush dynamics — every corp wants to establish operations.
- Comet perihelion approach: A frontier comet enters the inner system. Temporary volatile
  bonanza. Window lasts weeks/months then it's gone for decades.
- Derelict discovery: An abandoned facility or ship found at a frontier body. Salvage
  opportunity — free components, possibly functional equipment. First to arrive claims it.

**Market shocks** (moderate frequency, economic impact):
- Demand spike: A colony suddenly needs massive quantities of a resource (population
  boom, new facility construction, military buildup). Contract prices surge.
- Supply disruption: A major NPC corp's refinery goes offline (equipment failure, labor
  strike, combat damage). Market supply drops, prices rise. Opportunity for competitors.
- Price crash: Oversupply of a resource (multiple corps deliver large shipments
  simultaneously). Price collapses. Corps stuck with inventory take losses.

### Event Probability

Events aren't random dice rolls on a timer. They emerge from simulation conditions:

- Equipment failure probability = f(quality, maintenance_status, age, environmental_stress)
- Disease probability = f(population_density, medical_supply_level, hab_quality)
- Labor strike probability = f(avg_wage_vs_colony_avg, worst_corp_standing, unemployment)
- Solar flare probability = f(star_type, star_activity_cycle)
- Market shocks = f(supply/demand_ratio, concentration_of_supply, colony_growth_rate)

High-quality equipment in well-maintained facilities with good colony standing and
adequate supplies → events are rare. Neglected infrastructure, unhappy workers,
depleted medical stocks → events are frequent. The player's choices directly shape
their risk profile.

## 16. Mid-Game Depth

The first hour hooks you (first ship, first contract, learning orbital mechanics).
The late game excites (empire, politics, combat, market manipulation). The mid-game
(hours 2-10) is where tycoon games lose players to the grind. Here's what keeps it
engaging:

### Escalating Complexity Reveals

New systems reveal themselves as the player grows, each adding a new decision layer:

| Trigger | System revealed | New decisions |
|---------|----------------|---------------|
| Buy second ship | Fleet management | Which ship goes where? Deadheading penalty. |
| Build first facility | Production chains | What to produce? Where to source inputs? |
| First quality bottleneck | Quality system | Better ore? Better facility? Better crew? |
| Reach outer system | Power economics | Fission fuel logistics, command center placement |
| First competitor conflict | Economic warfare | Undercut? Vertically integrate? Lobby colony? |
| First maintenance failure | Maintenance economics | Pay for quality or accept risk? |
| First loan | Financial leverage | Borrow to grow fast or organic growth? |
| First smuggling opportunity | Underground economy | Risk vs reward, scanner game |
| First combat encounter | Security posture | Escorts? Combat drones? Avoid the area? |

The player never gets all of these at once. Each emerges when the player's operations
naturally encounter it. By hour 5, the player is juggling fleet logistics, production
optimization, quality management, and political relationships — not because the game
forced it, but because growth created the need.

### The "Next Big Thing" Ladder

The mid-game always has a visible next milestone:

**Milestone 1 (~hour 1):** First profitable delivery route. "I can make money."
**Milestone 2 (~hour 2):** First facility (refinery or depot). "I own infrastructure."
**Milestone 3 (~hour 3):** Second ship. Fleet management begins. "I'm a fleet operator."
**Milestone 4 (~hour 4):** First command center outside homeworld. "I have reach."
**Milestone 5 (~hour 5-6):** First component factory or shipyard investment. "I'm a manufacturer."
**Milestone 6 (~hour 6-8):** First political entanglement (colony standing matters, bloc reputation shifts). "I'm a political actor."
**Milestone 7 (~hour 8-10):** First major competitive conflict. "I'm fighting for territory."

Each milestone changes what the game feels like. The player who just built a shipyard
is playing a different game than the player who's still hauling ore. But both are
valid — the shipyard owner needs the hauler's deliveries.

### Why the Economy Doesn't Stagnate

- **Orbital mechanics create natural cycles.** The same route is profitable this month
  and unprofitable next month because distances changed. Players must continuously
  re-evaluate and adapt.
- **Resource depletion at small bodies** forces expansion. Your belt mining operation
  runs dry, you need to prospect new sites.
- **Random events disrupt plans.** Equipment failure, colony crisis, market shock —
  something always needs attention.
- **NPC corps are competing.** They expand, undercut, claim resources. Standing still
  means falling behind.
- **Quality improvement is a treadmill.** Better inputs exist somewhere. Better engineers
  can be attracted. There's always a marginal improvement to chase.
- **New colonies and infrastructure create new markets.** As the system develops (both
  player and NPC-driven), new demand centers appear. The economic map is constantly
  shifting.

## 17. Economic Parameters (Ballpark)

These are order-of-magnitude estimates for validating that the economy works on paper.
All numbers are tuning targets, not commitments. Final values come from playtesting.

### Starting Conditions

| Item | Value | Notes |
|------|-------|-------|
| Starting credits | 50,000 ₵ | Enough for a few contracts + one small investment |
| Starting ship | 1 × Scout-class freighter | Quality-40, small cargo (500t), basic drive |
| Starting ship value | ~100,000 ₵ | You can't afford to lose it |
| Starting loan available | ~75,000 ₵ | Collateralized against your ship |

### Ship Costs (new construction, quality-50)

| Class | Cost | Cargo capacity | Notes |
|-------|------|---------------|-------|
| Scout | 80,000–120,000 ₵ | 500t | Fast, cheap. Courier/exploration. |
| Freighter | 200,000–400,000 ₵ | 5,000t | The workhorse. |
| Heavy hauler | 500,000–1,000,000 ₵ | 15,000t | Bulk transport. Mid-game purchase. |
| Mining vessel | 300,000–500,000 ₵ | 2,000t + mining equipment | Extraction + hauling combo. |
| Tanker | 150,000–300,000 ₵ | 8,000t (liquid H₂) | Fuel logistics. |
| Colony ship | 400,000–800,000 ₵ | 200–500 passengers | Immigration/evacuation. |

Ship costs scale with quality. A quality-80 freighter costs ~3x a quality-50 freighter
(premium components throughout).

### Facility Costs (construction, quality-50)

| Facility | Cost | Monthly operating | Notes |
|----------|------|-------------------|-------|
| Mining rig (drone) | 50,000–100,000 ₵ | 2,000–5,000 ₵ | Cheapest entry to production |
| Mining rig (crewed) | 100,000–200,000 ₵ | 10,000–20,000 ₵ | Higher throughput, adaptable |
| Refinery | 200,000–400,000 ₵ | 8,000–15,000 ₵ | Ore → refined materials |
| Component factory | 300,000–600,000 ₵ | 15,000–30,000 ₵ | Specialized (drives, electronics, etc) |
| Drone factory | 200,000–400,000 ₵ | 10,000–20,000 ₵ | Produces all drone types |
| Shipyard | 1,000,000–2,000,000 ₵ | 40,000–80,000 ₵ | The big investment. Late mid-game. |
| Casimir condenser | 2,000,000–5,000,000 ₵ | 100,000–200,000 ₵ | Endgame. Power-hungry. |
| Command center | 200,000–400,000 ₵ | 10,000–20,000 ₵ | Strategic infrastructure. |
| Comms relay | 50,000–100,000 ₵ | 2,000–5,000 ₵ | Earns bandwidth fees passively |
| Propellant depot | 80,000–150,000 ₵ | 3,000–8,000 ₵ | Essential at every stop |

### Resource Prices (ballpark, at Terra/homeworld market)

| Resource | Price per tonne | Notes |
|----------|----------------|-------|
| Iron ore | 5–15 ₵ | Bulk, low margin |
| Refined iron | 20–40 ₵ | ~3x markup over ore |
| Platinum ore | 50–100 ₵ | Higher base value |
| Refined platinum | 200–400 ₵ | High-value material |
| Water ice | 10–25 ₵ | Cheap at source, expensive far from ice |
| Rare earth ore | 80–150 ₵ | Scarce, strategic |
| Processed rare earths | 300–600 ₵ | The bottleneck material |
| Casimir fuel rods | 1,000–3,000 ₵ | THE premium product |
| Propellant (H₂) | 5–15 ₵ | Cheap but consumed in enormous quantities |
| Electronics (component) | 500–1,000 ₵ | Universal demand |
| Drive components | 800–1,500 ₵ | Shipyard bottleneck |

Prices vary by location (distance premium), supply/demand, and quality. Quality-80
refined platinum commands 2–3x the price of quality-40. Frontier prices for imported
goods can be 5–10x homeworld baseline.

### Contract Pay (typical, at 60x game speed)

| Contract type | Pay | Duration | Notes |
|--------------|-----|----------|-------|
| Short inner-system delivery | 5,000–15,000 ₵ | 1–3 game-days | Bread and butter early game |
| Belt mining run + delivery | 15,000–40,000 ₵ | 5–10 game-days | Requires cargo capacity |
| Outer system expedition | 50,000–150,000 ₵ | 15–30 game-days | Needs fuel logistics |
| Emergency supply (colony crisis) | 3–5x normal rate | Tight deadline | High reward, high risk |
| Survey (unsurveyed body) | 10,000–30,000 ₵ | Varies by distance | Information is the real value |
| Passenger transport | 2,000–5,000 ₵/passenger | Varies | 200 passengers = 400K–1M ₵ |

### Economic Validation

Does the math work? Quick sanity checks:

**Can a new player make money?**
Starting ship (500t cargo). Short delivery: 500t iron ore × 15₵ = 7,500₵ revenue.
Propellant cost for inner system hop: ~5,000t H₂ × 10₵ = 50,000₵. Wait — that's
more than the cargo value. This means **short hops between nearby bodies must have
low Δv** (belt asteroids with tiny escape velocities, or orbital transfers between
moons of the same planet). The starting contracts should be between bodies with low
gravity wells — asteroid-to-asteroid or Luna-to-Terra-orbit transfers where propellant
cost is minimal.

Revised: starting contracts are specifically **low-Δv routes** where propellant cost
is a small fraction of cargo value. 500t refined platinum (quality-40) between two
belt asteroids (escape <1 km/s each): propellant ~50t × 10₵ = 500₵. Cargo value:
500t × 200₵ = 100,000₵. Profit after fuel: ~99,500₵. That works. The game naturally
pushes early players toward low-gravity-well bodies — which is where the accessible
mining is anyway.

**Can a mid-game player afford a shipyard?**
Shipyard costs ~1.5M₵. At 50,000₵ profit per mid-game contract, that's 30 contracts
— roughly 30 game-weeks of operation with one ship. With 3 ships running parallel
routes, ~10 game-weeks. At 60x speed, that's ~7 real hours of play. About right for
a major mid-game milestone.

**Is a Casimir condenser a late-game investment?**
Casimir condenser: 3M₵ + 150K₵/month operating. A single Casimir fuel rod sells for
~2,000₵. Need to produce ~75 rods/month to break even on operating costs. Plus the
3M₵ capital recovery. This is a serious late-game investment that only makes sense with
cheap power (inner system solar) and reliable rare earth + platinum supply chains. Not
something you build on a whim. About right.

## 18. LLM Integration (Narrative Layer)

A small but capable language model adds immersion without replacing game logic. The
simulation computes facts. The LLM writes prose. No agency — narration only.

**Principle:** The LLM never decides what happens. It decides how what happened is
communicated. Game events are deterministic simulation outputs. The LLM renders them
into character, context, and atmosphere.

**Implementation:** Qwen2.5-1.5B-Instruct (Q4_K_M quantized, ~1 GB) via llama.cpp
compiled to **WebAssembly**. Runs entirely in the browser — no server, no install, no
GPU drivers. Same zero-build static web app architecture as the rest of the game.

- **Default: fine-tuned Qwen3.5-0.8B** (~500 MB download, cached in IndexedDB).
  Hybrid architecture (Gated Delta Networks + sparse MoE) designed for on-device
  inference. Fine-tuned on 500-1000 examples of game-specific prose styles. MoE
  means only a fraction of parameters activate per token = fast inference even in
  WASM. The use case is narrow enough that a fine-tuned 0.8B nails it.
- **Enhanced: Qwen2.5-1.5B or Qwen3.5-2B** (~1 GB, 2-4 seconds per paragraph).
  Better voice differentiation, richer prose. For players who want the premium.
- Inference runs in a **Web Worker** (separate thread, never blocks the game loop
  or Three.js rendering)
- Apache 2.0 license — fully shippable, no restrictions
- **Hybrid calling strategy**: template strings for routine events ("Ship arrived at
  Vesta"), LLM reserved for high-value narration (NPC personality messages, political
  events, intel briefings, dramatic moments). Reduces LLM calls to a few per game-
  minute rather than every event.
- **Template string fallback** when model hasn't loaded yet or player opts out.
  All gameplay works without it — the LLM is a flavor layer, not a dependency.

The full stack: **Three.js + lit-html + llama.cpp WASM + Keplerian orbital engine.**
Open a URL, play a game with real orbital mechanics, an AI narrator, and a full
economic simulation. Nothing to install. Everything in the browser.

### Use Cases

**System Herald (news feed):**
Simulation event: `{type: 'supply_crisis', body: 'Kepler-7b', resource: 'water', level: 0.28}`
LLM renders: *"Water crisis deepens at Kepler-7b as stockpiles hit critical 28%. Colony
administrator urges shipping corps to prioritize deliveries. Port price for water ice
has tripled this week. Analysts warn that failure to resupply within 30 days could
trigger evacuation protocols."*

News items appear in a scrollable feed panel. They surface simulation events the player
might miss in raw data — and make the world feel alive.

**NPC corp voice:**
Simulation decides: `{type: 'offer', from: 'apex_industrial', terms: {...}, personality: 'monopolist'}`
LLM renders: *"We notice you've been supplying refined platinum to the same ports we
service. We'd prefer to discuss territory before this becomes... unproductive. — Apex
Industrial"*

Each NPC corp has a personality prompt prefix (hauler = professional/reliable, monopolist
= aggressive/territorial, prospector = enthusiastic/risk-loving). The LLM applies tone
consistently. All comms arrive through the in-world relay system with appropriate delay.

**Colony political narration:**
Simulation event: `{type: 'governance_change', body: 'Kepler-7b', from: 'company_town', to: 'independent'}`
LLM renders: *"After months of tension, Kepler-7b residents voted 73–27 to establish an
independent council. OmniCorp retains its facilities but will no longer set docking
policy unilaterally. Workers celebrated in the hab commons as the vote results were
announced."*

**Intel briefings:**
Simulation data: `{sightings: [{ship: 'pk_8a3f', near: 'Vesta', count: 3, pattern: 'surveying'}]}`
LLM renders: *"INTEL BRIEF: Three passes by an unregistered vessel near your Vesta
operation this week. Flight pattern consistent with geological surveying. Possible
competitor prospecting or pre-positioning for a claim jump. Recommend increasing
patrol drone presence."*

**Contract color:**
Simulation: `{type: 'contract', origin: 'frontier_colony', resource: 'medical', urgency: 'critical'}`
LLM renders: *"URGENT — Frontier Station Tau-9 requesting emergency medical supply run.
'We've had a mining accident and our stocks are depleted. Any corp in range, we'll pay
triple rate. People are hurt.' — Station Administrator Chen"*

### What the LLM Does NOT Do

- Does not make game decisions (NPC strategy is deterministic code)
- Does not generate contracts (simulation generates terms, LLM adds flavor text)
- Does not resolve disputes or combat (pure simulation)
- Does not have memory across calls (stateless — context is passed per-call from
  game state)
- Does not hallucinate game state (prompt includes only verified simulation data)

### Prompt Architecture

Each LLM call includes:
1. **System prompt**: Game setting, tone guide, current date
2. **Entity context**: Who is speaking or being described (personality, history, standing)
3. **Event data**: The simulation output being narrated (structured JSON)
4. **Instruction**: What to produce (news article, diplomatic message, intel brief, etc.)

The prompt never asks "what should happen?" — only "describe what happened" or "voice
this message as this character."

### Offline / Performance Fallback

If no LLM is available (hardware too weak, player preference), the game falls back to
template strings: "Water supply critical at Kepler-7b (28%). Price: 75₵/t." Functional,
just less immersive. All gameplay works without the LLM — it's pure flavor.

## 16. Technical Architecture

### What WarpDrive Already Provides

- Keplerian orbital engine (orbits.js) — deterministic positions at any time T
- 7-phase transit physics (pathfinder.js) — gravity-well-aware fuel/time costs
- Collision-free pathfinding with tidal-limit danger zones
- Phase-aware ship position (computePhaseProgress)
- Three.js 3D rendering with lit-html UI panels
- Time simulation with play/pause/speed controls

### What Changes

| Component | Current | Game version |
|-----------|---------|-------------|
| Body data | Static imports | Procedural generator output |
| State | Single ship | Fleet + economy + contracts |
| Time | Observation only | Game clock with consequences |
| UI | Passive | Interactive (buy/sell/assign) |

### New Modules

```
js/
  generator.js   — Procedural system generation + fast-forward bootstrap
  economy.js     — Markets, prices, supply/demand simulation
  contracts.js   — Contract generation, escrow, tracking
  fleet.js       — Multi-ship state management
  comms.js       — Relay network, command center latency, message routing
  combat.js      — Engagement resolution, drone combat, damage
  ai.js          — NPC corp decision engine
  save.js        — Game state serialization
```

### Development Phases

### Early Game Pacing & Progressive Disclosure

The first 30 minutes must hook the player. The full system complexity (9 resources, 4
processing tiers, communications, labor, governance, combat...) is revealed gradually
through natural gameplay progression, not dumped upfront.

**First session (hauler phase):**
- Player has one ship, docked at homeworld, some starting credits.
- Contract board has simple delivery jobs: "Haul 50t water ice from Asteroid X to
  Homeworld. Pay: 5,000₵. Deadline: 30 days."
- Player learns: navigation, transit physics, orbital windows, basic trading.
- Variety: delivery, survey (fly to unsurveyed body, scan it), rescue (retrieve
  stranded drone). Not just "haul X to Y" for an hour.
- The orbital mechanics novelty carries this phase — watching your ship warp across
  the system for the first time is inherently cool.

**Early expansion (investor phase):**
- After a few contracts: enough credits to borrow against your ship and buy a small
  facility (refinery or drone outpost). Classic tycoon leverage moment.
- Player learns: processing, supply chain basics, colony presence, maintenance costs.
- Niche contracts that big NPC corps ignore: frontier survey runs, rush deliveries to
  understocked outposts, hauling for small colonies the megacorps don't bother with.

**Mid-game (empire phase):**
- Multiple ships, at least one facility, maybe a command center in a second region.
- Player encounters: fleet management, labor economics, colony standing, communications
  latency, market dynamics, competition.
- Systems reveal themselves as needed: you don't think about colony standing until you
  try to hire workers. You don't think about relay infrastructure until your orders to
  the outer system take hours to arrive.

**Late game (power player phase):**
- The full system is in play: manufacturing chains, Casimir matter production, political
  maneuvering, combat posturing, information warfare, smuggling.
- Player is shaping the system, not just reacting to it.

**Phase 1: Core Loop** — Procedural generator. Resource model. Single ship with cargo.
Two AI colonies with markets. Delivery contracts with deadlines. Money counter. One AI
corp competing.

**Phase 2: Depth** — Ship upgrades and fleet expansion. More AI corps with personalities.
Market dynamics. Colony founding. Exploration contracts. Manufacturing chain.

**Phase 3: Infrastructure** — Command centers. Relay network. Colony standing. Labor
economics. Environmental dynamics.

**Phase 4: Conflict** — Combat drones and engagement resolution. Smuggling and black
markets. Information brokering. Economic warfare tools.

**Phase 5: Multiplayer** — Server-side simulation. WebSocket protocol. Lobby system.
Mixed human/AI mode. Time speed consensus. Async variant.

**Phase 6: Polish** — Sound design. Tutorial (guided first contract). Procedural names.
Mobile layout. Leaderboards.

## 15. Open Questions

- **Combat balance**: What prevents the richest corp from dominating through force?
  Coalitions? Diminishing returns on military spending? Insurance making piracy
  net-negative? Maintenance costs scaling with fleet size?
- **Mercenaries**: Can corps hire NPC military outfits for deniable operations?
- **Casimir fuel balance**: How much Casimir matter per AU of warp travel? This single
  number determines whether warp is cheap (everyone warps everywhere) or expensive
  (warp is a strategic choice, conventional travel is the default for short hops).
- **Loan interest rates**: What range keeps loans useful without making over-leverage
  trivially safe? Needs playtesting.
- **Colony governance transitions**: What triggers a company town becoming an independent
  colony? Population threshold? Worker unrest? External pressure? How is this simulated?
