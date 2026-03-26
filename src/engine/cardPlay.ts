/// <reference path="../state/types.ts" />
import { hasEnoughEnergy, hasActionsRemaining, isSlotEmpty } from '../rules/validation';
import { getCardDefinition } from '../cards/registry';
import { resolvePlayerName } from '../utils/logHelpers';

function getCardDefinitionByInstance(card: CardInstance): CardDefinition | undefined {
  return getCardDefinition(card.definitionId);
}

function getActivePlayer(state: GameState): PlayerState {
  return state.players.find((p) => p.playerId === state.activePlayerId)!;
}

function spendEnergy(state: GameState, playerId: string, amount: number): GameState {
  const updatedPlayers = state.players.map((p) =>
    p.playerId !== playerId ? p : { ...p, energy: p.energy - amount },
  ) as [PlayerState, PlayerState];
  return { ...state, players: updatedPlayers };
}

export function spendAction(state: GameState, playerId: string): GameState {
  const updatedPlayers = state.players.map((p) =>
    p.playerId !== playerId ? p : { ...p, actionsRemaining: p.actionsRemaining - 1 },
  ) as [PlayerState, PlayerState];
  return { ...state, players: updatedPlayers };
}


export function playUnitCard(
  state: GameState,
  cardInstanceId: string,
  targetSlot: SlotPosition,
): GameState {
  const active = getActivePlayer(state);
  const card = active.hand.find((c) => c.instanceId === cardInstanceId);

  if (!card) {
    return { ...state, eventLog: [...state.eventLog, `⚠ Card not found in hand.`] };
  }
  if (!hasActionsRemaining(active)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(active.playerId)} has no actions remaining.`] };
  }
  if (!hasEnoughEnergy(active, card.cost)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(active.playerId)} has insufficient energy.`] };
  }
  if (!isSlotEmpty(active.board, targetSlot)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ Target slot is not empty.`] };
  }

  const placedCard = { ...card, hasMovedThisTurn: false, hasAttackedThisTurn: false };

  const updatedPlayers = state.players.map((p) => {
    if (p.playerId !== active.playerId) return p;
    const updatedRow = p.board[targetSlot.row].map((s, i) =>
      i === targetSlot.index ? { ...s, occupant: placedCard } : s,
    ) as [Slot, Slot, Slot];
    return {
      ...p,
      hand: p.hand.filter((c) => c.instanceId !== cardInstanceId),
      board: { ...p.board, [targetSlot.row]: updatedRow },
    };
  }) as [PlayerState, PlayerState];

  let next = { ...state, players: updatedPlayers };
  next = spendEnergy(next, active.playerId, card.cost);
  next = spendAction(next, active.playerId);

  return {
    ...next,
    eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} played ${getCardDefinitionByInstance(card)?.name ?? card.instanceId} to ${targetSlot.row} ${targetSlot.index + 1}.`],
  };
}

export function playSpellCard(state: GameState, cardInstanceId: string, targetSlot?: SlotPosition, sourceSlot?: SlotPosition): GameState {
  const active = getActivePlayer(state);
  const card = active.hand.find((c) => c.instanceId === cardInstanceId);

  if (!card) {
    return { ...state, eventLog: [...state.eventLog, `⚠ Card not found in hand.`] };
  }
  if (!hasActionsRemaining(active)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(active.playerId)} has no actions remaining.`] };
  }
  if (!hasEnoughEnergy(active, card.cost)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(active.playerId)} has insufficient energy.`] };
  }

  const def = getCardDefinitionByInstance(card);

  const updatedPlayers = state.players.map((p) =>
    p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
  ) as [PlayerState, PlayerState];

  let next = { ...state, players: updatedPlayers };
  next = spendEnergy(next, active.playerId, card.cost);
  next = spendAction(next, active.playerId);

  return {
    ...next,
    eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} cast ${def?.name ?? card.instanceId}.`],
  };
}

export function playUpgradeCard(
  state: GameState,
  cardInstanceId: string,
  targetSlot: SlotPosition,
): GameState {
  const active = getActivePlayer(state);
  const card = active.hand.find((c) => c.instanceId === cardInstanceId);

  if (!card) {
    return { ...state, eventLog: [...state.eventLog, `⚠ Card not found in hand.`] };
  }
  if (!hasActionsRemaining(active)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(active.playerId)} has no actions remaining.`] };
  }
  if (!hasEnoughEnergy(active, card.cost)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ ${resolvePlayerName(active.playerId)} has insufficient energy.`] };
  }
  const upgradeDef = getCardDefinitionByInstance(card);

  if (isSlotEmpty(active.board, targetSlot)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ Target slot has no unit to attach upgrade to.`] };
  }

  const updatedPlayers = state.players.map((p) =>
    p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
  ) as [PlayerState, PlayerState];

  let next = { ...state, players: updatedPlayers };
  next = spendEnergy(next, active.playerId, card.cost);
  next = spendAction(next, active.playerId);

  return {
    ...next,
    eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} attached ${upgradeDef?.name ?? card.instanceId}. Effects pending.`],
  };
}
