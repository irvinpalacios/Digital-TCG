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
- [x] Game state model (Phase 1)
- [x] Turn flow engine (Phase 2)
- [x] Combat and movement (Phase 3)
- [x] Card play (Phase 4)
- [x] Opening deployment engine (Phase 5)
- [x] Card definitions and registry (Pre-6)
- [x] UI wired to real state (Phase 6)
- [x] Opening phase UI and routing (Opening Fixes 1–5)
- [ ] Playtesting and tuning (Phase 7) — NEXT

---

## Session Snapshot

*Updated 2026-03-21. Overwrites previous snapshot entirely.*

---

### Completed Phases

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Core type system (`types.ts`, `initialState.ts`) | ✅ Done |
| Phase 2 | Turn flow engine (`turnFlow.ts` — startTurn, endTurn, drawCard, gainCharge, checkCompanionEvolution) | ✅ Done |
| Phase 3 | Combat and movement (`combat.ts`, `movement.ts`, `targeting.ts`, `movement rules`) | ✅ Done |
| Phase 4 | Card play (`cardPlay.ts` — playUnitCard, playSpellCard, playUpgradeCard) | ✅ Done |
| Phase 5 | Opening deployment engine (`opening.ts` — placeCardFaceDown, isReadyToReveal, revealOpeningBoards) | ✅ Done |
| Pre-6 | Card definitions, registry, deck configs (`definitions.ts`, `registry.ts`, `decks.ts`) | ✅ Done |
| Phase 6 | React UI wired to real game state (all UI components + store) | ✅ Done |
| Opening Fixes 1–5 | Opening phase UI: hand dealing, face-down placement, reveal button, phase routing | ✅ Done |

---

### Current State of the Game

- Game loads into the opening phase (`state.phase === 'opening'`)
- Player 1 places 6 cards face-down, then Player 2 places 6 cards face-down
- "Reveal Boards" button appears when both players have placed all 6 — clicking it calls `revealOpeningBoards`, transitions to `phase: 'main'`, and sets up the first turn via `startTurn`
- Main game screen shows both boards, both hands, both HUDs (energy/actions/companion), and a scrollable event log
- Both prototype decks are wired with real `CardDefinition` data (Tempo / Sacrifice)
- TypeScript: zero errors across all files (`npx tsc --noEmit` clean)

---

### Known Issues

- **Spell and Upgrade card play**: `playSpellCard` and `playUpgradeCard` are stubbed — they remove the card from hand but apply no effect. Charge-generating spells (Soul Kindle, Death Flare) do not yet grant Charge.
- **Upgrade targeting**: `playUpgradeCard` requires a `targetSlot` but the UI's `PLAY_CARD` dispatch always passes `targetSlot`. No slot-selection UI exists for upgrades yet.
- **Opening placement order**: Player 1 always goes first (hardcoded). No turn-order randomization.
- **Companion placement**: Companions are not placeable during the opening phase — they are initialized directly onto the board state. This may feel inconsistent with the face-down deployment theme.
- **Evolution**: `checkCompanionEvolution` runs at start of turn and updates companion stats, but evolved abilities are not yet applied (no ability system exists yet).
- **No win detection in UI**: `state.winner` can be set by `handleDeath` in `combat.ts`, but the winner screen in `App.tsx` is only shown if `state.phase === 'ended'` or `state.winner !== null`. The `handleDeath` function should set `winner` correctly — verify during playtesting.

---

### Active File List

| File | Purpose |
|---|---|
| `config/gameConstants.ts` | `GAME_CONSTANTS` — energy cap, max energy, hand size, actions per turn |
| `src/main.tsx` | ReactDOM entry — mounts `<App />` into `#root` |
| `src/cards/definitions.ts` | 16 `CardDefinition` objects for both decks + `allCards[]` export |
| `src/cards/registry.ts` | `getCardDefinition(id)` and `getCardDefinitionOrThrow(id)` — lookup over `allCards` |
| `src/cards/decks.ts` | `DeckConfig` type; `tempoDeck` and `sacrificeDeck` (12 card IDs + 1 companion ID each) |
| `src/engine/cardPlay.ts` | `playUnitCard`, `playSpellCard`, `playUpgradeCard` — pure state reducers |
| `src/engine/combat.ts` | `dealDamage`, `handleDeath`, `resolveAttack` — pure state reducers; sets `state.winner` |
| `src/engine/movement.ts` | `resolveMove` — validates and executes unit movement, pure state reducer |
| `src/engine/opening.ts` | `placeCardFaceDown`, `isReadyToReveal`, `revealOpeningBoards` — opening phase engine |
| `src/engine/turnFlow.ts` | `startTurn`, `endTurn`, `drawCard`, `gainCharge`, `checkCompanionEvolution` |
| `src/rules/movement.ts` | `getAdjacentSlots`, `getLegalMoves` — pure validators, no side effects |
| `src/rules/targeting.ts` | `isLaneClear`, `canAttackFromPosition`, `getLegalTargets` — pure validators |
| `src/rules/validation.ts` | `hasEnoughEnergy`, `hasActionsRemaining`, `isSlotEmpty`, `getLegalPlaySlots` |
| `src/state/types.ts` | All global TypeScript types — no exports, ambient global script pattern |
| `src/state/initialState.ts` | `createEmptyBoard`, `createInitialPlayerState`, `createInitialGameState` |
| `src/state/store.ts` | React context + `useReducer`; `gameReducer` routes all `GameAction` types; deck/companion init |
| `src/ui/App.tsx` | Root component — `GameStateProvider` wraps `GameRouter`; routes by `state.phase` |
| `src/ui/OpeningScreen.tsx` | Opening phase UI — hand display, face-down placement grid, status, Reveal button |
| `src/ui/GameScreen.tsx` | Main game screen — click logic, legal target highlighting, board layout, End Turn |
| `src/ui/Board.tsx` | 3×2 grid of `BoardSlot` components; `flipped` prop renders enemy view (back row first) |
| `src/ui/BoardSlot.tsx` | Single board slot — green border if legal target, yellow bg if selected, registry name lookup |
| `src/ui/Hand.tsx` | Hand display — card name/type/stats, yellow bg if selected; registry lookup |
| `src/ui/HUD.tsx` | Player status bar — energy, actions remaining, companion name/HP/charge; gold border if active |
| `src/ui/EventLog.tsx` | Scrollable log — last 8 entries from `state.eventLog`, fixed 160px height |

---

### Next Action

**Phase 7 — Playtesting.** Run `npm run dev` and play through a full game (Tempo vs Sacrifice).

Verify:
- Opening placement works for both players
- Reveal transitions correctly to main phase
- Cards can be played into slots (Energy cost deducted, actions decremented)
- Units can move to adjacent empty slots
- Front-row units can attack; back-row units cannot (unless Ranged)
- Back-row units become vulnerable when front slot in their lane is empty
- Companion takes damage and dies → winner is set
- End Turn passes to opponent, energy/actions reset, hand draws up
- Evolution fires when Charge threshold is met at start of turn

Identify what feels broken, wrong, or missing. That drives the fix list for Phase 7.
