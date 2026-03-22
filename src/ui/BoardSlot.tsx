/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';

type BoardSlotProps = {
  slot: Slot;
  isLegalTarget: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export function BoardSlot({ slot, isLegalTarget, isSelected, onClick }: BoardSlotProps) {
  const style: React.CSSProperties = {
    width: 80,
    height: 100,
    border: isLegalTarget ? '2px solid green' : '2px solid #aaa',
    background: isSelected ? 'yellow' : '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: 12,
  };

  const name = slot.occupant
    ? (getCardDefinition(slot.occupant.definitionId)?.name ?? slot.occupant.instanceId)
    : null;

  return (
    <div style={style} onClick={onClick}>
      {slot.occupant ? (
        <>
          <div>{name}</div>
          <div>HP: {slot.occupant.currentHp}</div>
          <div>ATK: {slot.occupant.currentAttack}</div>
        </>
      ) : (
        <div>Empty</div>
      )}
    </div>
  );
}
