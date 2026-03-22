# CARDS.md — Prototype Card Definitions

All card definitions for the two MVP prototype decks.

---

## Deck 1: Tempo / Lane Pressure

**Theme:** Mobility, efficient pressure, opening lanes, aggressive tactical play.

---

### Companion: Auric Cub

| Property | Value |
|---|---|
| Type | Companion |
| HP | 8 |
| Attack | 2 |
| Cost | — (starts on board) |
| Row | Any |
| Keywords | — |
| Evolution | → Auric Leon |
| Evolution Condition | 4 Charge + companion has attacked at least twice |

**Ability:** *Swift Pounce* — Once per turn, after this unit attacks, it may move to an adjacent empty slot for free.

---

### Evolved Companion: Auric Leon

| Property | Value |
|---|---|
| Type | Companion (Evolved) |
| HP | 14 |
| Attack | 4 |
| Row | Any |
| Keywords | — |
| Evolution Stage | 2 |

**Ability:** *Pride's Charge* — Once per turn, this unit may attack twice. The second attack costs 0 actions.

**Flavor:** The cub's speed becomes unstoppable momentum.

---

### Lane Prowler

| Property | Value |
|---|---|
| Type | Unit |
| Cost | 2 Energy |
| HP | 3 |
| Attack | 2 |
| Row | Front |
| Keywords | — |

**Ability:** *Open Lane* — When this unit moves, the slot it left becomes open. If that slot was front row, any back row unit in the same lane gains **Exposed** until end of turn (can be targeted by any attack).

---

### Vanguard Hound

| Property | Value |
|---|---|
| Type | Unit |
| Cost | 1 Energy |
| HP | 2 |
| Attack | 1 |
| Row | Front |
| Keywords | — |

**Ability:** *Intercept* — When an adjacent ally is attacked, you may move this unit into the attacker's lane (if a front slot is open) before damage resolves.

---

### Bolt Skipper

| Property | Value |
|---|---|
| Type | Unit |
| Cost | 2 Energy |
| HP | 2 |
| Attack | 2 |
| Row | Back |
| Keywords | Ranged |

**Ability:** *Skip Shot* — This unit may attack a back-row unit directly, ignoring the front-row protection of that lane, once per turn.

---

### Pack Signal

| Property | Value |
|---|---|
| Type | Spell |
| Cost | 1 Energy |
| Row | — |

**Effect:** Move up to **two friendly units** to empty adjacent slots. This counts as free movement (does not cost actions).

---

### Sharpen Instinct

| Property | Value |
|---|---|
| Type | Upgrade |
| Cost | 2 Energy |
| Target | Friendly unit |

**Effect:** Target friendly unit gains +2 Attack until end of turn. If attached to the companion, also gain 1 Charge.

---

### Pounce Window

| Property | Value |
|---|---|
| Type | Spell |
| Cost | 1 Energy |
| Row | — |

**Effect:** Choose a front-row lane. The enemy unit in that lane (if any) is **pushed** to their back row in the same lane (if empty). If the front slot is already empty, draw 1 card instead.

---

## Deck 2: Sacrifice / Evolution Ramp

**Theme:** Friendly deaths as value, Charge acceleration, delayed payoff, powerful evolved companion.

---

### Companion: Ember Wisp

| Property | Value |
|---|---|
| Type | Companion |
| HP | 6 |
| Attack | 1 |
| Cost | — (starts on board) |
| Row | Back preferred |
| Keywords | — |
| Evolution | → Cinder Seraph |
| Evolution Condition | 6 Charge |

**Ability:** *Soul Siphon* — Whenever a friendly unit dies, gain 1 Charge.

*Note: This companion is intentionally fragile. The strategy is to not let it get hit, and rush evolution via sacrifice.*

---

### Evolved Companion: Cinder Seraph

| Property | Value |
|---|---|
| Type | Companion (Evolved) |
| HP | 12 |
| Attack | 4 |
| Row | Any |
| Keywords | Ranged |
| Evolution Stage | 2 |

**Ability:** *Inferno Nova* — Once per turn, deal 1 damage to **all** enemy units. If a unit dies from this effect, gain 1 Charge.

**Flavor:** From ash, a conflagration.

---

### Ash Drudge

| Property | Value |
|---|---|
| Type | Unit |
| Cost | 1 Energy |
| HP | 1 |
| Attack | 1 |
| Row | Front |
| Keywords | Charge: 1 |

**Note:** `Charge: 1` — When this unit dies, gain 1 Charge.

*Designed to be sacrificed. Cheap, dies easily, feeds the engine.*

---

### Pyre Acolyte

| Property | Value |
|---|---|
| Type | Unit |
| Cost | 2 Energy |
| HP | 2 |
| Attack | 1 |
| Row | Front |
| Keywords | Charge: 2 |

**Ability:** *Final Flame* — When this unit dies, deal 1 damage to the enemy unit that killed it.

---

### Grave Lancer

| Property | Value |
|---|---|
| Type | Unit |
| Cost | 3 Energy |
| HP | 3 |
| Attack | 3 |
| Row | Back |
| Keywords | Ranged |

**Ability:** *Death Surge* — Whenever a friendly unit dies this turn, this unit gains +1 Attack until end of turn (stackable).

---

### Soul Kindle

| Property | Value |
|---|---|
| Type | Spell |
| Cost | 1 Energy |
| Row | — |

**Effect:** Sacrifice a friendly non-companion unit. Gain **3 Charge**.

*The core sacrifice engine card. Turns any unit into an evolution accelerant.*

---

### Ember Mantle

| Property | Value |
|---|---|
| Type | Upgrade |
| Cost | 2 Energy |
| Target | Companion only |

**Effect:** Your companion gains +2 HP and +1 Attack permanently. If your companion is Ember Wisp, also gain 1 Charge.

---

### Death Flare

| Property | Value |
|---|---|
| Type | Spell |
| Cost | 2 Energy |
| Row | — |

**Effect:** Deal 2 damage to **all units** (both players). For each unit that dies from this effect, gain 1 Charge.

*High risk, high reward. Often used to trigger multiple Charge: X keywords at once.*

---

## Keyword Reference (MVP)

| Keyword | Rules Text |
|---|---|
| **Ranged** | This unit may attack from the back row. It may also target back-row units directly, ignoring front-row protection. |
| **Charge: X** | When this unit dies, the controlling player gains X Charge. |

---

## Card Design Notes

- All costs are provisional and subject to playtesting
- HP values are low by design — fast matches require units to die
- Companion HP is also low — the win condition should feel threatened
- Companion evolved forms are significantly stronger to reward the evolution path
- Both decks have 6 distinct cards. In a real deck, each card would have multiple copies — copy counts TBD during playtesting
