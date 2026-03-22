/// <reference path="../state/types.ts" />

export function isLaneClear(laneIndex: SlotIndex, enemyBoard: BoardState): boolean {
  return enemyBoard.front[laneIndex].occupant === null;
}

// Determines whether a unit at the given position is eligible to attack at all.
// Lane restriction logic (which lanes/slots are valid targets) lives in getLegalTargets.
export function canAttackFromPosition(position: SlotPosition, board: BoardState): boolean {
  if (position.row === 'front') return true;

  const occupant = board.back[position.index].occupant;
  if (occupant === null) return false;

  return occupant.keywords.some((k) => k.keyword === 'Ranged');
}

export function getLegalTargets(
  attackerPosition: SlotPosition,
  attackerBoard: BoardState,
  enemyBoard: BoardState,
): SlotPosition[] {
  if (!canAttackFromPosition(attackerPosition, attackerBoard)) return [];

  const attackerRow = attackerPosition.row;
  const attackerIndex = attackerPosition.index;
  const attackerOccupant = attackerBoard[attackerRow][attackerIndex].occupant;
  if (attackerOccupant === null) return [];

  const isRanged = attackerOccupant.keywords.some((k) => k.keyword === 'Ranged');

  const targets: SlotPosition[] = [];

  function addLaneTargets(laneIndex: SlotIndex) {
    if (isLaneClear(laneIndex, enemyBoard)) {
      if (enemyBoard.back[laneIndex].occupant !== null) {
        targets.push({ row: 'back', index: laneIndex });
      }
    } else {
      targets.push({ row: 'front', index: laneIndex });
    }
  }

  if (!isRanged) {
    // Melee: same lane only
    addLaneTargets(attackerIndex);
  } else {
    // Ranged: same lane + adjacent lanes
    const indices: SlotIndex[] = [attackerIndex];
    if (attackerIndex - 1 >= 0) indices.push((attackerIndex - 1) as SlotIndex);
    if (attackerIndex + 1 <= 2) indices.push((attackerIndex + 1) as SlotIndex);
    for (const idx of indices) {
      addLaneTargets(idx);
    }
  }

  return targets;
}
