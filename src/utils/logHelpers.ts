/// <reference path="../state/types.ts" />
import { getCardDefinition } from '../cards/registry';

export function resolveCardName(instanceId: string, state: GameState): string {
  for (const player of state.players) {
    // Check if it's the companion
    if (player.companion.instanceId === instanceId) {
      const def = getCardDefinition(player.companion.definitionId);
      return def ? def.name : instanceId;
    }

    // Check hand
    const inHand = player.hand.find((c) => c.instanceId === instanceId);
    if (inHand) {
      const def = getCardDefinition(inHand.definitionId);
      return def ? def.name : instanceId;
    }

    // Check deck
    const inDeck = player.deck.find((c) => c.instanceId === instanceId);
    if (inDeck) {
      const def = getCardDefinition(inDeck.definitionId);
      return def ? def.name : instanceId;
    }

    // Check board slots
    const allSlots = [...player.board.front, ...player.board.back];
    for (const slot of allSlots) {
      if (slot.occupant && slot.occupant.instanceId === instanceId) {
        const def = getCardDefinition(slot.occupant.definitionId);
        return def ? def.name : instanceId;
      }
    }
  }

  return instanceId;
}

export function resolvePlayerName(playerId: string): string {
  if (playerId === 'player-1') return 'Player 1';
  if (playerId === 'player-2') return 'Player 2';
  return playerId;
}
