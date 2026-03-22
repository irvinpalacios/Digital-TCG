/// <reference path="../state/types.ts" />
import React from 'react';
import { BoardSlot } from './BoardSlot';

type BoardProps = {
  board: BoardState;
  legalTargets: SlotPosition[];
  selectedSlot: SlotPosition | null;
  onSlotClick: (position: SlotPosition) => void;
  flipped: boolean;
};

export function Board({ board, legalTargets, selectedSlot, onSlotClick, flipped }: BoardProps) {
  const isLegalTarget = (pos: SlotPosition) =>
    legalTargets.some((t) => t.row === pos.row && t.index === pos.index);

  const isSelected = (pos: SlotPosition) =>
    selectedSlot !== null && selectedSlot.row === pos.row && selectedSlot.index === pos.index;

  const renderRow = (row: Row) => (
    <div style={{ display: 'flex', gap: 8 }}>
      {([0, 1, 2] as SlotIndex[]).map((index) => {
        const pos: SlotPosition = { row, index };
        return (
          <BoardSlot
            key={`${row}-${index}`}
            slot={board[row][index]}
            isLegalTarget={isLegalTarget(pos)}
            isSelected={isSelected(pos)}
            onClick={() => onSlotClick(pos)}
          />
        );
      })}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {flipped ? (
        <>
          {renderRow('back')}
          {renderRow('front')}
        </>
      ) : (
        <>
          {renderRow('front')}
          {renderRow('back')}
        </>
      )}
    </div>
  );
}
