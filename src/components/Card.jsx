import React from 'react';

const RANK_DISPLAY = { 'A': 'A', '10': '10', 'J': 'J', 'Q': 'Q', 'K': 'K' };

export default function Card({ card, faceDown = false, selected = false, onClick, small = false }) {
  if (faceDown) {
    return (
      <div
        className={`card card-back ${small ? 'card-small' : ''}`}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="card-back-pattern" />
      </div>
    );
  }

  const isRed = card.suit === '♥' || card.suit === '♦';

  return (
    <div
      className={`card card-face ${isRed ? 'card-red' : 'card-black'} ${selected ? 'card-selected' : ''} ${small ? 'card-small' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card-corner card-top-left">
        <span className="card-rank">{card.rank}</span>
        <span className="card-suit">{card.suit}</span>
      </div>
      <div className="card-center-suit">{card.suit}</div>
      <div className="card-corner card-bottom-right">
        <span className="card-rank">{card.rank}</span>
        <span className="card-suit">{card.suit}</span>
      </div>
    </div>
  );
}