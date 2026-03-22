/// <reference path="../state/types.ts" />
import React from 'react';
import { useGameState } from '../state/store';
import { getCardDefinition } from '../cards/registry';

export function OpeningScreen() {
  const { state, dispatch } = useGameState();
  const [draggedCardId, setDraggedCardId] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [hoveredSlot, setHoveredSlot] = React.useState<{ row: Row; index: number } | null>(null);
  const [showHandoff, setShowHandoff] = React.useState(false);
  const [handoffCount, setHandoffCount] = React.useState(0);
  const prevActivePlacer = React.useRef<string>('player-1');

  const p1 = state.players.find((p) => p.playerId === 'player-1')!;
  const p2 = state.players.find((p) => p.playerId === 'player-2')!;

  const p1Placed = (p1.openingPlacements ?? []).filter((fc) => fc !== null).length;
  const p2Placed = (p2.openingPlacements ?? []).filter((fc) => fc !== null).length;

  const activePlacer = p1Placed < 6 ? 'player-1' : 'player-2';
  const activePlayer = state.players.find((p) => p.playerId === activePlacer)!;
  const activePlaced = activePlacer === 'player-1' ? p1Placed : p2Placed;
  const bothReady = p1Placed === 6 && p2Placed === 6;

  // Detect transition from player-1 to player-2 and show handoff overlay
  React.useEffect(() => {
    if (prevActivePlacer.current === 'player-1' && activePlacer === 'player-2') {
      setShowHandoff(true);
      setHandoffCount(0);
      const t1 = setTimeout(() => setHandoffCount(1), 625);
      const t2 = setTimeout(() => setHandoffCount(2), 1250);
      const t3 = setTimeout(() => setHandoffCount(3), 1875);
      const dismiss = setTimeout(() => setShowHandoff(false), 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(dismiss); };
    }
    prevActivePlacer.current = activePlacer;
  }, [activePlacer]);

  function handleReveal() {
    dispatch({ type: 'REVEAL_BOARDS' });
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', background: '#111', color: '#eee', minHeight: '100vh' }}>

      {/* Handoff overlay */}
      {showHandoff && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.96)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          fontFamily: 'monospace',
          color: '#eee',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Player 1 is done placing.</div>
          <div style={{ fontSize: '16px', color: '#aaa', marginBottom: '8px' }}>Pass the screen to Player 2.</div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '28px' }}>Player 2's hand will appear shortly.</div>
          <div style={{ color: '#f0c040', fontSize: '28px', letterSpacing: '10px' }}>
            {'●'.repeat(handoffCount)}{'○'.repeat(3 - handoffCount)}
          </div>
        </div>
      )}

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
            <div key={row} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ width: 'auto', minWidth: '180px', color: '#666', lineHeight: '56px', textAlign: 'right', marginRight: '8px', whiteSpace: 'nowrap', fontSize: '11px' }}>
                {row === 'front' ? 'FRONT — Attacks & Protects' : 'BACK — Protected / Ranged Only'}
              </span>
              {([0, 1, 2] as const).map((idx) => {
                const slotNum = row === 'front' ? idx : idx + 3;
                const placements = activePlayer.openingPlacements ?? [];
                const filled = placements[slotNum] != null;
                const isHovered = hoveredSlot?.row === row && hoveredSlot?.index === idx;
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#222',
                        color: '#eee',
                        fontSize: '10px',
                        padding: '5px 8px',
                        borderRadius: '3px',
                        border: '1px solid #444',
                        whiteSpace: 'normal',
                        maxWidth: '200px',
                        textAlign: 'center',
                        zIndex: 10,
                        marginBottom: '4px',
                        pointerEvents: 'none',
                        lineHeight: '1.4',
                      }}>
                        {row === 'front'
                          ? 'Front row — can attack. Protects the back slot in this lane.'
                          : 'Back row — safe from melee. Only Ranged units can attack from here.'}
                      </div>
                    )}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedCardId) {
                          dispatch({ type: 'PLACE_CARD_FACE_DOWN', cardInstanceId: draggedCardId, playerId: activePlacer, targetSlot: { row, index: idx } });
                          setDraggedCardId(null);
                        }
                      }}
                      onMouseEnter={() => setHoveredSlot({ row, index: idx })}
                      onMouseLeave={() => setHoveredSlot(null)}
                      style={{
                        width: '80px',
                        height: '56px',
                        background: filled ? '#2a4a2a' : row === 'front' ? '#1e1a18' : '#141820',
                        border: draggedCardId && !filled ? '1px dashed #f0c040' : filled ? '1px solid #4a8a4a' : '1px solid #444',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: filled ? '#8f8' : '#555',
                        fontSize: '12px',
                        cursor: 'default',
                      }}
                    >
                      {filled ? 'FACE DOWN' : 'empty'}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Active player's hand — hidden while handoff overlay is showing */}
      {!bothReady && !showHandoff && activePlayer.hand.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ textAlign: 'center', color: '#888', marginBottom: '8px' }}>
            {activePlacer === 'player-1' ? 'Player 1' : 'Player 2'} — Hand (drag to place)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {activePlayer.hand.map((card) => {
              const def = getCardDefinition(card.definitionId);
              const isCompanion = def?.type === 'Companion';
              const isUnit = def?.type === 'Unit' || isCompanion;
              return (
                <div
                  key={card.instanceId}
                  draggable={true}
                  onDragStart={() => setDraggedCardId(card.instanceId)}
                  onDragEnd={() => setDraggedCardId(null)}
                  style={{
                    padding: '10px',
                    background: isCompanion ? '#1f1c0e' : '#1e2a3a',
                    border: draggedCardId === card.instanceId
                      ? (isCompanion ? '2px solid #f0c040' : '1px solid #f0c040')
                      : (isCompanion ? '1px solid #c8a000' : '1px solid #5a8aaa'),
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minWidth: '90px',
                    textAlign: 'center',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{def?.name ?? card.instanceId}</div>
                  {isCompanion && (
                    <div style={{ color: '#f0c040', fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '3px' }}>
                      WIN CONDITION
                    </div>
                  )}
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

            {/* Player 1 grid preview */}
            <div>
              <div style={{ color: '#aaa', marginBottom: '6px', textAlign: 'center', fontSize: '12px' }}>Player 1</div>
              {(['front', 'back'] as const).map((row) => (
                <div key={row} style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ width: '36px', fontSize: '9px', color: '#666', textAlign: 'right', marginRight: '4px' }}>
                    {row === 'front' ? 'FRONT' : 'BACK'}
                  </span>
                  {([0, 1, 2] as const).map((i) => {
                    const slotNum = row === 'front' ? i : i + 3;
                    const fc = (p1.openingPlacements ?? [])[slotNum];
                    const name = fc ? (getCardDefinition(fc.definitionId)?.name ?? fc.definitionId) : '—';
                    return (
                      <div key={i} style={{
                        width: '70px',
                        height: '36px',
                        background: fc ? '#1a2a1a' : '#181818',
                        border: fc ? '1px solid #3a6a3a' : '1px solid #2a2a2a',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        color: fc ? '#8f8' : '#444',
                        textAlign: 'center',
                        padding: '2px',
                      }}>
                        {name}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Player 2 grid preview */}
            <div>
              <div style={{ color: '#aaa', marginBottom: '6px', textAlign: 'center', fontSize: '12px' }}>Player 2</div>
              {(['front', 'back'] as const).map((row) => (
                <div key={row} style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ width: '36px', fontSize: '9px', color: '#666', textAlign: 'right', marginRight: '4px' }}>
                    {row === 'front' ? 'FRONT' : 'BACK'}
                  </span>
                  {([0, 1, 2] as const).map((i) => {
                    const slotNum = row === 'front' ? i : i + 3;
                    const fc = (p2.openingPlacements ?? [])[slotNum];
                    const name = fc ? (getCardDefinition(fc.definitionId)?.name ?? fc.definitionId) : '—';
                    return (
                      <div key={i} style={{
                        width: '70px',
                        height: '36px',
                        background: fc ? '#1a2a1a' : '#181818',
                        border: fc ? '1px solid #3a6a3a' : '1px solid #2a2a2a',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        color: fc ? '#8f8' : '#444',
                        textAlign: 'center',
                        padding: '2px',
                      }}>
                        {name}
                      </div>
                    );
                  })}
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
