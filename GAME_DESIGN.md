# WarpDrive: Asteroid Mining Tycoon

## Concept

Asteroid mining tycoon set in procedurally generated solar systems. Each new game creates a unique star with orbiting bodies — planets, moons, asteroids, comets — with real Keplerian orbital mechanics. The player builds a mining and shipping empire by exploiting orbital dynamics: timing launch windows, managing transit costs driven by gravity wells, and running trade routes across a living system where everything moves.

**Core thesis: orbital mechanics IS the economy.** Physics creates natural scarcity, timing pressure, and strategic depth without artificial game mechanics. A player who understands launch windows and gravity wells outperforms one who brute-forces routes.

## Setting & Premise

**Year 2058.** Humanity has achieved warp speed (c) but hasn't broken the light-speed barrier. Advanced AI and robotics are mature technologies — autonomous mining rigs, AI-piloted freighters, and algorithmic trading are the norm. The player isn't necessarily sitting in a cockpit; they're running a corporation from a terminal.

**One race: humans.** This isn't a 4X — no alien civilizations, no tech trees spanning millennia. The drama comes from human institutions: corporations competing, contracts being honored or broken, regulatory bodies trying to keep order in a frontier that's expanding faster than law can follow.

**The system is not empty.** By 2058, humanity has been in space for decades. The initial gamestate reflects this — there are existing colonies, established trade routes, regulatory bodies, and incumbent corporations. The player is a new entrant, not a pioneer.

## What WarpDrive already provides

The existing navigation simulator is the game engine:

- Keplerian orbital mechanics (bodies move on elliptical orbits, positions change over time)
- 7-phase transit physics with gravity-well-aware fuel/time costs
- Collision-free pathfinding with waypoint insertion
- Tidal-limit danger zones derived from body mass
- Phase-aware ship animation (accel → warp → decel)
- 3D visualization with Three.js, lit-html UI panels
- Time simulation with play/pause/speed controls

## Initial World State & Game Start Modes

The world doesn't start empty. The generator creates not just a solar system, but a
civilization at a particular stage of development. The player chooses how "mature" the
system is when they enter — this is the primary difficulty/playstyle selector.

### Start Modes (Historical Simulation Depth)

Each mode represents a different answer to "how much history happened before you arrived?"

**Mode 1: Frontier (T+5 years)**
- One established colony on the habitable-zone planet (the "homeworld")
- A few orbital stations under construction
- 1–2 small NPC corps doing initial prospecting
- Most bodies are unsurveyed — composition unknown until someone visits
- No regulatory infrastructure — pure frontier capitalism, contracts are handshake deals
- Player advantage: first-mover on untapped resources
- Player risk: no safety net, no established markets, no contract enforcement

**Mode 2: Expansion (T+20 years)**
- Homeworld colony is a small city
- 2–3 outpost colonies on moons/asteroids (still dependent on homeworld imports)
- 5–8 NPC corps of varying size, established trade routes
- Inner system mostly surveyed, outer system still frontier
- Nascent regulatory body: the **System Commerce Authority (SCA)**
  - Registers ships and corps
  - Arbitrates contract disputes (but enforcement is weak)
  - Publishes market data (transponder-reported prices)
- Player advantage: infrastructure exists, markets have liquidity
- Player risk: competition is real, good routes are already claimed

**Mode 3: Established (T+50 years)** ← the "2058" canonical mode
- Multiple established colonies with real economies
- Major NPC corps are powerful (some bigger than the player will ever be)
- Full regulatory framework (SCA has teeth — fines, license revocation)
- Supply chains exist: raw materials → refineries → manufacturers → consumers
- Shipyards build ships from manufactured components (not bought from a menu)
- Player advantage: deep markets, diverse contracts, infrastructure everywhere
- Player risk: incumbents have economies of scale, regulation constrains options

**Mode 4: Late Stage (T+100 years)**
- System is heavily developed, most resources mapped and claimed
- Megacorporations dominate — player is a scrappy upstart
- Complex regulation, taxation, tariffs between colony jurisdictions
- Opportunities in: niche markets, frontier (outer system), disruption, politics
- Hardest mode — requires understanding the full economic simulation

### What the Generator Produces per Mode

The procedural generator runs a simplified economic simulation forward from T+0 to the
chosen start time. This isn't real-time — it's a fast-forward bootstrap that produces:

1. **Colony locations and populations** — where did settlement spread?
2. **NPC corp portfolios** — who owns what ships, routes, mining claims?
3. **Market prices** — supply/demand equilibrium at each colony
4. **Infrastructure** — refineries, shipyards, stations (placed on bodies)
5. **Regulatory state** — SCA rules, taxation rates, existing contracts
6. **Surveyed vs unsurveyed bodies** — what's been explored?

This fast-forward simulation uses the same economic rules the live game uses, just
compressed. The result is a plausible world state, not a random one.

## Supply Chain & Manufacturing

Resources don't teleport from asteroid to market. The supply chain is the game.

### The Full Chain

```
RAW EXTRACTION          PROCESSING              MANUFACTURING           CONSUMER
───────────────────────────────────────────────────────────────────────────────
Iron ore         →   Refined iron         →   Hull plating        →   Shipyard
Platinum ore     →   Refined platinum     →   Electronics         →   Colony
Water ice        →   H₂ + O₂ (fuel)      →   (consumed directly) →   Ships/stations
                     Purified water       →   Life support        →   Colony
Silicates        →   Glass/ceramics       →   Hab modules         →   Colony
Rare earth ore   →   Processed RE         →   Drive components    →   Shipyard
Volatiles        →   Chemical feedstock   →   Propellant          →   Ships
He-3 (gas giant) →   Fusion fuel          →   (consumed directly) →   Power plants
```

### Processing & Refining

Raw ore is nearly worthless. Value is created at each stage:
- **Mining rigs** extract raw ore (need equipment, power, crew/robots)
- **Refineries** process ore into usable materials (fixed installations on bodies)
- **Factories** turn materials into components (complex, need multiple inputs)
- **Shipyards** assemble components into ships (the ultimate manufactured good)

A mining corp that builds a refinery at their mining site captures more margin.
A corp that builds a shipyard controls who gets new ships and at what price.
Vertical integration is powerful but capital-intensive.

### Who Operates What

Any player or NPC corp can operate at any level of the chain:
- **Pure miner**: Extract and sell raw ore. Low margin, low capital requirement.
- **Integrated miner**: Extract + refine on-site. Better margin, needs refinery investment.
- **Hauler**: Own no mines. Buy processed materials, deliver to where they're needed.
- **Manufacturer**: Buy refined materials, produce components/ships. Sell to corps/colonies.
- **Conglomerate**: The whole chain. Massive capital, economies of scale, political power.

### Ship Manufacturing (not a menu — a supply chain)

Ships are not bought from a UI shop. They're built:

1. A **shipyard** (owned by a corp, located at a body) needs:
   - Hull plating (from refined iron)
   - Drive components (from rare earths)
   - Electronics (from platinum)
   - Hab modules (from glass/ceramics)
   - Fuel tankage (from refined metals)
2. The shipyard's owning corp sets the **price and queue**
3. Other corps place **orders** — pay upfront, wait for construction
4. Construction time depends on component availability and shipyard capacity
5. If a shipyard runs out of drive components, all orders stall until resupplied

This means:
- **Shipyard owners have power** — they choose who gets ships first
- **Supply disruptions cascade** — a platinum shortage → no electronics → no ships → fleet stagnation
- **A mining corp that controls rare earth supply controls the shipbuilding pace**
- **A corp can partner with a shipyard** — guaranteed component supply in exchange for priority orders or revenue share

## Governance & Contract Enforcement

The frontier needs law, but law needs enforcement. This creates interesting gameplay.

### Smart Contract Infrastructure

By 2058, cryptocurrency-based smart contract escrow is a solved problem. This
fundamentally changes what "contract enforcement" means — for most transactions,
you don't need to trust your counterparty at all. The code enforces the deal.

**How it works in-game:**

Contracts are on-chain programs with locked collateral. When conditions are met
(cargo delivered, verified by destination port transponder), funds release automatically.
No arbitration needed. No trust needed. No regulatory body needed for the common case.

```
DELIVERY CONTRACT (on-chain)
├─ Buyer deposits: 50,000 credits (locked in escrow)
├─ Seller bonds: 5,000 credits (performance guarantee)
├─ Conditions:
│   ├─ Cargo: 200 tons water ice
│   ├─ Destination: Port Kepler-7b
│   ├─ Deadline: Tau 2058.347
│   └─ Quality: ≥95% purity (verified by port assay scanner)
├─ On fulfillment: buyer escrow → seller, bond returned
├─ On deadline expiry: bond → buyer as compensation, escrow returned
└─ On partial delivery: pro-rata release based on tonnage delivered
```

**What smart contracts solve (no gameplay here — it just works):**
- Payment for delivered goods — automatic, trustless
- Simple delivery deadlines — binary pass/fail
- Collateral/bonds — locked, released by code
- Multi-party splits — revenue sharing agreements execute automatically
- Escrow for ship purchases — funds release when title transfers

### What Smart Contracts Can't Enforce

The interesting gameplay is in everything the blockchain CAN'T verify:

**1. Quality of goods in transit**
The contract says "200 tons water ice, ≥95% purity." The port scanner verifies on arrival.
But what if the cargo was contaminated in transit? What if the seller loaded 95% pure ice
but stored it next to volatile chemicals? The contract pays out — the scanner reads 94.8% —
bond is forfeit. Was it the seller's fault or a transit accident? The contract doesn't know.

**2. Exclusive dealing**
"I'll supply your refinery exclusively" can't be enforced on-chain because the blockchain
can't see what deals you make elsewhere. Exclusivity is reputation-based — if you're caught
supplying a competitor, the partnership dissolves but there's no automatic penalty.

**3. Non-compete and territory**
"Don't mine in the belt between 2.5–3.0 AU" — there's no on-chain mechanism to prevent
a ship from going somewhere. Territory claims are social/reputational, not code-enforced.

**4. Best-effort obligations**
"Prioritize our shipments during high-demand periods" — how does code measure "prioritize"?
These soft commitments are where trust, reputation, and relationships matter.

**5. Emergent situations**
Ship breaks down mid-transit. Contract deadline is impossible. The smart contract just
sees a missed deadline and forfeits the bond. There's no "act of God" clause in code.
This creates demand for insurance markets (also smart-contract-based, but with oracle
disputes).

**6. Physical interference**
What if someone sabotages your mining rig? What if a competitor "accidentally" parks their
ship in your planned docking slot? Code can't prevent meatspace interference.

### The System Commerce Authority (SCA) — Reimagined

With smart contracts handling routine enforcement, the SCA's role shifts from enforcer
to **standards body, data oracle, and dispute resolver for edge cases.**

**SCA Functions:**
- **Port certification**: Certifies port scanners and transponders as trustworthy oracles
  for on-chain contract verification. Uncertified ports can't trigger contract settlement.
- **Ship registration**: On-chain identity system. Links physical ships to wallet addresses.
  Required for contracts at certified ports.
- **Standards**: Defines cargo grades, purity standards, measurement units — the shared
  vocabulary that smart contracts reference.
- **Oracle disputes**: When port scanner readings are contested (calibration, tampering),
  SCA arbitrates. This is the one area they still have enforcement power.
- **Insurance regulation**: Certifies insurance DAOs, validates claim oracles.
- **Market data aggregation**: Aggregates prices across certified ports into a public feed.

**SCA does NOT do:**
- Contract enforcement (smart contracts handle this)
- Price setting (markets are free)
- Route assignment (anyone can fly anywhere)
- Direct taxation (but certified ports charge docking fees that fund SCA)

**SCA can be corrupted:**
- Large corps can lobby for scanner calibration standards that favor their ore grades
- Port certification can be denied to competitors' frontier stations (keeping them "uncertified")
- Insurance oracle disputes can be influenced

### The Trust Spectrum (Revised)

| Transaction type | Trust mechanism | Failure mode |
|-----------------|----------------|--------------|
| Spot delivery (certified port) | Smart contract escrow + port oracle | Scanner disputes, contamination |
| Spot delivery (uncertified port) | Smart contract but no oracle — buyer must manually confirm | Buyer claims non-delivery, no oracle to verify |
| Long-term supply agreement | Smart contract per shipment + reputational commitment | Soft terms (exclusivity, priority) unenforceable |
| Partnership / JV | Multi-sig treasury + reputation + mutual dependency | Messy dissolution, asset disputes |
| Frontier handshake | Reputation only, no on-chain record | No recourse. Welcome to the frontier. |

The gradient from "fully trustless" to "fully trust-based" creates natural gameplay zones:
- **Certified space**: Smart contracts + oracles. Nearly frictionless commerce. But fees, standards, docking costs.
- **Uncertified outposts**: Smart contracts work but settlement requires manual confirmation — slower, disputable.
- **Deep frontier**: No infrastructure for on-chain settlement. Pure reputation economy. High margin, high risk.

### PvP & Economic Conflict

No combat — conflict is economic. Smart contracts make overt fraud hard, so competition
is about strategy, not deception:

- **Undercutting**: Offer lower prices on a competitor's key route
- **Supply disruption**: Buy up all rare earths before a competitor's shipyard order fills
- **Vertical integration**: Build your own refinery, cut out the middleman
- **Market timing**: Exploit orbital windows — lock in delivery contracts when distances are
  short, fulfill when they're long (if you planned your fleet position ahead of time)
- **Shipyard control**: If you own the only shipyard, you decide who gets ships and when
- **Insurance plays**: Insure a high-risk route, then let a competitor take it while you
  profit from their failure via insurance DAO positions
- **Oracle manipulation**: Contest scanner readings on a competitor's delivery to delay
  their payment (costs SCA arbitration fees — a calculated move)
- **Port politics**: Lobby SCA to deny port certification to a competitor's frontier station,
  forcing their contracts to require manual confirmation (slower, less trustworthy)
- **Reputation warfare**: Consistently fulfill contracts the competitor abandoned.
  The market learns who's reliable.

## Workforce & Automation

### The AI/Robotics Question

By 2058, AI and robotics are mature. This affects the game economy:

- **Mining rigs** are mostly automated. Crew is 2–3 humans supervising dozens of robots.
- **Freighters** can be AI-piloted (cheaper operating cost, but slower decision-making in emergencies).
- **Refineries/factories** are heavily automated. Human labor is management and maintenance.
- **Colonies** need humans for governance, culture, services. Can't be fully automated.

### Labor as a Resource

Skilled workers are scarce in space:
- **Engineers**: Needed to build and maintain infrastructure. Recruited from colonies.
- **Pilots**: Human pilots handle complex maneuvers better than AI (warp transit edge cases). Premium cost.
- **Managers**: Each facility needs management. More facilities = more overhead.
- AI crew is cheaper but has limitations (can't improvise, vulnerable to novel situations).

This creates a strategic choice:
- **All-robot fleet**: Low operating cost, but brittle. One unexpected situation and you lose a ship.
- **Human crews**: Expensive, but resilient. Can handle pirates, equipment failures, first contact with unknowns.
- **Mixed**: Robots for routine runs, humans for high-value or frontier missions.

## Diplomacy & Relationships

### Inter-Corp Relations

Corps have relationships that affect gameplay:
- **Reputation**: Public score based on contract history. Affects who will do business with you.
- **Partnerships**: Formal agreements — exclusive supply deals, joint ventures, revenue shares.
- **Rivalries**: Emerge from competition. NPC corps remember who undercut them.
- **Debt**: Corps can borrow from each other. Defaulting damages relationships.

### Colony Relations

Each colony has an opinion of each corp based on:
- How reliably they've supplied essential goods (water, food, equipment)
- Whether they've invested in colony infrastructure
- Tax compliance
- Employment (colonies prefer corps that hire locals)

High colony reputation → priority docking, lower taxes, exclusive contracts.
Low reputation → fees, restrictions, eventually refused docking.

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

## Game Modes

### Single Player — Campaign

Real-time strategy on simulator time. Player vs AI corporations in a procedurally generated
system. The AI is always there — it IS the economy. Single player is just multiplayer
where all other players are NPCs.

- **Start**: One ship, one contract, starting colony. AI corps already operating.
- **Mid-game**: Fleet of 5–10 ships, established routes, competing for contracts.
- **End-game**: Market manipulation, monopolies, founding new colonies.
- **Win condition**: Control X% of system trade volume, or accumulate $X net worth, or
  be the first to complete a "megaproject" (e.g., build a station at the system's edge).
- **Difficulty**: System archetype (dense inner = forgiving, scattered = brutal) +
  number/aggression of AI corps.

### Multiplayer — Shared System

Same game, but some of the corporations are human players. The key insight: **the AI
corps and human players use the exact same interface.** An AI corp is just a decision
engine that calls the same fleet/market/contract APIs a human player does.

This means:
- Single player works day one (AI corps populate the economy)
- Multiplayer is "replace some AI corps with WebSocket connections"
- Mixed mode: 2 humans + 4 AI corps in the same system
- Spectator mode: watch AI corps compete (screensaver/demo mode)

### Multiplayer Architecture

**Authoritative server model** — the simulation runs on the server. Clients send commands
(assign ship, accept contract, buy/sell), server validates and broadcasts state updates.

```
Client (browser)                    Server
  ├─ Three.js rendering              ├─ Orbital engine (same orbits.js)
  ├─ UI / input                      ├─ Economy tick
  ├─ Local prediction                ├─ AI corp decision loops
  └─ WebSocket ←──────────────────→  ├─ Contract generation
                                     ├─ Fleet state for all players
                                     └─ WebSocket broadcast
```

Why this works well for our game:
- **Orbital mechanics is deterministic.** Given a time T, all body positions are the same
  for every client. No need to sync positions — just sync T and each client computes locally.
- **Actions are infrequent.** Players issue commands (assign route, buy cargo) maybe once
  per real-time minute. Not a twitch game — low bandwidth.
- **Time can be paused in single player, voted on in multiplayer.** Speed controls become
  a consensus mechanism: game runs at the slowest player's preferred speed, or majority vote.

### Server tech options

- **Lightweight**: Node.js + WebSocket (ws). The orbital engine is already JS — `orbits.js`
  runs identically on server. No port needed.
- **Persistence**: Game state serialized to JSON. SQLite or flat file for save/load.
  No heavy database needed — the entire game state is: fleet positions, cargo, money,
  market prices, contract list. Small enough for localStorage in single player.

### Async / Turn-based variant

For players in different timezones: the game runs on server time (1 real hour = X game days).
Players log in, issue orders, log out. Ships execute routes. Market ticks. Contracts expire.
Check back later to see results. Like a slower Ogame/Travian but with real orbital mechanics.

## AI Corporations (NPCs)

AI corps are first-class entities — same state structure as human players. They make the
economy feel alive in single player and fill seats in multiplayer.

### AI decision model

Each AI corp has a personality (risk tolerance, specialization, aggression) and runs a
simple decision loop each game tick:

```
1. Evaluate available contracts (filter by ship capability and time feasibility)
2. Estimate profit: (contract pay) - (fuel cost) - (opportunity cost of ship time)
3. Check market prices: any arbitrage opportunities? (buy cheap at A, sell expensive at B)
4. Assign idle ships to best opportunity
5. Consider fleet expansion: if profitable routes > available ships, buy another
6. Occasionally: found a new colony if sitting on enough capital
```

### AI personality archetypes

- **Hauler**: Prefers safe, reliable delivery contracts. Avoids speculation. Builds large fleet.
- **Prospector**: Focuses on exploration and mining. First to reach new bodies. Volatile income.
- **Trader**: Plays the market — buys low, sells high. Few ships but high margins.
- **Monopolist**: Aggressive — undercuts competitors on key routes, tries to corner markets.
- **Frontier**: Targets distant, high-value bodies. Long transits, big payoffs. High risk.

### Why AI-first design matters

Building the AI corps BEFORE multiplayer means:
1. The economy works in single player from day one
2. The game API is proven (if AI can play, humans can play)
3. Multiplayer is just "swap an AI decision loop for a WebSocket"
4. AI corps handle the boring parts (baseline trade volume, price stability)
5. Balance testing is automated — run 8 AI corps overnight, check if economy collapses

## Open Questions

- **Campaign length?** How many game-years before "winning"? Or is it endless sandbox?
- **Name generation?** Procedural star/body names? Or let player name discoveries?
- **Tutorial?** The orbital mechanics learning curve is steep. Guided first contract?
- **Mobile?** Three.js works on mobile but the UI density is challenging.
- **Sound?** Ambient, notification sounds, engine hum during transit?
- **Lobby system?** How do multiplayer games get created and joined?
- **Anti-griefing?** Can a player sabotage others' routes? Ram ships? Or is competition purely economic?
- **Alliances?** Can players form corporations together? Shared fleet, shared revenue?

## Development Phases

### Phase 1: Core Game Loop (single player, AI economy)
1. Procedural system generator (star + 15–25 bodies with orbits and resources)
2. Resource model on bodies (composition, quantity)
3. Single ship with cargo hold
4. Two AI colonies with buy/sell markets
5. Delivery contracts with deadlines
6. Money counter
7. One AI corporation competing for contracts
8. Win condition: accumulate $X net worth

### Phase 2: Depth (still single player)
1. Ship upgrades (engine, drive, cargo, mining equipment)
2. Fleet expansion (buy additional ships, assign to routes)
3. More AI corporations with different personalities
4. Market dynamics (supply/demand price shifts)
5. New colony founding
6. Exploration contracts (discover body composition)

### Phase 3: Multiplayer
1. Server-side simulation (Node.js, same orbital engine)
2. WebSocket protocol (commands up, state diffs down)
3. Lobby / game creation
4. Mixed mode (humans + AI corps)
5. Time control consensus (speed voting)

### Phase 4: Polish
1. Sound design
2. Tutorial / guided first game
3. Leaderboards
4. Async / turn-based mode
5. Mobile layout
