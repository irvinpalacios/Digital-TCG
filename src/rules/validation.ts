/// <reference path="../state/types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';

export function hasEnoughEnergy(player: PlayerState, cost: number): boolean {
  return player.energy >= cost;
}

export function hasActionsRemaining(player: PlayerState): boolean {
  return player.actionsRemaining > 0;
}

export function isSlotEmpty(board: BoardState, position: SlotPosition): boolean {
  return board[position.row][position.index].occupant === null;
}

// Note: CardInstance does not carry card type — Spell/Upgrade filtering requires
// a CardDefinition lookup. Callers must verify card type before calling this function.
// This function returns all empty slots, valid for Unit and Companion card types.
export function getLegalPlaySlots(card: CardInstance, board: BoardState): SlotPosition[] {
  const rows: Row[] = ['front', 'back'];
  const indices: SlotIndex[] = [0, 1, 2];
  const empty: SlotPosition[] = [];

  for (const row of rows) {
    for (const index of indices) {
      if (board[row][index].occupant === null) {
        empty.push({ row, index });
      }
    }
  }

  return empty;
}
