/// <reference path="../state/types.ts" />
import { getCardDefinitionOrThrow } from '../cards/registry';

export function placeCardFaceDown(
  state: GameState,
  playerId: string,
  cardInstanceId: string,
): GameState {
  if (state.phase !== 'opening') {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: placeCardFaceDown called outside opening phase.`],
    };
  }

  const player = state.players.find((p) => p.playerId === playerId);
  if (!player) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: player ${playerId} not found.`],
    };
  }

  const card = player.hand.find((c) => c.instanceId === cardInstanceId);
  if (!card) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: card ${cardInstanceId} not found in ${playerId}'s hand.`],
    };
  }

  const placements = player.openingPlacements ?? [];
  if (placements.length >= 6) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: ${playerId} has already placed 6 cards face-down.`],
    };
  }

  const faceDownCard: FaceDownCard = { instanceId: card.instanceId, definitionId: card.definitionId, ownerId: playerId, revealed: false };

  const updatedPlayers = state.players.map((p) =>
    p.playerId !== playerId
      ? p
      : {
          ...p,
          hand: p.hand.filter((c) => c.instanceId !== cardInstanceId),
          openingPlacements: [...placements, faceDownCard],
        },
  ) as [PlayerState, PlayerState];

  return {
    ...state,
    players: updatedPlayers,
    eventLog: [...state.eventLog, `${playerId} placed a card face-down (${cardInstanceId}).`],
  };
}

export function isReadyToReveal(state: GameState): boolean {
  return state.players.every((p) => (p.openingPlacements ?? []).length === 6);
}

export function revealOpeningBoards(state: GameState): GameState {
  if (!isReadyToReveal(state)) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: not all players have placed 6 cards. Cannot reveal yet.`],
    };
  }

  const updatedPlayers = state.players.map((player) => {
    const placements = player.openingPlacements ?? [];

    const makeInstance = (fc: FaceDownCard): CardInstance => {
      if (fc.instanceId === player.companion.instanceId) {
        return player.companion;
      }
      const def = getCardDefinitionOrThrow(fc.definitionId);
      return {
        instanceId: fc.instanceId,
        definitionId: fc.definitionId,
        ownerId: fc.ownerId,
        currentHp: def.hp,
        currentAttack: def.attack,
        keywords: def.keywords,
        hasAttackedThisTurn: false,
        hasMovedThisTurn: false,
      };
    };

    const front: [Slot, Slot, Slot] = [
      { position: { row: 'front', index: 0 }, occupant: makeInstance(placements[0]) },
      { position: { row: 'front', index: 1 }, occupant: makeInstance(placements[1]) },
      { position: { row: 'front', index: 2 }, occupant: makeInstance(placements[2]) },
    ];

    const back: [Slot, Slot, Slot] = [
      { position: { row: 'back', index: 0 }, occupant: makeInstance(placements[3]) },
      { position: { row: 'back', index: 1 }, occupant: makeInstance(placements[4]) },
      { position: { row: 'back', index: 2 }, occupant: makeInstance(placements[5]) },
    ];

    return { ...player, board: { front, back }, openingPlacements: [] };
  }) as unknown as [PlayerState, PlayerState];

  return {
    ...state,
    phase: 'main',
    players: updatedPlayers,
    eventLog: [...state.eventLog, 'Opening boards revealed. Game begins.'],
  };
}
