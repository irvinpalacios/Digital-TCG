/// <reference path="../state/types.ts" />

// ─── CAELUM VOSS — Iron Century ────────────────────────────────────────────

export const caelumVoss: CardDefinition = {
  id: 'caelum-voss',
  name: 'Caelum Voss',
  type: 'Companion',
  subtype: 'Remnant',
  timeline: 'Iron Century',
  cost: 0,
  hp: 7,
  attack: 2,
  keywords: [],
  evolutionTarget: 'caelum-voss-recalled',
  evolutionChargeThreshold: 6,
};

export const caelumVossRecalled: CardDefinition = {
  id: 'caelum-voss-recalled',
  name: 'Caelum Voss — The Unwound Hour',
  type: 'Companion',
  subtype: 'Remnant',
  timeline: 'Iron Century',
  cost: 0,
  hp: 7,
  attack: 4,
  keywords: [],
};

export const synchronGuard: CardDefinition = {
  id: 'synchron-guard',
  name: 'Synchron Guard',
  type: 'Unit',
  timeline: 'Iron Century',
  cost: 2,
  hp: 4,
  attack: 2,
  keywords: [],
};

export const gearwrightApprentice: CardDefinition = {
  id: 'gearwright-apprentice',
  name: 'Gearwright Apprentice',
  type: 'Unit',
  timeline: 'Iron Century',
  cost: 1,
  hp: 2,
  attack: 1,
  keywords: [],
};

export const pressureMonk: CardDefinition = {
  id: 'pressure-monk',
  name: 'Pressure Monk',
  type: 'Unit',
  timeline: 'Iron Century',
  cost: 2,
  hp: 3,
  attack: 1,
  keywords: [{ keyword: 'Charge', value: 1 }],
};

export const ironveilSmuggler: CardDefinition = {
  id: 'ironveil-smuggler',
  name: 'Ironveil Smuggler',
  type: 'Unit',
  timeline: 'Iron Century',
  cost: 2,
  hp: 2,
  attack: 2,
  keywords: [{ keyword: 'Ranged' }],
};

export const underlurgeEcho: CardDefinition = {
  id: 'underlurge-echo',
  name: 'Underlurge Echo',
  type: 'Unit',
  timeline: 'Iron Century',
  cost: 4,
  hp: 5,
  attack: 4,
  keywords: [],
};

// ─── SERAVINE NULL — Ashen Covenant ───────────────────────────────────────

export const seravineNull: CardDefinition = {
  id: 'seravine-null',
  name: 'Seravine Null',
  type: 'Companion',
  subtype: 'Remnant',
  timeline: 'Ashen Covenant',
  cost: 0,
  hp: 8,
  attack: 1,
  keywords: [],
  evolutionTarget: 'seravine-null-recalled',
  evolutionChargeThreshold: 7,
};

export const seravineNullRecalled: CardDefinition = {
  id: 'seravine-null-recalled',
  name: 'Seravine Null — The Complete Record',
  type: 'Companion',
  subtype: 'Remnant',
  timeline: 'Ashen Covenant',
  cost: 0,
  hp: 8,
  attack: 2,
  keywords: [],
};

export const covenantWarden: CardDefinition = {
  id: 'covenant-warden',
  name: 'Covenant Warden',
  type: 'Unit',
  timeline: 'Ashen Covenant',
  cost: 2,
  hp: 4,
  attack: 2,
  keywords: [],
};

export const ashScribe: CardDefinition = {
  id: 'ash-scribe',
  name: 'Ash Scribe',
  type: 'Unit',
  timeline: 'Ashen Covenant',
  cost: 1,
  hp: 2,
  attack: 1,
  keywords: [{ keyword: 'Charge', value: 1 }],
};

export const lectorSurgeon: CardDefinition = {
  id: 'lector-surgeon',
  name: 'Lector Surgeon',
  type: 'Unit',
  timeline: 'Ashen Covenant',
  cost: 2,
  hp: 4,
  attack: 1,
  keywords: [],
};

export const quarantineSentinel: CardDefinition = {
  id: 'quarantine-sentinel',
  name: 'Quarantine Sentinel',
  type: 'Unit',
  timeline: 'Ashen Covenant',
  cost: 3,
  hp: 4,
  attack: 2,
  keywords: [],
};

export const theRemembered: CardDefinition = {
  id: 'the-remembered',
  name: 'The Remembered',
  type: 'Unit',
  timeline: 'Ashen Covenant',
  cost: 4,
  hp: 6,
  attack: 3,
  keywords: [{ keyword: 'Charge', value: 2 }],
};

// ─── XOCHITL PAVÓN — El Quinto Sol ────────────────────────────────────────

export const xochitlPavon: CardDefinition = {
  id: 'xochitl-pavon',
  name: 'Xochitl Pavón',
  type: 'Companion',
  subtype: 'Remnant',
  timeline: 'El Quinto Sol',
  cost: 0,
  hp: 7,
  attack: 3,
  keywords: [],
  evolutionTarget: 'xochitl-pavon-recalled',
  evolutionChargeThreshold: 7,
};

export const xochitlPavonRecalled: CardDefinition = {
  id: 'xochitl-pavon-recalled',
  name: 'Xochitl Pavón — El Alba que No Termina',
  type: 'Companion',
  subtype: 'Remnant',
  timeline: 'El Quinto Sol',
  cost: 0,
  hp: 7,
  attack: 5,
  keywords: [],
};

export const cuauhpilliVanguard: CardDefinition = {
  id: 'cuauhpilli-vanguard',
  name: 'Cuauhpilli Vanguard',
  type: 'Unit',
  timeline: 'El Quinto Sol',
  cost: 2,
  hp: 4,
  attack: 2,
  keywords: [{ keyword: 'Charge', value: 1 }],
};

export const telpochcalliScout: CardDefinition = {
  id: 'telpochcalli-scout',
  name: 'Telpochcalli Scout',
  type: 'Unit',
  timeline: 'El Quinto Sol',
  cost: 1,
  hp: 2,
  attack: 2,
  keywords: [],
};

export const laCantoraSegrada: CardDefinition = {
  id: 'la-cantora-sagrada',
  name: 'La Cantora Sagrada',
  type: 'Unit',
  timeline: 'El Quinto Sol',
  cost: 2,
  hp: 3,
  attack: 1,
  keywords: [{ keyword: 'Ranged' }, { keyword: 'Charge', value: 1 }],
};

export const serpienteDeJade: CardDefinition = {
  id: 'serpiente-de-jade',
  name: 'Serpiente de Jade',
  type: 'Unit',
  timeline: 'El Quinto Sol',
  cost: 3,
  hp: 4,
  attack: 2,
  keywords: [],
};

export const quetzalAscendant: CardDefinition = {
  id: 'quetzal-ascendant',
  name: 'Quetzal Ascendant',
  type: 'Unit',
  timeline: 'El Quinto Sol',
  cost: 5,
  hp: 6,
  attack: 4,
  keywords: [],
};

export const allCards: CardDefinition[] = [
  // Caelum Voss — Iron Century
  caelumVoss,
  caelumVossRecalled,
  synchronGuard,
  gearwrightApprentice,
  pressureMonk,
  ironveilSmuggler,
  underlurgeEcho,
  // Seravine Null — Ashen Covenant
  seravineNull,
  seravineNullRecalled,
  covenantWarden,
  ashScribe,
  lectorSurgeon,
  quarantineSentinel,
  theRemembered,
  // Xochitl Pavón — El Quinto Sol
  xochitlPavon,
  xochitlPavonRecalled,
  cuauhpilliVanguard,
  telpochcalliScout,
  laCantoraSegrada,
  serpienteDeJade,
  quetzalAscendant,
];
