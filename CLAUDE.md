# CLAUDE.md — Tactical Companion TCG

This file provides Claude Code with persistent project context. Read this before touching any file.

---

## What This Project Is

A **digital-first tactical TCG** with companion bonding, evolution, lane positioning, and fast match pacing. Target match length: **8–12 minutes**.

This is not a clone. Key differentiators:
- 6-slot front/back battlefield (3 front + 3 back per player)
- Companion as the **win condition** (no player life totals)
- Face-down **simultaneous opening deployment**
- Movement as a tactical action
- **Charge** resource specifically for evolution
- Dual-resource system: Energy (tempo) + Charge (evolution)

---

## Design Pillars (Do Not Break These)

1. Digital-first
2. Companion-centered — companion is the win condition
3. Fast matches — 8–12 min target
4. Positioning matters — front/back row have different rules
5. Sacrifice can be strategic — feeding Charge
6. Evolution is a core mechanic — not optional flavor
7. Limited counterplay — light reaction system only
8. Board state must be compact and readable

---

## Battlefield

Each player has **6 slots**: 3 front row + 3 back row.

Rules:
- Front row units can attack normally
- Back row units **cannot attack** unless they have the `Ranged` keyword
- If a front slot is **empty**, the back row unit behind it becomes **vulnerable** through that lane
- Units may move into **empty adjacent slots** (costs 1 action, 0 Energy)

---

## Win Condition

**Defeat the opponent's companion.** There is no separate player life total.

---

## Turn Structure

1. **Start of Turn** — check companion evolution condition
2. **Draw** — draw to refill toward hand size (hand cap: 5)
3. **Energy Refresh** — Energy refills to current max
4. **Action Phase** — player takes up to **3 actions**
5. **End of Turn** — cleanup, pass

### Actions (each costs 1 action):
- Play a card (also costs Energy)
- Move a unit
- Attack with a unit
- Activate an ability
- Evolve (if triggered at start of turn, this may be free — TBD)

---

## Resource System

### Energy
- Starts at **2**
- Max increases **+1 per turn**
- Caps at **6**
- Refills fully each turn
- Spent on: playing cards, abilities, upgrades

### Charge
- Used exclusively for companion **evolution**
- Accumulated via:
  - Turn progression (baseline gain)
  - Friendly units dying
  - Companion dealing damage
  - Specific card effects
- Evolution check happens at **start of turn**

---

## Evolution System

- Check at **start of player's turn**
- If companion has enough Charge AND meets any additional condition → may evolve
- Evolution updates: stats, abilities, tactical role
- Should feel like a **power spike**, not an instant win

---

## MVP Scope — Build Only This First

### Include in MVP:
- [ ] Game state model
- [ ] Board (6 slots per player)
- [ ] Companion unit with HP, attack, movement
- [ ] 3 actions per turn
- [ ] Energy system
- [ ] Charge system (basic accumulation)
- [ ] Simple evolution (stat change + ability update)
- [ ] Movement (adjacent empty slot)
- [ ] Combat (front row priority, Ranged exception)
- [ ] Turn flow
- [ ] Card play (place into slot)
- [ ] 2 prototype decks

### Explicitly Exclude from MVP:
- Reaction / interrupt system
- Multiple factions
- Keywords beyond: `Ranged`, `Charge: X`
- Polished UI
- Networking / multiplayer
- Sound / animation

---

## Core Data Types to Implement

```ts
GameState
PlayerState
BoardState
Slot           // { position: 'front'|'back', index: 0|1|2, occupant: CardInstance | null }
CardDefinition // static card data
CardInstance   // runtime card on board
CompanionState // extends CardInstance, tracks evolution stage
Action         // { type, source, target, cost }
Effect         // resolved game effect
TargetRule     // legal target constraint
```

---

## Core Engine Functions to Implement

```ts
startGame()
revealOpeningBoard()
drawCard()
playCard(card, slot)
moveUnit(from, to)
attackTarget(attacker, target)
endTurn()
gainCharge(amount)
checkCompanionEvolution()
resolveEffect(effect)
getLegalMoves(unit)
getLegalTargets(attacker)
isVulnerable(slot)
```

---

## Prototype Decks

### Deck 1: Tempo / Lane Pressure

**Companion:** Auric Cub → evolves into Auric Leon

| Card | Type | Cost | Notes |
|---|---|---|---|
| Lane Prowler | Unit | 2 | Mobile, lane pressure |
| Vanguard Hound | Unit | 1 | Fast front-row filler |
| Bolt Skipper | Unit | 2 | Ranged |
| Pack Signal | Spell | 1 | Repositioning effect |
| Sharpen Instinct | Upgrade | 2 | Attack buff |
| Pounce Window | Spell | 1 | Opens a lane |

**Strategy:** Push lanes, reposition, open vulnerabilities, tempo into evolution.

---

### Deck 2: Sacrifice / Evolution Ramp

**Companion:** Ember Wisp → evolves into Cinder Seraph

| Card | Type | Cost | Notes |
|---|---|---|---|
| Ash Drudge | Unit | 1 | Dies easily, generates Charge |
| Pyre Acolyte | Unit | 2 | Gains Charge on death |
| Grave Lancer | Unit | 3 | Ranged, bonus on ally death |
| Soul Kindle | Spell | 1 | Sacrifice a unit for Charge burst |
| Ember Mantle | Upgrade | 2 | Companion buff |
| Death Flare | Spell | 2 | Board damage, generates Charge |

**Strategy:** Turn losses into Charge, accelerate evolution, win via power spike.

---

## File Structure

```
tactical-tcg/
├── CLAUDE.md               ← you are here
├── docs/
│   ├── DESIGN_SPEC.md      ← full design document
│   ├── CARDS.md            ← card definitions
│   └── ROADMAP.md          ← phased build plan
├── src/
│   ├── engine/             ← core game loop, turn flow, resolution
│   ├── state/              ← GameState, reducers, store
│   ├── rules/              ← legal move/target/attack validators
│   ├── cards/              ← CardDefinition data, deck configs
│   ├── ui/                 ← React components (board, hand, HUD)
│   └── utils/              ← helpers, logging
├── tests/                  ← unit tests for engine + rules
├── assets/
│   └── cards/              ← card art placeholders
└── config/                 ← game config constants
```

---

## Coding Principles for This Project

- **State-driven first.** All game state lives in a single `GameState` object. UI reads from state; it does not own game logic.
- **Rules layer is pure.** Validation functions take state as input and return booleans or legal action lists. No side effects.
- **Engine functions are reducers.** Each action produces a new `GameState`. Immutable updates preferred.
- **Small and testable.** Every engine function should be independently testable without a UI.
- **No premature abstraction.** Don't build a general effect system until the simple effects work correctly.

---

## Inspiration References (Do Not Clone)

| Game | What We Borrow |
|---|---|
| Duelyst | Tactical board + card hybrid feel |
| Marvel Snap | Compact board, fast readability |
| Hearthstone | Digital pacing, accessibility |
| Digimon | Companion bond + evolution fantasy |

---

## Current Status

- [x] Design spec complete
- [x] Two prototype deck identities defined
- [x] Folder structure initialized
- [ ] Game state model — **START HERE**
- [ ] Rules engine
- [ ] Turn flow
- [ ] UI wired to real state
