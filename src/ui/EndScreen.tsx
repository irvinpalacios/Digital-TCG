/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';
import { getCompanionDisplayName } from '../utils/logHelpers';

type EndScreenProps = {
  state: GameState;
};

const companionDisplayName = getCompanionDisplayName;

function maxHpForCompanion(companion: CompanionInstance): number {
  if (companion.evolutionStage === 2) {
    return getCardDefinition(companion.evolutionDefinitionId)?.hp ?? companion.currentHp;
  }
  return getCardDefinition(companion.definitionId)?.hp ?? companion.currentHp;
}

function HpPips({ current, max }: { current: number; max: number }) {
  const filled = Math.max(0, Math.round((current / Math.max(1, max)) * 10));
  return (
    <span style={{ display: 'inline-flex', gap: 2, marginLeft: 6, verticalAlign: 'middle' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: 2,
            background: i < filled ? '#4caf50' : '#333',
          }}
        />
      ))}
    </span>
  );
}

function pickKeyMoment(log: string[]): string {
  const evolved = log.find((e) => e.toLowerCase().includes('evolved'));
  if (evolved) return evolved;
  const defeated = log.find(
    (e) => e.toLowerCase().includes('defeated') || e.toLowerCase().includes('destroyed'),
  );
  if (defeated) return defeated;
  return log[log.length - 1] ?? '';
}

function PlayerColumn({
  player,
  isWinner,
}: {
  player: PlayerState;
  isWinner: boolean;
}) {
  const name = companionDisplayName(player.companion);
  const maxHp = maxHpForCompanion(player.companion);
  const didEvolve = player.evolutionTurn !== null;

  return (
    <div style={{ flex: 1, padding: '0 20px' }}>
      <div style={{ marginBottom: 10, fontSize: 14 }}>
        <span style={{ color: '#ccc', fontWeight: 'bold' }}>{player.playerId}</span>
        {isWinner && (
          <span style={{ color: '#f0c040', marginLeft: 8, fontSize: 12 }}>★ WINNER</span>
        )}
      </div>
      <div style={{ marginBottom: 6, fontSize: 13, color: '#eee' }}>
        {name}
        {didEvolve && <span style={{ color: '#aaa', fontSize: 11, marginLeft: 6 }}>(evolved)</span>}
      </div>
      <div style={{ marginBottom: 4, fontSize: 12, color: '#aaa' }}>
        Final HP: {player.companion.currentHp}
        <HpPips current={player.companion.currentHp} max={maxHp} />
      </div>
      <div style={{ marginBottom: 4, fontSize: 12, color: didEvolve ? '#eee' : '#666' }}>
        Evolution:{' '}
        {didEvolve ? `Turn ${player.evolutionTurn}` : <span style={{ color: '#555' }}>Did not evolve</span>}
      </div>
      <div style={{ fontSize: 12, color: '#aaa' }}>
        Units lost: {player.unitsLost}
      </div>
    </div>
  );
}

export function EndScreen({ state }: EndScreenProps) {
  const winner = state.players.find((p) => p.playerId === state.winner) ?? state.players[0];
  const loser = state.players.find((p) => p.playerId !== state.winner) ?? state.players[1];

  const winnerName = companionDisplayName(winner.companion);
  const loserName = companionDisplayName(loser.companion);
  const keyMoment = pickKeyMoment(state.eventLog);

  return (
    <div style={{
      background: '#111',
      minHeight: '100vh',
      color: '#eee',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', letterSpacing: '0.1em', color: '#f0c040', marginBottom: 8 }}>
        GAME OVER
      </div>
      <div style={{ fontSize: 15, color: '#ccc', marginBottom: 32 }}>
        <span style={{ color: '#f0c040' }}>{winnerName}</span>
        {' defeated '}
        <span style={{ color: '#aaa' }}>{loserName}</span>
      </div>

      <div style={{ display: 'flex', width: '100%', maxWidth: 480, marginBottom: 24 }}>
        <PlayerColumn player={winner} isWinner={true} />
        <div style={{ width: 1, background: '#333', flexShrink: 0 }} />
        <PlayerColumn player={loser} isWinner={false} />
      </div>

      <div style={{ fontSize: 12, color: '#666', marginBottom: 24 }}>
        Game ended on Turn {state.turnNumber}
      </div>

      <div style={{
        width: '100%',
        maxWidth: 480,
        borderLeft: '3px solid #f0c040',
        paddingLeft: 12,
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4, letterSpacing: '0.06em' }}>
          KEY MOMENT
        </div>
        <div style={{ fontSize: 12, color: '#f0c040', fontStyle: 'italic' }}>
          {keyMoment}
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 32px',
          fontSize: 14,
          fontFamily: 'monospace',
          background: '#f0c040',
          color: '#111',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
        }}
      >
        Play Again
      </button>
    </div>
  );
}
