/// <reference path="../state/types.ts" />
import React from 'react';
import { useGameState } from '../state/store';
import { getCardDefinition } from '../cards/registry';

const CARD_TEXT: Record<string, string> = {};

const TYPE_COLORS: Record<string, string> = {
  Unit: '#22d3ee',
  Companion: '#f59e0b',
  Spell: '#c084fc',
  Upgrade: '#10b981',
};

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
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#020817',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'monospace',
      color: '#e2e8f0',
    }}>
      {/* Ambient glow — rose/red top */}
      <div style={{
        position: 'absolute', top: '-15%', left: '10%',
        width: '80%', height: '50%', borderRadius: '50%',
        background: 'rgba(190, 18, 60, 0.12)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      {/* Ambient glow — cyan bottom */}
      <div style={{
        position: 'absolute', bottom: '-15%', left: '10%',
        width: '80%', height: '50%', borderRadius: '50%',
        background: 'rgba(6, 182, 212, 0.10)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Handoff overlay */}
      {showHandoff && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(2, 8, 23, 0.97)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, fontFamily: 'monospace',
        }}>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 10, letterSpacing: '0.05em' }}>
            PLAYER 1 PLACEMENT COMPLETE
          </div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 6, letterSpacing: '0.04em' }}>
            Pass the screen to Player 2.
          </div>
          <div style={{ fontSize: 12, color: '#334155', marginBottom: 28 }}>
            Player 2's hand will appear shortly.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'inline-block', width: 10, height: 10, borderRadius: 2,
                background: i < handoffCount ? '#f59e0b' : '#1e293b',
                boxShadow: i < handoffCount ? '0 0 6px rgba(245,158,11,0.7)' : 'none',
                transition: 'background 200ms',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Centered content */}
      <div style={{
        maxWidth: 896, width: '100%', margin: '0 auto',
        padding: '20px 16px 32px', position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
            TACTICAL TCG
          </div>
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 'bold', letterSpacing: '0.08em',
            color: '#f1f5f9', textTransform: 'uppercase',
          }}>
            Opening Phase
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#475569', letterSpacing: '0.04em' }}>
            Place all 6 cards face-down. Boards reveal simultaneously.
          </p>
        </div>

        {/* Player status row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          {[{ id: 'player-1', placed: p1Placed }, { id: 'player-2', placed: p2Placed }].map(({ id, placed }) => {
            const done = placed === 6;
            const active = activePlacer === id && !bothReady;
            return (
              <div key={id} style={{
                padding: '8px 20px',
                background: done ? 'rgba(5,150,105,0.12)' : active ? 'rgba(34,211,238,0.08)' : 'rgba(15,23,42,0.6)',
                border: done ? '1px solid rgba(5,150,105,0.4)' : active ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(51,65,85,0.4)',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 12, color: done ? '#10b981' : active ? '#22d3ee' : '#475569', fontWeight: 'bold' }}>
                  {id === 'player-1' ? 'PLAYER 1' : 'PLAYER 2'}
                </span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <span key={i} style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                      background: i < placed ? (done ? '#10b981' : '#22d3ee') : '#1e293b',
                      boxShadow: i < placed ? `0 0 5px ${done ? 'rgba(16,185,129,0.6)' : 'rgba(34,211,238,0.5)'}` : 'none',
                    }} />
                  ))}
                </div>
                {done && <span style={{ fontSize: 10, color: '#10b981' }}>✓ READY</span>}
              </div>
            );
          })}
        </div>

        {/* Active placer prompt */}
        {!bothReady && (
          <div style={{
            marginBottom: 20, padding: '8px 20px',
            background: 'rgba(34,211,238,0.06)',
            border: '1px solid rgba(34,211,238,0.2)',
            borderRadius: 6, textAlign: 'center',
          }}>
            <span style={{ fontSize: 13, color: '#22d3ee', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              {activePlacer === 'player-1' ? 'PLAYER 1' : 'PLAYER 2'}
            </span>
            <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
              — place {6 - activePlaced} more card{6 - activePlaced !== 1 ? 's' : ''} face-down
            </span>
          </div>
        )}

        {/* Placement grid */}
        {!bothReady && (
          <div style={{ marginBottom: 28, width: '100%' }}>
            <div style={{ fontSize: 10, color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
              {activePlacer === 'player-1' ? 'Player 1' : 'Player 2'} — Deployment Grid
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {(['front', 'back'] as const).map((row) => (
                <div key={row}>
                  <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 4 }}>
                    {row === 'front' ? 'FRONT ROW — Attacks & Protects' : 'BACK ROW — Safe / Ranged Only'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 160px)', gap: 12 }}>
                    {([0, 1, 2] as const).map((idx) => {
                      const slotNum = row === 'front' ? idx : idx + 3;
                      const placements = activePlayer.openingPlacements ?? [];
                      const filled = placements[slotNum] != null;
                      const isHovered = hoveredSlot?.row === row && hoveredSlot?.index === idx;
                      const isDragTarget = !!draggedCardId && !filled;
                      return (
                        <div key={idx} style={{ position: 'relative' }}>
                          {isHovered && !filled && (
                            <div style={{
                              position: 'absolute', bottom: '100%', left: '50%',
                              transform: 'translateX(-50%)',
                              background: 'rgba(15,23,42,0.95)',
                              color: '#94a3b8', fontSize: 10, padding: '5px 8px',
                              borderRadius: 4, border: '1px solid #334155',
                              whiteSpace: 'normal', maxWidth: 180, textAlign: 'center',
                              zIndex: 10, marginBottom: 4, pointerEvents: 'none', lineHeight: 1.4,
                            }}>
                              {row === 'front'
                                ? 'Front — can attack. Shields back lane.'
                                : 'Back — safe from melee. Ranged units only.'}
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
                              width: 160, height: 96,
                              borderRadius: 8,
                              background: filled
                                ? 'rgba(15,23,42,0.6)'
                                : 'rgba(15,23,42,0.4)',
                              backgroundImage: filled
                                ? undefined
                                : 'radial-gradient(circle, rgba(71,85,105,0.3) 1px, transparent 1px)',
                              backgroundSize: filled ? undefined : '12px 12px',
                              border: filled
                                ? '1px solid rgba(34,211,238,0.3)'
                                : isDragTarget
                                  ? '1px dashed rgba(245,158,11,0.6)'
                                  : '1px solid rgba(51,65,85,0.3)',
                              boxShadow: isDragTarget ? '0 0 10px rgba(245,158,11,0.15)' : 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'default', boxSizing: 'border-box',
                              transition: 'border-color 150ms, box-shadow 150ms',
                            }}
                          >
                            {filled ? (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                                  FACE DOWN
                                </div>
                                <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                                  {[0, 1, 2].map((i) => (
                                    <span key={i} style={{
                                      display: 'inline-block', width: 16, height: 4, borderRadius: 2,
                                      background: 'rgba(34,211,238,0.25)',
                                    }} />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: 10, color: 'rgba(71,85,105,0.4)', letterSpacing: '0.08em' }}>
                                {row.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hand — hidden during handoff */}
        {!bothReady && !showHandoff && activePlayer.hand.length > 0 && (
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 10, color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
              {activePlacer === 'player-1' ? 'Player 1' : 'Player 2'} — Hand (drag to place)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {activePlayer.hand.map((card) => {
                const def = getCardDefinition(card.definitionId);
                const isCompanion = def?.type === 'Companion';
                const isUnit = def?.type === 'Unit' || isCompanion;
                const isSpellOrUpgrade = def?.type === 'Spell' || def?.type === 'Upgrade';
                const cost = (card as CardInstance & { cost?: number }).cost ?? def?.cost ?? '?';
                const typeColor = def?.type ? (TYPE_COLORS[def.type] ?? '#94a3b8') : '#94a3b8';
                const cardText = isSpellOrUpgrade ? (CARD_TEXT[card.definitionId] ?? null) : null;
                const isDragging = draggedCardId === card.instanceId;

                return (
                  <div
                    key={card.instanceId}
                    draggable
                    onDragStart={() => setDraggedCardId(card.instanceId)}
                    onDragEnd={() => setDraggedCardId(null)}
                    style={{
                      width: 128, height: 176,
                      borderRadius: 12,
                      background: '#0f172a',
                      border: isDragging
                        ? `2px solid ${isCompanion ? '#f59e0b' : '#22d3ee'}`
                        : '2px solid #334155',
                      boxShadow: isDragging
                        ? `0 0 16px ${isCompanion ? 'rgba(245,158,11,0.4)' : 'rgba(34,211,238,0.4)'}` : 'none',
                      cursor: 'grab',
                      userSelect: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      opacity: isDragging ? 0.6 : 1,
                      transform: isDragging ? 'rotate(3deg) scale(1.05)' : 'none',
                      transition: 'border-color 150ms, box-shadow 150ms, opacity 150ms',
                      display: 'flex', flexDirection: 'column',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Cost badge */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0,
                      background: '#0c2a3a',
                      borderRight: '1px solid rgba(34,211,238,0.4)',
                      borderBottom: '1px solid rgba(34,211,238,0.4)',
                      borderBottomRightRadius: 8,
                      padding: '3px 7px 3px 5px',
                      zIndex: 2, display: 'flex', alignItems: 'baseline', gap: 2,
                    }}>
                      <span style={{ fontSize: 10, color: '#22d3ee' }}>⚡</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold', color: '#22d3ee' }}>{cost}</span>
                    </div>

                    {/* Art area */}
                    <div style={{
                      height: 88, background: '#1e293b',
                      borderBottom: '1px solid #334155',
                      backgroundImage: 'radial-gradient(circle, rgba(71,85,105,0.4) 1px, transparent 1px)',
                      backgroundSize: '10px 10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isCompanion ? (
                        <span style={{ fontSize: 28, opacity: 0.4, color: '#f59e0b' }}>⬡</span>
                      ) : (
                        <span style={{ fontSize: 28, opacity: 0.25, color: '#94a3b8' }}>
                          {isUnit ? '↗' : '↑'}
                        </span>
                      )}
                    </div>

                    {/* Info section */}
                    <div style={{ flex: 1, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, fontWeight: 'bold', color: '#f1f5f9', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {def?.name ?? card.instanceId}
                      </div>
                      <div style={{ fontSize: 10, color: typeColor, fontWeight: 600, letterSpacing: '0.04em' }}>
                        {def?.type ?? '?'}
                      </div>
                      {isCompanion && (
                        <div style={{ fontSize: 9, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          WIN CONDITION
                        </div>
                      )}
                      {isUnit && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>🛡{card.currentHp}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>⚡{card.currentAttack}</span>
                        </div>
                      )}
                      {cardText && (
                        <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1.4, marginTop: 2, overflow: 'hidden' }}>
                          {cardText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reveal section — step 1: confirm */}
        {bothReady && !confirmed && (
          <div style={{ textAlign: 'center', marginTop: 16, width: '100%' }}>
            <div style={{ fontSize: 13, color: '#10b981', marginBottom: 20, letterSpacing: '0.04em' }}>
              ✓ Both players have placed all 6 cards
            </div>
            {/* Preview grids */}
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 24 }}>
              {[{ label: 'PLAYER 1', placements: p1.openingPlacements ?? [] }, { label: 'PLAYER 2', placements: p2.openingPlacements ?? [] }].map(({ label, placements }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 8 }}>{label}</div>
                  {(['front', 'back'] as const).map((row) => (
                    <div key={row} style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ width: 32, fontSize: 8, color: '#334155', textAlign: 'right', marginRight: 4, letterSpacing: '0.06em' }}>
                        {row.toUpperCase()}
                      </span>
                      {([0, 1, 2] as const).map((i) => {
                        const slotNum = row === 'front' ? i : i + 3;
                        const fc = placements[slotNum];
                        const name = fc ? (getCardDefinition(fc.definitionId)?.name ?? fc.definitionId) : null;
                        return (
                          <div key={i} style={{
                            width: 72, height: 40,
                            background: fc ? 'rgba(34,211,238,0.08)' : 'rgba(15,23,42,0.4)',
                            border: fc ? '1px solid rgba(34,211,238,0.25)' : '1px solid rgba(51,65,85,0.3)',
                            borderRadius: 4,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: fc ? '#94a3b8' : '#334155',
                            textAlign: 'center', padding: 2, boxSizing: 'border-box',
                            lineHeight: 1.3,
                          }}>
                            {name ?? '—'}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button
              onClick={() => setConfirmed(true)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#10b981'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#059669'; }}
              style={{
                padding: '12px 36px',
                background: '#059669', color: '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 'bold',
                fontFamily: 'monospace', letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(5,150,105,0.4)',
                transition: 'background 150ms',
              }}
            >
              Confirm and Reveal
            </button>
          </div>
        )}

        {/* Reveal section — step 2: final confirm */}
        {bothReady && confirmed && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 13, color: '#f59e0b', marginBottom: 20, letterSpacing: '0.04em' }}>
              Boards will be revealed and the match begins. Are you ready?
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={handleReveal}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#10b981'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#059669'; }}
                style={{
                  padding: '12px 32px',
                  background: '#059669', color: '#fff',
                  border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 'bold',
                  fontFamily: 'monospace', letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(5,150,105,0.4)',
                  transition: 'background 150ms',
                }}
              >
                Yes, Reveal Boards
              </button>
              <button
                onClick={() => setConfirmed(false)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#3f1a1a'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(127,29,29,0.3)'; }}
                style={{
                  padding: '12px 32px',
                  background: 'rgba(127,29,29,0.3)', color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                  fontSize: 14, fontWeight: 'bold',
                  fontFamily: 'monospace', letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'background 150ms',
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
