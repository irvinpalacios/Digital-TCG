# DESIGN_SPEC.md — Tactical Companion TCG

Full design specification for the MVP and beyond.

---

## Vision

A **fast tactical companion battler**. Players bond with a signature companion, build a deck around it, and fight to evolve it and defeat the opponent's companion.

- Match length target: **8–12 minutes**
- Strategic but not bloated
- Sacrifice can be beneficial
- Positioning matters
- Evolution is a central power spike
- Digital-only mechanics used where they add value
- Gameplay should be readable — not overloaded with triggers

---

## Core Design Pillars

| Pillar | Description |
|---|---|
| Digital-first | Mechanics that only work in a digital context are embraced |
| Companion-centered | Your companion is the heart of your deck and your win condition |
| Fast matches | 8–12 minute target; no bloated turns |
| Positioning matters | Front/back row have distinct tactical identities |
| Sacrifice is strategic | Losing units can accelerate evolution or generate value |
| Evolution is core | Not optional flavor — it's a primary power axis |
| Limited counterplay | Light reaction system; no full stack war |
| Readable board | Compact board; players can always understand the state |

---

## Battlefield Structure

**Fixed ownership.** No territory capture. Each player owns their 6 slots permanently.

```
ENEMY BOARD
[ Front-0 ] [ Front-1 ] [ Front-2 ]
[ Back-0  ] [ Back-1  ] [ Back-2  ]

PLAYER BOARD
[ Back-0  ] [ Back-1  ] [ Back-2  ]
[ Front-0 ] [ Front-1 ] [ Front-2 ]
```

- Front row protects the back row
- Empty front slots create lane vulnerabilities
- Lanes are paired: Front-0 ↔ Back-0, Front-1 ↔ Back-1, Front-2 ↔ Back-2

---

## Win Condition

**Defeat the opponent's companion.** No separate player life total.

The companion must survive. Losing it means losing the game.

---

## Companion System

- Starts on the board (placed face-down during opening)
- Is an **active fighter** — can move, attack, evolve
- Has HP, Attack, and abilities
- Has an **evolution condition**
- Is the primary loss condition for the opponent

---

## Opening Phase

1. Each player selects their starting 6 cards (companion + 5)
2. All 6 cards are placed face-down into all 6 slots
3. Both players **reveal simultaneously**
4. No dead early turns — full board presence from turn 1
5. Creates mind games and "chess opening" energy

This is one of the game's strongest differentiators.

---

## Positioning and Movement

- Units can move into **empty adjacent slots** (horizontal or vertical adjacency TBD)
- Movement costs **1 action**, **0 Energy**
- Possible future additions: swap effects, teleportation, positional spells

---

## Combat

- **Front-row units** can attack normally
- **Back-row units** cannot attack unless they have the `Ranged` keyword
- Front row protects back row
- If a front slot is **empty**, the back-row unit in the same lane is **vulnerable** — attackers may target it directly

### Targeting Rules

- **Melee units** attack the enemy slot directly in front of them (same lane index)
- If that front slot is empty, melee can reach the back slot in the same lane
- **Ranged units** can attack their own lane plus adjacent lanes (up to 3 lanes wide)
- For each targetable lane, if the front slot is empty the back slot in that lane is also targetable
- Ranged units cannot target a back slot if the front slot in that lane is occupied

---

## Action Economy

Each turn: **3 actions**

| Action | Cost |
|---|---|
| Play a card | 1 action + Energy |
| Move a unit | 1 action |
| Attack with a unit | 1 action |
| Activate an ability | 1 action (+ possible Energy) |

3 actions forces prioritization and tradeoffs. Turns stay fast.

---

## Hand and Card Flow

- Hand size: **5 cards**
- Draw: traditional (draw at start of turn)
- Playing a card: costs 1 action + Energy cost of the card
- With 3 actions and a 5-card hand, players usually won't dump everything — choices matter

---

## Resource System

### Energy

| Property | Value |
|---|---|
| Starting max | 2 |
| Growth | +1 per turn |
| Cap | 6 |
| Refresh | Full at start of turn |

Spent on: playing cards, abilities, upgrades.
Movement and attacking cost **0 Energy** — only actions.

### Charge

Accumulated through:
- Baseline turn gain (TBD amount)
- Friendly units dying
- Companion dealing damage
- Specific card effects

Used exclusively for companion evolution.

---

## Evolution System

- Check at **start of player's turn**
- If companion has sufficient Charge + meets any secondary condition → may evolve
- Evolution changes: stats, abilities, tactical role
- Should feel powerful but not like an instant win

### Evolution Design Intent
- Power spike that rewards patient play
- Sacrifice strategies can accelerate it
- Not every match will see a second evolution (if multi-stage is added later)

---

## Modularity / Upgrade Cards

Some cards can be played onto **units already on the field** as upgrades or attachments.

This is a **subset mechanic** — not universal. Cards explicitly marked as upgrades can target existing units.

Examples: stat buffs, keyword additions, persistent auras.

---

## Reaction / Counterplay System

Intentionally light. Not designed for MVP.

Design intent:
- Some interrupt-style decision points
- Should not become a stack war
- Should not slow games meaningfully

Defer until core gameplay loop is validated.

---

## Keyword List (MVP Only)

| Keyword | Meaning |
|---|---|
| Ranged | Can attack from back row |
| Charge: X | When this unit dies, gain X Charge |

Expand only after MVP is stable.

---

## MVP Scope

### In Scope
- Game state model
- 6-slot board per player
- Companion (move, attack, evolve)
- 3 actions per turn
- Energy system
- Charge system
- Simple evolution (one stage)
- Movement (adjacent empty slot)
- Combat (front row / Ranged rules)
- Turn flow (start → draw → action → end)
- Card play (place into slot)
- 2 prototype decks (Tempo and Sacrifice)
- Basic UI shell

### Out of Scope for MVP
- Reaction / interrupt system
- Multiple factions
- Expanded keyword list
- Networked multiplayer
- Animation / sound
- Content expansion

---

## Design Risk Areas

### 1. System Overload
Too many mechanics too soon. The design includes: positioning, movement, Energy, Charge, evolution, upgrades, reactions. MVP must ruthlessly stay narrow.

### 2. Snowballing
Companion is the win condition. Evolution is a power spike. Early advantage may compound badly. Monitor during playtesting.

### 3. Readability
Players must always understand:
- What can attack what
- When evolution triggers
- What movement can do
- When back row is vulnerable

### 4. Fast but Strategic
Depth must stay visible without adding clutter or slowing turns.

---

## Competitive Differentiation

| Feature | This Game | Duelyst | Hearthstone | Marvel Snap |
|---|---|---|---|---|
| Tactical board | ✅ 6-slot | ✅ Full grid | ❌ | ✅ Compact |
| Companion as win condition | ✅ | ❌ | ❌ | ❌ |
| Face-down opening | ✅ | ❌ | ❌ | ❌ |
| Evolution mechanic | ✅ Core | ❌ | ❌ | ❌ |
| Dual resource (Energy + Charge) | ✅ | ❌ | ❌ | ❌ |
| Match length 8–12 min | ✅ | ~15–20 | ~10–20 | ~3–5 |

---

## Future Expansion (Post-MVP, Do Not Build Yet)

- Multiple companion factions
- Second evolution stage
- Reaction / interrupt cards
- Positional spells (teleport, swap)
- PvP networking
- Ranked / ladder system
- Full keyword library
- Cosmetics
