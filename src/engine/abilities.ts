/// <reference path="../state/types.ts" />
import { hasActionsRemaining } from '../rules/validation';
import { getCardDefinition } from '../cards/registry';
import { spendAction } from './cardPlay';
import { gainCharge } from './turnFlow';

function spendEnergy(state: GameState, playerId: string, amount: number): GameState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.playerId !== playerId ? p : { ...p, energy: p.energy - amount },
    ) as [PlayerState, PlayerState],
  };
}

function applyWeakenToRow(row: [Slot, Slot, Slot]): [Slot, Slot, Slot] {
  return row.map((s) =>
    s.occupant
      ? {
          ...s,
          occupant: {
            ...s.occupant,
            weakenedStacks: (s.occupant.weakenedStacks ?? 0) + 1,
            currentAttack: Math.max(0, s.occupant.currentAttack - 1),
          },
        }
      : s,
  ) as [Slot, Slot, Slot];
}

export function activateAbility(
  state: GameState,
  playerId: string,
  abilityId: string,
  targetSlot?: SlotPosition,
): GameState {
  const player = state.players.find((p) => p.playerId === playerId)!;

  if (!hasActionsRemaining(player)) {
    return { ...state, eventLog: [...state.eventLog, `⚠ No actions remaining.`] };
  }

  switch (abilityId) {
    case 'unwound-hour': {
      // Caelum Voss Recalled — freeze one enemy unit (0 Energy, 1 action)
      if (player.companion.evolutionStage !== 2 || player.companion.definitionId !== 'caelum-voss') {
        return { ...state, eventLog: [...state.eventLog, `⚠ The Unwound Hour requires Recalled Caelum.`] };
      }
      if (!targetSlot) {
        return { ...state, eventLog: [...state.eventLog, `⚠ The Unwound Hour requires a target.`] };
      }
      const enemy = state.players.find((p) => p.playerId !== playerId)!;
      const target = enemy.board[targetSlot.row][targetSlot.index].occupant;
      if (!target) {
        return { ...state, eventLog: [...state.eventLog, `⚠ No unit at that slot.`] };
      }
      const targetName = getCardDefinition(target.definitionId)?.name ?? target.instanceId;
      const updatedPlayers = state.players.map((p) => {
        if (p.playerId === playerId) return p;
        const updatedRow = p.board[targetSlot.row].map((s, i) =>
          i === targetSlot.index && s.occupant
            ? { ...s, occupant: { ...s.occupant, frozen: true } }
            : s,
        ) as [Slot, Slot, Slot];
        return { ...p, board: { ...p.board, [targetSlot.row]: updatedRow } };
      }) as [PlayerState, PlayerState];
      let next = { ...state, players: updatedPlayers };
      next = spendAction(next, playerId);
      return { ...next, eventLog: [...next.eventLog, `Caelum's Unwound Hour — ${targetName} is frozen until the start of their owner's next turn.`] };
    }

    case 'null-codex': {
      // Seravine Null Recalled — Weaken ALL enemy units (1 Energy, 1 action)
      if (player.companion.evolutionStage !== 2 || player.companion.definitionId !== 'seravine-null') {
        return { ...state, eventLog: [...state.eventLog, `⚠ The Null Codex requires Recalled Seravine.`] };
      }
      if (player.energy < 1) {
        return { ...state, eventLog: [...state.eventLog, `⚠ The Null Codex requires 1 Energy.`] };
      }
      const enemy = state.players.find((p) => p.playerId !== playerId)!;
      const count = [...enemy.board.front, ...enemy.board.back].filter((s) => s.occupant !== null).length;
      if (count === 0) {
        return { ...state, eventLog: [...state.eventLog, `⚠ No enemy units to Weaken.`] };
      }
      const updatedPlayers = state.players.map((p) => {
        if (p.playerId === playerId) return p;
        return { ...p, board: { front: applyWeakenToRow(p.board.front), back: applyWeakenToRow(p.board.back) } };
      }) as [PlayerState, PlayerState];
      let next = { ...state, players: updatedPlayers };
      next = spendEnergy(next, playerId, 1);
      next = spendAction(next, playerId);
      return { ...next, eventLog: [...next.eventLog, `Seravine's Null Codex — ${count} enemy unit${count !== 1 ? 's' : ''} Weakened.`] };
    }

    case 'xochiyaoyotl': {
      // Xochitl Pavón Recalled — mark one enemy unit as sacred offering (0 Energy, 1 action)
      if (player.companion.evolutionStage !== 2 || player.companion.definitionId !== 'xochitl-pavon') {
        return { ...state, eventLog: [...state.eventLog, `⚠ Xochiyaoyotl requires Recalled Xochitl.`] };
      }
      if (!targetSlot) {
        return { ...state, eventLog: [...state.eventLog, `⚠ Xochiyaoyotl requires a target.`] };
      }
      const enemy = state.players.find((p) => p.playerId !== playerId)!;
      const target = enemy.board[targetSlot.row][targetSlot.index].occupant;
      if (!target) {
        return { ...state, eventLog: [...state.eventLog, `⚠ No unit at that slot.`] };
      }
      const targetName = getCardDefinition(target.definitionId)?.name ?? target.instanceId;
      const updatedPlayers = state.players.map((p) => {
        if (p.playerId === playerId) return p;
        const updatedRow = p.board[targetSlot.row].map((s, i) =>
          i === targetSlot.index && s.occupant
            ? { ...s, occupant: { ...s.occupant, markedAsOffering: true } }
            : s,
        ) as [Slot, Slot, Slot];
        return { ...p, board: { ...p.board, [targetSlot.row]: updatedRow } };
      }) as [PlayerState, PlayerState];
      let next = { ...state, players: updatedPlayers };
      next = spendAction(next, playerId);
      return { ...next, eventLog: [...next.eventLog, `Xochitl's Xochiyaoyotl — ${targetName} marked as sacred offering.`] };
    }

    default:
      return { ...state, eventLog: [...state.eventLog, `⚠ Unknown ability: ${abilityId}.`] };
  }
}
