import React from 'react';
import { GameStateProvider } from '../state/store';
import { GameScreen } from './GameScreen';

export default function App() {
  return (
    <GameStateProvider>
      <GameScreen />
    </GameStateProvider>
  );
}
