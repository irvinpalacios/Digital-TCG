import {
  caelumVoss,
  synchronGuard,
  gearwrightApprentice,
  pressureMonk,
  ironveilSmuggler,
  underlurgeEcho,
  seravineNull,
  covenantWarden,
  ashScribe,
  lectorSurgeon,
  quarantineSentinel,
  theRemembered,
  xochitlPavon,
  cuauhpilliVanguard,
  telpochcalliScout,
  laCantoraSegrada,
  serpienteDeJade,
  quetzalAscendant,
} from './definitions';

export type DeckConfig = {
  deckId: string;
  name: string;
  companionId: string;
  timeline: string;
  role: string;
  cardIds: string[];
};

export const ironCenturyDeck: DeckConfig = {
  deckId: 'iron-century',
  name: 'Caelum Voss',
  companionId: caelumVoss.id,
  timeline: 'Iron Century',
  role: 'Control / Temporal Disruption',
  cardIds: [
    synchronGuard.id, synchronGuard.id,
    gearwrightApprentice.id, gearwrightApprentice.id,
    pressureMonk.id, pressureMonk.id,
    ironveilSmuggler.id, ironveilSmuggler.id,
    underlurgeEcho.id, underlurgeEcho.id,
  ],
};

export const ashenCovenantDeck: DeckConfig = {
  deckId: 'ashen-covenant',
  name: 'Seravine Null',
  companionId: seravineNull.id,
  timeline: 'Ashen Covenant',
  role: 'Attrition / Knowledge Control',
  cardIds: [
    covenantWarden.id, covenantWarden.id,
    ashScribe.id, ashScribe.id,
    lectorSurgeon.id, lectorSurgeon.id,
    quarantineSentinel.id, quarantineSentinel.id,
    theRemembered.id, theRemembered.id,
  ],
};

export const quintoSolDeck: DeckConfig = {
  deckId: 'quinto-sol',
  name: 'Xochitl Pavón',
  companionId: xochitlPavon.id,
  timeline: 'El Quinto Sol',
  role: 'Sacred Momentum / Offensive Sustain',
  cardIds: [
    cuauhpilliVanguard.id, cuauhpilliVanguard.id,
    telpochcalliScout.id, telpochcalliScout.id,
    laCantoraSegrada.id, laCantoraSegrada.id,
    serpienteDeJade.id, serpienteDeJade.id,
    quetzalAscendant.id, quetzalAscendant.id,
  ],
};

export const remnantDecks: DeckConfig[] = [
  ironCenturyDeck,
  ashenCovenantDeck,
  quintoSolDeck,
];
