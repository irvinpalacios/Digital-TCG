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

export function GameScreen() {
  const { state, dispatch } = useGameState();
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<SlotPosition | null>(null);

  const player = state.players.find((p) => p.playerId === 'player-1')!;
  const enemy = state.players.find((p) => p.playerId === 'player-2')!;

  const selectedCard = selectedCardId !== null
    ? player.hand.find((c) => c.instanceId === selectedCardId) ?? null
    : null;

  const playerLegalTargets: SlotPosition[] = selectedCard !== null
    ? getLegalPlaySlots(selectedCard, player.board)
    : selectedSlot !== null
    ? getLegalMoves(selectedSlot, player.board)
    : [];

  const enemyLegalTargets: SlotPosition[] = selectedSlot !== null
    ? getLegalTargets(selectedSlot, player.board, enemy.board)
    : [];

  function handleCardClick(cardInstanceId: string) {
    if (selectedCardId === cardInstanceId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardInstanceId);
      setSelectedSlot(null);
    }
  }

  function handlePlayerSlotClick(pos: SlotPosition) {
    if (selectedCardId !== null) {
      dispatch({ type: 'PLAY_CARD', cardInstanceId: selectedCardId, targetSlot: pos });
      setSelectedCardId(null);
      setSelectedSlot(null);
      return;
    }
    if (selectedSlot && selectedSlot.row === pos.row && selectedSlot.index === pos.index) {
      setSelectedSlot(null);
      return;
    }
    if (selectedSlot !== null) {
      const targetSlot = player.board[pos.row][pos.index];
      if (targetSlot.occupant === null) {
        dispatch({ type: 'MOVE_UNIT', fromSlot: selectedSlot, toSlot: pos });
        setSelectedSlot(null);
        setSelectedCardId(null);
        return;
      }
    }
    const slot = player.board[pos.row][pos.index];
    if (slot.occupant !== null) {
      setSelectedSlot(pos);
      setSelectedCardId(null);
    }
  }

  function handleEnemySlotClick(pos: SlotPosition) {
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
  }

  const isActivePlayer = state.activePlayerId === 'player-1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, maxWidth: 420 }}>
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
        selectedSlot={selectedSlot}
        onSlotClick={handlePlayerSlotClick}
        flipped={false}
      />
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
