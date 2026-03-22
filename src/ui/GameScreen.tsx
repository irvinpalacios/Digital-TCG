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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, maxWidth: 420 }}>
      <div style={{
        marginLeft: -16,
        marginRight: -16,
        marginTop: -16,
        height: 36,
        background: '#1a1a1a',
        borderLeft: `4px solid ${turnBorderColor}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12,
        boxSizing: 'border-box',
        fontFamily: 'monospace',
        fontSize: 13,
        fontWeight: 'bold',
        color: turnColor,
        letterSpacing: '0.05em',
      }}>
        {turnLabel}
      </div>
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
          background: '#222', color: '#f0c040', padding: '10px 24px',
          borderRadius: 6, border: '1px solid #f0c040',
          fontFamily: 'monospace', fontSize: 14, zIndex: 100,
        }}>
          {autoPassBanner}
        </div>
      )}
      <HUD player={enemy} isActive={!isActivePlayer} />
      <div style={{ border: '1px solid rgba(80,20,20,0.4)', background: 'rgba(80,20,20,0.15)', borderRadius: 4, padding: '4px 6px 6px' }}>
        <div style={{ fontSize: 11, color: '#c04040', fontVariant: 'small-caps', letterSpacing: '0.08em', marginBottom: 4 }}>Enemy Board</div>
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
      <EventLog log={state.eventLog} />
      <div style={{ padding: '4px 6px 6px' }}>
        <div style={{ fontSize: 11, color: '#40a0c0', fontVariant: 'small-caps', letterSpacing: '0.08em', marginBottom: 4 }}>Your Board</div>
        {evolutionBanner && (
          <div style={{
            textAlign: 'center',
            background: '#1a1a1a',
            color: '#f0c040',
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 'bold',
            letterSpacing: '0.08em',
            padding: '6px 0',
            marginBottom: 4,
            borderRadius: 3,
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
      <div style={{ fontSize: 12, color: '#666', display: 'flex', gap: 6, alignItems: 'baseline' }}>
        <span>Hand ({player.hand.length}/{GAME_CONSTANTS.HAND_SIZE_CAP})</span>
        <span style={{ fontSize: 11, color: '#888' }}>
          {selectedCardId !== null
            ? '— Click a highlighted slot to play'
            : selectedSlot !== null
              ? '— Click an enemy to attack or an empty slot to move'
              : '— Select a card to play or a unit to move/attack'}
        </span>
      </div>
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
