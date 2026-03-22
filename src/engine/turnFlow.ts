/// <reference path="../state/types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';
import { getCardDefinitionOrThrow } from '../cards/registry';

export function startTurn(state: GameState): GameState {
  const updatedPlayers = state.players.map((player) => {
    if (player.playerId !== state.activePlayerId) return player;
    const newEnergyMax = Math.min(
      player.energyMax + GAME_CONSTANTS.ENERGY_GROWTH_PER_TURN,
      GAME_CONSTANTS.ENERGY_CAP,
    );
    const drawCount = Math.min(
      Math.max(0, GAME_CONSTANTS.HAND_SIZE_CAP - player.hand.length),
      player.deck.length,
    );
    const drawn = player.deck.slice(0, drawCount);
    const remainingDeck = player.deck.slice(drawCount);
    return {
      ...player,
      energyMax: newEnergyMax,
      energy: newEnergyMax,
      actionsRemaining: GAME_CONSTANTS.ACTIONS_PER_TURN,
      hand: [...player.hand, ...drawn],
      deck: remainingDeck,
    };
  }) as [PlayerState, PlayerState];

  const active = state.players.find((p) => p.playerId === state.activePlayerId)!;
  const drawCount = Math.min(
    Math.max(0, GAME_CONSTANTS.HAND_SIZE_CAP - active.hand.length),
    active.deck.length,
  );

  let next: GameState = {
    ...state,
    players: updatedPlayers,
    eventLog: [
      ...state.eventLog,
      `Turn ${state.turnNumber} started for ${state.activePlayerId}`,
      ...(drawCount > 0 ? [`${state.activePlayerId} drew ${drawCount} card${drawCount !== 1 ? 's' : ''}.`] : []),
    ],
  };

  next = gainCharge(next, state.activePlayerId, GAME_CONSTANTS.CHARGE_BASELINE_PER_TURN);
  next = checkCompanionEvolution(next, state.activePlayerId);

  return next;
}

export function endTurn(state: GameState): GameState {
  const nextPlayerId = state.players.find(
    (p) => p.playerId !== state.activePlayerId,
  )!.playerId;

  return {
    ...state,
    activePlayerId: nextPlayerId,
    turnNumber: state.turnNumber + 1,
    eventLog: [
      ...state.eventLog,
      `Turn ended. Now player ${nextPlayerId}'s turn.`,
    ],
  };
}

export function gainCharge(state: GameState, playerId: string, amount: number): GameState {
  const updatedPlayers = state.players.map((player) =>
    player.playerId !== playerId
      ? player
      : {
          ...player,
          companion: { ...player.companion, charge: player.companion.charge + amount },
        },
  ) as [PlayerState, PlayerState];

  return {
    ...state,
    players: updatedPlayers,
    eventLog: [...state.eventLog, `${playerId} gained ${amount} charge.`],
  };
}

export function checkCompanionEvolution(state: GameState, playerId: string): GameState {
  const player = state.players.find((p) => p.playerId === playerId)!;
  const companion = player.companion;
  const threshold = companion.evolutionChargeThreshold;

  if (companion.evolutionStage === 1 && companion.charge >= threshold) {
    const evolvedDef = getCardDefinitionOrThrow(companion.evolutionDefinitionId);
    const updatedPlayers = state.players.map((p) => {
      if (p.playerId !== playerId) return p;
      const newHp = evolvedDef.hp;
      const newAtk = evolvedDef.attack;
      const newKeywords = evolvedDef.keywords;
      const companionId = p.companion.instanceId;
      const syncRow = (row: Row): [Slot, Slot, Slot] =>
        p.board[row].map((s) =>
          s.occupant?.instanceId === companionId
            ? { ...s, occupant: { ...s.occupant, currentHp: newHp, currentAttack: newAtk, keywords: newKeywords } }
            : s,
        ) as [Slot, Slot, Slot];
      return {
        ...p,
        companion: {
          ...p.companion,
          currentHp: newHp,
          currentAttack: newAtk,
          keywords: newKeywords,
          evolutionStage: 2 as EvolutionStage,
        },
        board: { front: syncRow('front'), back: syncRow('back') },
      };
    }) as [PlayerState, PlayerState];

    return {
      ...state,
      players: updatedPlayers,
      eventLog: [...state.eventLog, `${playerId}'s companion evolved into ${evolvedDef.name}!`],
    };
  }

  return state;
}
