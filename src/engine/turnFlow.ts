/// <reference path="../state/types.ts" />
import { GAME_CONSTANTS } from '../../config/gameConstants';

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

  return {
    ...state,
    players: updatedPlayers,
    eventLog: [
      ...state.eventLog,
      `Turn ${state.turnNumber} started for ${state.activePlayerId}`,
      ...(drawCount > 0 ? [`${state.activePlayerId} drew ${drawCount} card${drawCount !== 1 ? 's' : ''}.`] : []),
    ],
  };
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

export function drawCard(state: GameState): GameState {
  const active = state.players.find((p) => p.playerId === state.activePlayerId)!;

  if (active.deck.length === 0) {
    return {
      ...state,
      eventLog: [...state.eventLog, `${state.activePlayerId} tried to draw but deck is empty.`],
    };
  }

  if (active.hand.length >= GAME_CONSTANTS.HAND_SIZE_CAP) {
    return {
      ...state,
      eventLog: [...state.eventLog, `${state.activePlayerId} tried to draw but hand is full.`],
    };
  }

  const [drawn, ...remainingDeck] = active.deck;
  const updatedPlayers = state.players.map((player) =>
    player.playerId !== state.activePlayerId
      ? player
      : { ...player, hand: [...player.hand, drawn], deck: remainingDeck },
  ) as [PlayerState, PlayerState];

  return {
    ...state,
    players: updatedPlayers,
    eventLog: [...state.eventLog, `${state.activePlayerId} drew a card.`],
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
  // evolutionChargeThreshold lives on CardDefinition; cast until card instantiation copies it onto the instance
  const companion = player.companion as CompanionInstance & { evolutionChargeThreshold?: number };
  const threshold = companion.evolutionChargeThreshold ?? Infinity;

  if (companion.evolutionStage === 1 && companion.charge >= threshold) {
    const updatedPlayers = state.players.map((p) =>
      p.playerId !== playerId
        ? p
        : { ...p, companion: { ...p.companion, evolutionStage: 2 as EvolutionStage } },
    ) as [PlayerState, PlayerState];

    return {
      ...state,
      players: updatedPlayers,
      eventLog: [...state.eventLog, 'Companion evolved!'],
    };
  }

  return {
    ...state,
    eventLog: [...state.eventLog, 'No evolution this turn.'],
  };
}
