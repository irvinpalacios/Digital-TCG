/// <reference path="../state/types.ts" />
import React from 'react';
import { useGameState } from '../state/store';
import { Board } from './Board';
import { Hand } from './Hand';
import { HUD } from './HUD';
import { EventLog } from './EventLog';
import { getLegalTargets } from '../rules/targeting';
import { getLegalPlaySlots } from '../rules/validation';
import { getLegalMoves } from '../rules/movement';
import { GAME_CONSTANTS } from '../../config/gameConstants';

function findCompanionSlot(board: BoardState, companionInstanceId: string): SlotPosition | null {
  const rows: Row[] = ['front', 'back'];
  const indices: SlotIndex[] = [0, 1, 2];
  for (const row of rows) {
    for (const index of indices) {
      if (board[row][index].occupant?.instanceId === companionInstanceId) {
        return { row, index };
      }
    }
  }
  return null;
}

function getOccupiedSlots(board: BoardState): SlotPosition[] {
  const rows: Row[] = ['front', 'back'];
  const indices: SlotIndex[] = [0, 1, 2];
  const result: SlotPosition[] = [];
  for (const row of rows) {
    for (const index of indices) {
      if (board[row][index].occupant !== null) result.push({ row, index });
    }
  }
  return result;
}

export function GameScreen() {
  const { state, dispatch } = useGameState();
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<SlotPosition | null>(null);
  const [packSignalSource, setPackSignalSource] = React.useState<SlotPosition | null>(null);
  const [autoPassBanner, setAutoPassBanner] = React.useState<string | null>(null);

  const player = state.players.find((p) => p.playerId === state.activePlayerId)!;
  const enemy = state.players.find((p) => p.playerId !== state.activePlayerId)!;

  const selectedCard = selectedCardId !== null
    ? player.hand.find((c) => c.instanceId === selectedCardId) ?? null
    : null;

  const isDeathFlare = selectedCard?.definitionId === 'death-flare';
  const isPackSignal = selectedCard?.definitionId === 'pack-signal';
  const isPounceWindow = selectedCard?.definitionId === 'pounce-window';
  const isEmberMantle = selectedCard?.definitionId === 'ember-mantle';
  const isSharpenInstinct = selectedCard?.definitionId === 'sharpen-instinct';

  const playerLegalTargets: SlotPosition[] = (() => {
    if (selectedCard === null) {
      return selectedSlot !== null ? getLegalMoves(selectedSlot, player.board) : [];
    }
    if (isDeathFlare || isPounceWindow) return [];
    if (isPackSignal) {
      return packSignalSource === null
        ? getOccupiedSlots(player.board)
        : getLegalMoves(packSignalSource, player.board);
    }
    if (isEmberMantle) {
      const companionSlot = findCompanionSlot(player.board, player.companion.instanceId);
      return companionSlot ? [companionSlot] : [];
    }
    if (isSharpenInstinct) {
      return getOccupiedSlots(player.board);
    }
    return getLegalPlaySlots(selectedCard, player.board);
  })();

  const enemyLegalTargets: SlotPosition[] = (() => {
    if (isDeathFlare) {
      return (['front', 'back'] as const).flatMap((row) =>
        ([0, 1, 2] as const).map((index) => ({ row, index })),
      );
    }
    if (isPounceWindow) {
      return ([0, 1, 2] as const)
        .filter((i) => enemy.board.front[i].occupant !== null && enemy.board.back[i].occupant === null)
        .map((i) => ({ row: 'front' as Row, index: i as SlotIndex }));
    }
    if (selectedSlot !== null) {
      return getLegalTargets(selectedSlot, player.board, enemy.board);
    }
    return [];
  })();

  React.useEffect(() => {
    if (state.phase !== 'main') return;
    if (player.actionsRemaining <= 0) {
      setAutoPassBanner('No actions remaining — passing turn automatically...');
      const timer = setTimeout(() => {
        dispatch({ type: 'END_TURN' });
        setAutoPassBanner(null);
        setSelectedCardId(null);
        setSelectedSlot(null);
        setPackSignalSource(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [player.actionsRemaining, state.activePlayerId]);

  function handleCardClick(cardInstanceId: string) {
    if (selectedCardId === cardInstanceId) {
      setSelectedCardId(null);
      setPackSignalSource(null);
    } else {
      setSelectedCardId(cardInstanceId);
      setSelectedSlot(null);
      setPackSignalSource(null);
    }
  }

  function handlePlayerSlotClick(pos: SlotPosition) {
    // Pack Signal: two-step — pick source unit, then pick destination
    if (isPackSignal) {
      if (packSignalSource === null) {
        if (player.board[pos.row][pos.index].occupant !== null) {
          setPackSignalSource(pos);
        }
      } else if (packSignalSource.row === pos.row && packSignalSource.index === pos.index) {
        setPackSignalSource(null);
      } else if (player.board[pos.row][pos.index].occupant === null) {
        dispatch({ type: 'PLAY_CARD', cardInstanceId: selectedCardId!, targetSlot: pos, sourceSlot: packSignalSource });
        setSelectedCardId(null);
        setPackSignalSource(null);
        setSelectedSlot(null);
      } else {
        setPackSignalSource(pos);
      }
      return;
    }

    // Ember Mantle: only respond to companion slot click
    if (isEmberMantle) {
      const companionSlot = findCompanionSlot(player.board, player.companion.instanceId);
      if (companionSlot && companionSlot.row === pos.row && companionSlot.index === pos.index) {
        dispatch({ type: 'PLAY_CARD', cardInstanceId: selectedCardId!, targetSlot: pos });
        setSelectedCardId(null);
        setSelectedSlot(null);
      }
      return;
    }

    // All other card plays: dispatch on any slot click
    if (selectedCardId !== null) {
      dispatch({ type: 'PLAY_CARD', cardInstanceId: selectedCardId, targetSlot: pos });
      setSelectedCardId(null);
      setSelectedSlot(null);
      return;
    }

    // No card selected: movement / slot selection
    if (selectedSlot && selectedSlot.row === pos.row && selectedSlot.index === pos.index) {
      setSelectedSlot(null);
      return;
    }
    if (selectedSlot !== null) {
      if (player.board[pos.row][pos.index].occupant === null) {
        dispatch({ type: 'MOVE_UNIT', fromSlot: selectedSlot, toSlot: pos });
        setSelectedSlot(null);
        setSelectedCardId(null);
        return;
      }
    }
    if (player.board[pos.row][pos.index].occupant !== null) {
      setSelectedSlot(pos);
      setSelectedCardId(null);
    }
  }

  function handleEnemySlotClick(pos: SlotPosition) {
    if (selectedCardId !== null && (isDeathFlare || isPounceWindow)) {
      dispatch({ type: 'PLAY_CARD', cardInstanceId: selectedCardId, targetSlot: pos });
      setSelectedCardId(null);
      setSelectedSlot(null);
      return;
    }
    if (selectedSlot !== null) {
      dispatch({ type: 'ATTACK', attackerSlot: selectedSlot, targetSlot: pos });
      setSelectedSlot(null);
      setSelectedCardId(null);
    }
  }

  function handleEndTurn() {
    dispatch({ type: 'END_TURN' });
    setSelectedCardId(null);
    setSelectedSlot(null);
    setPackSignalSource(null);
  }

  const isActivePlayer = true;
  const highlightedPlayerSlot = packSignalSource ?? selectedSlot;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, maxWidth: 420 }}>
      {autoPassBanner && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#f0c040', padding: '10px 24px',
          borderRadius: 6, border: '1px solid #f0c040',
          fontFamily: 'monospace', fontSize: 14, zIndex: 100,
        }}>
          {autoPassBanner}
        </div>
      )}
      <HUD player={enemy} isActive={!isActivePlayer} />
      <Board
        board={enemy.board}
        legalTargets={enemyLegalTargets}
        selectedSlot={null}
        onSlotClick={handleEnemySlotClick}
        flipped={true}
      />
      <EventLog log={state.eventLog} />
      <Board
        board={player.board}
        legalTargets={playerLegalTargets}
        selectedSlot={highlightedPlayerSlot}
        onSlotClick={handlePlayerSlotClick}
        flipped={false}
      />
      <div style={{ fontSize: 12, color: '#666' }}>Hand ({player.hand.length}/{GAME_CONSTANTS.HAND_SIZE_CAP})</div>
      <Hand hand={player.hand} selectedCardId={selectedCardId} onCardClick={handleCardClick} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <HUD player={player} isActive={isActivePlayer} />
        <button onClick={handleEndTurn} style={{ padding: '6px 14px' }}>
          End Turn
        </button>
      </div>
    </div>
  );
}
