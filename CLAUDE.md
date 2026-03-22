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

**Lane targeting (locked in):**
- **Melee** units attack only the enemy slot directly in front of them (same lane index). If that front slot is empty and the back slot has a unit, that back slot is targetable instead.
- **Ranged** units can attack their own lane plus adjacent lanes (index ±1). For each of those lanes, if the front slot is empty and the back slot has a unit, the back slot is targetable instead. Ranged cannot target a back slot if the front slot of that lane is occupied.

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
- [x] Action economy enforced: attack/move/play all cost 1 action, validated
- [x] Companion sync: dealDamage keeps companion.currentHp in sync with board slot
- [x] Lane targeting rules locked in: melee same-lane only, ranged ±1 lane
- [x] Turn draw: startTurn fills hand to HAND_SIZE_CAP in one pass
- [ ] Playtesting and tuning (Phase 7) — IN PROGRESS

---

## Resolved Bugs

Bugs found and fixed during development. Do not re-introduce these.

| Bug | Root Cause | Fix |
|---|---|---|
| **Opening phase auto-advanced after 1 card** | `p1Placed` used `.length` on `openingPlacements`, which is a 6-element sparse array initialized on first placement — so length was immediately 6 | Changed to `.filter(fc => fc !== null).length` to count only placed cards |
| **`revealOpeningBoards` built plain `CardInstance` for companion** | `makeInstance` always constructed a fresh `CardInstance` from the definition, discarding companion fields (`evolutionStage`, `charge`, `evolutionDefinitionId`) | Added a check: if `fc.instanceId === player.companion.instanceId`, return `player.companion` directly |
| **`player` and `enemy` hardcoded to `'player-1'`/`'player-2'`** | `GameScreen.tsx` hardcoded `state.players.find(p => p.playerId === 'player-1')` — after End Turn, the active player was still shown as player-1 | Changed to derive from `state.activePlayerId` and `!== state.activePlayerId` |
| **Companion HP not updated when taking damage** | `dealDamage` updated the board slot occupant's `currentHp` but left `player.companion.currentHp` unchanged — win detection read stale HP | `dealDamage` now checks if damaged occupant is the companion and updates both the board slot and `player.companion` in the same map pass |
| **Win detection read HP before damage was applied** | `resolveAttack` checked `companion.currentHp <= 0` after `handleDeath`, but `handleDeath` clears the slot — the check needed to happen after `dealDamage` (which now syncs the companion) | Moved win check to immediately after `dealDamage`, before `handleDeath` |
| **Attack and move consumed no actions** | `resolveAttack` and `resolveMove` had no `spendAction` call — players could attack and move unlimited times | Added `spendAction(result, playerId)` at end of both functions; added `hasActionsRemaining` guard at top of both |
| **`FaceDownCard` missing `definitionId`** | Original `FaceDownCard` type had no `definitionId` field — `revealOpeningBoards` couldn't look up the card definition at reveal time | Added `definitionId: string` to `FaceDownCard`; `placeCardFaceDown` copies it from the `CardInstance` |
| **`placeCardFaceDown` appended to array end** | Cards were pushed onto `openingPlacements` in click order with no slot mapping — there was no way to control which board slot a card ended up in | Replaced with a 6-element sparse array indexed by slot number (front 0-2, back 3-5); `placeCardFaceDown` now takes `targetSlot` and inserts at the correct index |
| **Turn 1 had no draw and wrong energy** | `REVEAL_BOARDS` and auto-reveal transitioned to `'main'` without calling `startTurn` — players started with 0 cards | Both reducer cases now call `startTurn(revealOpeningBoards(...))` |
| **Evolution permanently blocked** | `checkCompanionEvolution` was never called in `startTurn`; `evolutionChargeThreshold` was never copied from `CardDefinition` onto `CompanionInstance` so threshold resolved to `Infinity` | Added `evolutionChargeThreshold` field to `CompanionInstance` type; `buildCompanionInstance` copies it from the def; `startTurn` now calls `gainCharge` (baseline) then `checkCompanionEvolution` |
| **Evolution didn't apply evolved stats** | `checkCompanionEvolution` only bumped `evolutionStage` to 2 — it never looked up the evolved definition to apply new HP/ATK/keywords | Now calls `getCardDefinitionOrThrow(companion.evolutionDefinitionId)` and applies `currentHp`, `currentAttack`, `keywords` from the evolved def |
| **No baseline charge gained per turn** | `CHARGE_BASELINE_PER_TURN` was defined but never used anywhere | `startTurn` now calls `gainCharge(next, activePlayerId, CHARGE_BASELINE_PER_TURN)` after energy reset |
| **Death Flare only castable on own empty slots** | `playerLegalTargets` for spells used `getLegalPlaySlots` (empty slots only); `handleEnemySlotClick` only handled attacks, not spell casts | Added `isDeathFlare` flag; when true, all 6 enemy slots are shown as legal targets and clicking any enemy slot dispatches `PLAY_CARD` |
| **Death Flare didn't detect companion kill** | `handleDeath` clears board slots but never sets `winner`; Death Flare's death loop called `handleDeath` but didn't check for companion death afterward | Added post-loop win check in Death Flare: iterates `next.players`, sets `winner` + `phase: 'ended'` if any companion HP ≤ 0 |
| **Sharpen Instinct applied no effect** | `playUpgradeCard` had only a generic stub — all upgrades removed the card and spent resources but changed nothing | Added `'sharpen-instinct'` case: applies `+2 currentAttack` to the board slot occupant at `targetSlot` |

---

## Session Snapshot

*Updated 2026-03-22. Overwrites previous snapshot entirely.*

---

### Completed Phases

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Core type system — `types.ts` (global ambient), `initialState.ts` (empty board + player factories) | ✅ Done |
| Phase 2 | Turn flow — `startTurn` (energy reset, draw to hand cap, baseline charge, evolution check), `endTurn`, `gainCharge`, `checkCompanionEvolution` | ✅ Done |
| Phase 3 | Combat + movement — `resolveAttack` (action cost, win detection, companion sync), `resolveMove` (action cost), `dealDamage`, `handleDeath` | ✅ Done |
| Phase 4 | Card play — `playUnitCard`, `playSpellCard` (Soul Kindle, Death Flare), `playUpgradeCard` (Ember Mantle, Sharpen Instinct); `spendAction` exported | ✅ Done |
| Phase 5 | Opening engine — `placeCardFaceDown` (sparse array, slot targeting), `isReadyToReveal`, `revealOpeningBoards` + `startTurn` called after reveal | ✅ Done |
| Pre-6 | Card data — 16 `CardDefinition` objects, `getCardDefinition`/`getCardDefinitionOrThrow` registry, `tempoDeck` + `sacrificeDeck` configs | ✅ Done |
| Phase 6 | UI — all components wired to real state; `GameRouter` routes by phase; `GameScreen` has full click/selection/dispatch loop | ✅ Done |
| Opening Fixes | Sparse placement array; slot-targeted drag-and-drop; `playerId` field on action; count fix (non-null filter); two-step reveal confirmation | ✅ Done |
| Action economy | `resolveAttack` and `resolveMove` both call `spendAction`; both guard with `hasActionsRemaining`; auto-end turn when actions reach 0 | ✅ Done |
| Companion sync | `dealDamage` updates both board slot occupant and `player.companion.currentHp` in the same map pass | ✅ Done |
| Lane targeting | `getLegalTargets` rewritten: melee same lane only; ranged own lane + adjacent (±1); back slot reachable only when front is empty | ✅ Done |
| Evolution system | `checkCompanionEvolution` called every `startTurn`; threshold stored on instance; evolved def stats applied to companion on trigger | ✅ Done |
| Card effects | Soul Kindle (+3 Charge via sacrifice), Death Flare (2 AoE damage + Charge per kill), Ember Mantle (+2 HP/+1 ATK companion), Sharpen Instinct (+2 ATK unit) | ✅ Done |
| UI polish | `Hand.tsx` type badges, cost, HP/ATK; `BoardSlot.tsx` shows HP, ATK, Melee/Ranged; auto-pass banner; Death Flare highlights enemy board | ✅ Done |

---

### Current State of the Game (what works when you run `npm run dev`)

- Game opens in `phase: 'opening'`
- Each player has 6 cards in hand: companion + 5 deck cards; drag to placement grid, front/back rows
- After both players place 6, two-step confirm → reveal transitions to `phase: 'main'`; `startTurn` fires immediately so turn 1 has correct energy, actions, and draw
- Main screen: enemy board (flipped) on top, event log in middle, player board below, hand + HUD at bottom
- Unit cards can be played to empty board slots (Energy deducted, action spent); board shows name/HP/ATK/Melee/Ranged
- Units can move to adjacent empty slots; melee attacks same-lane enemy; ranged attacks own + adjacent lanes
- **Soul Kindle**: select from hand, click own non-companion unit to sacrifice it — grants 3 Charge
- **Death Flare**: select from hand, click any enemy slot — deals 2 damage to all units on both boards, grants 1 Charge per kill; detects companion kill and ends game
- **Ember Mantle**: select from hand, play on any slot — companion gains +2 HP, +1 ATK; +1 Charge bonus if companion is Ember Wisp
- **Sharpen Instinct**: select from hand, click own occupied slot — target unit gains +2 ATK permanently
- Each turn: `startTurn` resets energy (grows +1/turn, cap 6), resets actions to 3, draws to hand cap, grants 1 baseline Charge
- When active player's actions reach 0, a gold banner appears and the turn auto-ends after 1.2 seconds
- Evolution: at `startTurn`, if companion charge ≥ threshold, companion stats update to evolved definition (e.g. Auric Cub → Auric Leon)
- Companion HP → 0 triggers `winner` + `phase: 'ended'`; `GameRouter` shows winner screen
- TypeScript: zero errors (`npx tsc --noEmit` clean)

---

### Known Issues

| Issue | Location | Notes |
|---|---|---|
| **Pack Signal, Pounce Window effects missing** | `cardPlay.ts` `playSpellCard` | No case for `'pack-signal'` or `'pounce-window'`. Cards are consumed with no effect. Pack Signal should reposition a unit; Pounce Window should open a lane vulnerability. |
| **Grave Lancer death bonus missing** | `cardPlay.ts`, `combat.ts` | Grave Lancer has a "bonus on ally death" effect that isn't implemented. `handleDeath` grants Charge keyword value but has no per-card death trigger system. |
| **Evolution doesn't update board slot** | `turnFlow.ts` `checkCompanionEvolution` | When evolution fires, `player.companion` gets new stats but the board slot occupant is NOT updated. The companion's displayed HP/ATK on the board won't reflect evolved values until it takes damage (which re-syncs via `dealDamage`). |
| **Upgrade targeting shows wrong highlights** | `GameScreen.tsx` | When Sharpen Instinct is selected from hand, `getLegalPlaySlots` highlights empty slots (unit placement targets). The player must click an occupied slot — which works — but the green borders are misleading. No dedicated "occupied slot" highlight path exists for upgrades. |
| **Ember Mantle plays on any slot click** | `GameScreen.tsx`, `cardPlay.ts` | Ember Mantle ignores `targetSlot` entirely and always buffs the companion. But the PLAY_CARD dispatch fires when clicking any own slot. If the player clicks an empty slot while Ember Mantle is selected, it dispatches and succeeds — the UI gives no specific indication that the companion is the target. |
| **Opening placement order hardcoded** | `OpeningScreen.tsx` | Player 1 always places first. No randomization or coin flip. |
| **`cost` stored via type assertion, not type field** | `store.ts`, `cardPlay.ts` | `cost` is added to `CardInstance` as `CardInstance & { cost: number }` at build time. The base `CardInstance` type has no `cost` field. This works but is fragile — any code that reads `cost` off an instance must use the same cast. |

---

### Active File List

| File | Purpose |
|---|---|
| `config/gameConstants.ts` | `GAME_CONSTANTS` — energy cap, growth, hand size cap, actions per turn, `CHARGE_BASELINE_PER_TURN` |
| `src/main.tsx` | ReactDOM entry — `createRoot` → `<App />` |
| `src/cards/definitions.ts` | 16 `CardDefinition` objects (both decks + companions + evolved forms) + `allCards[]` |
| `src/cards/registry.ts` | `getCardDefinition(id)` and `getCardDefinitionOrThrow(id)` |
| `src/cards/decks.ts` | `DeckConfig` type; `tempoDeck` (Auric Cub) and `sacrificeDeck` (Ember Wisp), 12 cards each |
| `src/engine/cardPlay.ts` | `playUnitCard`; `playSpellCard` (Soul Kindle, Death Flare live; Pack Signal/Pounce Window pending); `playUpgradeCard` (Ember Mantle, Sharpen Instinct live); `spendAction` exported |
| `src/engine/combat.ts` | `dealDamage` (syncs companion HP), `handleDeath` (Charge keyword), `resolveAttack` (action cost, win detection) |
| `src/engine/movement.ts` | `resolveMove` — action cost, actions guard, legal move check |
| `src/engine/opening.ts` | `placeCardFaceDown` (sparse 6-slot array, slot-targeted), `isReadyToReveal`, `revealOpeningBoards` (companion preserved) |
| `src/engine/turnFlow.ts` | `startTurn` (energy reset, draw, baseline charge, evolution check), `endTurn`, `gainCharge`, `checkCompanionEvolution` (applies evolved def stats) |
| `src/rules/movement.ts` | `getAdjacentSlots` (same row ±1, opposite row same index), `getLegalMoves` (empty slots only) |
| `src/rules/targeting.ts` | `isLaneClear`, `canAttackFromPosition`, `getLegalTargets` (melee same lane; ranged ±1 lane) |
| `src/rules/validation.ts` | `hasEnoughEnergy`, `hasActionsRemaining`, `isSlotEmpty`, `getLegalPlaySlots` (all empty slots) |
| `src/state/types.ts` | All global TS types — `CompanionInstance` has `evolutionChargeThreshold: number`; `openingPlacements` is sparse `(FaceDownCard \| null)[]` |
| `src/state/initialState.ts` | `createEmptyBoard`, `createInitialPlayerState`, `createInitialGameState` |
| `src/state/store.ts` | React context + `useReducer`; `gameReducer` calls `startTurn` after reveal; `buildCompanionInstance` copies `evolutionChargeThreshold` |
| `src/ui/App.tsx` | `GameStateProvider` wraps `GameRouter`; routes `'opening'` → `OpeningScreen`, `'main'` → `GameScreen`, `'ended'`/winner → winner screen |
| `src/ui/OpeningScreen.tsx` | Drag-and-drop face-down placement; sparse-array `filled` check; two-step reveal confirmation |
| `src/ui/GameScreen.tsx` | Click/select/dispatch loop; `isDeathFlare` flag for enemy board targeting; auto-end turn `useEffect` with banner |
| `src/ui/Board.tsx` | 3×2 grid of `BoardSlot`; `flipped` renders back row first for enemy perspective |
| `src/ui/BoardSlot.tsx` | Name, HP, ATK, Melee/Ranged; green border = legal target; yellow bg = selected |
| `src/ui/Hand.tsx` | Name, cost ⚡ (gold), type badge (color-coded), HP/ATK for units, tooltip for spells/upgrades |
| `src/ui/HUD.tsx` | Energy/max, actions, deck count, companion name/HP/charge; gold border if active player |
| `src/ui/EventLog.tsx` | Last 8 entries from `state.eventLog`; fixed 160px height, `overflowY: scroll` |

---

### Design Decisions Locked In

| Decision | Rule |
|---|---|
| **Lane targeting — Melee** | Attacks only the enemy slot at the same lane index. If front is empty, can reach the back slot in that same lane (no cross-lane). |
| **Lane targeting — Ranged** | Attacks own lane ± adjacent lanes (up to 3 lanes). For each lane, front slot is the primary target; back slot is reachable only if front is empty. |
| **Companion as win condition** | Companion HP reaching 0 sets `winner` and `phase: 'ended'` immediately in `resolveAttack` or the Death Flare loop. No separate life total. |
| **Opening placement** | Each player places all 6 cards (companion + 5 deck cards) face-down into specific board slots. Reveal is simultaneous. Companion is the first card in the opening hand. |
| **Action economy** | Playing, moving, and attacking each cost 1 action. Moving costs 0 Energy. Energy is only spent on card play. |
| **Companion HP sync** | `dealDamage` always updates both `player.companion.currentHp` and the board slot occupant in the same reducer pass. |

---

### Next Action

**Phase 7 — Remaining work in priority order:**

1. **Fix evolution board slot sync** — `checkCompanionEvolution` updates `player.companion` but not the board slot occupant. Add the same board-slot scan that `dealDamage` uses to apply the new stats to the slot.
2. **Implement Pack Signal** — reposition a friendly unit to an empty adjacent slot (spell, cost 1)
3. **Implement Pounce Window** — force an enemy front-row unit to move back, opening a lane (spell, cost 1)
4. **Fix upgrade targeting highlights** — when an Upgrade card is selected, `getLegalPlaySlots` shows empty slots; should show occupied own-board slots instead
5. **Implement Grave Lancer death bonus** — bonus trigger when a friendly unit dies while Grave Lancer is on the board
