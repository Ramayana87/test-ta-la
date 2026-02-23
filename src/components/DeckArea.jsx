import React from 'react';
import Card from './Card';

export default function DeckArea({ deck, discardPile, onDrawFromDeck, onDrawFromDiscard, canDraw }) {
  const topDiscard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  return (
    <div className="deck-area">
      {/* Deck */}
      <div
        className={`deck-pile ${canDraw ? 'deck-clickable' : ''}`}
        onClick={canDraw ? onDrawFromDeck : undefined}
        title="Rút từ bộ bài"
      >
        {deck.length > 0 ? (
          <>
            <Card card={null} faceDown />
            <div className="deck-count">{deck.length}</div>
          </>
        ) : (
          <div className="deck-empty">Hết bài</div>
        )}
      </div>

      {/* Discard pile */}
      <div
        className={`discard-pile ${canDraw && topDiscard ? 'deck-clickable' : ''}`}
        onClick={canDraw && topDiscard ? onDrawFromDiscard : undefined}
        title="Ăn từ bài vứt"
      >
        {topDiscard ? (
          <Card card={topDiscard} />
        ) : (
          <div className="deck-empty">—</div>
        )}
      </div>
    </div>
  );
}