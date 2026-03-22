/// <reference path="../state/types.ts" />
import React from 'react';
import { useGameState } from '../state/store';
import { getCardDefinition } from '../cards/registry';

export function OpeningScreen() {
  const { state, dispatch } = useGameState();
  const [draggedCardId, setDraggedCardId] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [dragTargetSlot, setDragTargetSlot] = React.useState<{row: 'front'|'back', index: 0|1|2} | null>(null);

  const p1 = state.players.find((p) => p.playerId === 'player-1')!;
  const p2 = state.players.find((p) => p.playerId === 'player-2')!;

  const p1Placed = (p1.openingPlacements ?? []).filter((fc) => fc !== null).length;
  const p2Placed = (p2.openingPlacements ?? []).filter((fc) => fc !== null).length;

  // Active placer: p1 goes first, then p2 once p1 is done
  const activePlacer = p1Placed < 6 ? 'player-1' : 'player-2';
  const activePlayer = state.players.find((p) => p.playerId === activePlacer)!;
  const activePlaced = activePlacer === 'player-1' ? p1Placed : p2Placed;
  const bothReady = p1Placed === 6 && p2Placed === 6;

  function handleReveal() {
    dispatch({ type: 'REVEAL_BOARDS' });
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', background: '#111', color: '#eee', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Opening Phase — Place Your Cards</h2>
      <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '24px' }}>
        Cards are placed face-down into slots. After both players place 6, boards are revealed simultaneously.
      </p>

      {/* Placement status */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '24px' }}>
        <div style={{ padding: '8px 16px', background: p1Placed === 6 ? '#1a3a1a' : '#1a1a2e', border: '1px solid #444', borderRadius: '4px' }}>
          Player 1: {p1Placed}/6 placed {p1Placed === 6 ? '✓' : ''}
        </div>
        <div style={{ padding: '8px 16px', background: p2Placed === 6 ? '#1a3a1a' : '#1a1a2e', border: '1px solid #444', borderRadius: '4px' }}>
          Player 2: {p2Placed}/6 placed {p2Placed === 6 ? '✓' : ''}
        </div>
      </div>

      {/* Active placer turn indicator */}
      {!bothReady && (
        <p style={{ textAlign: 'center', color: '#f0c040', marginBottom: '20px', fontWeight: 'bold' }}>
          {activePlacer === 'player-1' ? 'Player 1' : 'Player 2'} — select {6 - activePlaced} more card{6 - activePlaced !== 1 ? 's' : ''} to place face-down
        </p>
      )}

      {/* Face-down placement grid */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ textAlign: 'center', color: '#888', marginBottom: '8px' }}>
          {activePlacer === 'player-1' ? 'Player 1' : 'Player 2'} — Placement Grid
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {(['front', 'back'] as const).map((row) => (
            <div key={row} style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: '40px', color: '#666', lineHeight: '56px', textAlign: 'right', marginRight: '4px' }}>{row}</span>
              {([0, 1, 2] as const).map((idx) => {
                const slotNum = row === 'front' ? idx : idx + 3;
                const placements = activePlayer.openingPlacements ?? [];
                const filled = placements[slotNum] != null;
                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedCardId) {
                        dispatch({ type: 'PLACE_CARD_FACE_DOWN', cardInstanceId: draggedCardId, playerId: activePlacer, targetSlot: { row, index: idx } });
                        setDraggedCardId(null);
                      }
                    }}
                    style={{
                      width: '80px',
                      height: '56px',
                      background: filled ? '#2a4a2a' : '#222',
                      border: draggedCardId && !filled ? '1px dashed #f0c040' : filled ? '1px solid #4a8a4a' : '1px solid #444',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: filled ? '#8f8' : '#555',
                      fontSize: '12px',
                    }}
                  >
                    {filled ? 'FACE DOWN' : 'empty'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Active player's hand */}
      {!bothReady && activePlayer.hand.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ textAlign: 'center', color: '#888', marginBottom: '8px' }}>
            {activePlacer === 'player-1' ? 'Player 1' : 'Player 2'} — Hand (click to place)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {activePlayer.hand.map((card) => {
              const def = getCardDefinition(card.definitionId);
              const isUnit = def?.type === 'Unit' || def?.type === 'Companion';
              return (
                <div
                  key={card.instanceId}
                  draggable={true}
                  onDragStart={() => setDraggedCardId(card.instanceId)}
                  onDragEnd={() => setDraggedCardId(null)}
                  style={{
                    padding: '10px',
                    background: '#1e2a3a',
                    border: draggedCardId === card.instanceId ? '1px solid #f0c040' : '1px solid #5a8aaa',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minWidth: '90px',
                    textAlign: 'center',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{def?.name ?? card.instanceId}</div>
                  <div style={{ color: '#aaa', fontSize: '11px' }}>{def?.type ?? '?'}</div>
                  {isUnit && (
                    <div style={{ color: '#ccc', fontSize: '11px' }}>
                      {card.currentHp} HP / {card.currentAttack} ATK
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reveal section */}
      {bothReady && !confirmed && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ color: '#8f8', marginBottom: '12px' }}>Both players have placed all 6 cards.</p>
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#aaa', marginBottom: '4px' }}>Player 1:</div>
              {(p1.openingPlacements ?? []).filter((fc): fc is FaceDownCard => fc !== null).map((fc) => (
                <div key={fc.instanceId} style={{ color: '#ccc', fontSize: '12px' }}>
                  {getCardDefinition(fc.definitionId)?.name ?? fc.definitionId}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#aaa', marginBottom: '4px' }}>Player 2:</div>
              {(p2.openingPlacements ?? []).filter((fc): fc is FaceDownCard => fc !== null).map((fc) => (
                <div key={fc.instanceId} style={{ color: '#ccc', fontSize: '12px' }}>
                  {getCardDefinition(fc.definitionId)?.name ?? fc.definitionId}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setConfirmed(true)}
            style={{
              padding: '12px 32px',
              background: '#2a6a2a',
              color: '#fff',
              border: '2px solid #4aaa4a',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            Confirm and Reveal
          </button>
        </div>
      )}

      {bothReady && confirmed && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ color: '#f0c040', marginBottom: '16px' }}>Are you sure? Boards will be revealed and the game begins.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleReveal}
              style={{
                padding: '12px 32px',
                background: '#2a6a2a',
                color: '#fff',
                border: '2px solid #4aaa4a',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              Yes, Reveal Boards
            </button>
            <button
              onClick={() => setConfirmed(false)}
              style={{
                padding: '12px 32px',
                background: '#3a2a2a',
                color: '#fff',
                border: '2px solid #8a4a4a',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
