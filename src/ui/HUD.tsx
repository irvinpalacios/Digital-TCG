/// <reference path="../state/types.ts" />
import React from 'react';
import { getCompanionDisplayName } from '../utils/logHelpers';
import { GAME_CONSTANTS } from '../../config/gameConstants';

type HUDProps = {
  player: PlayerState;
  isActive: boolean;
};

export function HUD({ player, isActive }: HUDProps) {
  const companionName = getCompanionDisplayName(player.companion);

  const threshold = player.companion.evolutionChargeThreshold;
  const chargeCount = Math.min(player.companion.charge, threshold);

  const borderStyle = isActive
    ? { borderBottom: '2px solid rgba(34, 211, 238, 0.5)' }
    : { borderTop: '2px solid rgba(251, 113, 133, 0.4)' };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 14px',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(4px)',
      fontFamily: 'monospace',
      ...borderStyle,
    }}>
      {/* LEFT — Energy + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Energy */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 14, color: '#22d3ee' }}>⚡</span>
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#22d3ee', lineHeight: 1 }}>
            {player.energy}<span style={{ fontSize: 13, color: 'rgba(34,211,238,0.6)' }}>/{player.energyMax}</span>
          </span>
        </div>
        {/* Action pips */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {Array.from({ length: GAME_CONSTANTS.ACTIONS_PER_TURN }, (_, i) => {
            const filled = i < player.actionsRemaining;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 8,
                  borderRadius: 3,
                  background: filled ? '#10b981' : '#1e293b',
                  boxShadow: filled ? '0 0 6px rgba(16,185,129,0.7)' : 'none',
                  transition: 'background 200ms',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* RIGHT — Companion tracker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Companion name + charge pips */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 'bold', color: '#f59e0b', letterSpacing: '0.04em' }}>
            {companionName}
          </span>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {Array.from({ length: threshold }, (_, i) => {
              const filled = i < chargeCount;
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 6,
                    borderRadius: 2,
                    background: filled ? '#f59e0b' : '#1e293b',
                    boxShadow: filled ? '0 0 5px rgba(245,158,11,0.7)' : 'none',
                    transition: 'background 200ms',
                  }}
                />
              );
            })}
          </div>
        </div>
        {/* Vertical divider */}
        <div style={{ width: 1, height: 36, background: 'rgba(71,85,105,0.5)' }} />
        {/* HP */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: 13, color: '#fb7185' }}>♥</span>
          <span style={{ fontSize: 22, fontWeight: 'bold', color: '#fb7185', lineHeight: 1 }}>
            {player.companion.currentHp}
          </span>
        </div>
      </div>
    </div>
  );
}
