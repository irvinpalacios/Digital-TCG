import {
  auricCub,
  laneProwler,
  vanguardHound,
  boltSkipper,
  packSignal,
  sharpenInstinct,
  pounceWindow,
  emberWisp,
  ashDrudge,
  pyreAcolyte,
  graveLancer,
  soulKindle,
  emberMantle,
  deathFlare,
} from './definitions';

export type DeckConfig = {
  deckId: string;
  name: string;
  companionId: string;
  cardIds: string[];
};

export const tempoDeck: DeckConfig = {
  deckId: 'tempo-deck',
  name: 'Tempo / Lane Pressure',
  companionId: auricCub.id,
  cardIds: [
    laneProwler.id, laneProwler.id,
    vanguardHound.id, vanguardHound.id,
    boltSkipper.id, boltSkipper.id,
    packSignal.id, packSignal.id,
    sharpenInstinct.id, sharpenInstinct.id,
    pounceWindow.id, pounceWindow.id,
  ],
};

export const sacrificeDeck: DeckConfig = {
  deckId: 'sacrifice-deck',
  name: 'Sacrifice / Evolution Ramp',
  companionId: emberWisp.id,
  cardIds: [
    ashDrudge.id, ashDrudge.id,
    pyreAcolyte.id, pyreAcolyte.id,
    graveLancer.id, graveLancer.id,
    soulKindle.id, soulKindle.id,
    emberMantle.id, emberMantle.id,
    deathFlare.id, deathFlare.id,
  ],
};
