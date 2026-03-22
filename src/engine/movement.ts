/// <reference path="../state/types.ts" />
import { getLegalMoves } from '../rules/movement';
import { spendAction } from './cardPlay';
import { hasActionsRemaining } from '../rules/validation';

export function resolveMove(
  state: GameState,
  playerId: string,
  fromPosition: SlotPosition,
  toPosition: SlotPosition,
): GameState {
  const player = state.players.find((p) => p.playerId === playerId)!;

  if (!hasActionsRemaining(player)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${playerId} has no actions remaining.`] };
  }

  const fromSlot = player.board[fromPosition.row][fromPosition.index];

  if (fromSlot.occupant === null) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: no unit at ${fromPosition.row}[${fromPosition.index}] for ${playerId}.`],
    };
  }

  const legalMoves = getLegalMoves(fromPosition, player.board);
  const isLegal = legalMoves.some(
    (pos) => pos.row === toPosition.row && pos.index === toPosition.index,
  );

  if (!isLegal) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Warning: move to ${toPosition.row}[${toPosition.index}] is not legal for ${playerId}.`],
    };
  }

  const movedOccupant = { ...fromSlot.occupant, hasMovedThisTurn: true };

  const updatedPlayers = state.players.map((p) => {
    if (p.playerId !== playerId) return p;

    const clearedFrom = p.board[fromPosition.row].map((s, i) =>
      i === fromPosition.index ? { ...s, occupant: null } : s,
    ) as [Slot, Slot, Slot];

    const boardAfterClear = { ...p.board, [fromPosition.row]: clearedFrom };

    const filledTo = boardAfterClear[toPosition.row].map((s, i) =>
      i === toPosition.index ? { ...s, occupant: movedOccupant } : s,
    ) as [Slot, Slot, Slot];

    return { ...p, board: { ...boardAfterClear, [toPosition.row]: filledTo } };
  }) as [PlayerState, PlayerState];

  let result: GameState = {
    ...state,
    players: updatedPlayers,
    eventLog: [
      ...state.eventLog,
      `${movedOccupant.instanceId} moved from ${fromPosition.row}[${fromPosition.index}] to ${toPosition.row}[${toPosition.index}] (${playerId}).`,
    ],
  };

  result = spendAction(result, playerId);

  return result;
}
