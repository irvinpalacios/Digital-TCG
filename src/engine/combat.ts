/// <reference path="../state/types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';
import { gainCharge } from './turnFlow';

function getSlot(board: BoardState, position: SlotPosition): Slot {
  return board[position.row][position.index];
}

export function dealDamage(
  state: GameState,
  targetPlayerId: string,
  targetPosition: SlotPosition,
  amount: number,
): GameState {
  const updatedPlayers = state.players.map((player) => {
    if (player.playerId !== targetPlayerId) return player;

    const slot = getSlot(player.board, targetPosition);
    if (slot.occupant === null) return player;

    const occupant = slot.occupant;
    const newHp = Math.max(0, occupant.currentHp - amount);
    const updatedOccupant = { ...occupant, currentHp: newHp };

    const updatedRow = player.board[targetPosition.row].map((s, i) =>
      i === targetPosition.index ? { ...s, occupant: updatedOccupant } : s,
    ) as [Slot, Slot, Slot];

    return {
      ...player,
      board: { ...player.board, [targetPosition.row]: updatedRow },
    };
  }) as [PlayerState, PlayerState];

  const targetPlayer = state.players.find((p) => p.playerId === targetPlayerId)!;
  const slot = getSlot(targetPlayer.board, targetPosition);
  const occupantName = slot.occupant?.instanceId ?? 'unknown';

  return {
    ...state,
    players: updatedPlayers,
    eventLog: [
      ...state.eventLog,
      `${occupantName} took ${amount} damage (${targetPlayerId}, ${targetPosition.row}[${targetPosition.index}]).`,
    ],
  };
}

export function handleDeath(
  state: GameState,
  playerId: string,
  position: SlotPosition,
): GameState {
  const player = state.players.find((p) => p.playerId === playerId)!;
  const occupant = getSlot(player.board, position).occupant;

  if (occupant === null || occupant.currentHp > 0) return state;

  const chargeKeyword = occupant.keywords.find((k) => k.keyword === 'Charge');

  const clearedPlayers = state.players.map((p) => {
    if (p.playerId !== playerId) return p;
    const updatedRow = p.board[position.row].map((s, i) =>
      i === position.index ? { ...s, occupant: null } : s,
    ) as [Slot, Slot, Slot];
    return { ...p, board: { ...p.board, [position.row]: updatedRow } };
  }) as [PlayerState, PlayerState];

  let next: GameState = {
    ...state,
    players: clearedPlayers,
    eventLog: [...state.eventLog, `${occupant.instanceId} died (${playerId}, ${position.row}[${position.index}]).`],
  };

  if (chargeKeyword?.value !== undefined) {
    next = gainCharge(next, playerId, chargeKeyword.value);
  }

  return next;
}

export function resolveAttack(
  state: GameState,
  attackerPlayerId: string,
  attackerPosition: SlotPosition,
  targetPlayerId: string,
  targetPosition: SlotPosition,
): GameState {
  const attackerPlayer = state.players.find((p) => p.playerId === attackerPlayerId)!;
  const attacker = getSlot(attackerPlayer.board, attackerPosition).occupant;
  if (attacker === null) return state;

  const targetPlayer = state.players.find((p) => p.playerId === targetPlayerId)!;
  const targetOccupant = getSlot(targetPlayer.board, targetPosition).occupant;
  const isCompanionTarget =
    targetOccupant !== null &&
    targetOccupant.instanceId === targetPlayer.companion.instanceId;

  let next = dealDamage(state, targetPlayerId, targetPosition, attacker.currentAttack);
  next = handleDeath(next, targetPlayerId, targetPosition);

  if (isCompanionTarget) {
    const companionHp = next.players.find((p) => p.playerId === targetPlayerId)!.companion.currentHp;
    if (companionHp <= 0) {
      next = { ...next, winner: attackerPlayerId };
    }
  }

  const markedPlayers = next.players.map((player) => {
    if (player.playerId !== attackerPlayerId) return player;
    const updatedRow = player.board[attackerPosition.row].map((s, i) => {
      if (i !== attackerPosition.index || s.occupant === null) return s;
      return { ...s, occupant: { ...s.occupant, hasAttackedThisTurn: true } };
    }) as [Slot, Slot, Slot];
    return { ...player, board: { ...player.board, [attackerPosition.row]: updatedRow } };
  }) as [PlayerState, PlayerState];

  return {
    ...next,
    players: markedPlayers,
    eventLog: [
      ...next.eventLog,
      `${attacker.instanceId} attacked ${targetOccupant?.instanceId ?? 'empty'} for ${attacker.currentAttack}.`,
    ],
  };
}
