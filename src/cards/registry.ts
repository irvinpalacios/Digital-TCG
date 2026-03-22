/// <reference path="../state/types.ts" />
import { allCards } from './definitions';

export function getCardDefinition(id: string): CardDefinition | undefined {
  return allCards.find((card) => card.id === id);
}

export function getCardDefinitionOrThrow(id: string): CardDefinition {
  const card = getCardDefinition(id);
  if (!card) {
    throw new Error(`CardDefinition not found for id: "${id}"`);
  }
  return card;
}
