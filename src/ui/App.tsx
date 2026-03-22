import React from 'react';
import { GameStateProvider, useGameState } from '../state/store';
import { OpeningScreen } from './OpeningScreen';
import { GameScreen } from './GameScreen';

function GameRouter() {
  const { state } = useGameState();

  if (state.phase === 'opening') {
    return <OpeningScreen />;
  }

  if (state.winner !== null || state.phase === 'ended') {
    return (
      <div style={{ fontFamily: 'monospace', padding: '40px', textAlign: 'center', background: '#111', color: '#eee', minHeight: '100vh' }}>
        <h1>Game Over</h1>
        <p style={{ fontSize: '20px', marginTop: '16px' }}>{state.winner} wins!</p>
      </div>
    );
  }

  return <GameScreen />;
}

export default function App() {
  return (
    <GameStateProvider>
      <GameRouter />
    </GameStateProvider>
  );
}
