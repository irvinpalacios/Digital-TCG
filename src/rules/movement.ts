/// <reference path="../state/types.ts" />

export function getAdjacentSlots(position: SlotPosition): SlotPosition[] {
  const { row, index } = position;
  const adjacent: SlotPosition[] = [];

  // Same row, index - 1
  if (index - 1 >= 0) {
    adjacent.push({ row, index: (index - 1) as SlotIndex });
  }

  // Same row, index + 1
  if (index + 1 <= 2) {
    adjacent.push({ row, index: (index + 1) as SlotIndex });
  }

  // Opposite row, same index
  const oppositeRow: Row = row === 'front' ? 'back' : 'front';
  adjacent.push({ row: oppositeRow, index });

  return adjacent;
}

export function getLegalMoves(position: SlotPosition, board: BoardState): SlotPosition[] {
  const occupant = board[position.row][position.index].occupant;
  if (occupant === null || occupant.hasMovedThisTurn) return [];
  return getAdjacentSlots(position).filter((pos) => {
    const slot = board[pos.row][pos.index];
    return slot.occupant === null;
  });
}
