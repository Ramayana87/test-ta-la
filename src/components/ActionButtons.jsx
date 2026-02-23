import React from 'react';

export default function ActionButtons({
  phase,
  isPlayerTurn,
  selectedCards,
  onDiscard,
  onLayDown,
  onDrawDeck,
  onDrawDiscard,
  onSort,
  hasDiscard,
}) {
  const canDraw = phase === 'draw' && isPlayerTurn;
  const canDiscard = phase === 'discard' && isPlayerTurn;

  return (
    <div className="action-buttons">
      {canDraw && (
        <>
          <button className="btn btn-draw" onClick={onDrawDeck}>
            Rút bài
          </button>
          {hasDiscard && (
            <button className="btn btn-eat" onClick={onDrawDiscard}>
              Ăn bài
            </button>
          )}
        </>
      )}
      {canDiscard && (
        <>
          {selectedCards.length >= 3 && (
            <button className="btn btn-lay" onClick={onLayDown}>
              Hạ
            </button>
          )}
          <button
            className="btn btn-discard"
            onClick={onDiscard}
            disabled={selectedCards.length !== 1}
          >
            Đánh
          </button>
          <button className="btn btn-sort" onClick={onSort}>
            Xếp bài
          </button>
        </>
      )}
    </div>
  );
}