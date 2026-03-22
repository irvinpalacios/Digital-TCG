/// <reference path="../state/types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';
import { hasEnoughEnergy, hasActionsRemaining, isSlotEmpty } from '../rules/validation';
import { getCardDefinition } from '../cards/registry';

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

// Note: cost is on CardDefinition, not CardInstance. Until definition lookups are wired,
// cost is read via type assertion from the instance.
type CardInstanceWithCost = CardInstance & { cost: number };

export function playUnitCard(
  state: GameState,
  cardInstanceId: string,
  targetSlot: SlotPosition,
): GameState {
  const active = getActivePlayer(state);
  const card = active.hand.find((c) => c.instanceId === cardInstanceId) as CardInstanceWithCost | undefined;

  if (!card) {
    return { ...state, eventLog: [...state.eventLog, `Warning: card ${cardInstanceId} not found in hand.`] };
  }
  if (!hasActionsRemaining(active)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${active.playerId} has no actions remaining.`] };
  }
  if (!hasEnoughEnergy(active, card.cost)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${active.playerId} has insufficient energy to play ${card.instanceId}.`] };
  }
  if (!isSlotEmpty(active.board, targetSlot)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: target slot ${targetSlot.row}[${targetSlot.index}] is not empty.`] };
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
    eventLog: [...next.eventLog, `${active.playerId} played ${card.instanceId} to ${targetSlot.row}[${targetSlot.index}].`],
  };
}

export function playSpellCard(state: GameState, cardInstanceId: string, targetSlot?: SlotPosition): GameState {
  const active = getActivePlayer(state);
  const card = active.hand.find((c) => c.instanceId === cardInstanceId) as CardInstanceWithCost | undefined;

  if (!card) {
    return { ...state, eventLog: [...state.eventLog, `Warning: card ${cardInstanceId} not found in hand.`] };
  }
  if (!hasActionsRemaining(active)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${active.playerId} has no actions remaining.`] };
  }
  if (!hasEnoughEnergy(active, card.cost)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${active.playerId} has insufficient energy to play ${card.instanceId}.`] };
  }

  const def = getCardDefinitionByInstance(card);

  // Soul Kindle: sacrifice a unit on own board, gain 3 Charge
  if (def?.id === 'soul-kindle' && targetSlot) {
    const targetOccupant = active.board[targetSlot.row][targetSlot.index].occupant;
    if (!targetOccupant || targetOccupant.instanceId === active.companion.instanceId) {
      return { ...state, eventLog: [...state.eventLog, `Warning: Soul Kindle requires a non-companion unit to sacrifice.`] };
    }
    const clearedPlayers = state.players.map((p) => {
      if (p.playerId !== active.playerId) return p;
      const updatedRow = p.board[targetSlot.row].map((s, i) =>
        i === targetSlot.index ? { ...s, occupant: null } : s,
      ) as [Slot, Slot, Slot];
      return {
        ...p,
        hand: p.hand.filter((c) => c.instanceId !== cardInstanceId),
        board: { ...p.board, [targetSlot.row]: updatedRow },
        companion: { ...p.companion, charge: p.companion.charge + 3 },
      };
    }) as [PlayerState, PlayerState];
    let next = { ...state, players: clearedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);
    return { ...next, eventLog: [...next.eventLog, `${active.playerId} sacrificed ${targetOccupant.instanceId} with Soul Kindle — gained 3 Charge.`] };
  }

  const updatedPlayers = state.players.map((p) =>
    p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
  ) as [PlayerState, PlayerState];

  let next = { ...state, players: updatedPlayers };
  next = spendEnergy(next, active.playerId, card.cost);
  next = spendAction(next, active.playerId);

  return {
    ...next,
    eventLog: [...next.eventLog, `${active.playerId} played spell ${card.instanceId}. Effects pending.`],
  };
}

export function playUpgradeCard(
  state: GameState,
  cardInstanceId: string,
  targetSlot: SlotPosition,
): GameState {
  const active = getActivePlayer(state);
  const card = active.hand.find((c) => c.instanceId === cardInstanceId) as CardInstanceWithCost | undefined;

  if (!card) {
    return { ...state, eventLog: [...state.eventLog, `Warning: card ${cardInstanceId} not found in hand.`] };
  }
  if (!hasActionsRemaining(active)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${active.playerId} has no actions remaining.`] };
  }
  if (!hasEnoughEnergy(active, card.cost)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: ${active.playerId} has insufficient energy to play ${card.instanceId}.`] };
  }
  if (isSlotEmpty(active.board, targetSlot)) {
    return { ...state, eventLog: [...state.eventLog, `Warning: target slot ${targetSlot.row}[${targetSlot.index}] has no unit to attach upgrade to.`] };
  }

  const updatedPlayers = state.players.map((p) =>
    p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
  ) as [PlayerState, PlayerState];

  let next = { ...state, players: updatedPlayers };
  next = spendEnergy(next, active.playerId, card.cost);
  next = spendAction(next, active.playerId);

  return {
    ...next,
    eventLog: [...next.eventLog, `${active.playerId} attached upgrade ${card.instanceId} to ${targetSlot.row}[${targetSlot.index}]. Effects pending.`],
  };
}
