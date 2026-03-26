/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';

const CARD_TEXT: Record<string, string> = {};

const TYPE_COLORS: Record<string, string> = {
  Unit: '#22d3ee',
  Companion: '#22d3ee',
  Spell: '#c084fc',
  Upgrade: '#10b981',
};

type HandProps = {
  hand: CardInstance[];
  selectedCardId: string | null;
  onCardClick: (cardInstanceId: string) => void;
  deckCount?: number;
};

export function Hand({ hand, selectedCardId, onCardClick, deckCount }: HandProps) {
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      {hand.map((card) => {
        const def = getCardDefinition(card.definitionId);
        const isUnit = def?.type === 'Unit' || def?.type === 'Companion';
        const isSpellOrUpgrade = def?.type === 'Spell' || def?.type === 'Upgrade';
        const cost = (card as CardInstance & { cost?: number }).cost ?? def?.cost ?? '?';
        const typeColor = def?.type ? (TYPE_COLORS[def.type] ?? '#94a3b8') : '#94a3b8';
        const cardText = isSpellOrUpgrade ? (CARD_TEXT[card.definitionId] ?? null) : null;
        const isSelected = selectedCardId === card.instanceId;
        const isHovered = hoveredCardId === card.instanceId;

        const translateY = isSelected ? -16 : isHovered ? -8 : 0;

        return (
          <div
            key={card.instanceId}
            onClick={() => onCardClick(card.instanceId)}
            onMouseEnter={() => setHoveredCardId(card.instanceId)}
            onMouseLeave={() => setHoveredCardId(null)}
            style={{
              width: 128,
              height: 176,
              borderRadius: 12,
              background: '#0f172a',
              border: isSelected
                ? '2px solid #22d3ee'
                : '2px solid #334155',
              boxShadow: isSelected
                ? '0 0 16px rgba(34,211,238,0.4), 0 0 4px rgba(34,211,238,0.2)'
                : 'none',
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
              transform: `translateY(${translateY}px)`,
              transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            {/* Cost badge — top left corner */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: '#0c2a3a',
              borderRight: '1px solid rgba(34,211,238,0.4)',
              borderBottom: '1px solid rgba(34,211,238,0.4)',
              borderBottomRightRadius: 8,
              padding: '3px 7px 3px 5px',
              zIndex: 2,
              display: 'flex',
              alignItems: 'baseline',
              gap: 2,
            }}>
              <span style={{ fontSize: 10, color: '#22d3ee' }}>⚡</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold', color: '#22d3ee' }}>{cost}</span>
            </div>

            {/* Art area — top half */}
            <div style={{
              height: 88,
              background: '#1e293b',
              borderBottom: '1px solid #334155',
              backgroundImage: 'radial-gradient(circle, rgba(71,85,105,0.4) 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 28, opacity: 0.25, color: '#94a3b8' }}>
                {isUnit ? '↗' : '↑'}
              </span>
            </div>

            {/* Info section — bottom half */}
            <div style={{
              flex: 1,
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 'bold',
                color: '#f1f5f9',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {def?.name ?? card.instanceId}
              </div>
              <div style={{ fontSize: 10, color: typeColor, fontWeight: 600, letterSpacing: '0.04em' }}>
                {def?.type ?? '?'}
              </div>
              {isUnit && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>🛡{card.currentHp}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>⚡{card.currentAttack}</span>
                </div>
              )}
              {cardText && (
                <div style={{
                  fontSize: 9,
                  color: '#64748b',
                  lineHeight: 1.4,
                  marginTop: 2,
                  overflow: 'hidden',
                }}>
                  {cardText}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Deck counter */}
      {deckCount !== undefined && (
        <div style={{
          width: 80,
          height: 112,
          borderRadius: 8,
          background: '#0f172a',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            DECK
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 'bold', color: '#22d3ee', lineHeight: 1 }}>
            {deckCount}
          </span>
        </div>
      )}
    </div>
  );
}
