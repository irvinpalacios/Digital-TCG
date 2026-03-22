/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';

const CARD_TOOLTIPS: Record<string, string> = {
  'pack-signal': 'Move 2 friendly units to empty adjacent slots. Free action.',
  'pounce-window': 'Push enemy front unit back. If empty, draw 1 card.',
  'sharpen-instinct': 'Give a unit +2 ATK this turn. +1 Charge if companion.',
  'soul-kindle': 'Sacrifice a non-companion unit. Gain 3 Charge.',
  'ember-mantle': 'Companion gains +2 HP, +1 ATK permanently. +1 Charge if Wisp.',
  'death-flare': 'Deal 2 damage to ALL units. Gain 1 Charge per death.',
};

const TYPE_COLORS: Record<string, string> = {
  Unit: '#4a8aff',
  Companion: '#c040f0',
  Spell: '#f04040',
  Upgrade: '#40b040',
};

type HandProps = {
  hand: CardInstance[];
  selectedCardId: string | null;
  onCardClick: (cardInstanceId: string) => void;
};

export function Hand({ hand, selectedCardId, onCardClick }: HandProps) {
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {hand.map((card) => {
        const def = getCardDefinition(card.definitionId);
        const isUnit = def?.type === 'Unit' || def?.type === 'Companion';
        const isSpellOrUpgrade = def?.type === 'Spell' || def?.type === 'Upgrade';
        const cost = (card as CardInstance & { cost?: number }).cost ?? def?.cost ?? '?';
        const typeColor = def?.type ? (TYPE_COLORS[def.type] ?? '#888') : '#888';
        const tooltip = isSpellOrUpgrade ? CARD_TOOLTIPS[card.definitionId] : null;
        const showTooltip = hoveredCardId === card.instanceId && tooltip != null;

        return (
          <div
            key={card.instanceId}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredCardId(card.instanceId)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            {showTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#222',
                color: '#eee',
                border: '1px solid #555',
                borderRadius: 4,
                padding: '6px 8px',
                fontSize: 11,
                width: 160,
                zIndex: 10,
                pointerEvents: 'none',
                textAlign: 'center',
              }}>
                {tooltip}
              </div>
            )}
            <div
              onClick={() => onCardClick(card.instanceId)}
              style={{
                width: 80,
                height: 120,
                border: '1px solid #333',
                background: selectedCardId === card.instanceId ? 'yellow' : '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: 12,
                gap: 2,
              }}
            >
              <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 11, padding: '0 4px' }}>{def?.name ?? card.instanceId}</div>
              <div style={{ color: '#f0c040', fontSize: 11 }}>Cost: {cost} ⚡</div>
              <div style={{ color: typeColor, fontSize: 10 }}>{def?.type ?? '?'}</div>
              {isUnit && (
                <>
                  <div>HP: {card.currentHp}</div>
                  <div>ATK: {card.currentAttack}</div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
