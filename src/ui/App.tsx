import React from 'react';
import { GameStateProvider, useGameState } from '../state/store';
import { OpeningScreen } from './OpeningScreen';
import { GameScreen } from './GameScreen';
import { EndScreen } from './EndScreen';

function GameRouter() {
  const { state } = useGameState();

  if (state.phase === 'opening') {
    return <OpeningScreen />;
  }

  if (state.winner !== null || state.phase === 'ended') {
    return <EndScreen state={state} />;
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
