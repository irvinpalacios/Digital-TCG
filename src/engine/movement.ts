/// <reference path="../state/types.ts" />
import { getLegalMoves } from '../rules/movement';
import { spendAction } from './cardPlay';
import { hasActionsRemaining } from '../rules/validation';
import { resolveCardName, resolvePlayerName } from '../utils/logHelpers';

export function resolveMove(
  state: GameState,
  playerId: string,
  fromPosition: SlotPosition,
  toPosition: SlotPosition,
): GameState {
  const player = state.players.find((p) => p.playerId === playerId)!;

  if (!hasActionsRemaining(player)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(playerId)} has no actions remaining.`] };
  }

  const fromSlot = player.board[fromPosition.row][fromPosition.index];

  if (fromSlot.occupant === null) {
    return {
      ...state,
      eventLog: [...state.eventLog, `⚠ No unit at that slot.`],
    };
  }

  if (fromSlot.occupant.frozen) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolveCardName(fromSlot.occupant.instanceId, state)} is frozen and cannot move.`] };
  }

  const legalMoves = getLegalMoves(fromPosition, player.board);
  const isLegal = legalMoves.some(
    (pos) => pos.row === toPosition.row && pos.index === toPosition.index,
  );

  if (!isLegal) {
    return {
      ...state,
      eventLog: [...state.eventLog, `⚠ That move is not legal.`],
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
      `${resolveCardName(movedOccupant.instanceId, state)} moved to ${toPosition.row} ${toPosition.index + 1}.`,
    ],
  };

  result = spendAction(result, playerId);

  return result;
}
