# REMNANTS.md — Character Design Bible

This file is the canonical lore and card specification document for every Remnant in the game.
Each entry contains two sections: the **Story Bible** (narrative, world, Signature lore) and the
**Card Specification** (mechanical data ready for implementation in `definitions.ts`).

---

## What Is A Remnant?

Remnants are legendary figures pulled from fractured timelines — heroes, rulers, inventors, warriors —
who existed at the peak of their power in their own age and world, and have been drawn into a shared
convergence space where those timelines collapse together.

They arrive diminished. Not incomplete — they are fully themselves as people — but separated from the
instrument through which their legend was made real. The game builds toward the moment of **Recall**:
when a Remnant accumulates enough Charge, their Signature manifests. The weapon, spell, or defining
power of their legend arrives. Stats update. New abilities activate. The character doesn't transform.
They remember.

---

## Remnant Template

Each Remnant entry follows this structure:

- **Timeline** — which world they come from
- **Legend Summary** — one paragraph; who they were at their greatest
- **Arrival State** — how and why they arrived diminished through the Convergence
- **Personality** — how they carry themselves; what they will and won't say
- **The Signature** — the weapon or power, its name, its story, what it does
- **Unit Roster** — the five units drawn from their timeline
- **Card Specification** — mechanical data for engine implementation

---
---

# CAELUM VOSS
## The Keeper of the Unwound Hour

**Timeline:** The Iron Century
**Role:** Control / Temporal Disruption
**Recall Mechanic:** Temporal suppression — restricts enemy unit actions

---

### Legend Summary

In the Iron Century, time was never meant to be a mechanism. Gears moved pistons. Steam moved gears.
Industry moved civilization forward in one direction — always forward, always more, always faster.
That was the covenant of the age. Progress was sacred. Regression was heresy.

Caelum Voss broke that covenant alone, in a workshop no one else was ever allowed to enter, and spent
the rest of his life making sure no one found out.

He was a master horologist — a clockmaker of unmatched precision — commissioned by the state to build
the **Grand Synchron**: the most accurate timekeeping instrument in the Iron Century's history, a clock
that would synchronize every city, every factory, every rail line across the continent. The project
took eleven years. In the final calibration, something happened that his notes describe only as
*"the gears found a frequency the world had not assigned them."* Time didn't stop. It became
navigable. For exactly 44 seconds, Voss stood outside of it and watched the world hold its breath
around him.

He destroyed his notes immediately. Rebuilt the Grand Synchron to function as an ordinary — if
extraordinary — clock. Delivered it on schedule. Accepted his commission. Went home.

Then spent three years reconstructing what had happened, in secret, miniaturizing it, making it
wearable. Making it his.

The watch he built is not beautiful in any obvious way. Too many nested faces. Too many hands moving
in directions hands shouldn't move. It looks like a mistake made by someone who knew exactly what
they were doing.

He used it sparingly. Precisely. Surgically. Always alone. Always unseen. To prevent specific
disasters. To correct specific moments. Never for himself — always for the architecture of a timeline
he quietly decided he was responsible for protecting.

No one in the Iron Century knows what Caelum Voss really is. They know him as the man who built the
Grand Synchron. A great craftsman. Polite, unremarkable in public, slightly difficult to pin down in
conversation — like he always knows where the dialogue is going before it gets there.

He does. Because sometimes he's already heard it.

---

### Arrival State

Voss arrived through the Convergence mid-motion — watch already open in his hand, as though
interrupted in the act of a correction. He has not explained what he was correcting, or whether he
succeeded. He closed the watch immediately upon arrival and has not opened it since.

He arrived as himself — composed, observant, unhurried. Whatever diminishment the Convergence imposed
on him, he does not show it. His Charge accumulates not from grief or rage but from the slow,
deliberate act of *paying attention* — watching, calculating, waiting for the moment when the watch
should open again.

---

### Personality

Voss speaks carefully and listens to everything. He does not volunteer information about his timeline.
He asks precise questions. He is not cold — he is *measured*. There is a difference.

He has a particular quality that unsettles people who notice it: he is never surprised. Not by
ambushes, reversals, bad news, or sudden developments. He receives all of it with the same quiet
acknowledgment of a man reading a page he has already read.

He will not open the watch lightly. When he does, he does not announce it. He simply acts, and the
world around him accommodates.

The one thing that seems to genuinely cost him something: being asked directly what he has changed.
He does not lie. He also does not answer.

---

### The Signature — RECALL

**Name:** The Voss Watch — *The Unwound Hour*

**Lore:**
When Caelum Recalls, the watch opens — not the outer case, but the inner mechanism. A second face
unfolds from the first, and a third from the second, like a flower made of brass and impossible
geometry. The hands on each face run at different speeds. One forward. One backward. One in a
direction that has no name.

For the duration of its activation, Caelum operates slightly outside of the present moment. He is
not faster than his enemies. He has already seen what they are about to do.

The watch does not make him invincible. It makes him *prepared*. He has always been cautious with
this power — he does not use it to dominate, he uses it to prevent the worst outcome. That restraint
is character-accurate and mechanically intentional: the Recall state shifts him from a solid frontline
presence to a **control-oriented suppressor**, able to restrict enemy unit actions or movement within
specific lanes.

**Visual:** The watch face opens into three nested layers of brass, each rotating independently. The
air around Voss takes on a faint luminous quality — not light exactly, but the *impression* of light
that has arrived slightly before it should.

---

### Unit Roster — The Iron Century

These five units are drawn from Caelum's timeline. They do not all know him personally. They are the
Iron Century made playable — the soldiers, workers, believers, and aberrations of that world.

---

#### 1. SYNCHRON GUARD
*"They keep time with their lives."*

Elite soldiers of the Grand Synchron's institutional order. Drilled to mechanical precision, their
formations are coordinated to the second. They do not know what Voss really is — they serve the
institution he built, not the man himself.

- **Type:** Unit — Melee
- **Role:** Front line anchor, hard to displace
- **Flavor:** Discipline made flesh. They move in step because the clock demands it.

---

#### 2. GEARWRIGHT APPRENTICE
*"Still learning which questions not to ask."*

Young engineers early in their training — fast, curious, and fragile. They represent who Voss was
before everything changed: brilliant, ambitious, and unaware of what precision can cost.

- **Type:** Unit — Melee
- **Role:** Cheap early play, lane pressure, expendable
- **Flavor:** They remind Voss of something. He doesn't say what.

---

#### 3. PRESSURE MONK
*"The machine is the prayer. The prayer is the machine."*

A religious figure from the Iron Century's industrial theology — a faith that holds that the great
engines are not tools but *temples*, and that to maintain them with devotion is a form of worship.
The Pressure Monks tend the deep boilers and the resonance chambers. They also tend the dying.

- **Type:** Unit — Melee
- **Role:** Mid-cost, generates Charge under specific conditions
- **Flavor:** Devoted to something larger than themselves. In this, they are not unlike Voss.

---

#### 4. IRONVEIL SMUGGLER
*"What moves through the dark keeps the light running."*

Someone who moves things across borders that shouldn't be moved — information, components,
people. Operates in the grey margins of the Iron Century. Knows how to keep secrets. Does not know
whose secrets they are adjacent to.

- **Type:** Unit — Ranged
- **Role:** Back row, evasive, lane flexibility
- **Flavor:** Useful. Discreet. Asks no questions Voss doesn't want answered.

---

#### 5. UNDERLURGE ECHO
*"It was here before the first gear turned. It will be here after the last."*

Something ancient that the Iron Century's deep drilling disturbed — a presence that predates
industry, that experiences time not as a line but as a texture. It is not evil. It is not tame.
It is aware of Voss in a way that makes even him uncomfortable, because it seems to perceive the
watch not as a device but as a *kinship*.

- **Type:** Unit — Melee
- **Role:** High-cost, high-impact, late-game anchor
- **Flavor:** The only thing in the Iron Century that truly understands what Voss carries.
  Neither of them mentions this.

---
---

## Card Specification

*Ready for implementation in `src/cards/definitions.ts`*

```typescript
// ─── CAELUM VOSS — Base Form ───────────────────────────────────────────────

{
  id: 'caelum-voss',
  name: 'Caelum Voss',
  type: 'companion',
  subtype: 'Remnant',
  timeline: 'Iron Century',
  cost: 0,                      // companions are free; placed during opening
  attack: 2,
  hp: 7,
  keywords: [],
  evolutionDefinitionId: 'caelum-voss-recalled',
  evolutionChargeThreshold: 6,  // tune during playtesting
  flavorText: 'He already knows how this ends. He came anyway.',
  abilities: [
    {
      id: 'measured-presence',
      name: 'Measured Presence',
      description: 'Passive: Caelum cannot be targeted by enemy spell effects while he has not yet Recalled.',
      trigger: 'passive'
    }
  ]
}

// ─── CAELUM VOSS — Recalled Form ──────────────────────────────────────────

{
  id: 'caelum-voss-recalled',
  name: 'Caelum Voss — The Unwound Hour',
  type: 'companion',
  subtype: 'Remnant',
  timeline: 'Iron Century',
  cost: 0,
  attack: 4,
  hp: 7,                        // HP carries over; does not reset on Recall
  keywords: [],
  flavorText: 'The watch opened. The world held its breath.',
  abilities: [
    {
      id: 'unwound-hour',
      name: 'The Unwound Hour',
      description: 'Active (costs 1 action): Choose one enemy unit. That unit cannot attack or move until the start of your next turn.',
      trigger: 'active',
      cost: { actions: 1, energy: 0 }
    },
    {
      id: 'temporal-read',
      name: 'Temporal Read',
      description: 'Passive: At the start of your turn, if Caelum is in the back row, gain +1 Charge.',
      trigger: 'passive'
    }
  ]
}

// ─── DECK CONFIGURATION ───────────────────────────────────────────────────

// ironCenturyDeck (Caelum Voss)
// 2x each unit card = 10 unit cards + 2x each spell/upgrade = deck of 12

const ironCenturyDeck: DeckConfig = {
  companionId: 'caelum-voss',
  cards: [
    { definitionId: 'synchron-guard',       count: 2 },
    { definitionId: 'gearwright-apprentice', count: 2 },
    { definitionId: 'pressure-monk',        count: 2 },
    { definitionId: 'ironveil-smuggler',    count: 2 },
    { definitionId: 'underlurge-echo',      count: 2 },
    // Spell / Upgrade slots (2 remaining) — TBD during Phase 7+
  ]
}

// ─── UNIT CARD DEFINITIONS ────────────────────────────────────────────────

{
  id: 'synchron-guard',
  name: 'Synchron Guard',
  type: 'unit',
  timeline: 'Iron Century',
  cost: 2,
  attack: 2,
  hp: 4,
  keywords: [],
  flavorText: 'In step. Always in step.',
}

{
  id: 'gearwright-apprentice',
  name: 'Gearwright Apprentice',
  type: 'unit',
  timeline: 'Iron Century',
  cost: 1,
  attack: 1,
  hp: 2,
  keywords: [],
  flavorText: 'Fast hands. Faster questions.',
}

{
  id: 'pressure-monk',
  name: 'Pressure Monk',
  type: 'unit',
  timeline: 'Iron Century',
  cost: 2,
  attack: 1,
  hp: 3,
  keywords: ['Charge: 1'],     // generates 1 Charge on death
  flavorText: 'Devotion has a temperature. They know it precisely.',
}

{
  id: 'ironveil-smuggler',
  name: 'Ironveil Smuggler',
  type: 'unit',
  timeline: 'Iron Century',
  cost: 2,
  attack: 2,
  hp: 2,
  keywords: ['Ranged'],
  flavorText: 'She moves things. She never asks what they are.',
}

{
  id: 'underlurge-echo',
  name: 'Underlurge Echo',
  type: 'unit',
  timeline: 'Iron Century',
  cost: 4,
  attack: 4,
  hp: 5,
  keywords: [],
  flavorText: 'It recognized the watch before it recognized the man.',
}
```

---

## Art Direction — Locked

**Style:** Painterly anime foundation with atmospheric depth. Cool silhouette clarity fused
with beautiful light and emotional interiority.

**Caelum Voss specific palette:** Deep navy, oxidized gold, cold white, electric blue accent.
Single saturated accent: the blue of the watch chain or watch light. All other elements desaturated.

**Key visual beats:**
- Dark coat and sharp angles — silhouette readable as an icon at thumbnail size
- Clock face behind him: fractured, golden, radiating impossible light
- Two-source lighting: cold ambient from above, warm gold from the clock mechanism behind
- Watch not yet open — held at his side or in his coat pocket, implied rather than shown
- Expression: composed, unreadable, already ahead of the moment
- On Recall: watch opens into three nested faces, air takes on luminous quality — light arriving
  slightly before it should

**Tone:** Precise. Self-contained. The stillness of someone who has already seen what happens next
and has chosen to be here anyway.

---

## Implementation Notes

- The `timeline` field does not yet exist on `CardDefinition` in the engine. Add it as an optional
  `string` field — it will be used for future filtering, set legality, and UI flavor.
- `Measured Presence` (spell immunity before Recall) is a passive that requires a targeting
  validation check. Add a `isImmuneToSpells` flag on `CardInstance` or handle in `getLegalTargets`.
- `The Unwound Hour` (freeze one enemy unit) requires a new status effect: `frozen: boolean` on
  `CardInstance`, checked in `resolveAttack` and `resolveMove`. Clear at start of owner's turn.
- `Temporal Read` (back row Charge gain) hooks into `startTurn` — check companion position and call
  `gainCharge` conditionally.
- Spell and Upgrade slots for this deck (2 remaining card slots) are reserved for Phase 7+
  design once core unit interactions are validated through playtesting.

---

---
---

# SERAVINE NULL
## The Last Reader

**Timeline:** The Ashen Covenant
**Role:** Attrition / Knowledge Control
**Recall Mechanic:** Battlefield debuff — compounds enemy unit weakness over time

---

### Legend Summary

In the Ashen Covenant, disease was not a punishment or a curse. It was information. The body
speaking a language most people were too afraid to learn. The Covenant's greatest figures were
**Readers** — those who could walk into an outbreak and understand it, interpret what the sick
were saying, and through understanding, unmake what was killing them. They were not celebrated.
They were feared, kept at distance even by the people they were saving. They lived at the absolute
boundary between the living and the dead, and they did it voluntarily, with instruments they built
themselves, under an understanding that was always incomplete and always being revised.

Seravine Null was the most accomplished Reader the Covenant had ever produced. The one they called
when no one else had answers. She had survived outbreaks that killed everyone around her — not
through immunity but through understanding. She read what others could not bear to look at and she
did not look away.

When the memory plague arrived, everything changed. This was a disease that spread through memory
itself — not metaphorically, literally. To remember someone who had been infected was to carry the
infection forward. It moved through grief, through records, through the act of writing names down.

The Covenant's response was to begin erasing. Burning records. Forbidding mourning. Unnamed graves.
Containment through forgetting — if no one remembered the dead, the disease could not travel.

Seravine refused.

She kept every record they burned. She committed to memory every name they forbade writing down.
She believed that if the disease traveled through memory, the answer was not to destroy memory but
to understand its grammar — to find the pattern in how it moved, and unmake the pattern without
unmaking the people.

She never finished. The Convergence took her mid-work — surrounded by burning records, mask on,
instruments in hand, the answer somewhere in the pages she had not yet read.

She arrived through the Convergence still holding one page. She does not know if it was the right one.

---

### Arrival State

Seravine arrived in motion — kneeling, one hand extended toward something that was no longer there
when she looked up. The page she carried was blank on one side. She has not looked at the other side
since arriving. She keeps it folded in the inner pocket of her coat.

She arrived with her mask already on. She has not removed it in the presence of others. Whether this
is habit, protection, or grief is unclear. Possibly all three.

Her Charge accumulates through attrition and knowledge — through the slow process of reading the
battlefield the way she read outbreaks, identifying patterns, applying what she understands. She
does not rush toward Recall. She builds toward it with the patience of someone who has learned that
the worst outcomes come from acting before you have read enough.

---

### Personality

Seravine speaks rarely and precisely. When she does speak it is because she has already decided
the words are necessary. She does not fill silence. She uses it.

She is the warmest of cold people — there is genuine care underneath everything she does, but it is
expressed through action rather than words. She remembers things about people. She notices when
someone is struggling before they say so. She does not comment on it directly. She simply adjusts
her behavior in response, quietly, without drawing attention to the adjustment.

She carries grief that she does not perform. The names she memorized are still with her. She has
not found a way to put them down and does not expect to. She has also not found a way to explain
this to anyone, so she doesn't try.

The one thing that visibly costs her something: being asked to forget. Any version of that request,
from any source, for any reason. She will not do it. She will not argue about it. She will simply
continue remembering, and the conversation will end.

---

### The Signature — RECALL

**Name:** The Null Codex — *The Complete Record*

**Lore:**
What Recalls for Seravine is not a weapon. It is the diagnostic apparatus built into the mask and
coat itself — the instrument she used to do her work, now fully activated for the first time since
she arrived. When the Null Codex engages, the mask's lenses glow with deep amber light. The coat's
inner lining — previously dark — reveals itself to be covered entirely in handwritten names. Every
person she refused to forget, rendered visible.

The Codex reads the battlefield the way she read outbreaks — identifying patterns, isolating
weaknesses, finding the precise grammar of how the enemy is moving and where that movement will
fail. She does not stop enemies the way Caelum does. She makes them *worse at being themselves.*
Debuffs compound. Weaknesses accumulate. By the time the Codex has fully read the board, the
enemy's units are undermined from within — not destroyed, not frozen, but diminished in a way
that becomes catastrophic over time.

This is intentional character accuracy. Seravine never believed in overwhelming force. She believed
in understanding so complete that force became unnecessary. The Recall reflects that.

**Visual:** The mask lenses ignite in deep amber. The coat opens slightly to reveal the names
written across the lining — too many to count, too small to read individually, but unmistakably
human in their density and variation. The pages that surrounded her on arrival are now orbiting
her slowly, held in place by something that is not wind. One of them, at the very edge of the
image, is the folded page she carried through the Convergence. It remains folded.

---

### Unit Roster — The Ashen Covenant

These five units are drawn from Seravine's timeline. They do not all share her values. Some of
them actively opposed her. They are the Ashen Covenant rendered as the forces a player builds
around her — the believers, the enforcers, the lost, and the ones the Covenant tried to erase.

---

#### 1. COVENANT WARDEN
*"The order was given. The order was followed."*

Soldiers who enforced the erasure orders — who burned the records, who maintained the unnamed
graves, who kept people from mourning. They served the Covenant's decision, not Seravine's
refusal. They believed, or told themselves they believed, that what they were doing was necessary.
Front line. Disciplined. The weight of what they participated in is visible if you look at the art
closely enough. It is not addressed in the card text.

- **Type:** Unit — Melee
- **Role:** Front line anchor, reliable stats, no special conditions
- **Flavor:** Order maintained at a cost no one was asked to approve.

---

#### 2. ASH SCRIBE
*"They burned what they wrote. Then they wrote it again."*

The record-keepers of the Covenant — the ones ordered to destroy their own work. Some complied
fully. Some complied visibly and kept copies hidden. The Ash Scribe represents the ones who could
not fully let go, who found small ways to preserve what they were told to erase. Cheap and fragile.
Generates Charge on death — everything they carried, released.

- **Type:** Unit — Melee
- **Role:** Cheap early play, sacrifice synergy, Charge generation
- **Flavor:** What they remembered died with them. Seravine made sure it didn't stay dead.

---

#### 3. LECTOR SURGEON
*"To understand the wound is to already be healing it."*

A fellow Reader — less accomplished than Seravine, trained in the same tradition, still practicing.
Where Seravine worked at the scale of outbreaks, the Lector Surgeon works at the scale of
individuals. Precise. Careful. Believes in the work with the specific devotion of someone who has
seen it succeed and cannot imagine doing anything else.

- **Type:** Unit — Melee
- **Role:** Mid-cost, damage mitigation or defensive ability
- **Flavor:** The tradition continues. Seravine made sure of that too.

---

#### 4. QUARANTINE SENTINEL
*"Nothing leaves this lane."*

A unit built for containment rather than destruction. The Sentinel's entire purpose is to hold a
position — to ensure that whatever is in a given lane stays there, cannot retreat, cannot
reposition. Melee, but the damage is secondary to the restriction. Mechanically this translates
to an ability that prevents enemy units from moving out of their current slot.

- **Type:** Unit — Melee
- **Role:** Lane lock, movement denial, positional control
- **Flavor:** The Covenant built these to contain the infected. Seravine uses them differently.

---

#### 5. THE REMEMBERED
*"She said the name. That was enough."*

A figure from the plague itself — one of those the Covenant tried to erase, whose name Seravine
refused to forget. Not fully alive in any conventional sense. Not fully dead either. Exists in the
space between, held there by the specific gravity of being remembered by someone who does not
forget. Unsettling in the way that genuine devotion to another person's existence is unsettling
when you encounter it unexpectedly.

- **Type:** Unit — Melee
- **Role:** High-cost, high-impact, late-game anchor
- **Flavor:** The most expensive unit in the deck. The most important name she kept.

---
---

## Card Specification — Seravine Null

*Ready for implementation in `src/cards/definitions.ts`*

```typescript
// ─── SERAVINE NULL — Base Form ────────────────────────────────────────────

{
  id: 'seravine-null',
  name: 'Seravine Null',
  type: 'companion',
  subtype: 'Remnant',
  timeline: 'Ashen Covenant',
  cost: 0,
  attack: 1,
  hp: 8,                          // higher HP than Caelum; she endures rather than controls
  keywords: [],
  evolutionDefinitionId: 'seravine-null-recalled',
  evolutionChargeThreshold: 7,    // slightly higher threshold; her power is worth waiting for
  flavorText: 'She kept every name they burned. She is still keeping them.',
  abilities: [
    {
      id: 'the-reading',
      name: 'The Reading',
      description: 'Passive: Whenever a friendly unit dies, Seravine gains +1 Charge beyond the standard death Charge.',
      trigger: 'passive'
    }
  ]
}

// ─── SERAVINE NULL — Recalled Form ────────────────────────────────────────

{
  id: 'seravine-null-recalled',
  name: 'Seravine Null — The Complete Record',
  type: 'companion',
  subtype: 'Remnant',
  timeline: 'Ashen Covenant',
  cost: 0,
  attack: 2,
  hp: 8,                          // HP carries over; does not reset on Recall
  keywords: [],
  flavorText: 'The coat opened. Every name was still there.',
  abilities: [
    {
      id: 'null-codex',
      name: 'The Null Codex',
      description: 'Active (costs 1 action, 1 Energy): Apply Weakened to all enemy units currently on the board. Weakened units deal -1 attack damage. This effect stacks.',
      trigger: 'active',
      cost: { actions: 1, energy: 1 }
    },
    {
      id: 'compound-reading',
      name: 'Compound Reading',
      description: 'Passive: At the start of your turn, each enemy unit that is already Weakened receives an additional Weakened stack.',
      trigger: 'passive'
    }
  ]
}

// ─── DECK CONFIGURATION ───────────────────────────────────────────────────

const ashenCovenantDeck: DeckConfig = {
  companionId: 'seravine-null',
  cards: [
    { definitionId: 'covenant-warden',      count: 2 },
    { definitionId: 'ash-scribe',           count: 2 },
    { definitionId: 'lector-surgeon',       count: 2 },
    { definitionId: 'quarantine-sentinel',  count: 2 },
    { definitionId: 'the-remembered',       count: 2 },
    // Spell / Upgrade slots (2 remaining) — TBD during Phase 7+
  ]
}

// ─── UNIT CARD DEFINITIONS ────────────────────────────────────────────────

{
  id: 'covenant-warden',
  name: 'Covenant Warden',
  type: 'unit',
  timeline: 'Ashen Covenant',
  cost: 2,
  attack: 2,
  hp: 4,
  keywords: [],
  flavorText: 'The order was given. The order was followed.',
}

{
  id: 'ash-scribe',
  name: 'Ash Scribe',
  type: 'unit',
  timeline: 'Ashen Covenant',
  cost: 1,
  attack: 1,
  hp: 2,
  keywords: ['Charge: 1'],        // generates 1 Charge on death, stacks with Seravine passive
  flavorText: 'They burned what they wrote. Then they wrote it again.',
}

{
  id: 'lector-surgeon',
  name: 'Lector Surgeon',
  type: 'unit',
  timeline: 'Ashen Covenant',
  cost: 2,
  attack: 1,
  hp: 4,                          // tankier than average for cost; built to endure
  keywords: [],
  flavorText: 'To understand the wound is to already be healing it.',
}

{
  id: 'quarantine-sentinel',
  name: 'Quarantine Sentinel',
  type: 'unit',
  timeline: 'Ashen Covenant',
  cost: 3,
  attack: 2,
  hp: 4,
  keywords: [],                   // movement denial ability — requires new 'Anchored' status effect
  flavorText: 'Nothing leaves this lane.',
}

{
  id: 'the-remembered',
  name: 'The Remembered',
  type: 'unit',
  timeline: 'Ashen Covenant',
  cost: 4,
  attack: 3,
  hp: 6,
  keywords: ['Charge: 2'],        // generates 2 Charge on death; costs something to lose
  flavorText: 'She said the name. That was enough.',
}
```

---

## Implementation Notes — Seravine Null

- **Weakened status effect** — new `CardInstance` field: `weakenedStacks: number`. Each stack
  reduces `currentAttack` by 1 (floor 0). Applied via Null Codex active ability. Compound Reading
  adds 1 stack per already-weakened unit at `startTurn`. Clear stacks on unit death (handled by
  `handleDeath`).
- **The Reading passive** — hook into `handleDeath` in `combat.ts`. When a friendly unit dies,
  check if active player's companion is Seravine (base or recalled). If so, call
  `gainCharge(state, playerId, 1)` in addition to standard Charge keyword processing.
- **Quarantine Sentinel movement denial** — new `CardInstance` field: `anchored: boolean`. When
  `anchored` is true, `getLegalMoves` returns empty for that unit. The Sentinel's ability sets
  `anchored: true` on an adjacent enemy unit. Clear at start of that unit's owner's turn.
- **Charge threshold 7 vs Caelum's 6** — intentional design decision. Seravine's Recall is more
  board-wide in impact. The extra threshold turn creates meaningful pacing difference between
  the two decks and rewards the sacrifice synergy of her unit roster.
- **Deck identity contrast with Iron Century** — Seravine's deck is slower and more attrition
  oriented. Iron Century pressures through precision and tempo. Ashen Covenant pressures through
  accumulation and compound debuffs. Both decks should feel distinct from turn one.

---

## Art Direction — Locked

**Style:** Painterly anime foundation with atmospheric depth. Cool silhouette clarity fused
with beautiful light and emotional interiority.

**Seravine Null specific palette:** Ash grey, bone white, burnt sienna, deep amber.
Single saturated accent: the amber of the mask lenses. All other elements desaturated.

**Key visual beats:**
- Silhouette readable as an icon at thumbnail size
- Two-source lighting: cold exterior, warm amber interior bleeding through coat seams and mask
- Suspended pages mid-flight in background — handwriting visible, content unreadable
- One fingerprint on the mask lens — humanity implied beneath the instrument
- Closed fist at her side holding something unseen
- On Recall: coat lining reveals wall of handwritten names; folded page visible at image edge,
  still folded

**Tone:** Still. Pressured. The warmth of someone who cares enormously expressed entirely
through precision rather than expression.

---

*Document last updated: 2026-03-25*
*Active Remnants: Caelum Voss, Seravine Null, Xochitl Pavón. Fifth Remnant TBD.*

---
---

# XOCHITL PAVÓN
## La Guerrera del Alba Sagrada
*(The Warrior of the Sacred Dawn)*

**Timeline:** El Quinto Sol — The Fifth Sun
**Role:** Sacred Momentum / Offensive Sustain
**Recall Mechanic:** Attack amplification — every strike feeds and empowers allies

---

### Legend Summary

In the cosmology of El Quinto Sol, the universe has died and been reborn four times. Each sun —
each age — ended in catastrophe. Flood. Wind. Rain of fire. Darkness. Each time the gods
sacrificed themselves to begin again, and each time humanity survived by the narrowness of a
single breath.

The Fifth Sun — *Nahui Olín*, Four Movement — is the age of earthquakes, the age that will end
in motion and destruction unless the cosmic balance is maintained through continuous sacred
offering. In this world that offering is not passive ritual. It is *war.* The Flowery War —
*Xochiyaoyotl* — is fought on a schedule written in the stars, between civilizations who
understand that the sun must be fed or everything ends. Not metaphorically. Literally. The
astronomers calculate it. The priests confirm it. The warriors execute it.

Xochitl was not born to lead this war. She was born to serve in it — a *telpochcalli*-trained
warrior-priestess of Ixóchitl, devoted simultaneously to the goddess of flowers and creation
and to the martial discipline required to honor that devotion through sacred combat. She learned
to fight the way she learned to sing — as prayer. As offering. As the most complete expression
of what her body and spirit were capable of giving.

She rose through devotion rather than birth. Through the quality of her presence in battle — the
way she moved, the way she called to her warriors, the specific combination of ferocity and
ceremony that made those who fought beside her feel they were participating in something larger
than survival. She was promoted three times in five years. Given command of her own *cuauhpilli*
— a unit of elite warriors — before she was thirty.

Then came *La Guerra del Quinto Umbral* — the War of the Fifth Threshold.

The astronomers had identified an anomaly in the sacred calendar. A convergence of cycles that
had not occurred in four hundred years — a moment when all five cosmic forces aligned in a
configuration that meant either the sun would be fed beyond all ordinary measure, elevating the
Fifth Age into something unprecedented, or the balance would tip catastrophically and the
earthquakes would begin the ending early.

The high priests determined that the Flowery War fought at this convergence would need to be led
not by a general but by someone the gods themselves would recognize as their instrument. They
spent forty days in consultation with the divine. They emerged with a name.

Xochitl.

She accepted without hesitation. Not from ambition — from the specific clarity of someone who
has spent their entire life in preparation for a thing without knowing what the thing was, and
suddenly understands.

*La Guerra del Quinto Umbral* lasted thirteen days. Xochitl fought at the front of every
engagement. She sang the sacred hymns of Ixóchitl while her weapons moved — beauty and
destruction indistinguishable from each other in her hands. The offerings were made. The
calendar turned. The Fifth Sun held.

On the thirteenth day, as the final ceremony completed, the astronomers watching from the
temple saw something they had no category for. Xochitl did not walk away from the altar.
She rose from it. Not violently, not dramatically — with the specific inevitability of
something that was always going to happen and had finally arrived at its moment.

She ascended.

The people of El Quinto Sol did not mourn her. They understood. She had not been taken.
She had been *recognized.* The gods had seen someone so completely aligned with sacred
purpose that the boundary between mortal and divine had simply become inappropriate.

---

### Arrival State

Xochitl arrived in the Convergence still wearing her jade and quetzal regalia — headdress
intact, *macuahuitl* at her side, copal smoke still clinging to the folds of her mantle as
though the ceremony ended only moments ago. She looked around once, slowly, with the
deliberate attention of someone taking full inventory of a new space before deciding how
to move through it.

She understands the Convergence as another threshold. Another war fought not for territory
but for balance. She is looking for who or what needs to be offered so that this age too
can hold. She has not found the answer yet. She is not anxious about this. She has always
trusted the calendar to reveal what is needed at the right moment.

Her Charge accumulates through sacred momentum — through combat, through the act of offering
her strength in service of something larger than herself. Every strike she lands is a prayer.
Every ally who falls beside her feeds the balance she is maintaining.

---

### Personality

Xochitl is warm, ceremonial, and deeply present. She laughs easily. She speaks with the
specific directness of someone who has never needed to hide what they are — there is no
gap between who she is in battle and who she is at rest. Both are expressions of the same
devotion.

She is curious about the other Remnants in a way that feels genuinely generous rather than
strategic. She wants to understand what they are protecting toward. She asks questions
that are more perceptive than they appear and listens to the answers with complete attention.

She does not perform her faith. It is simply visible in everything she does — the way she
orients toward the morning, the small offerings she makes before any significant action,
the songs she sings quietly that no one else in the Convergence recognizes but everyone
feels something from.

The one thing that visibly unsettles her: meaningless destruction. Violence without offering.
Loss without purpose. She does not condemn it loudly. She simply becomes very still and
very watchful, the way a person becomes still when they recognize something dangerous that
others have not yet noticed.

---

### The Signature — RECALL

**Name:** Plumas de Quetzalcóatl — *El Alba que No Termina*
*(Quetzal Feathers — The Dawn That Does Not End)*

**Lore:**
When Xochitl Recalls, the feathers move.

Every quetzal feather in her regalia — headdress, shield, mantle — lifts simultaneously,
caught in a wind that exists only around her. They shift from deep green to the specific
gold-green of dawn light moving through jungle canopy, and the air fills with the presence
of Quetzalcóatl — not the god himself, but the divine frequency he represents. Creation.
Return. The wind that carries seeds. The knowledge that what ends does so in order for
something to begin.

Her *macuahuitl* — edged not with obsidian but with jade — begins to glow along its cutting
edge with the same dawn light. It is the weapon she carried through all thirteen days of
*La Guerra del Quinto Umbral.* The weapon the gods saw move and decided was worthy.

She does not transform. She *fills.* Every ability she has carried quietly becomes fully
realized. The war she was commissioned to fight continues — it simply has a new shape now.

**Visual:** Feathers lift in sacred wind, shifting from jade green to dawn gold. The
*macuahuitl*'s jade edge ignites. The air takes on the quality of early morning in a
jungle temple — warm, green, alive with the specific weight of something about to begin.
Copal smoke rises from her belt incense burner and does not disperse.

---

### Unit Roster — El Quinto Sol

These five units are drawn from Xochitl's timeline — a civilization of extraordinary
sophistication, beauty, and sacred purpose, where every act of creation and destruction
is understood as the same gesture made in different directions.

---

#### 1. CUAUHPILLI VANGUARD
*"Los primeros en cruzar el umbral."*
*(The first to cross the threshold.)*

Elite warriors of the Flowery War, trained to capture rather than kill, moving in precise
formation that reflects both martial discipline and ceremonial purpose. They do not fight
for territory. They fight because the sun requires it and they have been found worthy of
that requirement.

- **Type:** Unit — Melee
- **Role:** Front line anchor, Charge generation on victory
- **Flavor:** When they defeat an enemy unit they generate 1 Charge — the offering is made.

---

#### 2. TELPOCHCALLI SCOUT
*"Rápidos como colibrí, devotos como sacerdotes."*
*(Fast as hummingbird, devoted as priests.)*

Young warrior-students from the military schools — fast, mobile, and burning with the
specific energy of those who have not yet learned to be afraid. They are not reckless.
They are consecrated. There is a difference.

- **Type:** Unit — Melee
- **Role:** Cheap early play, lane pressure, feeds Xochitl on death
- **Flavor:** When they die, Xochitl gains +1 attack until end of turn. Their sacrifice
  feeds her directly.

---

#### 3. LA CANTORA SAGRADA
*"Su voz es el puente entre los mundos."*
*(Her voice is the bridge between worlds.)*

A sacred singer of Ixóchitl who performs the ceremonial songs during battle. She carries
no weapon. She needs none. Her voice is the thing that holds the sacred space open —
the frequency that keeps the offering meaningful rather than merely violent.

- **Type:** Unit — Ranged
- **Role:** Back row, passive Charge generation, sustain
- **Flavor:** Generates 1 Charge at the start of each turn simply through her presence.
  The song sustains. The song is never interrupted.

---

#### 4. SERPIENTE DE JADE
*"Donde ella camina, el equilibrio la sigue."*
*(Where she walks, balance follows.)*

A warrior-priest marked with the jade serpent, who carries both weapon and incense burner
into battle simultaneously. The serpent mark is not decorative — it is a cosmological
statement. She walks in the frequency of Quetzalcóatl and the ground knows it.

- **Type:** Unit — Melee
- **Role:** Mid-cost, counter-attacker, sacred disruption
- **Flavor:** When damaged, applies -1 attack to the attacker — to strike the sacred
  is to be diminished by the contact.

---

#### 5. QUETZAL ASCENDANT
*"No es pájaro. No es dios. Es el espacio entre los dos."*
*(Not bird. Not god. The space between the two.)*

A being in the process of the same ascension Xochitl completed — not yet arrived but
close enough that its presence is overwhelming. It does not fully belong to El Quinto Sol
anymore. It does not yet belong to whatever comes after. It fights from that threshold
with the specific ferocity of something that has already decided what it is willing to
become.

- **Type:** Unit — Melee
- **Role:** High-cost, high-impact, late-game anchor, Recall accelerator
- **Flavor:** When it dies it triggers Xochitl's Recall immediately if she has not yet
  Recalled, regardless of current Charge level. The ascension recognizes its own.

---
---

## Card Specification — Xochitl Pavón

*Ready for implementation in `src/cards/definitions.ts`*

```typescript
// ─── XOCHITL PAVÓN — Base Form ────────────────────────────────────────────

{
  id: 'xochitl-pavon',
  name: 'Xochitl Pavón',
  type: 'companion',
  subtype: 'Remnant',
  timeline: 'El Quinto Sol',
  cost: 0,
  attack: 3,
  hp: 7,                            // balanced — she is both warrior and priest
  keywords: [],
  evolutionDefinitionId: 'xochitl-pavon-recalled',
  evolutionChargeThreshold: 7,      // matches Seravine; her power rewards patience
  flavorText: 'La flor que cuesta algo. The flower that costs something.',
  abilities: [
    {
      id: 'sacred-offering',
      name: 'Ofrenda Sagrada',
      description: 'Passive: Whenever Xochitl deals damage, gain 1 Charge.',
      trigger: 'passive'
    }
  ]
}

// ─── XOCHITL PAVÓN — Recalled Form ───────────────────────────────────────

{
  id: 'xochitl-pavon-recalled',
  name: 'Xochitl Pavón — El Alba que No Termina',
  type: 'companion',
  subtype: 'Remnant',
  timeline: 'El Quinto Sol',
  cost: 0,
  attack: 5,
  hp: 7,                            // HP carries over; does not reset on Recall
  keywords: [],
  flavorText: 'Las plumas se movieron. El alba no terminó.',
  abilities: [
    {
      id: 'xochiyaoyotl',
      name: 'Xochiyaoyotl',
      description: 'Active (costs 1 action, 0 Energy): Mark one enemy unit as a sacred offering. That unit cannot be buffed or healed by its owner until the start of their next turn.',
      trigger: 'active',
      cost: { actions: 1, energy: 0 }
    },
    {
      id: 'plumas-de-quetzalcoatl',
      name: 'Plumas de Quetzalcóatl',
      description: 'Passive: Whenever Xochitl attacks, grant 1 Charge to a friendly unit of your choice.',
      trigger: 'passive'
    }
  ]
}

// ─── DECK CONFIGURATION ───────────────────────────────────────────────────

// quintoSolDeck (Xochitl Pavón)
// 2x each unit card = 10 unit cards + 2x each spell/upgrade = deck of 12

const quintoSolDeck: DeckConfig = {
  companionId: 'xochitl-pavon',
  cards: [
    { definitionId: 'cuauhpilli-vanguard',    count: 2 },
    { definitionId: 'telpochcalli-scout',     count: 2 },
    { definitionId: 'la-cantora-sagrada',     count: 2 },
    { definitionId: 'serpiente-de-jade',      count: 2 },
    { definitionId: 'quetzal-ascendant',      count: 2 },
    // Spell / Upgrade slots (2 remaining) — TBD during playtesting
  ]
}

// ─── UNIT CARD DEFINITIONS ────────────────────────────────────────────────

{
  id: 'cuauhpilli-vanguard',
  name: 'Cuauhpilli Vanguard',
  type: 'unit',
  timeline: 'El Quinto Sol',
  cost: 2,
  attack: 2,
  hp: 4,
  keywords: ['Charge: 1'],          // generates 1 Charge on kill — the offering is made
  flavorText: 'Los primeros en cruzar el umbral.',
}

{
  id: 'telpochcalli-scout',
  name: 'Telpochcalli Scout',
  type: 'unit',
  timeline: 'El Quinto Sol',
  cost: 1,
  attack: 2,
  hp: 2,
  keywords: [],
  flavorText: 'Rápidos como colibrí, devotos como sacerdotes.',
}

{
  id: 'la-cantora-sagrada',
  name: 'La Cantora Sagrada',
  type: 'unit',
  timeline: 'El Quinto Sol',
  cost: 2,
  attack: 1,
  hp: 3,
  keywords: ['Ranged', 'Charge: 1'], // passive Charge generation; ranged back row
  flavorText: 'Su voz es el puente entre los mundos.',
}

{
  id: 'serpiente-de-jade',
  name: 'Serpiente de Jade',
  type: 'unit',
  timeline: 'El Quinto Sol',
  cost: 3,
  attack: 2,
  hp: 4,
  keywords: [],                     // counter-attack debuff — requires new damage trigger
  flavorText: 'Donde ella camina, el equilibrio la sigue.',
}

{
  id: 'quetzal-ascendant',
  name: 'Quetzal Ascendant',
  type: 'unit',
  timeline: 'El Quinto Sol',
  cost: 5,
  attack: 4,
  hp: 6,
  keywords: [],                     // Recall trigger on death — requires special death handler
  flavorText: 'No es pájaro. No es dios. Es el espacio entre los dos.',
}
```

---

## Implementation Notes — Xochitl Pavón

- **Ofrenda Sagrada passive** — hook into `resolveAttack` in `combat.ts`. When Xochitl deals
  damage (base form), call `gainCharge(state, playerId, 1)`. Check companion id before firing.
- **Xochiyaoyotl active** — new `CardInstance` field: `markedAsOffering: boolean`. When true,
  the unit's owner cannot target it with buff or heal effects. Clear at start of that unit's
  owner's turn. Requires targeting UI — similar to Caelum's freeze targeting flow.
- **Plumas de Quetzalcóatl passive** — on each Xochitl attack (Recalled form), prompt player
  to choose a friendly unit and call `gainCharge(state, playerId, 1)` on that unit's slot.
  If no friendly units exist, Charge goes to Xochitl herself.
- **Telpochcalli Scout death trigger** — hook into `handleDeath`. When Scout dies, if active
  player's companion is Xochitl, apply `+1 currentAttack` to Xochitl until end of turn.
  Requires a `temporaryAttackBuff` field that resets in `endTurn`.
- **Serpiente de Jade counter-attack** — new damage trigger in `dealDamage`. When this unit
  takes damage, apply `weakenedStacks: 1` to the attacker. Shares the Weakened system
  introduced by Seravine Null.
- **Quetzal Ascendant death trigger** — hook into `handleDeath`. When this unit dies, check
  if Xochitl has not yet Recalled. If so, call `checkCompanionEvolution` with a forced
  threshold override — bypass normal Charge check and trigger Recall immediately.
- **Deck identity contrast** — Xochitl is the most aggressive of the three Remnants. Where
  Caelum controls and Seravine accumulates, Xochitl pressures forward continuously. Her deck
  rewards sustained combat over attrition or positional play.

---

## Art Direction — Locked

**Style:** Painterly anime foundation with atmospheric depth. Cool silhouette clarity fused
with beautiful light and emotional interiority.

**Xochitl Pavón specific palette:** Deep jade green, quetzal gold-green, warm terracotta,
copal white smoke. Single saturated accent: the dawn gold of her weapon's jade edge on Recall.
All other elements rich but controlled — this is the warmest palette of the three Remnants.

**Key visual beats:**
- Quetzal feather headdress — massive, iconic, immediately readable as silhouette at any size
- Jade jewelry at throat, wrists, ears — visibly sacred, not decorative
- *Macuahuitl* carried at rest, not raised — she is present, not threatening
- Small copal incense burner at her belt, smoke rising
- Expression: warm, direct, completely unafraid — the calm of someone who has already decided
  what they are willing to give
- On Recall: feathers lift in sacred wind, jade weapon edge ignites in dawn gold, air takes on
  the quality of early morning in a jungle temple — warm, alive, the specific light of
  something about to begin

**Tone:** Warm ceremonial authority. The beauty that costs something — present in every line.
The only Remnant who smiles.

---
