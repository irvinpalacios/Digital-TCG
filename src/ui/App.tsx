import React from 'react';
import { GameStateProvider, useGameState } from '../state/store';
import { DeckSelectScreen } from './DeckSelectScreen';
import { OpeningScreen } from './OpeningScreen';
import { GameScreen } from './GameScreen';
import { EndScreen } from './EndScreen';

function GameRouter({ onReset }: { onReset: () => void }) {
  const { state } = useGameState();

  if (state.phase === 'opening') {
    return <OpeningScreen />;
  }

  if (state.winner !== null || state.phase === 'ended') {
    return <EndScreen state={state} onReset={onReset} />;
  }

  return <GameScreen />;
}

export default function App() {
  const [deckSelections, setDeckSelections] = React.useState<{ p1: string; p2: string } | null>(null);

  if (deckSelections === null) {
    return (
      <DeckSelectScreen
        onStart={(p1, p2) => setDeckSelections({ p1, p2 })}
      />
    );
  }

  return (
    <GameStateProvider p1DeckId={deckSelections.p1} p2DeckId={deckSelections.p2}>
      <GameRouter onReset={() => setDeckSelections(null)} />
    </GameStateProvider>
  );
}
