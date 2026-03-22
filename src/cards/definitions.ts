/// <reference path="../state/types.ts" />

// Deck 1: Tempo / Lane Pressure

export const auricCub: CardDefinition = {
  id: 'auric-cub',
  name: 'Auric Cub',
  type: 'Companion',
  cost: 0,
  hp: 8,
  attack: 2,
  keywords: [],
  evolutionTarget: 'auric-leon',
  evolutionChargeThreshold: 4,
};

export const auricLeon: CardDefinition = {
  id: 'auric-leon',
  name: 'Auric Leon',
  type: 'Companion',
  cost: 0,
  hp: 14,
  attack: 4,
  keywords: [],
};

export const laneProwler: CardDefinition = {
  id: 'lane-prowler',
  name: 'Lane Prowler',
  type: 'Unit',
  cost: 2,
  hp: 3,
  attack: 2,
  keywords: [],
};

export const vanguardHound: CardDefinition = {
  id: 'vanguard-hound',
  name: 'Vanguard Hound',
  type: 'Unit',
  cost: 1,
  hp: 2,
  attack: 1,
  keywords: [],
};

export const boltSkipper: CardDefinition = {
  id: 'bolt-skipper',
  name: 'Bolt Skipper',
  type: 'Unit',
  cost: 2,
  hp: 2,
  attack: 2,
  keywords: [{ keyword: 'Ranged' }],
};

export const packSignal: CardDefinition = {
  id: 'pack-signal',
  name: 'Pack Signal',
  type: 'Spell',
  cost: 1,
  hp: 0,
  attack: 0,
  keywords: [],
};

export const sharpenInstinct: CardDefinition = {
  id: 'sharpen-instinct',
  name: 'Sharpen Instinct',
  type: 'Upgrade',
  cost: 2,
  hp: 0,
  attack: 0,
  keywords: [],
};

export const pounceWindow: CardDefinition = {
  id: 'pounce-window',
  name: 'Pounce Window',
  type: 'Spell',
  cost: 1,
  hp: 0,
  attack: 0,
  keywords: [],
};

// Deck 2: Sacrifice / Evolution Ramp

export const emberWisp: CardDefinition = {
  id: 'ember-wisp',
  name: 'Ember Wisp',
  type: 'Companion',
  cost: 0,
  hp: 6,
  attack: 1,
  keywords: [],
  evolutionTarget: 'cinder-seraph',
  evolutionChargeThreshold: 6,
};

export const cinderSeraph: CardDefinition = {
  id: 'cinder-seraph',
  name: 'Cinder Seraph',
  type: 'Companion',
  cost: 0,
  hp: 12,
  attack: 4,
  keywords: [{ keyword: 'Ranged' }],
};

export const ashDrudge: CardDefinition = {
  id: 'ash-drudge',
  name: 'Ash Drudge',
  type: 'Unit',
  cost: 1,
  hp: 1,
  attack: 1,
  keywords: [{ keyword: 'Charge', value: 1 }],
};

export const pyreAcolyte: CardDefinition = {
  id: 'pyre-acolyte',
  name: 'Pyre Acolyte',
  type: 'Unit',
  cost: 2,
  hp: 2,
  attack: 1,
  keywords: [{ keyword: 'Charge', value: 2 }],
};

export const graveLancer: CardDefinition = {
  id: 'grave-lancer',
  name: 'Grave Lancer',
  type: 'Unit',
  cost: 3,
  hp: 3,
  attack: 3,
  keywords: [{ keyword: 'Ranged' }],
};

export const soulKindle: CardDefinition = {
  id: 'soul-kindle',
  name: 'Soul Kindle',
  type: 'Spell',
  cost: 1,
  hp: 0,
  attack: 0,
  keywords: [],
};

export const emberMantle: CardDefinition = {
  id: 'ember-mantle',
  name: 'Ember Mantle',
  type: 'Upgrade',
  cost: 2,
  hp: 0,
  attack: 0,
  keywords: [],
};

export const deathFlare: CardDefinition = {
  id: 'death-flare',
  name: 'Death Flare',
  type: 'Spell',
  cost: 2,
  hp: 0,
  attack: 0,
  keywords: [],
};

export const allCards: CardDefinition[] = [
  auricCub,
  auricLeon,
  laneProwler,
  vanguardHound,
  boltSkipper,
  packSignal,
  sharpenInstinct,
  pounceWindow,
  emberWisp,
  cinderSeraph,
  ashDrudge,
  pyreAcolyte,
  graveLancer,
  soulKindle,
  emberMantle,
  deathFlare,
];
