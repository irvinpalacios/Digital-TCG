/// <reference path="./types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';

export function createEmptyBoard(): BoardState {
  const makeSlot = (row: Row, index: SlotIndex): Slot => ({
    position: { row, index },
    occupant: null,
  });

  return {
    front: [
      makeSlot('front', 0),
      makeSlot('front', 1),
      makeSlot('front', 2),
    ],
    back: [
      makeSlot('back', 0),
      makeSlot('back', 1),
      makeSlot('back', 2),
    ],
  };
}

export function createInitialPlayerState(playerId: string): PlayerState {
  return {
    playerId,
    hand: [],
    deck: [],
    board: createEmptyBoard(),
    energy: GAME_CONSTANTS.ENERGY_STARTING_MAX,
    energyMax: GAME_CONSTANTS.ENERGY_STARTING_MAX,
    actionsRemaining: GAME_CONSTANTS.ACTIONS_PER_TURN,
    companion: null as unknown as CompanionInstance, // wired in a later phase
    unitsLost: 0,
    evolutionTurn: null,
  };
}

export function createInitialGameState(playerOneId: string, playerTwoId: string): GameState {
  return {
    phase: 'opening',
    players: [
      createInitialPlayerState(playerOneId),
      createInitialPlayerState(playerTwoId),
    ],
    activePlayerId: playerOneId,
    turnNumber: 1,
    winner: null,
    eventLog: [],
  };
}
