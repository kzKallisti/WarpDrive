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

### Playability Constraints

- At least one body in the habitable zone (starting colony)
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

| Resource | Found on | Used for |
|----------|----------|----------|
| Iron/Nickel | Rocky bodies, M-type asteroids | Hull plating, structural frames |
| Platinum group | Rocky bodies, M-type asteroids | Electronics, sensor arrays |
| Water ice | Icy moons, C-type asteroids, comets | Fuel (H₂/O₂), life support |
| Rare earths | Rocky bodies, some asteroids | Drive components, actuators, superconductors |
| Silicates | S-type asteroids, rocky bodies | Glass/ceramics, optics, hab modules |
| Volatiles | Comets, icy bodies, gas giant moons | Propellant, polymers, chemical feedstock |
| Helium-3 | Gas giant atmospheres (via moons) | Fusion fuel (endgame) |
| Copper/Aluminum | Rocky bodies | Wiring, antenna arrays |
| Uranium/Thorium | Rocky bodies, some asteroids | Fission reactor fuel |

Resource quantity scales with body radius³ (volume proxy). Large bodies have more
resources but deeper gravity wells — more expensive to leave.

### Power

Every facility, colony, and ship needs power. Power generation is distance-dependent,
creating a fundamental economic gradient across the system.

**Solar power**: Cheap, zero fuel cost, but output falls off with the inverse square of
distance from the star. At 1 AU, a solar array is efficient. At 5 AU (Jupiter), output
is 4% of that. At 30 AU (Neptune), 0.1%. Solar is dominant in the inner system and
useless in the outer system.

**Fission reactors**: Reliable at any distance. Fuel is refined uranium/thorium (rare
earth supply chain). Moderate output. Standard for outer system facilities and crewed
stations. Needs periodic refueling and maintenance.

**Fusion reactors** (He-3): Endgame power source. Enormous output, compact, long-lived.
Requires He-3 fuel from gas giant moons — the most expensive resource to extract. A
facility with a fusion reactor has effectively unlimited power but the fuel supply chain
is a major ongoing cost.

**Ship power**: All ships run fission reactors (can't depend on solar during warp or at
arbitrary distances). Reactor quality is a ship stat — better reactors mean more power
for drives, sensors, and life support. Reactor fuel is a consumable that limits
operational range independent of propellant.

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
Water ice        →   H₂ + O₂ (fuel)      →   (consumed)          →   Ships
                     Purified water       →   Life support        →   Colonies
Silicates        →   Glass/ceramics       →   Hab modules         →   Colonies
                                          →   Optics              →   Relays, Sensors
Rare earth ore   →   Processed RE         →   Drive components    →   Shipyard
                                          →   Actuators           →   Drone factory
                                          →   Superconductors     →   Relays, Power
Volatiles        →   Chemical feedstock   →   Propellant          →   Ships
                                          →   Polymers            →   Drones, Habs
He-3 (gas giant) →   Fusion fuel          →   (consumed)          →   Fusion reactors (endgame)
Copper/Aluminum  →   Refined conductor    →   Wiring              →   Everything
                                          →   Antenna arrays      →   Relays
Uranium/Thorium  →   Reactor fuel rods    →   (consumed)          →   Fission reactors (ships, stations)
```

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

### Smart Contract Escrow

Trustless commerce is the backbone. Buyer locks funds in escrow; port scanner confirms
delivery; funds release automatically. No arbitration needed for the happy path.

Contracts handle: payment on delivery, deadline enforcement (bond forfeit on expiry),
multi-party revenue splits, escrow for purchases.

Contracts CAN'T handle: quality disputes (contamination — whose fault?), exclusive
dealing (can't prevent off-chain deals), territory claims (social, not code-enforced),
acts of god (ship breakdown), what's actually in the cargo hold.

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
| Hull length | Cargo capacity, tidal tolerance | `SHIP_LENGTH_KM` |
| Fuel capacity | Max range without refueling | New field |
| Mining equipment | Extraction rate | New field |
| Reactor | Power output, fuel consumption rate | New field |
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

### Fleet Management

The single-ship state extends to a fleet:

```js
state.fleet = [
  { id: 'ship-1', route: [...], jumpIndex: 0, elapsed: 0, cargo: {...}, ... },
  { id: 'ship-2', route: null, docked: 'Ceres', cargo: {...}, ... },
];
```

Each ship gets its own transit tick. Camera can track any ship.

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

**Time speed:** Set per-lobby. Default 10x. Host controls speed, or majority vote.

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

## 14. Technical Architecture

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

## 15. Open Questions

- **Combat balance**: What prevents the richest corp from dominating through force?
  Coalitions? Diminishing returns on military spending? Insurance making piracy
  net-negative?
- **Mercenaries**: Can corps hire NPC military outfits for deniable operations?
- **Campaign length**: How many game-years constitute a "satisfying" sandbox session?
  Is there a soft endpoint or do games run indefinitely?
