# WarpDrive: Asteroid Mining Tycoon

## Concept

Asteroid mining tycoon set in procedurally generated solar systems. Each new game creates a unique star with orbiting bodies — planets, moons, asteroids, comets — with real Keplerian orbital mechanics. The player builds a mining and shipping empire by exploiting orbital dynamics: timing launch windows, managing transit costs driven by gravity wells, and running trade routes across a living system where everything moves.

**Core thesis: orbital mechanics IS the economy.** Physics creates natural scarcity, timing pressure, and strategic depth without artificial game mechanics. A player who understands launch windows and gravity wells outperforms one who brute-forces routes.

**The player is a corporation.** Not a pilot, not a colonist — a corporate entity that
owns ships, facilities, and contracts. The player makes strategic decisions: where to
mine, what to build, which routes to run, who to partner with. Ships and drones execute.
Human crews and AI managers operate facilities. The player is the board of directors.

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
                                          →   Structural frame    →   Station/Hab builder
Platinum ore     →   Refined platinum     →   Electronics         →   Everything (universal input)
                                          →   Sensor arrays       →   Ships, Comms relays
Water ice        →   H₂ + O₂ (fuel)      →   (consumed directly) →   Ships/stations
                     Purified water       →   Life support        →   Colony
Silicates        →   Glass/ceramics       →   Hab modules         →   Colony, Station
                                          →   Optics              →   Comms relays, Sensors
Rare earth ore   →   Processed RE         →   Drive components    →   Shipyard
                                          →   Actuators/motors    →   Drone factory, Mining rigs
                                          →   Superconductors     →   Comms relays, Power systems
Volatiles        →   Chemical feedstock   →   Propellant          →   Ships
                                          →   Polymers            →   Drone factory, Hab modules
He-3 (gas giant) →   Fusion fuel          →   (consumed directly) →   Power plants
Copper/Aluminum  →   Refined conductor    →   Wiring/cabling      →   Everything (universal input)
                                          →   Antenna arrays      →   Comms relays
```

### Processing & Refining

Raw ore is nearly worthless. Value is created at each stage:
- **Mining rigs** extract raw ore (need equipment, power, crew/robots)
- **Refineries** process ore into usable materials (fixed installations on bodies)
- **Factories** turn materials into components (complex, need multiple inputs)
- **Assembly facilities** put components together into final products

A mining corp that builds a refinery at their mining site captures more margin.
Vertical integration is powerful but capital-intensive.

### Manufacturing Sectors

#### Ship Manufacturing

Ships are not bought from a UI shop. They're built at **shipyards**:

1. A shipyard (owned by a corp, located at a body) needs:
   - Hull plating (from refined iron)
   - Drive components (from rare earths)
   - Electronics (from platinum)
   - Hab modules (from glass/ceramics)
   - Fuel tankage (from refined metals)
   - Wiring/cabling (universal input)
2. The shipyard's owning corp sets the **price and build queue**
3. Other corps place **orders** via smart contract escrow — pay on delivery
4. Construction time depends on component availability and shipyard capacity
5. If a shipyard runs out of drive components, all orders stall until resupplied

Ship classes built from the same components but in different proportions:
- **Scout**: Light hull, big drive, small cargo. Fast, cheap, low capacity.
- **Freighter**: Heavy hull, standard drive, huge cargo. Slow, expensive, bulk hauler.
- **Mining vessel**: Medium hull, mining equipment mounts, ore processing bay.
- **Tanker**: Specialized fuel transport. Critical for frontier refueling.

#### Drone & Robotics Manufacturing

Drones are the workforce multiplier. **Drone factories** produce:

- **Mining drones**: Autonomous extractors. Deploy at an asteroid, they mine and stockpile.
  Need: actuators, electronics, structural frame, polymers.
- **Survey drones**: Sent to unsurveyed bodies to determine composition. Cheap, expendable.
  Need: sensor arrays, electronics, propellant.
- **Maintenance drones**: Keep stations and rigs operational. Reduce crew requirements.
  Need: actuators, electronics, polymers, tools (sub-component).
- **Construction drones**: Build stations, refineries, habs. Slow but no crew risk.
  Need: actuators, structural frames, electronics, welding units (sub-component).

Drones wear out. They need replacement parts (same components as manufacturing).
A drone fleet is an ongoing operating cost, not a one-time purchase.

**Strategic implications:**
- Drone factories need the same rare earths as shipyards (actuators vs drive components).
  There's a genuine resource tension between building ships and building drones.
- A corp with a drone fleet can mine unmanned asteroids — no life support, no crew risk.
  But drones are dumb: they can't handle unexpected situations (equipment failure, unusual
  geology). Human-supervised mining is slower to set up but more adaptive.
- Drone factories are simpler than shipyards (smaller, cheaper). Good mid-game investment.

#### Ship Parts & Components Manufacturing

Between raw refining and final assembly, there's a component manufacturing layer:

**Component factories** (smaller than shipyards, more specialized):
- **Drive works**: Rare earths + superconductors → drive components. The bottleneck.
- **Electronics fab**: Platinum + silicates (optics) → electronics, sensor arrays. Universal demand.
- **Structural mill**: Iron + polymers → hull plating, structural frames. High volume, low margin.
- **Hab works**: Glass/ceramics + polymers + life support systems → hab modules. Colony demand.
- **Actuator plant**: Rare earths + electronics → actuators/motors. Drone and rig demand.

A corp can specialize: "We just make drive components." Sell to every shipyard in the system.
High demand, rare earth supply is the constraint. This is a powerful niche position.

### Communications Infrastructure

Information moves at light speed. In a system where bodies are AU apart, that means
**comms latency is a gameplay mechanic.**

#### The Problem

- Earth to Mars at opposition: ~3 minute light delay
- Earth to Jupiter: ~35–50 minutes
- Earth to Neptune: ~4+ hours
- Earth to outer system (100+ AU): half a day or more

Market prices, contract offers, fleet status — all information is delayed by the time
it takes light to cross the system. A player at Jupiter sees Earth's market prices as
they were 40 minutes ago. By the time their sell order arrives, the price may have moved.

#### Communications Relays

**Comms relays** are infrastructure that players/corps can build:

- **Relay beacon**: Placed at a body or Lagrange point. Amplifies and routes signals.
  Doesn't reduce light-speed delay, but ensures signals reach their destination
  (without relays, distant bodies may be in radio shadow behind the star).
- **Network coverage**: More relays = more reliable signal routing. Redundant paths
  mean no single relay failure blacks out a region.
- **Relay ownership**: The corp that builds a relay controls it. They can:
  - Charge other corps for relay access (bandwidth fees)
  - Prioritize their own traffic (see price updates before competitors)
  - Deny access to specific corps (information warfare)
  - Sell relay capacity as a service (telecom business model)

**Relay components**: Antenna arrays + electronics + superconductors + power systems.
Expensive to build, cheap to maintain. A relay network is a long-term infrastructure play.

#### Relay Trust Model

Relays don't need to be trusted. Like Nostr, every message is cryptographically signed
at the source by the sender's keypair. A relay is dumb infrastructure — it forwards
signed messages, nothing more. Verification happens at the receiver, not the relay.

- **Identity**: Every corp, colony, port, and SCA node has a public key. Messages are
  signed. You can verify a price quote from Earth whether it arrived through your own
  relay, a competitor's relay, or bounced off six relays in sequence.
- **No spoofing**: A relay operator can't forge a message from another entity. They can
  only delay, drop, or refuse to forward. The worst a hostile relay can do is censor.
- **Censorship resistance**: If one relay path drops your messages, route through another.
  More relays = more redundant paths = harder to censor.
- **Relay incentive**: Relays charge forwarding fees (micropayments per message, settled
  on-chain). A relay at a strategic location earns passive income from traffic volume.
  No need to manipulate — honest forwarding is the business model.

What relay owners DO control:
- **Coverage**: If you're the only relay within range of a frontier body, you're the
  only pipe. You set the fee. Monopoly pricing on bandwidth, not on truth.
- **Priority**: You can prioritize your own corp's traffic. Your price updates arrive
  a few seconds before everyone else's. Not spoofing — just faster delivery of real data.
- **Uptime**: Your relay, your maintenance. If it goes down, everyone routing through
  it loses connectivity until they find an alternate path.

#### Information Asymmetry as Gameplay

Comms delay means **information is a tradeable advantage**, but the asymmetry is
about speed and coverage, not about truth:

- A corp with relays near Jupiter gets Jupiter market data 40 minutes before a corp
  relying on direct Earth-Jupiter transmission with no local relay.
- Frontier bodies with no relay coverage are information dark zones — prices are
  unknown until a ship physically visits and reports back.
- A corp can build a relay at a strategic location and earn fees from every message
  that routes through it. Telecom as a business.
- **No one can lie about prices** — but they can be the first to see them. In a market
  where prices move, being 40 minutes ahead of your competitor is worth real money.

#### Command Centers & Player Presence

The player sees everything (omniscient camera) but acts through **command centers** —
physical installations where their orders originate. Orders propagate at light speed
from the nearest command center to the target.

**Headquarters**: Your starting command center. Located at the homeworld colony. All
orders originate here at game start.

**Remote command centers**: As you grow, you can build additional command centers at
other colonies/stations. Each one gives you local-speed reaction time in its region.

- Building a command center requires: hab modules, electronics, comms relay, power.
  Comparable cost to a small factory. Significant mid-game investment.
- When you issue an order (assign ship, accept contract, buy/sell), it originates
  from the nearest command center to the target. The game shows you the latency
  before you confirm: "This order will arrive in 12m 34s. Confirm?"
- **Standing orders** execute at local speed regardless of command center distance.
  "Sell platinum whenever price > 500/ton" runs on the local port's smart contract
  engine. No latency. But standing orders can't adapt to context — they're dumb.

**Strategic implications:**
- Early game: one HQ, slow reaction everywhere except home. Favors local operations.
- Mid game: build a command center at your busiest remote region. Suddenly competitive there.
- Late game: network of command centers across the system. Near-instant reaction everywhere.
  But each one costs capital and ongoing maintenance (crew, power, supplies).
- **Placement is permanent** (expensive to relocate). Choose wrong and you've sunk capital
  into a region that dried up.
- Competitors' command center locations are visible (they're physical installations).
  You can see where they have fast reaction and where they're slow.

**Why this is fun (not frustrating):**
- Comms delay is a **planning and investment** problem, not a waiting problem. You're
  making strategic infrastructure decisions ahead of time, not staring at a timer.
- At game speed (100x–10,000x), a 40-minute light delay is seconds of real time.
  The delay is felt in missed opportunities and suboptimal order timing, not in
  literal waiting.
- Standing orders give you a zero-latency escape hatch for routine operations.
  The delay only bites when you need to make a novel decision remotely.
- Building a command center at a new location feels like "unlocking" a region —
  a tangible progression reward.

#### Smart Contracts and Latency

This interacts with the contract system:
- A contract offer broadcast from Earth takes 40 minutes to reach Jupiter.
  By the time a Jupiter-based corp accepts, someone closer may have already taken it.
- "Accept" messages propagate at light speed too. First-to-accept wins, determined
  by arrival time at the contract's originating node.
- This creates **natural geographic advantages** — corps based near contract-rich
  colonies react faster to opportunities. Frontier corps trade speed for margin.
- All of this is cryptographically verifiable — timestamps are signed, arrival order
  is deterministic from physics. No disputes about "who accepted first."

### Who Operates What

Any player or NPC corp can operate at any level of the chain:
- **Pure miner**: Extract and sell raw ore. Low margin, low capital requirement.
- **Integrated miner**: Extract + refine on-site. Better margin, needs refinery investment.
- **Hauler**: Own no mines. Buy processed materials, deliver to where they're needed.
- **Component manufacturer**: Buy refined materials, produce components. Sell to assemblers.
- **Shipbuilder**: Operate a shipyard. Control who gets ships and when.
- **Drone manufacturer**: Produce the workforce. Every mining corp is a customer.
- **Telecom**: Build and operate comms relays. Sell bandwidth and market data.
- **Conglomerate**: The whole chain. Massive capital, economies of scale, political power.

## Governance & Contract Enforcement

The frontier needs law, but law needs enforcement. This creates interesting gameplay.

### Design Principle: No Game-Rule Restrictions

Nothing in the game is forbidden by code. There is no "you can't attack here" flag
on a port. There is no "this corp is protected" status. Every restriction is enforced
by economics, physics, and the political choices of other entities in the system.

You CAN attack a ship at a major colony's port. But:
- The port has defense drones (proportional to its wealth and population)
- Every ship present has transponder logs with your cryptographic identity
- Every colony in the system will see the evidence within light-hours
- Your colony standings will crash across the board
- Other corps may collectively blacklist you
- If you damaged colony infrastructure, the entire local population hates you

None of that is a game rule. It's emergent from systems that exist for other reasons
(transponders exist for navigation, colony standing exists for labor markets, defense
drones exist because colonies invest in security). The consequence space is the
enforcement mechanism.

A player who attacks a major port and somehow survives the defenses, escapes the
political fallout, fences the stolen cargo through frontier contacts, and rebuilds
their reputation over years of clean operations — that's not an exploit. That's a
great story.

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

### Governance is Local and Plural

There is no single system-wide authority. Authority is local, fragmented, and emergent —
just like the real frontier. Each colony governs itself, and larger structures (if they
exist) are voluntary associations, not sovereign states.

#### Colony Governance Types

Each colony has a governance model that affects how corps operate there. The generator
assigns these based on founding history, population, and which corp(s) established it.

**Independent Colony** (self-governing)
- Elected council or direct democracy
- Sets own taxes, docking fees, environmental standards, defense budget
- Corps are tenants with negotiated terms
- Most common at established settlements with diverse populations

**Company Town** (corp-controlled)
- Founded by a corp, governed by that corp
- Low taxes for the owning corp, higher for competitors (or access denied entirely)
- Workers are employees, not citizens — limited labor mobility
- Efficient but brittle: if the owning corp collapses, the colony is stranded
- Common in frontier mode — first corp to build a hab calls the shots

**Consortium** (multi-corp cooperative)
- Several corps jointly govern, usually the founding members
- Decisions by vote weighted by investment
- Shared infrastructure costs, shared defense
- Stable but slow to decide anything — consensus is hard
- Common at strategic locations where multiple corps need access

**Free Port** (minimal governance)
- No taxes, no regulations, no questions asked
- Attracts frontier operators, smugglers (of "hot" stolen cargo), and risk-takers
- No defense investment — you're on your own
- Market is active but unverified — no port oracles for contract settlement
- Dangerous but lucrative for those who can handle it

#### Alliances & Confederations

Colonies and corps can form larger structures voluntarily:

**Trade Confederations**: Multiple colonies agree on shared standards (cargo grades,
measurement units, scanner calibration) so contracts are interoperable. A confederation
might share a port oracle standard, making automatic contract settlement work across
member colonies. Not a government — just a standards agreement. Think ISO, not NATO.

**Defense Pacts**: Colonies agree to mutual defense. Attack one, and the others'
defense drones respond (within light-speed delay). Expensive — each colony contributes
to a shared defense fund. But a pact of 5 colonies is much harder to pirate near than
5 independent ones.

**Corporate Alliances**: Corps can form alliances — shared intelligence, mutual trade
preferences, coordinated pricing. Not enforced by code (can't put "be nice to my ally"
in a smart contract). Pure reputation and mutual benefit. Betrayal is always possible.

#### The SCA (one possible institution, not guaranteed)

In Established/Late Stage start modes, a **System Commerce Authority** may exist as
a voluntary trade confederation that's grown powerful enough to feel like a governing
body. But it's not inherent to the game — it's an emergent institution.

**What the SCA actually is (when it exists):**
- A confederation of the largest/oldest colonies
- Sets widely-adopted standards (cargo grades, scanner calibration, ship registration)
- Operates a shared port oracle network (member colonies' scanners are cross-certified)
- Publishes aggregated market data
- Arbitrates disputes between member colonies
- Maintains a shared bounty board for piracy (funded by member dues)

**What it isn't:**
- A sovereign government (can't make laws, only standards)
- Universal (frontier colonies and free ports aren't members)
- Militarily powerful (no fleet — relies on member colonies' individual defenses)
- Incorruptible (largest corps have disproportionate influence over standards)

**In Frontier mode, the SCA doesn't exist yet.** The player might witness (or participate
in) its founding as colonies start cooperating. Or it might never form — the system
might stay fragmented. This emerges from gameplay, not from the scenario script.

#### Governance and the Procedural Generator

The generator doesn't place a fixed governance structure. It simulates colony founding
and growth, and governance types emerge from the simulation:

- First corp at a body → company town (by default)
- Second corp arrives → negotiation: consortium, or competitor builds nearby
- Population grows → pressure for independent governance (workers want a voice)
- Multiple independent colonies → trade confederation forms (shared standards are useful)
- Confederation grows → may adopt the name "System Commerce Authority" or equivalent

Different procedural seeds produce different political landscapes. One system might
have a dominant SCA. Another might be fragmented into rival confederations. Another
might be a patchwork of company towns and free ports with no overarching structure.

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

## Workforce, Population & Life Support

### Colonies vs Corps

A colony is a **place** — shared infrastructure (port, life support, hab space, governance)
on a body. A corp is a **tenant** — they lease dock space, build facilities, hire workers,
and operate within the colony.

Multiple corps can operate at one colony:
- Shared port (docking fees, not exclusive)
- Shared life support and hab infrastructure (colony provides, corps pay rent)
- Separate facilities (your refinery, their shipyard — both at the same colony)
- Shared labor pool (colony workers can be hired by any corp present)
- Shared market (buyers and sellers are co-located — competitive pricing)
- Colony governance sets local rules: tax rates, environmental standards, docking priority

A corp can have presence at many colonies simultaneously. A colony can host many corps.
This is a many-to-many relationship, not ownership.

**Who "owns" a colony?**
- In established modes: the colony is self-governing. Corps are tenants.
- In frontier mode: the first corp to build a hab at a body effectively founds the colony.
  They set initial rules, but as other corps arrive, governance becomes shared or contested.
- A corp can build a **private facility** on an uninhabited body — this is NOT a colony.
  It's a corporate installation (drone outpost, private station). No shared infrastructure,
  no docking for others unless the owner permits it.

**Colony vs private installation:**

| | Colony | Private installation |
|---|--------|---------------------|
| Governance | Self-governing or charter | Owner controls |
| Docking | Open (with fees) | Owner's discretion |
| Market | Public, competitive | Private/negotiated |
| Labor pool | Shared | Owner's crew only |
| Expansion | Any corp can build facilities | Owner only |
| SCA oversight | Yes (if certified) | Minimal |

The tension: colonies are better for commerce (shared market, labor pool, infrastructure)
but you share the space with competitors. Private installations are yours alone but you
bear all costs and have no local market.

### Colony Types

Not all settlements are the same. The human presence (or absence) determines what a
colony needs, what it can produce, and how it behaves in the economy.

**Drone Outpost** (unmanned)
- Fully automated mining/refining operation
- No life support costs, no food, no hab modules needed
- Requires: power, maintenance drones, periodic resupply of replacement parts
- Limitation: can't handle novel situations. If geology is weird or equipment fails
  in an unexpected way, the outpost stops and waits for a human visit.
- No population growth. No local market. Pure extraction node.
- Cheap to establish, limited upside.

**Crewed Station** (small human presence, 10–200 people)
- Human supervisors + drone workforce
- Needs: food, water, air (life support consumables), hab modules, medical supplies
- Capable of: adapting to problems, making on-site decisions, light manufacturing
- Small local market for crew amenities (entertainment, personal goods — minor economy)
- Can upgrade to full colony if population grows

**Colony** (established settlement, 200–50,000 people)
- Self-sustaining workforce with families, services, governance
- Needs: everything. Full supply chain of consumables.
- Produces: skilled labor, local services, culture, governance
- Has a real market with diverse demand
- Can house shipyards, factories, drone plants
- Population grows if well-supplied, shrinks if neglected

**City** (major settlement, 50,000+ people)
- Economic hub. Generates contracts, has deep markets, diverse industry
- Mostly self-sufficient in basic goods but imports specialty items and raw materials
- Exports: manufactured goods, skilled labor, financial services
- Political power — can lobby SCA, influence system-wide policy
- Only appears in Established/Late Stage start modes or after decades of growth

### The Human Supply Chain

Humans need to eat, breathe, and not die. This creates an entire parallel economy:

```
FOOD CHAIN
──────────────────────────────────────────────────────────
Hydroponics bays  →  Raw produce      →  Colony food supply
  (need: water, power, nutrients,        (need: regular deliveries
   grow modules, agricultural drones)     or local production)

Protein synthesis  →  Synthetic protein →  Colony food supply
  (need: chemical feedstock from          (shelf-stable, shippable,
   volatiles, power, biotech equipment)    less palatable but reliable)

Earth/Homeworld   →  Premium food      →  Luxury market
  imports              (real agriculture)    (high price, morale boost)
```

```
LIFE SUPPORT CHAIN
──────────────────────────────────────────────────────────
Water ice          →  Purified water    →  Drinking, agriculture,
                                           industrial coolant
Water electrolysis →  O₂               →  Atmosphere
                  →  H₂               →  Fuel, chemical feedstock
CO₂ scrubbers     →  (need: chemical   →  Atmosphere recycling
                       filters, power)
Medical supplies   →  (manufactured     →  Colony health
                       from biotech +       (population growth rate
                       chemical feedstock)    depends on medical access)
```

**Food as a strategic resource:**
- A colony that can't feed itself is dependent on imports — and the corps that supply food
  have enormous leverage.
- A corp that controls food supply to a colony controls the colony's workforce availability.
- Hydroponics can be built locally but takes time and resources. Until then, the colony
  imports or starves.
- Frontier outposts with human crews need regular food shipments. Miss a delivery and
  crew morale drops → productivity drops → eventually they evacuate.

### Crew & Labor Economics

**Humans are expensive but irreplaceable for certain tasks:**

| Role | Monthly cost | What they do | Drone alternative? |
|------|-------------|-------------|-------------------|
| Engineer | High | Build/repair complex systems, handle novel failures | Maintenance drones (routine only) |
| Pilot | High | Navigate edge cases, warp transit decisions, emergency response | AI pilot (cheaper, slower reactions) |
| Geologist | Medium | Assess deposits, optimize extraction | Survey drones (surface only, miss subsurface) |
| Manager | Medium | Run facilities, negotiate, make strategic decisions | No alternative |
| Medic | Medium | Keep crew alive | Telemedicine from colony (delayed by light-speed) |
| Worker | Low | General labor, loading, maintenance | Construction/mining drones |

**Crew needs (per person per month):**
- Food: ~0.05 tons (hydroponics produce or imported)
- Water: ~0.1 tons (recycled at 95% efficiency, need 5% resupply)
- Air: negligible if recycling works; catastrophic if it doesn't
- Hab space: 1 hab module per ~10 crew
- Medical: 0.01 tons medical supplies
- Morale: entertainment, communication with home, shore leave rotation

**The drone-vs-human calculus:**
- **Drone outpost**: Zero crew cost, but can't adapt. Works for routine extraction of known deposits.
- **Human-supervised**: 3–5 crew supervising 50 drones. Expensive but handles surprises. Best for new/complex sites.
- **Full crew**: 20+ humans. Maximum flexibility, maximum cost. For shipyards, factories, complex operations.
- **The trap**: Going all-drone saves money until something goes wrong. Then you need to send humans on a multi-week transit to fix it. Opportunity cost can dwarf the savings.

### Labor Relations & Colony Standing

Workers aren't a commodity you buy — they're people who live at a colony and choose
where to work. A corp's ability to hire depends on its **colony standing**: a composite
score reflecting how the local population perceives the corp.

**Colony standing is affected by:**
- **Wages**: Pay above colony average → attracts workers. Below → hemorrhages them.
- **Safety record**: Crew deaths, accidents, drone malfunctions near populated areas.
  One bad incident tanks standing for months.
- **Environmental impact**: Mining operations near a colony generate waste heat, dust,
  vibration, radiation risk. Colonies care about their habitat.
- **Investment**: Did you build infrastructure that benefits the colony? (Power plants,
  hab modules, medical facilities.) Colony remembers.
- **Supply reliability**: If you're the corp that keeps the water flowing, you're popular.
  If you're the corp that let food shipments lapse, you're not.
- **Employment**: More local jobs = more standing. Replacing human workers with drones
  when the colony has unemployment will cost you.

**Standing effects:**

| Standing | Hiring | Docking | Taxes | Other |
|----------|--------|---------|-------|-------|
| Excellent | Priority hiring, best talent | Priority slots | Tax breaks | Colony council consults you on policy |
| Good | Full access to labor pool | Normal | Standard | — |
| Neutral | Hire at market rate | Normal | Standard | — |
| Poor | Hiring penalty (workers avoid you) | Deprioritized | Surcharge | Protests reduce facility output |
| Hostile | Can't hire locals | Docking denied | — | Forced to evacuate facilities |

**The productivity-liquidity tradeoff:**
- Happy workers (high wages, good conditions, benefits) → high productivity, low turnover.
  But labor is your biggest operating cost. Overpaying erodes margins.
- Lean operations (low wages, skeleton crew, all-drone where possible) → more cash on hand,
  faster expansion. But high turnover, accidents, colony resentment.
- The optimal point depends on context: in a labor-scarce frontier colony, you MUST pay well
  or nobody works for you. In an established city with unemployment, you have leverage.

**Environmental & ecosystem dynamics:**

Colonies exist in fragile artificial ecosystems — pressurized habs, recycled atmosphere,
managed water cycles. Corporate activity can threaten this:

- **Mining near a colony**: Dust, vibration, risk of hull breach from blasting. Colony
  governance may impose setback distances, noise limits, or outright bans.
- **Refinery emissions**: Chemical processing produces waste gases and heat. Must be
  vented away from hab zones. Improper venting → environmental incident → standing crash.
- **Water contamination**: Mining runoff or refinery discharge near water recycling intake
  is catastrophic for a colony. Severe standing penalty, potential SCA intervention.
- **Orbital debris**: Careless ship operations (jettisoned cargo, failed drones) near a
  colony create collision hazards. Colony governance tracks this.

**Corps can choose how to operate:**

- **Clean operations**: Invest in containment, waste processing, setback compliance.
  Higher capital cost, slower setup, but maintains colony standing and avoids fines.
- **Cut corners**: Cheaper, faster, but accumulates environmental incidents. Works in
  the short term at frontier outposts with weak governance. Blows up in your face at
  established colonies with active SCA oversight.
- **Off-site operations**: Build your refinery on an uninhabited body nearby, ship
  processed materials to the colony for sale. No environmental friction, but transit cost.

The interplay: a corp that invests in clean operations AND pays well AND supplies the
colony reliably becomes a **pillar of the community**. Colony governance gives them
favorable treatment. Other corps have to compete against that embedded advantage.
The first corp to build deep relationships with a colony has a moat.

### Population Dynamics

Colonies grow or shrink based on conditions:

```
Population growth rate = base_rate
  × food_satisfaction      (0–1, drops below 1 if food supply < demand)
  × medical_access         (0–1, depends on medical supply and facilities)
  × economic_opportunity   (0–1, are there jobs? is pay good?)
  × morale                 (0–1, entertainment, communications, safety)
  - emigration_rate        (people leave if conditions are bad)
```

A thriving colony attracts immigrants (from homeworld or other colonies), providing
more labor supply. A neglected colony hemorrhages population. Ghost towns are possible
— a colony abandoned when its primary resource was exhausted.

**Immigration/emigration** requires passenger transport — another ship type and revenue
stream. Corps can run "colony ships" ferrying workers to labor-hungry outposts.

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

## System Scale

How big is the system? This is the most consequential design parameter. It determines
transit times, frontier depth, body density, and the feel of the entire game.

### Scale Factors

At warp speed (c), transit time is pure distance:

| Distance | Light-time | Game feel |
|----------|-----------|-----------|
| 1 AU | 8.3 minutes | Inner system — quick hops, competitive |
| 5 AU | 41 minutes | Jupiter distance — meaningful commitment |
| 30 AU | 4.2 hours | Neptune distance — expedition, not a commute |
| 100 AU | 13.9 hours | Deep frontier — multi-day round trip |
| 1000 AU | 5.8 days | Extreme frontier — week-long voyages |

Plus escape/insertion phases add overhead per-body (minutes to hours depending on
gravity well depth). A 1 AU hop isn't 8 minutes — it's 8 minutes of cruise plus
departure and arrival overhead.

### Recommended System Scale

**Inner system**: 0.2–5 AU from star. Dense, competitive, well-connected. 3–6 planets,
moons, nearby asteroids. This is where most of the economy lives. Transit times are
minutes to an hour — responsive enough for active management.

**Main belt**: 2–4 AU. Asteroid field. Dozens of minable bodies. The resource heartland.
Close enough to inner system for profitable hauling.

**Outer system**: 5–50 AU. Gas giants and their moons. Rich in volatiles and He-3 but
far from markets. Transit times of hours. Needs local infrastructure (refineries, command
centers) to operate efficiently. This is where command center placement matters most.

**Frontier**: 50–200 AU. Scattered TNOs, comets, dwarf planets. Multi-day transits.
Unsurveyed. High-value resources for those willing to make the trip. This is where
governance breaks down and frontier dynamics dominate.

**Deep frontier**: 200–1000 AU. Only the most ambitious corps venture here. Week-long
transits. No infrastructure. Uncharted. Potential for unique high-value discoveries.
Endgame content.

**Total system radius: ~200 AU for most gameplay, up to 1000 AU for frontier endgame.**

This means:
- The "playable" system for most of the game is ~200 AU across
- A round trip from the inner system to the outer frontier is ~2 days at c
- The inner system where most commerce happens is responsive (minutes between bodies)
- The frontier is genuinely remote — not just "far" but operationally isolated
- Command center placement matters most in the 5–50 AU range (hours of latency)

### Body Count & Density

The generator should produce:

| Zone | Bodies | Types |
|------|--------|-------|
| Inner (0.2–2 AU) | 3–5 | Rocky planets, some moons |
| Belt (2–4 AU) | 15–30 | Asteroids, dwarf planets |
| Outer (5–50 AU) | 3–5 | Gas/ice giants with 3–8 moons each |
| Frontier (50–200 AU) | 5–10 | TNOs, dwarf planets, comets |
| Deep frontier (200–1000 AU) | 2–5 | Scattered, high-value, rare |

**Total: 40–80 bodies per system.** Enough for a rich economy without overwhelming
the simulation. The existing WarpDrive engine handles ~50 bodies at 60fps already.

### Star Mass & Orbital Velocities

The star's mass determines all orbital velocities: `v = sqrt(GM_star / a)`.
A heavier star means faster orbits (bodies move around the system faster, changing
distances more rapidly). A lighter star means slower orbits (more stable distances,
longer windows).

This affects gameplay:
- **Heavy star (F-type)**: Fast orbital periods. Launch windows open and close quickly.
  Reactive, fast-paced economy. Distances change rapidly — routes that are profitable
  today aren't profitable next month.
- **Light star (M-type)**: Slow orbital periods. More stable distances. Strategic,
  long-term planning. But habitable zone is very close to the star — cramped inner system.
- **Sun-like (G-type)**: Balanced. Earth-like orbital periods. The "normal" experience.

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

## Combat & Conflict

### Why Combat Exists

You can't have frontier lawlessness, resource scarcity, and competing corporations
without violence. Smart contracts enforce financial agreements but can't stop someone
physically taking your cargo. The SCA can punish after the fact — but only if the
attacker ever docks at a certified port again.

### Physical Constraints (what the setting dictates)

**Combat only happens at low speed.** A ship at warp (~c) is untouchable — nothing can
intercept it. Engagements happen during escape, insertion, docking, and mining operations.
This mirrors historical piracy: you attack in port or near shore, never mid-ocean.

**No stealth in space.** Every ship radiates heat, every drive has a signature, every
transponder broadcasts (and disabling yours is itself suspicious). You always know
someone's coming. The question is what you can do about it.

**Ships aren't warships.** These are mining vessels, freighters, and tankers. Nobody
designed them for combat. But humans have been strapping weapons to cargo vessels since
the Phoenicians. "Combat capability" is a retrofit, a tradeoff against cargo capacity
and operating efficiency.

**Distance matters.** Space is big. Even near a body, ships are thousands of km apart.
This isn't submarine-close-quarters — it's long-range, slow, and deliberate.

### Combat Approaches (under consideration)

#### Option A: Drone Warfare

Combat is fought entirely by drones. Ships carry combat drones (repurposed mining/
construction drones with weapons mounts) that are deployed in an engagement zone.
The parent ship stays at distance.

**How it works:**
- Ships carry drone bays (takes cargo capacity — direct tradeoff)
- Combat drones: small, expendable, cheap individually but swarms are expensive
- Engagement is largely automated — player gives strategic orders ("defend this
  mining rig," "intercept that freighter"), drones execute
- Winning means destroying/disabling the opponent's drones, then their ship is
  defenseless — they surrender cargo or flee
- Ship hulls are tough (built for micrometeorites and radiation). Drones peck
  at them. Destroying a ship takes sustained effort.

**Pros:** Keeps the player at the strategic/corporate level. No twitch gameplay.
Drone manufacturing becomes dual-use (mining AND military). Creates demand for
combat drone variants in the manufacturing chain.

**Cons:** Could feel abstract/detached. Hard to balance swarm sizes.

#### Option B: Ship-to-Ship (Broadside)

Ships mount weapons directly — railguns, mining lasers repurposed as weapons,
missile racks. Combat is slow and positional, like age-of-sail broadsides at
thousands of km range.

**How it works:**
- Weapons are module slots that compete with cargo/mining equipment
- A combat-fitted ship carries less cargo — permanent economic penalty
- Engagements are slow (minutes to hours at realistic distances)
- Damage disables systems (engines, cargo hold, life support) before destroying
- Crew casualties are real — attacking a crewed ship is a different moral/legal
  calculus than attacking drones
- Escape is usually possible — if you're willing to dump cargo and burn hard

**Pros:** Visceral, high stakes. Ship fitting becomes a deep strategic decision.
Crew risk adds weight to the decision to fight.

**Cons:** Could dominate the game — becomes a space combat game with mining on the
side rather than a mining game with combat as a risk factor.

#### Option C: Boarding & Seizure

No ship-killing weapons. Instead: hacking, EMP, boarding drones. The goal is to
disable and seize, not destroy. Cargo and ships are valuable — blowing them up
is wasteful.

**How it works:**
- Electronic warfare: jam comms, spoof transponders, disable automated defenses
- EMP weapons: disable electronics, leaving hull intact
- Boarding drones: physically attach to a disabled ship, cut through airlock,
  take cargo or commandeer the vessel
- Defending: counter-hacking, point-defense against boarding drones, distress
  beacon (if within relay range, SCA responds... eventually)
- Seized cargo is "hot" — traceable on-chain. Fencing it requires black market
  contacts or processing it yourself to erase provenance

**Pros:** Non-destructive — preserves value in the system. Creates a piracy/
counter-piracy dynamic. Hacking/EW adds a tech dimension beyond pure economics.
Seized ships can be repurposed — actual prize-taking like historical naval warfare.

**Cons:** Complexity. Hacking minigame could feel out of place. "Hot cargo" fencing
mechanics add a whole secondary system.

#### Option D: Graduated Escalation (emergent, not rule-based)

All three exist as escalation levels. Most conflicts stay at the lowest level —
not because the game prevents escalation, but because the consequences are
economically ruinous. Nothing is forbidden. Everything has a price.

```
Level 0: Economic warfare        (undercutting, supply disruption, contract poaching)
Level 1: Intimidation            (park armed ships near competitor's operations)
Level 2: Drone skirmish          (deploy combat drones to contest a mining claim)
Level 3: Boarding & seizure      (disable and take cargo/ships)
Level 4: Ship-to-ship combat     (deliberate destruction — extreme, rare)
```

**Consequences are emergent, not game rules:**
- Level 0: Normal business. Nobody cares.
- Level 1: Colonies near your armed ships get nervous. If they have defense pacts,
  their drones activate. Corps with presence there may file complaints — or arm
  their own ships.
- Level 2: Transponder logs record it. Colonies that see the data will adjust their
  opinion of you. If someone's drones were destroyed near a colony, that colony's
  defense budget goes up and your standing drops. Plausible deniability depends on
  whether the evidence reaches anyone who cares.
- Level 3: Victim broadcasts evidence (cryptographically signed transponder logs).
  Every colony that receives it re-evaluates your standing. Insurance DAOs pay
  the victim. Other corps decide independently whether to blacklist you. No
  central authority makes this call — it's a collective response.
- Level 4: Same as Level 3 but with casualties (if crewed) and destruction. The
  response is proportionally harsher. Corps may form ad-hoc coalitions against you.
  Colonies may refuse docking. But all of this is THEIR choice, not a game rule.
  A corp operating purely in frontier space with no colony dependencies might get
  away with it.

**Most of the time, conflict stays at Level 0–2** because the math doesn't work.
The value of seized cargo minus the cost of combat drones, minus colony standing
damage, minus lost trade relationships, minus insurance payouts to the victim
is almost always negative. Violence is a losing trade in a connected economy.

But in a fragmented frontier with no witnesses and no colony dependencies? The
math changes. That's where piracy lives — not because the game allows it there,
but because the economic deterrents are weaker.

**Pros:** No artificial rules. Realistic emergent behavior. The economic game
remains primary. Combat exists but is genuinely risky. Every escalation tells
a story.

**Cons:** Most complex to implement. Emergent consequences are harder to
communicate to the player than explicit rules.

#### Option E: No Direct Combat — Proxy & Asymmetric Only

Corps can't attack each other directly. Instead, conflict is asymmetric:

- **Claim jumping**: Start mining a body someone else is already working. Not illegal,
  just aggressive. They can try to outproduce you or leave.
- **Blockade by presence**: Park ships at a competitor's facility. Don't attack — just
  occupy docking slots, congest the port, slow their operations. Annoying, expensive
  for both sides.
- **Sabotage**: Pay a third party (NPC "fixers") to cause "accidents" at a competitor's
  facility. Deniable. Expensive. Risk of exposure.
- **Regulatory warfare**: Lobby SCA to impose regulations that hurt a competitor. Safety
  inspections that shut down their refinery. Environmental audits.
- **Hostile acquisition**: Buy a competitor's debt, call it in, force asset liquidation.
  Pure financial aggression.

**Pros:** Keeps the game firmly in tycoon territory. No combat systems to build.
Conflict is creative and economic. Every aggressive move has an economic cost — no
"free" violence.

**Cons:** Some players will feel frustrated they can't just shoot the guy. Lacks a
visceral pressure valve. "I can see his ships, I have bigger ships, why can't I
do anything?"

### Combat: Open Questions

- Which option (or combination) fits the game's identity? D feels richest but most
  complex. E is cleanest but might feel toothless.
- Is combat real-time or auto-resolved? (Real-time would be a huge scope expansion.
  Auto-resolve fits the "player is a board of directors" framing.)
- How does combat interact with insurance? Does attacking an insured ship pay out
  to the victim, making piracy a net-negative for the system?
- Can corps hire NPC mercenary outfits for deniable operations?
- What prevents the biggest corp from just dominating through force? (Coalitions?
  SCA intervention? Diminishing returns on military spending?)
- Does the drone-vs-human crew choice affect combat? (Human crews can improvise
  under attack. Drone ships can be hacked.)

## Variant: All-Drone Universe (separate game concept?)

A version where there are no human crews in space at all. Players are Earth-based
corporations remotely operating drone fleets across the solar system. Pure logistics
and economics — no life support, no food chains, no morale, no population dynamics.

What this changes:
- **Simpler supply chain**: No food, water, medical, hab modules. Just machines and fuel.
- **Comms delay becomes THE constraint**: You can't micromanage a drone fleet at Jupiter
  with 40-minute latency. You write high-level orders, the drones execute autonomously,
  and you see results 40 minutes later. Strategy becomes about writing good standing orders.
- **Cyberpunk tone**: Corporate AIs competing through drone proxy wars. Hacking, signal
  jamming, electronic warfare replace human diplomacy.
- **Different failure modes**: Drones don't panic or mutiny, but they can be hacked,
  jammed, or confused by unexpected environments. Cybersecurity replaces crew management.
- **Faster pace**: No human considerations = more aggressive play. Corps can sacrifice
  drone fleets without ethical qualms.

This is probably a different game with the same orbital engine underneath. Worth
exploring separately — noted here for reference.

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
