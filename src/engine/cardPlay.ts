/// <reference path="../state/types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';
import { hasEnoughEnergy, hasActionsRemaining, isSlotEmpty } from '../rules/validation';
import { getCardDefinition } from '../cards/registry';
import { dealDamage, handleDeath } from './combat';
import { resolveCardName, resolvePlayerName } from '../utils/logHelpers';

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

  // Death Flare: deal 2 damage to all units on both boards; gain 1 Charge per kill
  if (def?.id === 'death-flare') {
    const removedPlayers = state.players.map((p) =>
      p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
    ) as [PlayerState, PlayerState];
    let next = { ...state, players: removedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);
    next = { ...next, eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} played Death Flare — 2 damage to all units!`] };

    const rows: Row[] = ['front', 'back'];
    const indices: SlotIndex[] = [0, 1, 2];

    for (const origPlayer of state.players) {
      for (const row of rows) {
        for (const idx of indices) {
          if (origPlayer.board[row][idx].occupant !== null) {
            next = dealDamage(next, origPlayer.playerId, { row, index: idx }, 2);
          }
        }
      }
    }

    let deathCount = 0;
    for (const origPlayer of state.players) {
      for (const row of rows) {
        for (const idx of indices) {
          const livePlayer = next.players.find((p) => p.playerId === origPlayer.playerId)!;
          const occupant = livePlayer.board[row][idx].occupant;
          if (occupant !== null && occupant.currentHp <= 0) {
            deathCount++;
            next = handleDeath(next, origPlayer.playerId, { row, index: idx });
          }
        }
      }
    }

    if (deathCount > 0) {
      const chargedPlayers = next.players.map((p) =>
        p.playerId !== active.playerId ? p :
        { ...p, companion: { ...p.companion, charge: p.companion.charge + deathCount } },
      ) as [PlayerState, PlayerState];
      next = {
        ...next,
        players: chargedPlayers,
        eventLog: [...next.eventLog, `Death Flare destroyed ${deathCount} unit${deathCount !== 1 ? 's' : ''} — ${resolvePlayerName(active.playerId)} gained ${deathCount} Charge.`],
      };
    }

    // Check if any companion was killed by the flare
    for (const p of next.players) {
      if (p.companion.currentHp <= 0) {
        const winnerId = next.players.find((pl) => pl.playerId !== p.playerId)!.playerId;
        next = { ...next, winner: winnerId, phase: 'ended' };
      }
    }

    return next;
  }

  // Soul Kindle: sacrifice a unit on own board, gain 3 Charge
  if (def?.id === 'soul-kindle' && targetSlot) {
    const targetOccupant = active.board[targetSlot.row][targetSlot.index].occupant;
    if (!targetOccupant || targetOccupant.instanceId === active.companion.instanceId) {
      return { ...state, eventLog: [...state.eventLog, `⚠ Soul Kindle requires a non-companion unit to sacrifice.`] };
    }
    // Step 1: Remove spell from hand, set sacrificed unit HP to 0 so handleDeath fires
    const preparedPlayers = state.players.map((p) => {
      if (p.playerId !== active.playerId) return p;
      const updatedRow = p.board[targetSlot.row].map((s, i) =>
        i === targetSlot.index && s.occupant ? { ...s, occupant: { ...s.occupant, currentHp: 0 } } : s,
      ) as [Slot, Slot, Slot];
      return {
        ...p,
        hand: p.hand.filter((c) => c.instanceId !== cardInstanceId),
        board: { ...p.board, [targetSlot.row]: updatedRow },
      };
    }) as [PlayerState, PlayerState];
    let next: GameState = { ...state, players: preparedPlayers };
    // Step 2: handleDeath clears the slot, fires Charge keyword, triggers Soul Siphon
    next = handleDeath(next, active.playerId, targetSlot);
    // Step 3: Grant the 3 Charge from Soul Kindle itself
    const chargedPlayers = next.players.map((p) =>
      p.playerId !== active.playerId ? p :
      { ...p, companion: { ...p.companion, charge: p.companion.charge + 3 } },
    ) as [PlayerState, PlayerState];
    next = { ...next, players: chargedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);
    return { ...next, eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} sacrificed ${resolveCardName(targetOccupant.instanceId, state)} with Soul Kindle — gained 3 Charge.`] };
  }

  // Pack Signal: reposition a friendly unit to an adjacent empty slot
  if (def?.id === 'pack-signal' && sourceSlot && targetSlot) {
    const sourceOccupant = active.board[sourceSlot.row][sourceSlot.index].occupant;
    if (!sourceOccupant) {
      return { ...state, eventLog: [...state.eventLog, `⚠ Pack Signal requires a unit at the source slot.`] };
    }
    if (!isSlotEmpty(active.board, targetSlot)) {
      return { ...state, eventLog: [...state.eventLog, `⚠ Pack Signal target slot is not empty.`] };
    }
    const repositionedPlayers = state.players.map((p) => {
      if (p.playerId !== active.playerId) return p;
      const clearedRow = p.board[sourceSlot.row].map((s, i) =>
        i === sourceSlot.index ? { ...s, occupant: null } : s,
      ) as [Slot, Slot, Slot];
      const boardAfterClear = { ...p.board, [sourceSlot.row]: clearedRow };
      const placedRow = boardAfterClear[targetSlot.row].map((s, i) =>
        i === targetSlot.index ? { ...s, occupant: { ...sourceOccupant, hasMovedThisTurn: true } } : s,
      ) as [Slot, Slot, Slot];
      return {
        ...p,
        hand: p.hand.filter((c) => c.instanceId !== cardInstanceId),
        board: { ...boardAfterClear, [targetSlot.row]: placedRow },
      };
    }) as [PlayerState, PlayerState];
    let next = { ...state, players: repositionedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);
    return { ...next, eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} used Pack Signal — ${resolveCardName(sourceOccupant.instanceId, state)} moved to ${targetSlot.row} ${targetSlot.index + 1}.`] };
  }

  // Pounce Window: push an enemy front-row unit to the back row of the same lane
  if (def?.id === 'pounce-window' && targetSlot) {
    if (targetSlot.row !== 'front') {
      return { ...state, eventLog: [...state.eventLog, `⚠ Pounce Window must target an enemy front-row unit.`] };
    }
    const enemy = state.players.find((p) => p.playerId !== active.playerId)!;
    const targetOccupant = enemy.board.front[targetSlot.index].occupant;
    if (!targetOccupant) {
      return { ...state, eventLog: [...state.eventLog, `⚠ Pounce Window target slot has no unit.`] };
    }
    const backSlot: SlotPosition = { row: 'back', index: targetSlot.index };
    if (!isSlotEmpty(enemy.board, backSlot)) {
      return { ...state, eventLog: [...state.eventLog, `⚠ Pounce Window cannot push — back lane ${targetSlot.index + 1} is occupied.`] };
    }
    const removedPlayers = state.players.map((p) =>
      p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
    ) as [PlayerState, PlayerState];
    let next = { ...state, players: removedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);
    const pushedPlayers = next.players.map((p) => {
      if (p.playerId !== enemy.playerId) return p;
      const newFront = p.board.front.map((s, i) =>
        i === targetSlot.index ? { ...s, occupant: null } : s,
      ) as [Slot, Slot, Slot];
      const newBack = p.board.back.map((s, i) =>
        i === targetSlot.index ? { ...s, occupant: { ...targetOccupant } } : s,
      ) as [Slot, Slot, Slot];
      return { ...p, board: { front: newFront, back: newBack } };
    }) as [PlayerState, PlayerState];
    next = { ...next, players: pushedPlayers };
    return { ...next, eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} used Pounce Window — ${resolveCardName(targetOccupant.instanceId, state)} pushed to back row, lane ${targetSlot.index + 1} open!`] };
  }

  const updatedPlayers = state.players.map((p) =>
    p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
  ) as [PlayerState, PlayerState];

  let next = { ...state, players: updatedPlayers };
  next = spendEnergy(next, active.playerId, card.cost);
  next = spendAction(next, active.playerId);

  return {
    ...next,
    eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} played ${def?.name ?? card.instanceId}. Effects pending.`],
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

  // Ember Mantle: companion gains +2 HP and +1 ATK; gain 1 Charge if companion is Ember Wisp
  if (upgradeDef?.id === 'ember-mantle') {
    const removedPlayers = state.players.map((p) =>
      p.playerId !== active.playerId ? p : { ...p, hand: p.hand.filter((c) => c.instanceId !== cardInstanceId) },
    ) as [PlayerState, PlayerState];
    let next = { ...state, players: removedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);

    const buffedPlayers = next.players.map((p) => {
      if (p.playerId !== active.playerId) return p;
      const newHp = p.companion.currentHp + 2;
      const newAtk = p.companion.currentAttack + 1;
      const companionId = p.companion.instanceId;
      const buffRow = (row: Row): [Slot, Slot, Slot] =>
        p.board[row].map((s) =>
          s.occupant?.instanceId === companionId
            ? { ...s, occupant: { ...s.occupant, currentHp: newHp, currentAttack: newAtk } }
            : s,
        ) as [Slot, Slot, Slot];
      return {
        ...p,
        companion: { ...p.companion, currentHp: newHp, currentAttack: newAtk },
        board: { front: buffRow('front'), back: buffRow('back') },
      };
    }) as [PlayerState, PlayerState];
    next = { ...next, players: buffedPlayers };

    const isEmberWisp = active.companion.definitionId === 'ember-wisp';
    if (isEmberWisp) {
      const chargedPlayers = next.players.map((p) =>
        p.playerId !== active.playerId ? p :
        { ...p, companion: { ...p.companion, charge: p.companion.charge + 1 } },
      ) as [PlayerState, PlayerState];
      next = { ...next, players: chargedPlayers };
    }

    return {
      ...next,
      eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} equipped Ember Mantle — companion +2 HP, +1 ATK${isEmberWisp ? ', +1 Charge' : ''}.`],
    };
  }

  if (isSlotEmpty(active.board, targetSlot)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ Target slot has no unit to attach upgrade to.`] };
  }

  // Sharpen Instinct: +2 ATK to target unit
  if (upgradeDef?.id === 'sharpen-instinct') {
    const occupant = active.board[targetSlot.row][targetSlot.index].occupant;
    const buffedPlayers = state.players.map((p) => {
      if (p.playerId !== active.playerId) return p;
      const updatedRow = p.board[targetSlot.row].map((s, i) =>
        i === targetSlot.index && s.occupant
          ? { ...s, occupant: { ...s.occupant, currentAttack: s.occupant.currentAttack + 2 } }
          : s,
      ) as [Slot, Slot, Slot];
      return {
        ...p,
        hand: p.hand.filter((c) => c.instanceId !== cardInstanceId),
        board: { ...p.board, [targetSlot.row]: updatedRow },
      };
    }) as [PlayerState, PlayerState];
    let next = { ...state, players: buffedPlayers };
    next = spendEnergy(next, active.playerId, card.cost);
    next = spendAction(next, active.playerId);
    return {
      ...next,
      eventLog: [...next.eventLog, `${resolvePlayerName(active.playerId)} equipped Sharpen Instinct on ${occupant ? resolveCardName(occupant.instanceId, state) : 'unit'} — +2 ATK.`],
    };
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
