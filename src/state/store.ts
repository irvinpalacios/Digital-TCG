/// <reference path="./types.ts" />
import React from 'react';
import { createInitialGameState } from './initialState';
import { getCardDefinition, getCardDefinitionOrThrow } from '../cards/registry';
import { tempoDeck, sacrificeDeck, DeckConfig } from '../cards/decks';
import { playUnitCard, playSpellCard, playUpgradeCard } from '../engine/cardPlay';
import { resolveMove } from '../engine/movement';
import { resolveAttack } from '../engine/combat';
import { startTurn, endTurn } from '../engine/turnFlow';
import { placeCardFaceDown, isReadyToReveal, revealOpeningBoards } from '../engine/opening';

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameStateContext = React.createContext<GameContextValue | null>(null);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY_CARD': {
      const active = state.players.find((p) => p.playerId === state.activePlayerId)!;
      const card = active.hand.find((c) => c.instanceId === action.cardInstanceId);
      if (!card) return state;
      const def = getCardDefinition(card.definitionId);
      if (!def) return state;
      switch (def.type) {
        case 'Unit':
        case 'Companion':
          return playUnitCard(state, action.cardInstanceId, action.targetSlot);
        case 'Spell':
          return playSpellCard(state, action.cardInstanceId);
        case 'Upgrade':
          return playUpgradeCard(state, action.cardInstanceId, action.targetSlot);
        default:
          return state;
      }
    }
    case 'MOVE_UNIT':
      return resolveMove(state, state.activePlayerId, action.fromSlot, action.toSlot);
    case 'ATTACK': {
      const opponentId = state.players.find((p) => p.playerId !== state.activePlayerId)!.playerId;
      return resolveAttack(state, state.activePlayerId, action.attackerSlot, opponentId, action.targetSlot);
    }
    case 'END_TURN':
      return startTurn(endTurn(state));
    case 'PLACE_CARD_FACE_DOWN': {
      const placed = placeCardFaceDown(state, state.activePlayerId, action.cardInstanceId);
      if (isReadyToReveal(placed)) {
        return revealOpeningBoards(placed);
      }
      return placed;
    }
    case 'REVEAL_BOARDS':
      return revealOpeningBoards(state);
    default:
      return state;
  }
}

let _instanceCounter = 0;
function nextInstanceId(): string {
  return `card-${++_instanceCounter}`;
}

function buildDeckInstances(deckConfig: DeckConfig, ownerId: string): CardInstance[] {
  return deckConfig.cardIds.map((cardId) => {
    const def = getCardDefinitionOrThrow(cardId);
    return {
      instanceId: nextInstanceId(),
      definitionId: def.id,
      ownerId,
      currentHp: def.hp,
      currentAttack: def.attack,
      keywords: def.keywords,
      hasAttackedThisTurn: false,
      hasMovedThisTurn: false,
    };
  });
}

function buildCompanionInstance(deckConfig: DeckConfig, ownerId: string): CompanionInstance {
  const def = getCardDefinitionOrThrow(deckConfig.companionId);
  return {
    instanceId: `${ownerId}-companion`,
    definitionId: def.id,
    ownerId,
    currentHp: def.hp,
    currentAttack: def.attack,
    keywords: def.keywords,
    hasAttackedThisTurn: false,
    hasMovedThisTurn: false,
    evolutionStage: 1,
    charge: 0,
    evolutionDefinitionId: def.evolutionTarget ?? '',
  };
}

const base = createInitialGameState('player-1', 'player-2');

const p1FullDeck = buildDeckInstances(tempoDeck, 'player-1');
const p2FullDeck = buildDeckInstances(sacrificeDeck, 'player-2');

const initialState: GameState = {
  ...base,
  players: [
    {
      ...base.players[0],
      hand: p1FullDeck.slice(0, 6),
      deck: p1FullDeck.slice(6),
      companion: buildCompanionInstance(tempoDeck, 'player-1'),
    },
    {
      ...base.players[1],
      hand: p2FullDeck.slice(0, 6),
      deck: p2FullDeck.slice(6),
      companion: buildCompanionInstance(sacrificeDeck, 'player-2'),
    },
  ],
};

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);
  return React.createElement(GameStateContext.Provider, { value: { state, dispatch } }, children);
}

export function useGameState(): GameContextValue {
  const ctx = React.useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used inside GameStateProvider');
  return ctx;
}
