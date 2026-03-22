/// <reference path="../state/types.ts" />

export function isLaneClear(laneIndex: SlotIndex, enemyBoard: BoardState): boolean {
  return enemyBoard.front[laneIndex].occupant === null;
}

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

  const targets: SlotPosition[] = [];

  for (let i = 0; i <= 2; i++) {
    const laneIndex = i as SlotIndex;

    if (enemyBoard.front[laneIndex].occupant !== null) {
      targets.push({ row: 'front', index: laneIndex });
    }

    if (isLaneClear(laneIndex, enemyBoard) && enemyBoard.back[laneIndex].occupant !== null) {
      targets.push({ row: 'back', index: laneIndex });
    }
  }

  return targets;
}
