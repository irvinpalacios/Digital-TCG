/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';

type HUDProps = {
  player: PlayerState;
  isActive: boolean;
};

export function HUD({ player, isActive }: HUDProps) {
  const companionName =
    getCardDefinition(player.companion.definitionId)?.name ?? player.companion.instanceId;

  const style: React.CSSProperties = {
    border: isActive ? '2px solid gold' : '2px solid #aaa',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '8px 12px',
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    fontSize: 13,
    background: '#f9f9f9',
  };

  return (
    <div style={style}>
      <span>{player.playerId}</span>
      <span>Energy: {player.energy}/{player.energyMax}</span>
      <span>Actions: {player.actionsRemaining}</span>
      <span>Deck: {player.deck.length}</span>
      <span>{companionName} — HP: {player.companion.currentHp} | Charge: {player.companion.charge}</span>
    </div>
  );
}
