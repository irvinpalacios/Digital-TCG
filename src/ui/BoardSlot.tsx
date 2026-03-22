/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';

type BoardSlotProps = {
  slot: Slot;
  isLegalTarget: boolean;
  isSelected: boolean;
  onClick: () => void;
  isCompanion?: boolean;
  isJustEvolved?: boolean;
  isEnemy?: boolean;
  row: Row;
  frontSlotEmpty?: boolean;
};

export function BoardSlot({
  slot,
  isLegalTarget,
  isSelected,
  onClick,
  isCompanion = false,
  isJustEvolved = false,
  isEnemy = false,
  row,
  frontSlotEmpty = false,
}: BoardSlotProps) {
  const companion =
    isCompanion && slot.occupant !== null && 'evolutionStage' in slot.occupant
      ? (slot.occupant as CompanionInstance)
      : null;
  const isEvolved = companion !== null && companion.evolutionStage === 2;

  const name = slot.occupant
    ? (getCardDefinition(slot.occupant.definitionId)?.name ?? slot.occupant.instanceId)
    : null;

  const isRanged = slot.occupant?.keywords.some((k) => k.keyword === 'Ranged') ?? false;

  const getUnitGradient = () => {
    if (isCompanion) {
      return 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(120,53,15,0.2) 100%)';
    }
    if (isEnemy) {
      return 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(127,29,29,0.2) 100%)';
    }
    return 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(22,78,99,0.2) 100%)';
  };

  const companionBorder = isCompanion ? '1px solid rgba(245,158,11,0.5)' : undefined;
  const showExposed = row === 'back' && slot.occupant !== null && frontSlotEmpty;

  const outerBorder = isLegalTarget
    ? '1px solid rgba(34,197,94,0.6)'
    : '1px solid rgba(51,65,85,0.3)';
  const outerShadow = isLegalTarget ? '0 0 0 2px rgba(34,197,94,0.3)' : 'none';

  return (
    <div style={{ position: 'relative' }}>
      {isJustEvolved && (
        <style>{`@keyframes companion-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06);filter:brightness(1.6);box-shadow:0 0 18px rgba(245,158,11,0.8)} }`}</style>
      )}
      {showExposed && (
        <div style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(244,63,94,0.2)',
          color: '#f43f5e',
          fontSize: 9,
          fontFamily: 'monospace',
          padding: '1px 5px',
          borderRadius: 3,
          border: '1px solid rgba(244,63,94,0.4)',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          zIndex: 2,
        }}>
          EXPOSED
        </div>
      )}
      <div
        onClick={onClick}
        style={{
          width: 160,
          height: 96,
          borderRadius: 8,
          border: outerBorder,
          boxShadow: outerShadow,
          background: slot.occupant
            ? 'rgba(15,23,42,0.4)'
            : 'rgba(15,23,42,0.4)',
          backgroundImage: slot.occupant
            ? undefined
            : 'radial-gradient(circle, rgba(71,85,105,0.3) 1px, transparent 1px)',
          backgroundSize: slot.occupant ? undefined : '12px 12px',
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
          animation: isJustEvolved ? 'companion-pulse 0.8s ease-in-out' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {/* Selected overlay */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(34,211,238,0.12)',
            borderRadius: 8,
            pointerEvents: 'none',
            zIndex: 1,
          }} />
        )}

        {slot.occupant ? (
          <div style={{
            position: 'absolute',
            inset: 4,
            borderRadius: 5,
            background: getUnitGradient(),
            border: companionBorder,
            display: 'flex',
            flexDirection: 'column',
            padding: '4px 6px',
            boxSizing: 'border-box',
          }}>
            {/* Top row: name + type icon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#e2e8f0',
                lineHeight: 1.2,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {name}
              </span>
              <span style={{ fontSize: 11, marginLeft: 2, flexShrink: 0, lineHeight: 1 }}>
                {isCompanion ? '⬡' : isRanged ? '◎' : ''}
              </span>
            </div>
            <div style={{ flex: 1 }} />
            {/* Bottom row: HP + ATK */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>
                🛡{slot.occupant.currentHp}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>
                ⚡{slot.occupant.currentAttack}
              </span>
            </div>
            {isEvolved && (
              <div style={{
                position: 'absolute',
                bottom: 2,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 8,
                color: '#f59e0b',
                letterSpacing: '0.06em',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
              }}>
                ★ EVOLVED
              </div>
            )}
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 10,
              color: 'rgba(71,85,105,0.5)',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
            }}>
              {row.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
