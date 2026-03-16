# WarpDrive: Asteroid Mining Tycoon

## Table of Contents

1. **Concept** — Core thesis, player identity, sandbox
2. **Setting** — 2058, one race, tech level, system not empty
3. **System Scale & Procedural Generation**
   - System scale, body count, star properties
   - Procedural generation, system archetypes
   - Terra & Luna (constants), Terran political blocs & rivalry axes
   - Playability constraints, start modes (Frontier → Late Stage)
4. **Resources & Supply Chain**
   - 9 raw resources + Casimir matter
   - Resource depletion
   - Power (solar, fission, fusion) & economic gradient
   - Propulsion (fusion torch Isp 3000s), three ship consumables, fuel economics
   - Mass, volume & cargo physics (densities, Tsiolkovsky impact)
   - Body composition types
   - Full supply chain diagram (extraction → processing → manufacturing → consumer)
   - Quality & technology progression (60/24/16 formula, chain propagation, inter-corp deals)
   - Quality-to-physics formulas (mass factor, durability)
   - Maintenance (ships, drones, infrastructure)
   - Processing facilities & corp roles
   - Human supply chain (food, life support, medical)
   - Currency (₵) & finance (collateralized loans, insurance)
5. **Communications & Information**
   - Relays (Nostr-style trust, 30 AU standard / 600 AU premium range)
   - Asset-based perspective (each asset is a viewpoint)
   - Standing directives & LLM directive compiler
   - Chat interface (fleet / diplomacy / market unified)
   - Exception handling (configurable default behavior)
   - All communication is in-world (players and AI same physics)
   - Out-of-band communication resistance
   - Information as cargo (broadcast / encrypted / sneakernet)
   - Fog of war (you only know what you've observed)
   - Passive intelligence, counterintelligence
6. **Colonies, Workforce & Population**
   - Colonies vs corps vs private installations
   - Colony types (drone outpost → crewed station → colony → city)
   - Workforce roles & drone-vs-human calculus
   - Worker needs (survival → comfort → growth)
   - Immigration pipeline & feedback loops
   - Payroll & labor economics (wages, retention, poaching, training)
   - Colony standing
   - Environmental dynamics
   - Population dynamics
7. **Governance & Law**
   - Design principle: no game-rule restrictions
   - Colony governance types (independent, company town, consortium, free port)
   - Taxation (docking fees, transaction tax, tariffs, lobbying)
   - Governance quality ≠ tax rate
   - Colony enforcement apparatus (physical, legal, impound, summon)
   - Alliances & confederations
   - The SCA (one possible emergent institution)
8. **Contracts, Commerce & the Underground**
   - Privacy model (pseudonymous, encrypted-by-default)
   - Smart contract escrow
   - Reputation (observable history, not a score)
   - Trust spectrum (certified port → frontier handshake)
   - Cargo manifests, scanners & smuggling
   - Scanner warfare (hacked scanners, ship-mounted defense)
   - Black markets & information brokering
9. **Ships, Fleet & Manufacturing**
   - Ship properties & classes
   - Ship & drone manufacturing (supply-chain-built, not menu-bought)
   - Fleet management & trade routes (emergent from directives)
   - Passenger transport (immigration, piracy stakes, political leverage)
10. **Combat & Conflict**
    - Physical constraints (low-speed only, no stealth, not warships)
    - Graduated escalation (Level 0–4, emergent consequences)
    - Combat mechanics (auto-resolve, directives, not twitch)
    - Economic warfare (Level 0)
11. **AI Corporations**
    - Decision model, personality archetypes, AI-first design
12. **Game Modes**
    - Single player, multiplayer (authoritative server), async variant, spectator
    - Time speed (default 60x)
13. **User Interface & Gameplay Flow**
    - Map as primary interface
    - Asset-based interaction model
    - Contract system (creation, lifecycle, board, player-initiated)
    - Notification system
    - Information panels (fleet, finance, reputation, intel)
    - Multiplayer-specific UI
14. **Random Events & Emergencies**
    - Event philosophy (disruptions, not punishments)
    - Categories (equipment, stellar, colony, discovery, market)
    - Event probability (condition-based, not timer)
15. **Pacing & Progressive Disclosure**
    - Early game pacing (hauler → investor → empire → power player)
    - Mid-game depth (escalating complexity reveals, milestone ladder)
    - Why the economy doesn't stagnate
16. **Economic Parameters (Ballpark)**
    - Starting conditions, ship costs, facility costs
    - Resource prices, contract pay
    - Economic validation (sanity checks)
17. **LLM Integration (Narrative Layer)**
    - Dual model (0.8B background + 4B interactive), WASM in-browser
    - Use cases (news, NPC voice, intel, contracts, directive compiler)
    - Inference budget management
    - What the LLM does NOT do
    - Prompt architecture, offline fallback
18. **Technical Architecture**
    - What WarpDrive already provides
    - What changes, new modules
    - Development phases (1–6)
19. **Open Questions**

**Appendix A:** Variant — All-Drone Universe

---

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

**Ship power**: Ships have **two separate systems**: a **fission reactor** for power
(life support, sensors, comms, electronics) and a **fusion torch drive** for thrust.
Different engineering, same physics family. The reactor runs continuously at low output.
The torch fires during burn phases at enormous output. Both need fuel — reactor fuel
(uranium/thorium, consumed slowly) and propellant (H₂, consumed rapidly during burns).

**Propulsion technology**: The fusion torch delivers both high acceleration and viable
cargo economics at Isp ~3,000s (exhaust velocity ~29.4 km/s). Chemical rockets
(Isp 450s) are hopelessly inadequate. Basic fusion (Isp 1200s) gives 276:1 ratios —
ships would be 99% fuel. The Tsiolkovsky equation is unforgiving.

**Propellant cost depends on Δv, not distance.** Two trips covering the same distance
can have wildly different fuel costs depending on the gravity wells at each end:

- Belt asteroid to belt asteroid (escape <1 km/s each): Δv ~2 km/s. Propellant
  ratio ~0.07:1. Nearly free. This is where early-game hauling is profitable.
- Terra to a nearby planet (escape ~11 km/s + warp threshold): Δv ~30+ km/s.
  Propellant ratio ~10:1. Expensive. Only high-value cargo justifies this.

The ~10:1 ratio cited elsewhere is for full interplanetary transfers with significant
Δv budgets. Low-Δv hops between small bodies are far cheaper. The game's economic
geography is shaped by Δv costs, not by distance on the map.

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
output_quality = (input_material × 0.60) + (facility × 0.24) + (labor × 0.16)
```

Material at 60% is the dominant factor — ore quality matters and finding better
deposits is genuinely rewarding. But 40% combined processing (facility + labor)
means investment in infrastructure and workforce creates real value-add at every
stage.

```
EXAMPLE: Ore-50 through three stages of quality-80 processing

Stage 1 — Refinery:  (50 × 0.60) + (80 × 0.24) + (80 × 0.16) = 62.0
Stage 2 — Factory:   (62 × 0.60) + (80 × 0.24) + (80 × 0.16) = 69.2
Stage 3 — Shipyard:  (69.2× 0.60) + (80 × 0.24) + (80 × 0.16) = 73.5
```

Ore-50 became a quality-74 ship. Each stage lifted it. With quality-90 processing:

```
Stage 1: (50 × 0.60) + (90 × 0.24) + (90 × 0.16) = 66.0
Stage 2: (66 × 0.60) + (90 × 0.24) + (90 × 0.16) = 75.6
Stage 3: (75.6× 0.60) + (90 × 0.24) + (90 × 0.16) = 81.4
```

Ore-50 → quality-81 ship through excellent processing. That's +31 points of lift.

**Ore quality creates a persistent edge:**

| Ore | Processing 90/90 | Processing 80/80 | Processing 50/50 |
|-----|-------------------|-------------------|-------------------|
| 30 | **77.0** | **69.2** | **45.7** |
| 50 | **81.4** | **73.5** | **50.0** |
| 70 | **85.7** | **77.8** | **54.3** |
| 90 | **90.0** | **82.2** | **58.6** |
| **Spread (30→70)** | **8.6 pts** | **8.6 pts** | **8.6 pts** |

The ~9-point spread between ore-30 and ore-70 is consistent regardless of processing
level (mathematically: 0.6³ × 40 = 8.64). Finding a quality-70 deposit over a
quality-30 deposit gives you a permanent quality advantage on every product. That's
worth building infrastructure around.

**Processing below input quality degrades output.** At processing 50/50, ore above
quality-50 actually decays through stages — mediocre facilities and labor drag down
premium material. Ore-70 through quality-50 processing yields only 54.3, not 70.
Ore-90 decays to 58.6. The only fixed point is when ore = facility = labor (e.g.,
50-50-50 stays 50). This means processing quality must EXCEED input material quality
to add value — otherwise it destroys value. Great ore wasted by bad processing is a
real and costly mistake.

**Processing is still a genuine multiplier:**

Ore-50 produces quality-50 with matching processing but quality-81 with excellent
processing — a 31-point lift. Processing transforms mediocre materials into premium
goods. It just can't fully erase an ore quality gap.

**Great ore in a bad chain is wasted:**

Ore-80 through quality-30 processing: 80 → 60.0 → 48.0 → 40.8. Premium ore degraded
to junk by bad facilities and unskilled workers.

**Key lessons:**
- **Ore matters.** ~9-point persistent spread rewards exploration and prospecting.
- **Processing matters.** +31 points of lift from quality-90 chain. Infrastructure
  and workforce investment genuinely transforms output quality.
- **Great ore + bad chain = waste.** Ore-80 → 40.8 through bad processing.
- **Bad ore + great chain = viable.** Ore-30 → 77.0 through excellent processing.
- **Consistent chain quality compounds.** Each stage builds on prior gains.

**Inter-corp specialization (the deal that creates value):**

```
Corp A: quality-90 refinery + quality-90 labor (refining specialist)
Corp B: quality-90 factory + quality-80 labor, quality-80 yard + quality-80 labor

Starting ore: quality-40

Corp A alone (great refinery, q-50 factory/yard): 40 → 60.0 → 56.0 → 53.6
Corp B alone (q-50 refinery, great factory/yard): 40 → 44.0 → 60.8 → 68.5
Together (A refines → B manufactures + assembles): 40 → 60.0 → 70.4 → 74.2
```

Together: 74.2. Best solo: 68.5. The deal creates +5.7 points of value. The 60%
material weight means Corp A's quality-60 handoff gives Corp B significantly better
input than their self-refined quality-44. **Specialization and trade create value
that neither party can achieve independently.**

The weights (60/24/16) balance three goals:
- **Ore rewards exploration** — ~9-point persistent spread from deposit quality
- **Processing rewards investment** — +31 points of lift through a great chain
- **Specialization rewards trade** — +5.7 points from inter-corp deals

**How quality propagates through the full supply chain:**

```
Ore deposit (base quality — exploration finds better deposits)
  → Refinery: ore × 0.60 + refinery × 0.24 + labor × 0.16
    → Refined material (quality lifted by refining)
      → Factory: material × 0.60 + factory × 0.24 + labor × 0.16
        → Components (quality lifted by manufacturing)
          → Assembly: components × 0.60 + yard × 0.24 + labor × 0.16
            → Finished product (quality lifted a third time)
              → Performance (quality scalar on efficiency stats)
```

**What quality affects (grounded in physics):**

Quality represents metallurgical and engineering precision. It doesn't change
fundamental material properties (iron is always 7,870 kg/m³) but it changes what
you can DO with the material:

| Thing | Quality effect | Physics basis |
|-------|---------------|---------------|
| Refined material | Purity, consistency. Less waste in manufacturing. | Fewer impurities = predictable behavior in alloys |
| Hull plating | **Strength-to-weight ratio.** Quality-80 alloy achieves same structural integrity at ~20% less mass than quality-40. | Real aerospace engineering — better alloys = thinner walls for same strength |
| Drive components | Isp and thrust efficiency. Quality-80 drives burn less fuel. | Tighter tolerances = less energy wasted |
| Electronics | Sensor range, comms encryption grade, scanner precision. | Cleaner signal processing, better miniaturization |
| Hab modules | Life support efficiency, recycling rate, crew morale. | Better seals, pumps, filters = less consumable waste |
| Mining equipment | Extraction rate, ore quality preservation. | Sharper cutting, gentler handling = less material degraded |
| Drones | Operational reliability, task efficiency. | Tighter tolerances = fewer failures, better performance |
| Port scanners | Detection capability, spectral resolution. | Better optics + electronics = finer discrimination |
| Casimir fuel rods | Warp efficiency — more AU per rod. | Purer containment = less energy leakage |

**The mass implication is critical.** Higher quality hull plating and structural
components are LIGHTER for the same strength. This means:

- A quality-80 ship has less structural mass than a quality-40 ship of the same class.
- Less structural mass = higher cargo-to-mass ratio.
- Higher cargo-to-mass ratio = less propellant per trip (Tsiolkovsky).
- Less propellant per trip = lower operating cost.

Quality literally makes your ships cheaper to fly. A quality-80 freighter hauling
5,000t of cargo burns measurably less propellant than a quality-40 freighter hauling
the same load, because its hull, frame, and drive components weigh less. Over hundreds
of trips, this compounds into a serious competitive advantage.

**Quality-to-physics formulas:**

Two scalars derive from quality. Both use quality-50 as the baseline (1.0):

```
mass_factor    = 1.0 - (quality - 50) × 0.005     (lighter at higher quality)
durability     = quality / 50                       (linear, quality-50 = 1.0x)
```

| Quality | Mass factor | Durability | What it means |
|---------|------------|------------|---------------|
| 30 | 1.10 (10% heavier) | 0.60× | Cheap, heavy, breaks fast |
| 50 | 1.00 (baseline) | 1.00× | Standard |
| 70 | 0.90 (10% lighter) | 1.40× | Good alloy, lasts longer |
| 90 | 0.80 (20% lighter) | 1.80× | Premium — light and tough |

**Mass factor** applies to hull plating, structural frames, and any component where
strength-to-weight matters. A quality-90 ship's structural mass is 80% of a quality-50
ship's — 20% lighter for the same integrity. Via Tsiolkovsky, this compounds: less
structural mass = less propellant per burn = lower operating cost on every trip, forever.

**Durability** is a multiplier on maintenance interval. Quality-90 components last
1.8× as long before needing replacement. This directly reduces maintenance cost and
downtime. A quality-30 fleet needs maintenance nearly 2× as often as quality-50 —
more parts consumed, more time in dock, more opportunities for failure events.

Both formulas are linear. Durability is unbounded (always positive). Mass factor
has a physical floor — structural mass can't reach zero. In practice, this doesn't
matter: the quality propagation formula makes quality above ~120 nearly unreachable
(requires near-perfect inputs at every supply chain stage), and mass_factor at
quality-120 is 0.65 (35% lighter than baseline) — well within physical plausibility.
If quality ever exceeds expected ranges, clamp mass_factor to a minimum of 0.5.

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

**Total wipeout:** If debts exceed all assets, the lender seizes everything. The player
is left with zero credits, zero ships, zero facilities — but they're still in the game.
The fiction: you're a CEO at a terminal. As long as you exist, you can communicate. You
can negotiate with other players or NPC corps for a loan, a gift, a partnership. You can
accept a contract that provides a starter ship. You're bankrupt, not dead. It's hard to
recover from zero, but a sandbox doesn't force game-over. The player who talked their
way back from total wipeout has the best story in the lobby.

**Insurance:**

Insurance DAOs are NPC-operated smart contract pools that pay claims on verifiable
events. Corps pay premiums; the pool pays out when bad things happen.

**What's insurable** (requires on-chain verifiable trigger):
- Ship destroyed (transponder goes permanently dark)
- Cargo lost at a certified port (scanner records show delivery failure)
- Facility damaged (colony infrastructure monitoring)
- Contract failure due to force majeure (ship breakdown, provable from logs)

**What's NOT insurable** (can't be verified on-chain):
- Losses at uncertified ports (no oracle to verify)
- Deliberate self-sabotage (moral hazard — hard to distinguish from bad luck)
- Losses during illegal activity (smuggling, piracy)

**Premium calculation:**
```
monthly_premium = base_rate × asset_value × route_risk × history_factor
```
- `base_rate`: ~0.5–2% of insured value per month (tuning parameter)
- `asset_value`: total value of insured ships + cargo
- `route_risk`: inner system (1.0×), belt (1.5×), outer (2.5×), frontier (5.0×)
- `history_factor`: 0.8× for clean record, 1.0× baseline, up to 2.0× for frequent claimants

**Example:** A 400,000₵ freighter carrying 100,000₵ cargo on a belt route:
500,000₵ × 1% × 1.5 = 7,500₵/month. About 15% of a mid-game facility's operating
cost. Meaningful but not crippling.

**Self-insurance:** Skip premiums, absorb losses directly. Viable for large corps
with capital reserves. Risky for small corps — one lost ship without insurance can
be game-ending. The insurance decision is a risk management choice that scales with
corp size.

**Insurance as economic stabilizer:** When piracy occurs, insurance pays the victim.
This means piracy doesn't destroy value from the system — it transfers value from
the insurance pool (funded by premiums from everyone) to the victim. The pirate gains
stolen cargo but everyone's premiums rise slightly. This makes piracy a negative-sum
activity for the system as a whole, naturally discouraging it without game rules.

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

**Relay range (grounded in RF link budget physics):**

Signal strength falls off with inverse square distance. Range depends on transmitter
power, antenna size, and required data rate. At 1 Mbps (practical for commercial
messaging — contracts, market data, encrypted comms):

| Relay class | Power | Antenna | Range | Cost |
|-------------|-------|---------|-------|------|
| **Standard relay** | 10 kW | 10m dish | **~30 AU** | Medium |
| **Premium relay station** | 100 kW | 25m dish | **~600 AU** | Very high |

Based on Ka-band RF with 2058 receiver tech. Optical/laser is local-only (~1.3 AU —
beam divergence kills range). Radio wins at interplanetary scale. These numbers are
conservative: Voyager 1 does 160 bps from 160 AU with 23W and a 3.7m dish using 1977
technology.

What this means for coverage:
- **Inner system (0–5 AU):** One standard relay covers everything. Comms are trivial.
- **Belt to outer system (5–30 AU):** One or two standard relays. Jupiter reachable
  from a belt relay. Saturn at the edge. Manageable.
- **Beyond 30 AU:** Needs relay chains or a premium station. This is where comms
  infrastructure investment becomes a real strategic decision.
- **Deep frontier (200+ AU):** Only reachable via premium stations or chains of 7+
  standard relays. The corp that builds this controls frontier information access.

**Bloc relay policies:**

Each political bloc operates relay infrastructure with a hard-coded encryption
policy. Encryption is unbreakable — no magic decryption, no secret logging of
cleartext. The physics of cryptography is as inviolable as orbital mechanics.
A relay either forwards encrypted traffic or it doesn't.

Encrypted traffic that hits a cleartext-only relay gets **dropped or neutered**
(signature stripped from payload, rendering it unverifiable). It doesn't get
"decrypted" — that's not possible.

| Bloc | Relay policy | Rationale |
|------|-------------|-----------|
| **Commonwealth** | Both encrypted and cleartext | Flexible, pragmatic. Privacy available. |
| **Collective** | Cleartext ONLY | State oversight. All traffic readable by operator. |
| **Consortium** | Encrypted ONLY | Technical security. No cleartext exposure. |
| **Coalition** | Varies per relay (33% each: both/cleartext/encrypted) | Politically diverse bloc. Each relay reflects local politics. |

**Encryption is a hard guarantee:**
- Encrypted traffic cannot be read by relay operators. Period. No exceptions.
- A corrupt relay operator's worst move is to **log encrypted traffic** (useless
  without keys) and **sell metadata** (who's talking to whom, volume, timing).
  Content is never compromised.
- A corrupt Collective relay operator can selectively drop messages
  (censorship-for-hire) or sell the cleartext they legitimately see.
- Corruption can't upgrade or downgrade a relay's encryption policy. The hardware
  enforces it.

**Encryption costs are real:**
Encrypted relays consume more bandwidth (N individually-encrypted copies vs one
cleartext broadcast) and more power (crypto math draws watts). A Consortium relay
handling the same traffic volume as a Collective relay needs more power and more
bandwidth — the privacy tax is physical, not political. In the outer system where
power is fission-only and expensive, a relay's power budget is split between
transmission (range) and encryption (privacy). Frontier relays on tight power
budgets may have to choose between signal strength and encryption throughput.

**Bloc policy vs corp policy:**

Bloc relay policy applies to **bloc-operated infrastructure.** Corp-owned relays
follow the corp's own policy regardless of bloc alignment. A Collective-aligned corp
CAN build an encrypted relay. A Consortium-aligned corp CAN build a cleartext one.
The corp decides — but building infrastructure that contradicts your bloc's norms
may be viewed as a political statement.

**Procedural seed implications:**

Different seeds produce different relay landscapes. Coalition relay variance (33%
each option) means Coalition-dominated regions have an unpredictable patchwork of
relay policies — some encrypted, some cleartext, some both. This creates interesting
routing puzzles specific to each seed.

A seed where the Collective controls inner system relays means all inner-system
corporate comms are readable in cleartext. A seed where the Consortium dominates
means everything is encrypted — private, but the Consortium's standards bodies
can't inspect traffic for compliance (their relays won't let them).

**What this means for gameplay:**

- **Routing is a political choice.** The shortest path might go through a
  Collective relay that drops your encrypted message. Route through a Commonwealth
  or Consortium relay instead — longer, but your encryption survives.
- **Collective space = surveillance zone.** All traffic readable. Corps operating
  here accept the transparency or go sneakernet for sensitive data.
- **Consortium space = privacy zone.** All traffic encrypted. But cleartext
  messages (public market data, contract postings) get neutered too — Consortium
  relays are all-or-nothing encrypted.
- **Coalition space = check the map.** Each relay has its own policy. Know your
  route before you send.
- **Corp-owned relays are the escape valve.** Build your own relay with your own
  policy. Expensive, but you control the information environment.
- **Sneakernet is the universal fallback.** Physical transport is always private
  regardless of relay landscape. The question is whether you can afford the time.

**What relay owners control:**
- **Coverage**: Only relay in range of a frontier body? Monopoly pricing on bandwidth.
- **Priority**: Own traffic arrives slightly before competitors'. Not forgery — faster delivery.
- **Fees**: Micropayments per forwarded message. Passive income from traffic volume.
- **Access**: Can deny forwarding to specific corps (information warfare via censorship).

### Asset-Based Perspective

The player doesn't have a god-view. **Each asset (ship, facility, command center) is a
viewpoint with its own information bubble.** Select an asset, see the world through its
eyes. Information availability depends entirely on what that asset can observe and what
relay data has reached it.

**Select your freighter at Eris:**
- Eris market prices: current (firsthand observation)
- Jupiter prices: 41 minutes stale (last relay update)
- Terra prices: 13 hours stale (long relay chain)
- Local contracts: current. Remote contracts: stale, might already be taken.
- Orders to this freighter: instant (it's right there)
- The freighter can accept local contracts and trade immediately

**Select your command center at Jupiter:**
- Jupiter: current. Eris: 41 minutes stale. Terra: 35 minutes stale.
- Orders to Jupiter-area assets: instant
- Orders to your Eris freighter: 41 minutes to arrive
- Richer information than a lone freighter: relay traffic analysis, market trends,
  intel briefings, sensor sweeps of the local area

**Select your mining rig at Vesta:**
- Vesta: current. Belt neighbors: minutes stale. Inner system: 15-30 min stale.
- Can see ships approaching, local ore quality, extraction status
- Limited comms compared to a command center

**The UI is always scoped to one asset's perspective.** The player cycles through
assets — each flip is like switching cameras in a control room. This naturally solves
interface complexity: you're never looking at everything at once, just one viewpoint
at a time with its own context and available actions.

**What each asset type provides as a viewpoint:**

| Asset | Local info | Remote info | Actions available |
|-------|-----------|-------------|-------------------|
| Ship (docked) | Port prices, contracts, ships in dock | Relay-delayed from elsewhere | Trade, accept contracts, load/unload |
| Ship (in transit) | Sensor observations along route | Last relay update before departure | Adjust course (limited) |
| Mining rig | Ore quality, extraction rate, local conditions | Relay-delayed | Adjust production, load drones |
| Refinery/Factory | Input/output quality, inventory, workforce | Relay-delayed | Adjust production, manage workers |
| Command center | All of the above PLUS: traffic analysis, trend computation, intel briefings, sensor sweeps | Better relay connections, more bandwidth | Issue orders to remote assets, diplomacy, contracts |
| Comms relay | Traffic metadata (volume, routing) | Other relays' status | Adjust routing, priority, fees |

**Command centers are still valuable** — not because orders originate there, but because
they're **staffed facilities with better sensors, more relay connections, and analytical
capability.** A freighter at Eris sees what's in port. A command center at Eris sees
that plus traffic pattern analysis, market trend computation, competitor activity
summaries, and LLM-generated intel briefings. The command center is a better camera,
not a required relay for orders.

### Standing Directives (the core control mechanism)

Assets are not directly controlled in real-time. The player writes **standing
directives** — behavioral scripts that assets execute autonomously based on their
local information. This is the fundamental control mechanism of the game.

**Why directives, not direct control:**
- Your freighter at Eris sees a deal. You're looking at Jupiter. By the time you
  switch viewpoint and decide, the deal is gone. But a directive you wrote earlier —
  "buy platinum below 40₵/t if quality ≥ 60" — executes instantly because it's
  already on the freighter.
- Direct control across light-speed delay is clunky: issue order, wait 41 seconds,
  see result, adjust. Directives are fire-and-forget: write once, asset executes
  locally, you review results when relay reports arrive.
- This is how real distributed organizations work. A CEO doesn't call every sales rep
  before every deal. They set policy. The reps execute within policy. The CEO reviews
  performance and adjusts policy.

**The LLM as directive compiler:**

The built-in LLM translates natural-language intent into structured executable rules.
The player writes what they want in plain language. The LLM produces a deterministic
script. The player reviews and approves. The game engine executes the script — no LLM
in the execution loop, just in the authoring.

```
PLAYER WRITES:
"Buy platinum below 40₵/t only if quality 60+, only at ports where our standing
is Good or better, don't spend more than 30% of available credits, and only when
fuel reserves allow a return trip to Jupiter with at least 20% margin."

LLM COMPILES TO:
{
  trigger: "dock_at_port",
  conditions: [
    { resource: "platinum", price_below: 40, quality_min: 60 },
    { standing_min: "good" },
    { credits_commitment_max: 0.30 },
    { fuel_reserve_min: "return_trip_jupiter_120pct" }
  ],
  action: { buy: "platinum", max_tonnes: 2000, then: "route_to_jupiter" }
}
```

The compiled directive is a deterministic rule — no ambiguity, no LLM interpretation
at runtime. The player can inspect, edit, and test the compiled version before
deploying it. Advanced players can write the structured rules directly and skip the
LLM entirely.

**Directive complexity scales with player skill:**

- **Beginner**: "Deliver cargo to nearest colony" → simple route order
- **Intermediate**: "Run platinum between Vesta and Terra, buy below 50, sell above 80,
  refuel at any depot under 15₵/t" → automated trade route with conditions
- **Advanced**: "If platinum price at any observed port drops below 35₵/t AND our
  Vesta refinery has less than 500t input inventory AND fuel cost for the trip is
  less than 20% of cargo value, divert to buy. Otherwise continue current route.
  If approached by unidentified ships, dump low-value cargo and burn for nearest
  defended port." → complex conditional behavior with threat response

The game's skill ceiling is in writing better directives. A fleet of 20 ships with
brilliant directives outperforms a fleet of 50 ships with dumb ones.

**Exception handling:** When an asset encounters a situation its directives don't cover,
it needs a fallback. The player configures a **default exception behavior** per asset:

- **Hold position**: Stop and wait for new orders. Safe but burns time (and crew
  still needs life support). Best for high-value cargo near friendly space.
- **Return to nearest friendly port**: Disengage and head for the closest colony or
  depot where you have positive standing. Safe default for most assets.
- **Continue current route**: Ignore the exception, proceed with existing orders.
  Best for routine operations where exceptions are minor.
- **Custom**: Player-defined via directive (e.g., "if exception near hostile ships,
  dump cargo and flee; otherwise hold position").

The exception alert still propagates to the player at light speed. But the asset
doesn't sit idle for 82 minutes — it executes the default behavior immediately, and
the player can override when the alert arrives.

**Direct intervention is still possible** — but it's an override, not the default.
The player can select any asset and issue a one-time order ("go here now, ignore your
current directive"). This propagates at light speed from the player's current viewpoint
to the asset. It's the "I see something the directive doesn't account for" escape valve.
But relying on direct intervention means relying on being faster than physics — which
works in the inner system and fails in the outer system.

**Two interfaces, one game:**

The game is still point-and-click. Click a ship, click a destination, click "go."
Click a contract, click "accept." Every action has a button. The traditional interface
is always available and fully functional.

The **chat interface** is a first-class overlay — the same text input for everything:

- **Fleet/operations**: "Reroute the Vesta freighter to pick up that platinum deal."
  "Set up an automated trade loop between Kepler-3 and Terra for water ice." "If
  anyone approaches our mining rig at belt-7, pull the drones back and alert me."
  → Your corporate AI translates to game actions and standing directives.
- **Diplomacy**: "Hey Corp B, interested in a long-term rare earth supply deal?"
  → Message sent via relay to the other corp (human or NPC). NPC corps respond in
  character via the LLM. Human players see it in their own chat.
- **Market**: "Post a buy order for 1000t quality-60 platinum at Vesta, max 45₵/t."
  → Creates the contract on the local market board.

In 2058, talking to your corporate AI to manage operations is as natural as email
is today. The chat IS the command line. Point-and-click is the visual shortcut.
Both do the same things. Simple actions are faster to click. Complex multi-step
behaviors are faster to type. The player uses whichever fits the moment.

**The chat unifies three systems that would otherwise need separate interfaces:**
1. Fleet management (directing your own assets)
2. Inter-corp communication (diplomacy, negotiation, threats)
3. Market operations (posting/accepting contracts, trading)

One text input. The AI figures out whether you're talking to it, to another corp,
or to the market — based on context and explicit addressing (@CorpB, @market, or
just talking to your own AI by default).

**Directive monitor**: For each asset, a panel shows current standing directives,
recent autonomous actions taken, and exceptions where the directive couldn't decide
(flagged for player attention).

**Progression:**
- Early: One ship = one viewpoint. You see the world from wherever your ship is.
  Limited information, but everything you see is current and actionable.
- Mid: Multiple ships + first command center. More viewpoints, richer analysis at
  the command center location. Start to feel the relay delay between viewpoints.
- Late: Network of command centers + large fleet. Rich information from multiple
  perspectives. The challenge shifts from "I don't know enough" to "I know too much
  from too many viewpoints — what's the signal in the noise?"

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

### Payroll & Labor Economics

Workers are your biggest recurring cost. Every crewed facility, every manned ship,
every command center has a payroll. Understanding labor economics is the difference
between a profitable empire and one that bleeds credits.

**Wage determination:**

Workers have a **market wage** set by colony-level supply and demand. The colony's
labor market is a real market — wages float based on how many workers are available
vs how many jobs exist.

- **Labor surplus** (more workers than jobs): Market wage drops. Corps can hire cheap.
  Workers accept lower offers because the alternative is unemployment. Colony morale
  suffers (unemployment breeds resentment).
- **Labor shortage** (more jobs than workers): Market wage rises. Corps bid against
  each other for scarce talent. Workers demand premium pay. This is common at
  frontier colonies and rapidly growing outposts.
- **Specialization premium**: Engineers, geologists, and pilots command higher wages
  than general workers. The premium scales with local scarcity — an engineer at a
  frontier outpost with only 3 engineers in the labor pool commands extreme wages.
  The same engineer at a Terra city with 10,000 engineers earns standard rates.

**What you pay:**

| Cost | Per worker/month | Notes |
|------|-----------------|-------|
| Base wage | Market rate | Minimum to hire. Set by local supply/demand. |
| Above-market premium | Optional | Attracts better talent, improves retention, boosts standing |
| Life support | ~500₵ | Food, water, air, medical per person. Non-negotiable. |
| Hab space | ~200₵ | Per person. Colony charges rent, or you build your own habs. |
| Crew transport | One-time | Getting workers to remote locations costs a ship trip. |

**Payroll as operating cost:**

A crewed mining rig with 5 engineers and 15 workers at a belt asteroid:
- 5 engineers × 3,000₵/month = 15,000₵
- 15 workers × 1,000₵/month = 15,000₵
- 20 people × 700₵ life support/hab = 14,000₵
- **Total: ~44,000₵/month**

That's BEFORE you account for equipment maintenance, propellant, reactor fuel. Crew
costs dominate facility operating budgets. This is why drone operations are tempting —
a drone rig at the same asteroid costs maybe 5,000₵/month in maintenance and power.
But the drone rig can't handle the unexpected geology problem that a geologist solves
in an afternoon.

**Wage negotiation isn't micro-managed.** The player sets a **wage policy** per
facility or fleet-wide:
- **At market**: Pay exactly the going rate. No bonus, no penalty. Workers come and go.
- **Above market (+X%)**: Attract better workers, improve retention. Standing boost.
  Higher cost.
- **Below market (-X%)**: Only attracts desperate workers (low quality). High turnover.
  Standing penalty. Only viable in labor surplus colonies.
- **Premium specialist**: Offer above-market rates for specific roles (engineers,
  geologists) while paying standard for general workers. Targeted investment.

The chat/directive interface handles this naturally: "Pay engineers 20% above market
at all facilities. Standard rate for everyone else. If local unemployment exceeds 15%,
drop to market rate across the board."

**Crew retention:**

Workers aren't locked to your corp. They evaluate their employment continuously:
- Am I paid at or above market?
- Is this facility safe? (maintenance quality, environmental record)
- Is this colony livable? (comfort goods, comms access, education for my kids)
- Does this corp treat people well? (standing reflects accumulated treatment)
- Is there a better offer? (other corps at this colony, other colonies entirely)

Workers who are unhappy leave — either to a competitor at the same colony or they
emigrate to a better colony entirely. You lose their training investment and have to
recruit replacements (which costs time and may mean lower quality).

**Poaching:**

Corps can actively recruit workers employed by competitors. Offer above-market wages
with a signing bonus and workers switch. This is legal but damages your standing with
the poached corp (they remember) and may trigger a wage war where both corps bid up
labor costs, hurting margins for everyone.

**Training investment:**

Hiring a quality-30 worker and training them to quality-60 takes time and resources
(education facilities, instructor time, lost productivity during training). If that
worker then gets poached by a competitor, you've lost the investment. This creates
an incentive to either:
- Pay trained workers above market (retention through compensation)
- Build a colony where people WANT to stay (retention through quality of life)
- Accept turnover and run a training pipeline (always have workers in training)

**Ship crew is separate from facility crew:**

Ships carry their own crew. Ship payroll travels with the ship — you're paying these
people whether the ship is hauling cargo or sitting in dock. An idle ship with crew
is bleeding credits. This creates pressure to keep ships moving and to minimize crew
size (drone-assisted ships with skeleton crews where possible).

Ship crew also needs life support IN TRANSIT — food stores, water recycling, medical
supplies loaded before departure. A long frontier trip to the outer system means
loading enough supplies for months. That's cargo capacity used for crew support
instead of revenue-generating cargo. Another reason drone ships are attractive for
long hauls.

**The full labor cost picture:**

```
Monthly operating cost of a crewed facility:
  Payroll (wages × headcount)              — the biggest line item
  + Life support (food, water, air, medical) — non-negotiable
  + Hab lease or hab maintenance            — where they live
  + Equipment maintenance                   — quality degrades
  + Power (reactor fuel or solar)           — keeps everything running
  + Consumables (drone parts, tools)        — operational needs
  = TOTAL OPERATING COST

Compare to drone-only facility:
  Power                                     — still needed
  + Equipment maintenance                   — higher drone attrition
  + Drone replacement parts                 — ongoing
  + Periodic human visit for exceptions     — expensive but infrequent
  = TOTAL (typically 15-25% of crewed cost)
```

The 75-85% cost savings from going all-drone is real. The question is whether you
can afford the brittleness. A crewed facility costs 4x more but handles surprises,
maintains quality, and improves over time (workers learn and get better). A drone
facility is cheap but static — it produces the same quality forever and breaks when
something unexpected happens.

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

### Taxation

Taxes are local, set by each colony's governance. There is no system-wide tax authority.
Each colony decides its own rates, and those rates fund local services (defense, port
authority, infrastructure, education, life support subsidies).

**What's taxed:**
- **Docking fees**: Per-dock, per-day. The baseline cost of having ships at a port.
- **Transaction tax**: Percentage of market transactions conducted at the port. This is
  the big one — every buy/sell at a colony pays a cut to the colony treasury.
- **Facility lease**: Monthly fee for operating a refinery, factory, or other facility
  at a colony. Based on footprint and resource usage.
- **Import/export tariffs**: Taxes on specific goods entering or leaving the port.
  Tariffs are the most politically interesting tax — they're targeted, they create
  winners and losers, and they're a tool for economic warfare between colonies.

**Tax rates vary by governance:**
- **Company town**: Low taxes for the owning corp (they ARE the government). High for
  competitors — or outright access denial. Effective tax haven for the owner.
- **Independent colony**: Moderate, democratically set. Rates reflect resident priorities
  — high defense spending means higher taxes, good education means higher taxes.
  Transparent and predictable.
- **Consortium**: Negotiated between member corps. Each member may have different
  effective rates based on their investment share. Complex but generally moderate.
- **Free port**: Zero taxes. Zero services. You get what you pay for.

**Tax arbitrage is gameplay:**
- Base at a high-tax colony and benefit from tax-funded infrastructure, defense,
  labor pool, and enforcement. Pay for it through taxes. Simple.
- Base at a low-tax colony and invest directly in your own services — build your own
  defense drones, fund your own training programs, run your own port authority. Lower
  taxes but higher direct capital investment. You control the infrastructure but bear
  the full cost. A low-tax colony with heavy corp investment can have excellent
  services — the corps just pay directly instead of through the tax system.
- Operate through pseudonymous addresses at free ports to avoid taxes entirely —
  but with no enforcement, no scanner oracles for contract settlement, and no legal
  recourse if something goes wrong.
- Colonies compete for corporate tenants. A colony that raises taxes too high loses
  corps to cheaper neighbors. A colony that cuts taxes too low AND has no direct corp
  investment deteriorates. This dynamic is emergent, not scripted.

**Tax rate ≠ service quality.** Taxes are an input. Service quality is an output. The
function between them is governance — which has its own quality dynamics:

- A high-tax colony with quality-30 bureaucrats and no accountability wastes revenue
  on bloated payroll and bad procurement. Services are mediocre despite high spending.
  Corps pay a lot and get little.
- A low-tax colony with a quality-70 manager running lean operations delivers
  effective services on a thin budget. Corps pay less and get more.
- A high-tax colony with quality-80 governance and educated labor force delivers
  excellent services that justify the cost. The premium taxes attract premium corps
  that demand premium results.
- A company town with zero taxes but massive direct corp investment can outperform
  all of the above — but the services serve the corp's interests, not the public's.

**Governance quality** depends on the same inputs as everything else: labor quality
(educated administrators make better decisions), facility quality (good systems reduce
waste), and investment (more resources = more capability). A colony that invests in
education produces better governors, which produces better policy, which produces a
more attractive colony. The virtuous cycle runs through governance too.

**Corruption** is the inverse: low-accountability governance (company towns with
absentee owners, independent colonies with apathetic voters, consortiums with
deadlocked decision-making) degrades service quality regardless of tax revenue. Tax
money gets misallocated, contracts go to connected corps instead of competent ones,
infrastructure maintenance gets deferred. This is emergent from governance quality,
not a separate "corruption stat."

The real choice for a corp: **which colony's governance do I trust to convert my tax
credits into services I actually benefit from?** Sometimes the answer is "none — I'll
do it myself."

**Tax evasion:**
- Operating through pseudonymous addresses to avoid association with a taxable
  identity is possible but has costs: you lose reputation history, colony standing,
  and access to identity-gated services (loans, preferred contracts).
- Under-reporting transactions by settling off-port (ship-to-ship transfer outside
  port scanner range) avoids transaction tax but also avoids contract escrow
  protections. You're trading in the dark.
- A colony's port authority (if it has one) monitors for tax evasion. Quality of
  enforcement determines how much evasion they catch. A quality-80 port authority
  with good analytics catches most evasion. A quality-30 one catches almost none.

**Tariffs as economic warfare:**

Tariffs aren't just revenue — they're protectionism, retaliation, and political tools:

- **Protect local industry**: Colony has a refinery. Imports of refined metals get
  tariffed to make the local refinery competitive. Corps operating the local refinery
  benefit. Corps that import from elsewhere pay the premium.
- **Retaliation**: Colony A tariffs Colony B's exports after a political dispute.
  Colony B retaliates. Trade war ensues. Corps caught in the middle either eat the
  costs, reroute supply chains, or lobby for resolution.
- **Strategic control**: Tariff Casimir fuel rod imports to force local production.
  Expensive short-term but builds domestic capability long-term.
- **Bloc policy**: Bloc-affiliated colonies may coordinate tariffs against rival
  bloc exports. Commonwealth colonies collectively tariff Collective-origin goods.
  The player's bloc alignment affects which tariffs help or hurt them.

Tariffs are set by colony governance. Who decides depends on governance type:
independent colonies vote, company towns decree, consortiums negotiate.

**Lobbying:**

Corps can spend credits to influence colony governance decisions. This isn't
corruption — it's how political systems actually work. The mechanics:

- **Lobby target**: A specific upcoming policy decision (tax rate change, new tariff,
  environmental regulation, defense budget, infrastructure spending).
- **Lobby spend**: Credits invested in influencing the outcome. Higher spend = more
  influence, but with diminishing returns. Multiple corps can lobby the same issue
  on different sides.
- **Governance type determines effectiveness:**
  - **Independent colony**: Lobbying competes with popular opinion. A corp can spend
    heavily but if the policy is unpopular with residents, the council may still
    reject it. Colony standing affects how much weight your lobby carries.
  - **Company town**: No lobbying needed if you own it — you just set policy. Other
    corps can lobby the owner (effectively negotiation/bribery).
  - **Consortium**: Lobbying weighted by investment share. Bigger investors have more
    votes. Pay-to-play by design.
  - **Free port**: Nothing to lobby. No governance, no policy.

- **What you can lobby for:**
  - Lower your tax rate (or raise a competitor's)
  - Impose tariffs on imports that compete with your products
  - Remove tariffs on goods you import
  - Increase defense budget (if you sell defense drones to this colony)
  - Relax environmental standards (cheaper operations, lower colony quality of life)
  - Tighten environmental standards (hurts corner-cutting competitors)
  - Fund education (improves labor quality for everyone, including you)
  - Change docking priorities

- **Lobby visibility**: Lobbying spend is observable (it's on-chain). Other corps can
  see you're spending credits to influence Colony X's policy. They can counter-lobby.
  This creates a transparent political economy — not secret backroom deals, but
  visible influence campaigns.

The tension: **taxes fund the services that make a colony worth operating at.** A
corp that evades taxes is free-riding on infrastructure paid for by others. If
enough corps evade, the colony can't fund defense, port authority, education, or
life support — and deteriorates into a free port. This is the tragedy of the commons
playing out at colony scale. And lobbying means corps don't just passively accept
the tax environment — they actively shape it. The political landscape is as dynamic
as the economic one.

### Alliances & Confederations

**Trade Confederations**: Colonies agree on shared standards (cargo grades, scanner
calibration) so contracts are interoperable. Think ISO, not NATO.

**Defense Pacts**: Mutual defense. Attack one member, the others respond (within
light-speed delay). Expensive shared defense fund.

**Colony defense drones:** Colonies invest in defense from tax revenue. Defense budget
is a colony governance decision — independent colonies vote on it, company towns set
it, consortiums negotiate it. Defense drones are purchased from drone manufacturers
(player or NPC corps) — creating demand in the drone supply chain. A corp that supplies
defense drones to a colony earns standing AND creates a dependency.

**Colony enforcement is layered** — defense drones are just the physical layer:

| Layer | What it does | Requirements |
|-------|-------------|-------------|
| **Physical defense** | Combat drones, patrol ships, point-defense | Drone supply + power + crew |
| **Port authority** | Inspects ships, enforces docking rules, scanner oversight, warrants | Trained personnel, command infrastructure |
| **Legal/arbitration** | Resolves disputes smart contracts can't (quality, environmental, labor) | Legal expertise, governance maturity |
| **Impound capability** | Seize ships as evidence or penalty | Requires a shipyard or armed dock facility |
| **Summon capability** | Call for help from defense pact allies | Relay coverage + pact membership |

Each layer costs money and infrastructure. A colony that can't afford port authority
doesn't have one. A colony without a shipyard can't impound ships — they can deny
docking but can't physically detain a vessel. Frontier colonies are lawless not by
game rule but by resource constraint.

**Governance type shapes enforcement character:**
- **Company town**: Corporate security. Effective, serves the owning corp's interests.
  "Law" is whatever the owning corp says it is.
- **Independent colony**: Elected law enforcement. Slower, more bureaucratic, but
  legitimate and accountable to residents.
- **Consortium**: Shared security funded by member corps. Professional but politically
  complicated — enforcement priorities are negotiated.
- **Free port**: Nothing. No police, no port authority, no courts. That's the point.
  Disputes are settled between the parties or not at all.

In Established/Late Stage start modes, bloc-affiliated colonies start with enforcement
proportional to bloc investment. Commonwealth colonies tend toward professional
independent law enforcement. Collective colonies tend toward heavy state security.
Coalition colonies tend toward community-based enforcement. Consortium colonies rely
on shared professional security forces. The procedural generator seeds enforcement
levels from bloc affiliation, colony wealth, and governance type.

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
- Credit mixing (transaction obfuscation protocols) is routine for general spending.
  Financial flows between addresses are obfuscated unless the parties choose transparency.
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

**Scanner detection mechanics:**

Detection is a probability check when a ship docks at a port with a scanner:

```
detection_chance = (scanner_quality - countermeasure_quality) / 100
```

Clamped to 0.05–0.95 (always a small chance either way). Examples:

| Scanner | Countermeasure | Detection chance |
|---------|---------------|-----------------|
| Quality-80 port scanner | No countermeasures (0) | 80% — you're probably caught |
| Quality-80 port scanner | Quality-60 shielded container | 20% — decent odds |
| Quality-40 frontier scanner | Quality-60 shielded container | 5% (floor) — very safe |
| Quality-90 port scanner | Quality-80 shielded container | 10% — risky but possible |
| Quality-60 port scanner | Manifest falsification (quality-50) | 10% — scanner barely notices |

Countermeasure types:
- **Shielded container**: Manufactured item (refined metals + electronics). Has a
  quality level. Reduces scanner effectiveness. Takes cargo space.
- **Manifest falsification**: Skill-equivalent — quality derived from the electronics
  used to generate the fake manifest. Better electronics = more convincing forgery.
- **Hidden compartment**: Ship modification. Scanner can't see it at all unless
  scanner quality > compartment quality. Binary: either found or not.
- **Bribery**: Available at corrupt ports. Bypasses the check entirely for a fee.
  Corruption availability is a colony governance property.

A corp investing in quality-80 shielded containers is making a manufactured product
from the same supply chain as everything else. Smuggling equipment has an economic
cost, a quality level, and competes for the same components as legitimate equipment.

**Scanner warfare:**

Scanners are oracles — their signed readings settle contracts on-chain. This makes
them simultaneously critical infrastructure and attack surface.

**Ship-mounted scanners**: Corps can install their own scanners on ships or at private
facilities. A high-quality ship scanner lets you independently verify cargo before
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

### Modular Component System

Ships, facilities, and drones are all built from the same component vocabulary.
The same "electronics" component goes into a ship's navigation system, a refinery's
process controller, and a drone's sensor package. This keeps the supply chain simple
while allowing diverse final products.

**Component types (universal building blocks):**

| Component | Made from | Used in |
|-----------|-----------|---------|
| Hull plating | Refined iron + polymers | Ship hull, station structure, hab shell |
| Structural frame | Refined iron | Ship skeleton, facility frame, drone chassis |
| Drive components | Processed RE + superconductors | Ship drives, high-thrust drone motors |
| Electronics | Refined platinum + optics | Everything — navigation, sensors, controls, comms |
| Actuators | Processed RE + electronics | Turrets, manipulator arms, drones, mining rigs |
| Hab modules | Glass/ceramics + polymers + life support | Crewed ships, stations, colonies |
| Wiring/cabling | Refined conductors | Everything (universal interconnect) |
| Power systems | Superconductors + electronics + reactor components | Ships, stations, relays |
| Sensor arrays | Optics + electronics | Ships, scanners, relays, survey drones |
| Weapon systems | See weapons section | Combat ships, combat drones, defense installations |

**Slot-based assembly:**

Every constructed thing has **component slots** — typed slots that accept specific
component types. A ship has slots for hull, drive, electronics, power, and optional
slots for weapons, mining equipment, drone bays, hab modules. A refinery has slots
for structure, electronics, power, and process-specific equipment.

The quality of what goes in each slot determines the quality of that subsystem.
A ship with quality-80 drives but quality-40 electronics has great thrust but poor
sensors. The overall "ship quality" is the average across all filled slots — but
individual subsystem quality matters for specific tasks (drive quality for fuel
efficiency, electronics quality for sensor range, hull quality for structural mass).

**Slot configuration defines capability:**

| Ship class | Required slots | Optional slots |
|------------|---------------|----------------|
| Scout | Hull, Drive, Electronics, Power, Wiring | Sensors, Cargo (small) |
| Freighter | Hull (heavy), Drive, Electronics, Power, Wiring, Cargo (large) | Hab, Sensors |
| Mining vessel | Hull, Drive, Electronics, Power, Wiring, Mining equipment, Cargo (medium) | Hab |
| Tanker | Hull, Drive, Electronics, Power, Wiring, Fuel tankage (large) | — |
| Colony ship | Hull, Drive, Electronics, Power, Wiring, Hab (large), Life support | Cargo (small) |
| Any ship | — | Weapons, Drone bays, Point defense, Scanner |

Optional slots are what make the same ship class serve different roles. A freighter
with a weapons slot and drone bay is an armed convoy escort. A freighter without them
has more cargo capacity. The tradeoff is always: capability vs cargo space. Every
optional module takes volume and mass that could be revenue-generating cargo.

**Facilities use the same components:**

| Facility | Key slots |
|----------|-----------|
| Mining rig | Structure, Power, Electronics, Mining equipment, Cargo storage |
| Refinery | Structure, Power, Electronics, Process equipment, Storage (in/out) |
| Factory | Structure, Power, Electronics, Assembly equipment, Storage |
| Shipyard | Structure (heavy), Power (heavy), Electronics, Assembly (large), Dock |
| Command center | Structure, Power (heavy), Electronics (heavy), Sensors, Comms relay |
| Comms relay | Structure (light), Power, Electronics, Antenna array |

This means upgrading a facility is the same action as upgrading a ship: swap a
component in a slot for a higher-quality one. The supply chain doesn't need to know
whether an electronics unit is going into a ship or a refinery — it's the same product.

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
- **Combat drones**: Mining/construction drones fitted with weapons mounts and
  targeting electronics. See weapons below.

Drone factories need the same rare earths as shipyards (actuators vs drive components) —
genuine resource tension.

### Weapons & Combat Equipment

Weapons are manufactured components like any other — they have a supply chain, a
quality level, and they compete for the same inputs as civilian equipment.

**Weapon types:**
- **Kinetic accelerator** (railgun): Refined iron (projectiles) + superconductors
  (magnetic rails) + electronics (targeting). Long range, slow rate of fire.
  Damages hull. The "serious" weapon.
- **Mining laser (repurposed)**: Optics + electronics + power coupling. Short range,
  continuous beam. Originally designed to cut rock. Damages systems and drones.
  Cheap, available anywhere there's mining equipment.
- **EMP projector**: Superconductors + electronics + capacitor banks (from refined
  conductors). Disables electronics without physical damage. Used for boarding
  operations — knock out a ship's systems, then send boarding drones.
- **Point defense array**: Sensor arrays + actuators + electronics. Automated
  interception of incoming projectiles and drones. Defensive only.

**Weapons in the supply chain:**

```
Refined iron          → Projectiles          → Kinetic accelerator
Superconductors       → Magnetic rails       → Kinetic accelerator
                      → EMP coils            → EMP projector
Optics                → Weapon optics        → Mining laser (repurposed)
Electronics           → Targeting systems     → All weapons
                      → Fire control          → Point defense
Actuators             → Turret mounts         → Ship-mounted weapons
                      → Weapon mounts         → Combat drone retrofit
Refined conductors    → Capacitor banks       → EMP projector
```

**Quality affects weapons** the same way it affects everything else: higher quality
targeting systems improve accuracy, higher quality rails increase projectile velocity,
higher quality optics focus the laser tighter. A quality-80 railgun hitting a quality-40
hull does more damage than a quality-40 railgun hitting a quality-80 hull. Quality
is the arms race.

**Weapons compete for civilian inputs.** Superconductors used for railgun rails can't
be used for relay infrastructure. Electronics used for targeting can't be used for
port scanners. Actuators used for turret mounts can't be used for mining drones.
Militarization has an economic opportunity cost — every weapon built is a civilian
component not built. A system at war becomes a system with worse infrastructure.

### Fleet Management & Trade Routes

The single-ship state extends to a fleet:

```js
state.fleet = [
  { id: 'ship-1', route: [...], jumpIndex: 0, elapsed: 0, cargo: {...}, orders: {...} },
  { id: 'ship-2', route: null, docked: 'Ceres', cargo: {...}, orders: {...} },
];
```

Each ship gets its own transit tick. Camera can track any ship.

**Trade routes are emergent, not a game object.** A ship with standing directives — "load
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

## 13. User Interface & Gameplay Flow

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

The primary interaction loop: **select an asset → see its perspective → act from it.**

A navigation bar or hotkey cycle steps through your assets: ships, facilities, command
centers, relays. Each selection reframes the entire map view through that asset's
information bubble. Stale data is visually indicated (dimmed, timestamped).

**Select your ship (docked) →**
- Local port: prices, contracts, ships in dock (CURRENT)
- Ship status: cargo manifest, fuel gauges, crew, maintenance
- Nearby bodies: composition, orbital info (CURRENT if in sensor range)
- Remote information: relay-delayed, with timestamps showing staleness
- Actions: trade, accept contracts, load/unload, refuel, set orders, depart

**Select your ship (in transit) →**
- Sensor observations along route (bodies, other ships, transponders)
- Last relay update before departure (increasingly stale)
- Ship status: fuel burn rate, ETA, cargo
- Actions: adjust course (limited), manage standing directives

**Select your facility →**
- Production: input/output rates, queue, quality levels (CURRENT)
- Inventory and workforce status (CURRENT)
- Local market if at a colony (CURRENT)
- Remote information: relay-delayed
- Actions: adjust production, manage workers, order supplies

**Select your command center →**
- Everything a facility provides PLUS:
- Relay traffic analysis (who's communicating, volume patterns)
- Market trend computation (price history, demand projections)
- Intel briefings (LLM-generated analysis of competitor activity)
- Sensor sweeps (ships in local area, approaching vessels)
- Full diplomatic capability (send messages, negotiate, post contracts)
- Actions: all facility actions + issue orders to remote assets + diplomacy

**Click a body (no asset there) →**
- Physical info: orbit, mass, escape cost
- Composition: if surveyed (by any of your assets), show results. Otherwise "UNSURVEYED"
- Colony info: only what you've observed — may be stale or incomplete
- Market: only if you have recent relay data. Otherwise "NO DATA"
- Actions: "Send ship here," "Queue survey"

**Click empty space →** Dismiss panels, return to map overview

The key difference from a traditional god-game: **information quality degrades with
distance from your assets.** Bodies near your ships show rich, current data. Bodies
on the far side of the system show whatever your last relay update contained — which
might be hours or days old. Bodies you've never sent a ship to show almost nothing.

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
all contracts visible from your assets' relay data.

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

## 14. Random Events & Emergencies

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

## 15. Pacing & Progressive Disclosure

The full system complexity (9 resources, 4 processing tiers, communications, labor,
governance, combat...) is revealed gradually through natural gameplay progression, not
dumped upfront.

### Early Game Pacing

The first 30 minutes must hook the player.

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

### Mid-Game Depth

The first hour hooks you (first ship, first contract, learning orbital mechanics).
The late game excites (empire, politics, combat, market manipulation). The mid-game
(hours 2-10) is where tycoon games lose players to the grind. Here's what keeps it
engaging:

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

## 16. Economic Parameters (Ballpark)

These are order-of-magnitude estimates for validating that the economy works on paper.
All numbers are tuning targets, not commitments. Final values come from playtesting.

### Starting Conditions

| Item | Value | Notes |
|------|-------|-------|
| Starting credits | 10,000 ₵ | Seed money. Not much. |
| Starting assets | None | You're a new corp with a terminal and a dream. |
| Starting loan available | ~50,000 ₵ | Unsecured starter loan from your bloc (or colony if independent). Enough to lease a ship or buy a small drone rig. |

The player starts with almost nothing — a corp registration, seed credits, and
access to the market. First decisions: lease a ship (cheaper, don't own it), buy a
used ship (own it, collateral for future loans, but costs more), or skip ships
entirely and buy a drone mining rig at a local asteroid. Multiple viable on-ramps,
all requiring the player to figure out how to turn a small stake into income.

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

## 17. LLM Integration (Narrative Layer)

A small but capable language model adds immersion without replacing game logic. The
simulation computes facts. The LLM writes prose. No agency — narration only.

**Principle:** The LLM never decides what happens. It decides how what happened is
communicated. Game events are deterministic simulation outputs. The LLM renders them
into character, context, and atmosphere.

**Implementation:** Two fine-tuned models via llama.cpp compiled to **WebAssembly**.
Runs entirely in the browser — no server, no install, no GPU drivers. Same zero-build
static web app architecture as the rest of the game.

- **Two models, two roles:**
  - **Background model: fine-tuned Qwen3.5-0.8B** (~500 MB). Handles news blurbs,
    intel briefings, flavor text, routine narration. Fires in a background Web Worker.
    Fast (60-80 tok/s native, 30-40 WASM). Nobody waits for these — they appear in
    the news feed asynchronously.
  - **Interactive model: Qwen3.5-4B** (~2.5 GB). Handles the chat interface: directive
    compilation, NPC diplomatic negotiation, context routing (AI/corp/market), complex
    personality-voiced responses. Player types, waits 3-5 seconds for response —
    acceptable latency for a chat interface. Runs in a separate Web Worker.
- Both models cached in IndexedDB. Total: ~3 GB first-time download.
- The 4B model is necessary because directive compilation requires reliable logical
  parsing ("don't spend more than 30% unless quality > 70 AND fuel sufficient for
  return trip") and NPC negotiation requires multi-turn coherence with game-state
  awareness. The 0.8B hallucinates conditions and loses character consistency.
- Fine-tuning both on game-specific data (500-1000 directive examples, NPC personality
  templates, news formats) significantly improves reliability for these narrow domains.

**Inference budget management:**

The 4B model generates one response at a time in WASM. Queue management prevents
backlog from breaking game feel:

- **Directive execution doesn't call the LLM.** Directives are compiled at authoring
  time into deterministic rules. When a trigger fires, the game engine evaluates the
  rule instantly. 15 ships hitting triggers = 15 instant rule evaluations, zero LLM.
- **Player chat gets top priority.** Always next in queue. 3-5 second response.
- **NPC diplomatic responses are hidden behind relay delay.** You send a proposal →
  relay propagation (real game-time delay) → NPC "considers" (LLM inference, hidden
  behind the fiction of deliberation) → relay propagation back. The player perceives
  realistic communication pacing, not inference latency.
- **NPC-to-NPC diplomacy uses templates.** Background world-building doesn't need the
  4B. If the player can't observe the conversation (no relay coverage), it never
  needs to be rendered at all.
- **News/intel uses the 0.8B in a separate worker.** Never competes with interactive.
  Falls back to templates silently if backlogged.

Realistic call volume: **2-5 interactive LLM calls per real minute** during active
play. One for each player command or NPC response in an active conversation.
Completely manageable for a single WASM inference thread.

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

### LLM as Directive Compiler

The LLM's most important role isn't narration — it's **translating player intent into
executable directives.** This is the primary gameplay interface for fleet management.

The LLM takes natural language ("buy platinum cheap, sell at Jupiter") and produces a
structured rule the game engine can execute deterministically. The player reviews the
compiled output before deploying. The LLM is never in the execution loop — only in
the authoring loop.

This means the LLM quality directly affects gameplay accessibility. A good model
correctly interprets "don't overcommit on credits" as a percentage cap. A bad model
might misinterpret it. The review step catches errors, but better models mean fewer
corrections.

### What the LLM Does NOT Do

- Does not execute directives (deterministic game engine does)
- Does not make NPC decisions (NPC strategy is deterministic code)
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

## 18. Technical Architecture

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

## 19. Open Questions

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

---

## Appendix A: Variant — All-Drone Universe

A different game with the same orbital engine. No human crews in space — players are
Earth-based corporations remotely operating drone fleets. Simpler supply chain (no food,
water, medical). Comms delay becomes THE constraint — you write standing directives, drones
execute, results arrive 40 minutes later. Cyberpunk tone: hacking, signal jamming,
electronic warfare replace human diplomacy. Faster pace, more aggressive play.

Probably a separate game, noted here for reference.
