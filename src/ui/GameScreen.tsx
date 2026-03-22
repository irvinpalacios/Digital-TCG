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
import { getCardDefinition } from '../cards/registry';

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
  const [turnOverlay, setTurnOverlay] = React.useState<string | null>(null);
  const isFirstRender = React.useRef(true);
  const [evolutionBanner, setEvolutionBanner] = React.useState<string | null>(null);
  const [justEvolvedId, setJustEvolvedId] = React.useState<string | null>(null);
  const prevEvolutionStages = React.useRef<Record<string, number>>({});

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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const n = state.activePlayerId.replace('player-', '');
    setTurnOverlay(`PLAYER ${n}'S TURN`);
    const timer = setTimeout(() => setTurnOverlay(null), 1500);
    return () => clearTimeout(timer);
  }, [state.activePlayerId]);

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

  React.useEffect(() => {
    let evolvedPlayerId: string | null = null;
    let evolvedCompanionInstanceId: string | null = null;
    let evolvedName: string | null = null;
    for (const p of state.players) {
      const prev = prevEvolutionStages.current[p.playerId] ?? 1;
      if (prev === 1 && p.companion.evolutionStage === 2) {
        evolvedPlayerId = p.playerId;
        evolvedCompanionInstanceId = p.companion.instanceId;
        evolvedName = getCardDefinition(p.companion.evolutionDefinitionId)?.name ?? p.companion.evolutionDefinitionId;
      }
      prevEvolutionStages.current[p.playerId] = p.companion.evolutionStage;
    }
    if (evolvedPlayerId === null) return;
    setEvolutionBanner(`★ ${evolvedName} HAS EVOLVED ★`);
    setJustEvolvedId(evolvedCompanionInstanceId);
    const timer = setTimeout(() => { setEvolutionBanner(null); setJustEvolvedId(null); }, 2000);
    return () => clearTimeout(timer);
  }, [state.players[0].companion.evolutionStage, state.players[1].companion.evolutionStage]);

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

  const activePlayerNumber = state.activePlayerId.replace('player-', '');
  const turnLabel = isActivePlayer
    ? `YOUR TURN — Player ${activePlayerNumber}`
    : `PLAYER ${activePlayerNumber}'S TURN`;
  const turnColor = isActivePlayer ? '#f0c040' : '#888';
  const turnBorderColor = isActivePlayer ? '#f0c040' : '#444';

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#020817',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow — rose/red top half */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '10%',
        width: '80%',
        height: '50%',
        borderRadius: '50%',
        background: 'rgba(190, 18, 60, 0.12)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      {/* Ambient glow — cyan bottom half */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '10%',
        width: '80%',
        height: '50%',
        borderRadius: '50%',
        background: 'rgba(6, 182, 212, 0.10)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Fixed Tactical Log sidebar — hidden below 1024px via style tag */}
      <style>{`@media (max-width: 1023px) { #tactical-log-sidebar { display: none !important; } }`}</style>
      <div
        id="tactical-log-sidebar"
        style={{
          position: 'fixed',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 200,
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: 8,
          border: '1px solid rgba(51,65,85,0.4)',
          zIndex: 50,
          opacity: 0.5,
          transition: 'opacity 200ms ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.5'; }}
      >
        <div style={{
          fontSize: 9,
          color: '#475569',
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '8px 10px 4px',
        }}>
          TACTICAL LOG
        </div>
        <EventLog log={state.eventLog} />
      </div>

      {/* Turn overlay */}
      {turnOverlay && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
          fontFamily: 'monospace', fontSize: 28, fontWeight: 'bold',
          color: '#f0c040', letterSpacing: '0.1em',
        }}>
          {turnOverlay}
        </div>
      )}
      {autoPassBanner && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', color: '#f0c040', padding: '10px 24px',
          borderRadius: 6, border: '1px solid rgba(240,192,64,0.5)',
          fontFamily: 'monospace', fontSize: 14, zIndex: 100,
        }}>
          {autoPassBanner}
        </div>
      )}

      {/* Centered content container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 16px 16px',
        maxWidth: 896,
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Turn label bar */}
        <div style={{
          height: 32,
          background: 'rgba(15,23,42,0.7)',
          borderLeft: `3px solid ${turnBorderColor}`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
          boxSizing: 'border-box',
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 'bold',
          color: turnColor,
          letterSpacing: '0.05em',
          borderRadius: '0 4px 4px 0',
          marginBottom: 8,
        }}>
          {turnLabel}
        </div>

        {/* Enemy HUD */}
        <HUD player={enemy} isActive={!isActivePlayer} />

        {/* Enemy board */}
        <div style={{ marginTop: 8 }}>
          <Board
            board={enemy.board}
            legalTargets={enemyLegalTargets}
            selectedSlot={null}
            onSlotClick={handleEnemySlotClick}
            flipped={true}
            companionInstanceId={enemy.companion.instanceId}
            justEvolvedInstanceId={justEvolvedId}
          />
        </div>

        {/* Tactical Divide */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '12px 0' }}>
          <div style={{
            flex: 1,
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.3), transparent)',
          }} />
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#020817',
            padding: '0 10px',
            fontSize: 10,
            color: 'rgba(34,211,238,0.6)',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}>
            TACTICAL DIVIDE
          </div>
        </div>

        {/* Player board */}
        <div>
          {evolutionBanner && (
            <div style={{
              textAlign: 'center',
              background: 'rgba(245,158,11,0.08)',
              color: '#f59e0b',
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: '0.08em',
              padding: '6px 0',
              marginBottom: 6,
              borderRadius: 4,
              border: '1px solid rgba(245,158,11,0.2)',
            }}>
              {evolutionBanner}
            </div>
          )}
          <Board
            board={player.board}
            legalTargets={playerLegalTargets}
            selectedSlot={highlightedPlayerSlot}
            onSlotClick={handlePlayerSlotClick}
            flipped={false}
            companionInstanceId={player.companion.instanceId}
            justEvolvedInstanceId={justEvolvedId}
          />
        </div>

        {/* Hand section */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 8, letterSpacing: '0.04em' }}>
            {selectedCardId !== null
              ? '▶ Click a highlighted slot to play'
              : selectedSlot !== null
                ? '▶ Click an enemy to attack or an empty slot to move'
                : `HAND ${player.hand.length}/${GAME_CONSTANTS.HAND_SIZE_CAP} — Select a card or unit`}
          </div>
          <Hand
            hand={player.hand}
            selectedCardId={selectedCardId}
            onCardClick={handleCardClick}
            deckCount={player.deck.length}
          />
        </div>

        {/* Player HUD + End Turn */}
        <div style={{ marginTop: 8, position: 'relative' }}>
          <HUD player={player} isActive={isActivePlayer} />
          <button
            onClick={handleEndTurn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#10b981'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#059669'; }}
            style={{
              position: 'absolute',
              top: '50%',
              right: 12,
              transform: 'translateY(-50%)',
              background: '#059669',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '7px 18px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(5,150,105,0.5)',
              transition: 'background 150ms ease',
            }}
          >
            End Turn
          </button>
        </div>
      </div>
    </div>
  );
}
