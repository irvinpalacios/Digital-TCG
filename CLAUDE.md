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
- **Charge** resource specifically for Recall (evolution)
- Dual-resource system: Energy (tempo) + Charge (Recall)

---

## Design Pillars (Do Not Break These)

1. Digital-first
2. Companion-centered — companion is the win condition
3. Fast matches — 8–12 min target
4. Positioning matters — front/back row have different rules
5. Sacrifice can be strategic — feeding Charge
6. Recall is a core mechanic — not optional flavor
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

1. **Start of Turn** — Energy max grows (+1, cap 6), Energy refills, actions reset to 3, draw to hand cap
2. **Baseline Charge** — +1 Charge granted to active player
3. **Recall Check** — if companion Charge ≥ threshold, Recall fires (stats + board slot updated)
4. **Action Phase** — player takes up to **3 actions**
5. **End of Turn** — cleanup, pass

### Actions (each costs 1 action):
- Play a card (also costs Energy)
- Move a unit
- Attack with a unit
- Activate an ability

---

## Resource System

### Energy
- Starts at **2**
- Max increases **+1 per turn**
- Caps at **6**
- Refills fully each turn
- Spent on: playing cards, abilities

### Charge
- Used exclusively for companion **Recall**
- Accumulated via:
  - Turn progression (baseline gain)
  - Friendly units dying
  - Companion dealing damage
  - Specific card effects
- Recall check happens at **start of turn**

---

## Recall System (formerly "Evolution")

- Check at **start of player's turn**
- If companion has enough Charge → Recalls
- Recall updates: stats (HP/ATK), abilities, tactical role
- HP carries over — does not reset on Recall
- Should feel like a **power spike**, not an instant win

---

## Remnants

Companions are called **Remnants** — legendary figures from fractured timelines who arrive diminished, and Recall their defining power when enough Charge accumulates.

See `docs/REMNANTS.md` for full lore, card specs, and implementation notes.

### Active Remnants

| Remnant | Timeline | Role | HP | ATK | Recall @ |
|---|---|---|---|---|---|
| Caelum Voss | Iron Century | Control / Temporal Disruption | 7 | 2→4 | 6 Charge |
| Seravine Null | Ashen Covenant | Attrition / Knowledge Control | 8 | 1→2 | 7 Charge |
| Xochitl Pavón | El Quinto Sol | Sacred Momentum / Offensive Sustain | 7 | 3→5 | 7 Charge |

### Caelum Voss — Iron Century
- Units: Synchron Guard (2/4 cost2), Gearwright Apprentice (1/2 cost1), Pressure Monk (1/3 cost2 Charge:1), Ironveil Smuggler (2/2 cost2 Ranged), Underlurge Echo (4/5 cost4)
- Passive: "Measured Presence" — spell immunity before Recall (STUB — no spells in deck yet)
- Recalled active: "Unwound Hour" — 1 action, 0 Energy; freeze one enemy unit until start of their owner's next turn (LIVE)
- Recalled passive: "Temporal Read" — at start of turn, if Caelum is in the back row, gain +1 Charge (LIVE)

### Seravine Null — Ashen Covenant
- Units: Covenant Warden (2/4 cost2), Ash Scribe (1/2 cost1 Charge:1), Lector Surgeon (1/4 cost2), Quarantine Sentinel (2/4 cost3), The Remembered (3/6 cost4 Charge:2)
- Passive: "The Reading" — when a friendly unit dies, gain +1 Charge (LIVE)
- Recalled active: "Null Codex" — 1 action, 1 Energy; apply Weakened to all enemy units (LIVE)
- Recalled passive: "Compound Reading" — at start of Seravine's turn, each already-Weakened enemy gains +1 additional Weakened stack (LIVE)

### Xochitl Pavón — El Quinto Sol
- Units: Cuauhpilli Vanguard (2/4 cost2 Charge:1), Telpochcalli Scout (2/2 cost1), La Cantora Sagrada (1/3 cost2 Ranged Charge:1), Serpiente de Jade (2/4 cost3), Quetzal Ascendant (4/6 cost5)
- Passive: "Ofrenda Sagrada" — when Xochitl deals combat damage, gain +1 Charge (LIVE)
- Recalled active: "Xochiyaoyotl" — 1 action, 0 Energy; mark one enemy unit as sacred offering (LIVE)
- Recalled passive: "Plumas de Quetzalcóatl" — on attack, grant 1 Charge to a friendly unit of choice (STUB — requires mid-resolution targeting)

---

## File Structure

```
tactical-tcg/
├── CLAUDE.md               ← you are here
├── docs/
│   ├── DESIGN_SPEC.md      ← full design document
│   ├── REMNANTS.md         ← Remnant lore + card specs (canonical)
│   ├── CARDS.md            ← legacy card reference
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
- [x] Remnant character bible complete (3 active Remnants in `docs/REMNANTS.md`)
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
- [x] Remnant card system: 3 Remnants × 5 units = 15 unit defs + 6 companion defs
- [x] Deck selection screen: pre-game UI lets players choose any two different Remnants
- [x] Seravine passive live: "The Reading" fires on ally death
- [x] Xochitl passive live: "Ofrenda Sagrada" fires on Xochitl combat damage
- [x] Recall active abilities: Unwound Hour (Caelum), Null Codex (Seravine), Xochiyaoyotl (Xochitl)
- [x] Recall passives: Temporal Read (Caelum), Compound Reading (Seravine)
- [ ] Playtesting and tuning (Phase 7) — IN PROGRESS

---

## Resolved Bugs

Bugs found and fixed during development. Do not re-introduce these.

| Bug | Root Cause | Fix |
|---|---|---|
| **Opening phase auto-advanced after 1 card** | `p1Placed` used `.length` on `openingPlacements`, which is a 6-element sparse array initialized on first placement — so length was immediately 6 | Changed to `.filter(fc => fc !== null).length` to count only placed cards |
| **`revealOpeningBoards` built plain `CardInstance` for companion** | `makeInstance` always constructed a fresh `CardInstance` from the definition, discarding companion fields | Added a check: if `fc.instanceId === player.companion.instanceId`, return `player.companion` directly |
| **`player` and `enemy` hardcoded to `'player-1'`/`'player-2'`** | `GameScreen.tsx` hardcoded IDs — after End Turn, the active player was still shown as player-1 | Changed to derive from `state.activePlayerId` and `!== state.activePlayerId` |
| **Companion HP not updated when taking damage** | `dealDamage` updated the board slot but left `player.companion.currentHp` unchanged | `dealDamage` now syncs both the board slot and `player.companion` in the same map pass |
| **Win detection read HP before damage was applied** | `resolveAttack` checked `companion.currentHp <= 0` after `handleDeath` (slot already cleared) | Moved win check to immediately after `dealDamage`, before `handleDeath` |
| **Attack and move consumed no actions** | `resolveAttack` and `resolveMove` had no `spendAction` call | Added `spendAction(result, playerId)` at end of both functions |
| **Evolution permanently blocked** | `checkCompanionEvolution` was never called in `startTurn`; `evolutionChargeThreshold` was never copied from `CardDefinition` | Added `evolutionChargeThreshold` to `CompanionInstance`; `buildCompanionInstance` copies it; `startTurn` calls evolution check |
| **Evolution didn't apply evolved stats or sync board** | `checkCompanionEvolution` only bumped `evolutionStage` to 2; board slot occupant was never updated | Now looks up evolved definition, applies HP/ATK/keywords to both `player.companion` and the board slot occupant via `syncRow` |
| **No baseline charge gained per turn** | `CHARGE_BASELINE_PER_TURN` was defined but never used | `startTurn` now calls `gainCharge(next, activePlayerId, CHARGE_BASELINE_PER_TURN)` after energy reset |

---

## Session Snapshot

*Updated 2026-03-25 (latest). Overwrites previous snapshot entirely.*

---

### Completed Phases

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Core type system — `types.ts` (global ambient), `initialState.ts` (empty board + player factories) | ✅ Done |
| Phase 2 | Turn flow — `startTurn` (energy reset, draw to hand cap, baseline charge, Recall check), `endTurn`, `gainCharge`, `checkCompanionEvolution` | ✅ Done |
| Phase 3 | Combat + movement — `resolveAttack` (action cost, win detection, companion sync), `resolveMove` (action cost), `dealDamage`, `handleDeath` | ✅ Done |
| Phase 4 | Card play — `playUnitCard`, `playSpellCard` (generic fallthrough), `playUpgradeCard` (generic fallthrough); `spendAction` exported | ✅ Done |
| Phase 5 | Opening engine — `placeCardFaceDown` (sparse array, slot targeting), `isReadyToReveal`, `revealOpeningBoards` + `startTurn` called after reveal | ✅ Done |
| Pre-6 | Card data — 21 `CardDefinition` objects (3 Remnants × 5 units + 6 companion/recalled forms); registry; 3 `DeckConfig` objects + `remnantDecks[]` export | ✅ Done |
| Phase 6 | UI — all components wired to real state; `GameRouter` routes by phase; `GameScreen` has full click/selection/dispatch loop | ✅ Done |
| Opening Fixes | Sparse placement array; slot-targeted drag-and-drop; `playerId` field on action; count fix (non-null filter); two-step reveal confirmation | ✅ Done |
| Action economy | `resolveAttack` and `resolveMove` both call `spendAction`; both guard with `hasActionsRemaining`; auto-end turn when actions reach 0 | ✅ Done |
| Companion sync | `dealDamage` updates both board slot occupant and `player.companion.currentHp` in the same map pass | ✅ Done |
| Lane targeting | `getLegalTargets` rewritten: melee same lane only; ranged own lane + adjacent (±1); back slot reachable only when front is empty | ✅ Done |
| Recall system | `checkCompanionEvolution` called every `startTurn`; threshold stored on instance; evolved def stats applied to companion AND board slot occupant on trigger via `syncRow` | ✅ Done |
| Remnant rollout | Old prototype decks removed; 3 Remnant decks implemented; `DeckSelectScreen` added; Seravine + Xochitl passives live | ✅ Done |
| Game reset | `EndScreen` "Play Again" wired to `App.tsx` state reset via `onReset` prop — no page reload | ✅ Done |
| Recall abilities | Unwound Hour (freeze), Null Codex (Weaken all), Xochiyaoyotl (mark offering); Temporal Read + Compound Reading passives; frozen/weakened/offering status system; ability targeting UI | ✅ Done |

---

### Current State of the Game (what works when you run `npm run dev`)

- Game opens on **DeckSelectScreen** — P1 and P2 each pick a Remnant (cannot pick the same one); Start Game enabled when both have selected
- After Start Game, transitions to `phase: 'opening'`
- Each player has 6 cards in hand: companion + 5 deck units; drag to placement grid, front/back rows
- After both players place 6, two-step confirm → reveal transitions to `phase: 'main'`; `startTurn` fires immediately
- Main screen: enemy board (flipped) on top, tactical log sidebar (right), player board below, hand + HUD at bottom
- Unit cards can be played to empty board slots (Energy deducted, action spent); board shows name/HP/ATK/Melee/Ranged
- Units can move to adjacent empty slots; melee attacks same-lane enemy; ranged attacks own + adjacent lanes
- Each turn: `startTurn` resets energy (grows +1/turn, cap 6), resets actions to 3, draws to hand cap, grants 1 baseline Charge
- When active player's actions reach 0, a gold banner appears and the turn auto-ends after 1.2 seconds
- **Seravine passive**: when any friendly unit dies, event log shows "Seravine's The Reading — gained 1 Charge"
- **Xochitl passive**: when Xochitl attacks, event log shows "Xochitl's Ofrenda Sagrada — gained 1 Charge"
- Recall: at `startTurn`, if companion charge ≥ threshold, companion stats update to Recalled form
- **Recall active abilities**: once Recalled, a `✦ [Ability Name]` button appears above the hand; Seravine fires immediately (Null Codex — Weaken all enemies, costs 1 Energy); Caelum and Xochitl enter targeting mode (all occupied enemy slots highlight; click one to apply Unwound Hour freeze or Xochiyaoyotl mark)
- **Recall passives**: Temporal Read (Caelum in back row → +1 Charge at turn start); Compound Reading (each already-Weakened enemy gains +1 Weakened stack at start of Seravine's turn)
- **Status badges**: board slots show `❄ FROZEN`, `↓ WEAK ×N`, `✦ OFFERING` text badges when effects are active
- Companion HP → 0 triggers `winner` + `phase: 'ended'`; `GameRouter` shows winner screen with "Play Again" → returns to deck selector (no page reload)
- TypeScript: zero errors (`npx tsc --noEmit` clean)

---

### Known Issues

| Issue | Location | Notes |
|---|---|---|
| **Opening placement order hardcoded** | `OpeningScreen.tsx` | Player 1 always places first. No randomization or coin flip. |
| **Plumas de Quetzalcóatl not yet implemented** | `combat.ts`, `GameScreen.tsx` | Xochitl Recalled passive: "on attack, grant 1 Charge to a friendly unit of your choice" — requires a mid-resolution targeting prompt, deferred. |
| **No spells or upgrades in current decks** | `definitions.ts`, `decks.ts` | The 2 spell/upgrade slots per deck are TBD per REMNANTS.md. Until added, each deck has 10 unit cards only. |

---

### Active File List

| File | Purpose |
|---|---|
| `config/gameConstants.ts` | `GAME_CONSTANTS` — energy cap, growth, hand size cap, actions per turn, `CHARGE_BASELINE_PER_TURN` |
| `src/main.tsx` | ReactDOM entry — `createRoot` → `<App />` |
| `docs/REMNANTS.md` | Canonical Remnant lore + card specs (3 active Remnants) |
| `src/cards/definitions.ts` | 21 `CardDefinition` objects (3 companion pairs + 15 units) + `allCards[]` |
| `src/cards/registry.ts` | `getCardDefinition(id)` and `getCardDefinitionOrThrow(id)` |
| `src/cards/decks.ts` | `DeckConfig` type; `ironCenturyDeck`, `ashenCovenantDeck`, `quintoSolDeck`; `remnantDecks[]` export |
| `src/engine/abilities.ts` | `activateAbility` — routes `ACTIVATE_ABILITY` actions: Unwound Hour (freeze), Null Codex (Weaken all), Xochiyaoyotl (mark offering) |
| `src/engine/cardPlay.ts` | `playUnitCard`; `playSpellCard` (generic); `playUpgradeCard` (generic); `spendAction` exported |
| `src/engine/combat.ts` | `dealDamage` (syncs companion HP), `handleDeath` (Charge keyword + Seravine passive), `resolveAttack` (action cost, win detection, frozen guard, Xochitl passive) |
| `src/engine/movement.ts` | `resolveMove` — action cost, actions guard, frozen guard, legal move check |
| `src/engine/opening.ts` | `placeCardFaceDown` (sparse 6-slot array, slot-targeted), `isReadyToReveal`, `revealOpeningBoards` (companion preserved) |
| `src/engine/turnFlow.ts` | `startTurn` (energy reset, draw, clear statuses, Temporal Read, Compound Reading, baseline charge, Recall check), `endTurn`, `gainCharge`, `checkCompanionEvolution`, `clearActivePlayerStatuses` |
| `src/rules/movement.ts` | `getAdjacentSlots` (same row ±1, opposite row same index), `getLegalMoves` (empty slots only) |
| `src/rules/targeting.ts` | `isLaneClear`, `canAttackFromPosition`, `getLegalTargets` (melee same lane; ranged ±1 lane) |
| `src/rules/validation.ts` | `hasEnoughEnergy`, `hasActionsRemaining`, `isSlotEmpty`, `getLegalPlaySlots` (all empty slots) |
| `src/state/types.ts` | All global TS types — `CardDefinition` has `timeline?`, `subtype?`; `CompanionInstance` has `evolutionChargeThreshold: number`; `CardInstance` has `frozen?`, `weakenedStacks?`, `markedAsOffering?` |
| `src/state/initialState.ts` | `createEmptyBoard`, `createInitialPlayerState`, `createInitialGameState` |
| `src/state/store.ts` | React context + `useReducer`; accepts `p1DeckId`/`p2DeckId` props; `buildInitialState` looks up from `remnantDecks` |
| `src/ui/App.tsx` | Deck selection state (`deckSelections`); threads `onReset` to `GameRouter`; renders `DeckSelectScreen` when null |
| `src/ui/DeckSelectScreen.tsx` | Two-column pre-game selector; prevents duplicate picks; Start Game button |
| `src/ui/EndScreen.tsx` | GAME OVER screen; winner/loser columns with HP pips and evolution turn; key moment from log; "Play Again" calls `onReset` |
| `src/ui/OpeningScreen.tsx` | Drag-and-drop face-down placement; sparse-array `filled` check; two-step reveal confirmation |
| `src/ui/GameScreen.tsx` | Click/select/dispatch loop; `pendingAbility` targeting mode; `✦ [Ability]` button with cancel; auto-end turn banner; evolution banner |
| `src/ui/Board.tsx` | 3×2 grid of `BoardSlot`; `flipped` renders back row first for enemy perspective |
| `src/ui/BoardSlot.tsx` | Name, HP, ATK, Melee/Ranged, status badges (❄ FROZEN / ↓ WEAK ×N / ✦ OFFERING); green border = legal target |
| `src/ui/Hand.tsx` | Name, cost ⚡ (gold), type badge (color-coded), HP/ATK for units |
| `src/ui/HUD.tsx` | Energy/max, actions, deck count, companion name/HP/charge; gold border if active player |
| `src/ui/EventLog.tsx` | Last 8 entries from `state.eventLog`; fixed 160px height, `overflowY: scroll` |

---

### Design Decisions Locked In

| Decision | Rule |
|---|---|
| **Lane targeting — Melee** | Attacks only the enemy slot at the same lane index. If front is empty, can reach the back slot in that same lane (no cross-lane). |
| **Lane targeting — Ranged** | Attacks own lane ± adjacent lanes (up to 3 lanes). For each lane, front slot is the primary target; back slot is reachable only if front is empty. |
| **Companion as win condition** | Companion HP reaching 0 sets `winner` and `phase: 'ended'` immediately in `resolveAttack`. No separate life total. |
| **Opening placement** | Each player places all 6 cards (companion + 5 deck cards) face-down into specific board slots. Reveal is simultaneous. Companion is the first card in the opening hand. |
| **Action economy** | Playing, moving, and attacking each cost 1 action. Moving costs 0 Energy. Energy is only spent on card play. |
| **Companion HP sync** | `dealDamage` always updates both `player.companion.currentHp` and the board slot occupant in the same reducer pass. |
| **Recall terminology** | In-engine: `checkCompanionEvolution`, `evolutionStage`, `evolutionDefinitionId` (legacy names kept for compatibility). In design docs and UI: "Recall" is the correct term. |
| **`companion.definitionId` never changes** | It always holds the base form ID (e.g., `'caelum-voss'`). Use `evolutionStage === 2` + `definitionId` together to detect Recalled state. Never check for the `-recalled` ID on `definitionId`. |
| **Weakened stacks** | Applying Weakened immediately decrements `currentAttack` (floor 0) AND increments `weakenedStacks`. All existing attack math uses `currentAttack` unchanged. Compound Reading applies additional stacks at the start of Seravine's turn. Stacks are cleared when the unit dies (unit is removed from board). |
| **Status effect clearing** | `frozen` and `markedAsOffering` clear at the start of the affected unit's **owner's** next turn, not the caster's. `clearActivePlayerStatuses` runs in `startTurn` before Charge and Recall checks. |
| **Active ability costs** | All companion active abilities cost 1 action. `null-codex` additionally costs 1 Energy. No other ability costs Energy. Abilities are only available after Recall (`evolutionStage === 2`). |

---

### Next Action

**Phase 7 — Remaining work in priority order:**

1. **Add deck spells/upgrades** — each Remnant has 2 open card slots per REMNANTS.md
2. **Implement Plumas de Quetzalcóatl** — Xochitl Recalled passive: on attack, grant 1 Charge to a friendly unit (requires mid-resolution targeting UI)
