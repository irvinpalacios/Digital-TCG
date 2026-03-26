import React from 'react';
import { remnantDecks, DeckConfig } from '../cards/decks';
import { getCardDefinitionOrThrow } from '../cards/registry';

type Props = {
  onStart: (p1DeckId: string, p2DeckId: string) => void;
};

type PlayerKey = 'p1' | 'p2';

export function DeckSelectScreen({ onStart }: Props) {
  const [selected, setSelected] = React.useState<{ p1: string | null; p2: string | null }>({
    p1: null,
    p2: null,
  });

  function handleSelect(player: PlayerKey, deckId: string) {
    setSelected((prev) => ({ ...prev, [player]: deckId }));
  }

  function handleStart() {
    if (selected.p1 && selected.p2) {
      onStart(selected.p1, selected.p2);
    }
  }

  const canStart = selected.p1 !== null && selected.p2 !== null;

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>REMNANTS</h1>
      <p style={styles.subtitle}>Each player selects a Remnant. You cannot choose the same one.</p>

      <div style={styles.columns}>
        {(['p1', 'p2'] as PlayerKey[]).map((player) => (
          <div key={player} style={styles.column}>
            <div style={styles.playerLabel}>
              {player === 'p1' ? 'PLAYER 1' : 'PLAYER 2'}
            </div>
            {remnantDecks.map((deck) => {
              const companion = getCardDefinitionOrThrow(deck.companionId);
              const isSelected = selected[player] === deck.deckId;
              const isDisabledByOther =
                player === 'p1'
                  ? selected.p2 === deck.deckId
                  : selected.p1 === deck.deckId;

              return (
                <button
                  key={deck.deckId}
                  style={{
                    ...styles.card,
                    ...(isSelected ? styles.cardSelected : {}),
                    ...(isDisabledByOther ? styles.cardDisabled : {}),
                  }}
                  onClick={() => !isDisabledByOther && handleSelect(player, deck.deckId)}
                  disabled={isDisabledByOther}
                >
                  <div style={styles.cardName}>{deck.name}</div>
                  <div style={styles.cardTimeline}>{deck.timeline}</div>
                  <div style={styles.cardRole}>{deck.role}</div>
                  <div style={styles.cardStats}>
                    <span>HP {companion.hp}</span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    <span>ATK {companion.attack}</span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    <span>Recall @ {companion.evolutionChargeThreshold} ⚡</span>
                  </div>
                  {isSelected && <div style={styles.selectedBadge}>✓ Selected</div>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button
        style={{ ...styles.startButton, ...(canStart ? {} : styles.startButtonDisabled) }}
        onClick={handleStart}
        disabled={!canStart}
      >
        Start Game
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: '#0d0d12',
    color: '#e8e0d0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: 'monospace',
  },
  title: {
    fontSize: '2.4rem',
    letterSpacing: '0.3em',
    color: '#c8b890',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#888',
    margin: '0 0 40px',
  },
  columns: {
    display: 'flex',
    gap: '60px',
    width: '100%',
    maxWidth: '860px',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  playerLabel: {
    fontSize: '0.75rem',
    letterSpacing: '0.2em',
    color: '#666',
    marginBottom: '4px',
  },
  card: {
    background: '#1a1a24',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '14px 16px',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#e8e0d0',
    transition: 'border-color 0.15s, background 0.15s',
  },
  cardSelected: {
    background: '#1e1e2e',
    border: '1px solid #c8b890',
    boxShadow: '0 0 8px rgba(200, 184, 144, 0.2)',
  },
  cardDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  cardName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#e8e0d0',
    marginBottom: '2px',
  },
  cardTimeline: {
    fontSize: '0.72rem',
    color: '#c8b890',
    letterSpacing: '0.1em',
    marginBottom: '6px',
  },
  cardRole: {
    fontSize: '0.78rem',
    color: '#999',
    marginBottom: '8px',
  },
  cardStats: {
    fontSize: '0.78rem',
    color: '#bbb',
    display: 'flex',
    alignItems: 'center',
  },
  selectedBadge: {
    marginTop: '8px',
    fontSize: '0.72rem',
    color: '#c8b890',
    letterSpacing: '0.1em',
  },
  startButton: {
    marginTop: '48px',
    padding: '12px 48px',
    fontSize: '0.9rem',
    letterSpacing: '0.2em',
    background: '#c8b890',
    color: '#0d0d12',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  startButtonDisabled: {
    background: '#333',
    color: '#666',
    cursor: 'not-allowed',
  },
};
