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
};

export function BoardSlot({ slot, isLegalTarget, isSelected, onClick, isCompanion = false, isJustEvolved = false }: BoardSlotProps) {
  const companion = isCompanion && slot.occupant !== null && 'evolutionStage' in slot.occupant
    ? (slot.occupant as CompanionInstance)
    : null;
  const isUnevolved = companion !== null && companion.evolutionStage === 1;
  const isEvolved = companion !== null && companion.evolutionStage === 2;

  const companionBorder = isUnevolved ? '2px solid #40c0c0' : isEvolved ? '2px solid #f0c040' : '2px solid #aaa';
  const companionBg = isUnevolved ? 'rgba(64, 192, 192, 0.08)' : isEvolved ? 'rgba(240, 192, 64, 0.08)' : '#fff';

  const style: React.CSSProperties = {
    width: 80,
    height: 100,
    border: isLegalTarget ? '2px solid green' : companionBorder,
    background: isSelected ? 'yellow' : companionBg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: 12,
    position: 'relative',
    animation: isJustEvolved ? 'companion-pulse 0.8s ease-in-out' : undefined,
  };

  const name = slot.occupant
    ? (getCardDefinition(slot.occupant.definitionId)?.name ?? slot.occupant.instanceId)
    : null;

  return (
    <>
      {isJustEvolved && (
        <style>{`@keyframes companion-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06);filter:brightness(1.6);box-shadow:0 0 18px #f0c040} }`}</style>
      )}
    <div style={style} onClick={onClick}>
      {slot.occupant ? (
        <>
          <div>{name}</div>
          <div>HP: {slot.occupant.currentHp}</div>
          <div>ATK: {slot.occupant.currentAttack}</div>
          <div>{slot.occupant.keywords.some((k) => k.keyword === 'Ranged') ? 'Ranged' : 'Melee'}</div>
          {(isUnevolved || isEvolved) && (
            <div style={{
              position: 'absolute',
              bottom: 3,
              fontSize: 9,
              color: isEvolved ? '#f0c040' : '#40c0c0',
              letterSpacing: '0.06em',
              fontVariant: 'small-caps',
            }}>
              {isEvolved ? 'Evolved ★' : 'Companion'}
            </div>
          )}
        </>
      ) : (
        <div>Empty</div>
      )}
    </div>
    </>
  );
}
