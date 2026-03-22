/// <reference path="../state/types.ts" />
import React from 'react';
import { getCardDefinition } from '../cards/registry';

type HandProps = {
  hand: CardInstance[];
  selectedCardId: string | null;
  onCardClick: (cardInstanceId: string) => void;
};

export function Hand({ hand, selectedCardId, onCardClick }: HandProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {hand.map((card) => {
        const def = getCardDefinition(card.definitionId);
        const isUnit = def?.type === 'Unit' || def?.type === 'Companion';
        return (
          <div
            key={card.instanceId}
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
            }}
          >
            <div>{def?.name ?? card.instanceId}</div>
            {isUnit && (
              <>
                <div>HP: {card.currentHp}</div>
                <div>ATK: {card.currentAttack}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
