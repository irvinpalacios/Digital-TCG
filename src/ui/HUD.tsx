/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';
import { GAME_CONSTANTS } from '../../config/gameConstants';

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
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {Array.from({ length: GAME_CONSTANTS.ACTIONS_PER_TURN }, (_, i) => {
          const filled = i < player.actionsRemaining;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: filled ? (isActive ? '#f0c040' : '#aaa') : '#444',
              }}
            />
          );
        })}
      </span>
      <span>Deck: {player.deck.length}</span>
      <span>{companionName} — HP: {player.companion.currentHp} | Charge: {player.companion.charge}</span>
    </div>
  );
}
