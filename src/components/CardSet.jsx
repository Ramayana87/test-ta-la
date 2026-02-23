import React from 'react';
import Card from './Card';

export default function CardSet({ cards, small = false }) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className={`card-set ${small ? 'card-set-small' : ''}`}>
      {cards.map(card => (
        <Card key={card.id} card={card} small={small} />
      ))}
    </div>
  );
}
