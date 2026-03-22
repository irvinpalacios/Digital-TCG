# ROADMAP.md — Build Phases

Phased development plan. Do not skip ahead.

---

## Phase 1 — Core State Model (Start Here)

Goal: Define the data model. Nothing should be built before this is solid.

- [ ] `GameState` type
- [ ] `PlayerState` type
- [ ] `BoardState` type — 6 slots per player
- [ ] `Slot` type — position, row, occupant
- [ ] `CardDefinition` type — static card data
- [ ] `CardInstance` type — runtime card on board
- [ ] `CompanionState` type — extends CardInstance, tracks evolution stage, Charge
- [ ] `Action` type — typed actions with source/target
- [ ] `Effect` type — resolved game effects
- [ ] `TargetRule` type — constraint for legal targets

**Deliverable:** Full TypeScript type system with no runtime logic yet.

---

## Phase 2 — Turn Flow Engine

Goal: Implement the turn lifecycle as pure state reducers.

- [ ] `startGame()` — initialize GameState from two deck configs
- [ ] `revealOpeningBoard()` — flip face-down cards simultaneously
- [ ] `drawCard()` — draw to hand cap (5)
- [ ] `startTurn()` — energy refresh, Charge gain, evolution check
- [ ] `endTurn()` — cleanup, pass to opponent
- [ ] `checkCompanionEvolution()` — check condition + Charge threshold

**Deliverable:** Turn can cycle cleanly with no errors in a test harness.

---

## Phase 3 — Combat and Movement

Goal: Implement legal movement and attack resolution.

- [ ] `getLegalMoves(unit, boardState)` — adjacent empty slots
- [ ] `moveUnit(from, to, gameState)` — reducer
- [ ] `getLegalTargets(attacker, boardState)` — front-row priority, Ranged exception, lane vulnerability
- [ ] `isVulnerable(slot, boardState)` — is front slot in this lane empty?
- [ ] `attackTarget(attacker, target, gameState)` — damage, death, Charge triggers
- [ ] Death resolution — remove unit, trigger Charge: X, trigger Soul Siphon etc.

**Deliverable:** Two units can fight with correct targeting and damage rules.

---

## Phase 4 — Card Play

Goal: Cards can be played from hand into slots.

- [ ] `getLegalPlaySlots(card, playerState)` — which slots accept this card
- [ ] `playCard(card, slot, gameState)` — place unit, pay Energy, cost 1 action
- [ ] Upgrade card targeting — attach to existing unit
- [ ] Spell resolution — resolve effect, no board slot needed

**Deliverable:** Player can play a card from hand onto the board.

---

## Phase 5 — Opening Deployment

Goal: Implement the face-down simultaneous opening.

- [ ] Face-down placement phase
- [ ] Simultaneous reveal
- [ ] Lock-in before reveal (no take-backs)

**Deliverable:** Game starts with both players placing 6 cards face-down, then revealing.

---

## Phase 6 — UI Integration

Goal: Wire the UI to the real state model.

- [ ] Board component reads from `GameState`
- [ ] Actions dispatch to engine reducers
- [ ] Hand renders from `PlayerState.hand`
- [ ] Energy and Charge HUD
- [ ] Turn and action counter
- [ ] Event log

**Deliverable:** A playable single-screen prototype, even if both sides are manual.

---

## Phase 7 — Playtesting Loop

Goal: Validate the core loop is actually fun.

- [ ] Play Tempo vs Sacrifice 10+ times
- [ ] Measure average match length (target: 8–12 min)
- [ ] Identify snowball scenarios
- [ ] Identify unreadable states
- [ ] Tune HP, Attack, Energy costs, Charge thresholds

---

## Phase 8+ (Post-Validation Only)

Do not build until Phase 7 confirms the loop is fun.

- Reaction / interrupt system
- Additional factions
- Second evolution stage
- Keyword expansion
- Networked multiplayer
- Ranked ladder
- Audio / visual polish
- Card art
- Cosmetics

---

## Current Status

**Active Phase:** Phase 1 — Core State Model

**Next Action:** Define TypeScript types in `src/state/types.ts`
