import React from 'react';
import Card from './Card';
import CardSet from './CardSet';
import DeckArea from './DeckArea';
import ActionButtons from './ActionButtons';
import PlayerInfo from './PlayerInfo';
import RoomSelection from './RoomSelection';
import useGameStore from '../store/gameStore';

const POSITIONS = ['bottom', 'top', 'left', 'right'];

export default function GameBoard() {
  const {
    game,
    gameMode,
    selectedCards,
    message,
    showResult,
    startGame,
    startGameMode,
    sortCards,
    selectCard,
    drawFromDeck,
    drawFromDiscard,
    discardCard,
    layDownPhom,
    closeResult,
  } = useGameStore();

  if (gameMode === 'selecting') {
    return <RoomSelection onSelectMode={startGameMode} />;
  }

  if (!game) {
    return (
      <div className="start-screen">
        <div className="start-content">
          <h1 className="game-title">🃏 Bài Phỏm</h1>
          <p className="game-subtitle">Game bài truyền thống Việt Nam</p>
          <button className="btn btn-start" onClick={startGame}>
            Bắt đầu chơi
          </button>
          <button className="btn btn-back" onClick={() => startGameMode('selecting')}>
            ← Quay lại
          </button>
          <div className="game-rules">
            <h3>Luật chơi cơ bản:</h3>
            <ul>
              <li>4 người chơi, mỗi người 9 lá (người đầu 10 lá)</li>
              <li>Phỏm: 3-4 lá cùng giá trị hoặc liên tiếp cùng chất</li>
              <li>Lượt: rút → hạ phỏm (nếu có) → đánh 1 lá</li>
              <li>Thắng khi hết bài (ù) hoặc ít điểm nhất</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const { players, deck, discardPile, currentPlayer, phase, pot } = game;
  const humanPlayer = players[0];
  const topPlayer = players[1];    // Trên
  const leftPlayer = players[2];   // Trái
  const rightPlayer = players[3];  // Phải

  const isPlayerTurn = currentPlayer === 0;
  const hasDiscard = discardPile.length > 0;

  const formatMoney = (n) => `$${n.toLocaleString('vi-VN')}`;

  return (
    <div className="game-container">
      {/* Header */}
      <div className="game-header">
        <div className="header-left">
          <button className="btn-icon">◀</button>
          <button className="btn-icon">⚙</button>
          <button className="btn-icon">?</button>
        </div>
        <div className="header-right">
          <div className="room-info">
            <span>Phòng</span>
            <span className="highlight">4 NGƯỜI</span>
          </div>
          <div className="room-info">
            <span>Cược:</span>
            <span className="highlight gold">{formatMoney(pot)}</span>
          </div>
        </div>
      </div>

      {/* Bàn chơi */}
      <div className="table-container">
        <div className="table-oval">

          {/* Người chơi trên */}
          <div className="player-area player-top">
            <PlayerInfo player={topPlayer} isActive={currentPlayer === 1} position="top" />
            <div className="player-hand-top">
              {/* Bài đã hạ của top player */}
              {topPlayer.laidPhoms.map((phom, i) => (
                <CardSet key={i} cards={phom} small />
              ))}
              {/* Bài úp */}
              <div className="ai-hand-face-down">
                {topPlayer.hand.map((_, i) => (
                  <Card key={i} card={null} faceDown small />
                ))}
              </div>
            </div>
          </div>

          {/* Người chơi trái */}
          <div className="player-area player-left">
            <PlayerInfo player={leftPlayer} isActive={currentPlayer === 2} position="left" />
            <div className="player-hand-left">
              {leftPlayer.laidPhoms.map((phom, i) => (
                <CardSet key={i} cards={phom} small />
              ))}
              <div className="ai-hand-face-down vertical">
                {leftPlayer.hand.map((_, i) => (
                  <Card key={i} card={null} faceDown small />
                ))}
              </div>
            </div>
          </div>

          {/* Người chơi phải */}
          <div className="player-area player-right">
            <PlayerInfo player={rightPlayer} isActive={currentPlayer === 3} position="right" />
            <div className="player-hand-right">
              {rightPlayer.laidPhoms.map((phom, i) => (
                <CardSet key={i} cards={phom} small />
              ))}
              <div className="ai-hand-face-down vertical">
                {rightPlayer.hand.map((_, i) => (
                  <Card key={i} card={null} faceDown small />
                ))}
              </div>
            </div>
          </div>

          {/* Khu vực trung tâm: deck + bài đã hạ của human */}
          <div className="center-area">
            {/* Phỏm đã hạ của người chơi ở trên deck */}
            {humanPlayer.laidPhoms.map((phom, i) => (
              <div key={i} className="laid-phom-center">
                {phom.map(card => (
                  <Card key={card.id} card={card} small />
                ))}
              </div>
            ))}

            <DeckArea
              deck={deck}
              discardPile={discardPile}
              onDrawFromDeck={drawFromDeck}
              onDrawFromDiscard={drawFromDiscard}
              canDraw={isPlayerTurn && phase === 'draw'}
            />
          </div>

          {/* Thông điệp */}
          {message && (
            <div className="message-bar">{message}</div>
          )}
        </div>
      </div>

      {/* Khu vực người chơi dưới */}
      <div className="player-bottom-area">
        <PlayerInfo player={humanPlayer} isActive={isPlayerTurn} position="bottom" />

        {/* Bài trên tay */}
        <div className="human-hand">
          {humanPlayer.hand.map(card => (
            <Card
              key={card.id}
              card={card}
              selected={!!selectedCards.find(sc => sc.id === card.id)}
              onClick={() => isPlayerTurn && phase === 'discard' && selectCard(card)}
            />
          ))}
        </div>

        {/* Nút hành động */}
        <ActionButtons
          phase={phase}
          isPlayerTurn={isPlayerTurn}
          selectedCards={selectedCards}
          onDiscard={discardCard}
          onLayDown={layDownPhom}
          onDrawDeck={drawFromDeck}
          onDrawDiscard={drawFromDiscard}
          onSort={sortCards}
          hasDiscard={hasDiscard}
        />
      </div>

      {/* Màn hình kết quả */}
      {showResult && (
        <div className="result-overlay">
          <div className="result-modal">
            <h2>{game.winner === 0 ? '🎉 Bạn Thắng!' : '😢 Bạn Thua!'}</h2>
            <p>{message}</p>
            <div className="result-scores">
              {players.map(p => (
                <div key={p.id} className="result-player">
                  <span>{p.name}</span>
                  <span>{p.hand.length} lá còn lại</span>
                </div>
              ))}
            </div>
            <button className="btn btn-start" onClick={startGame}>
              Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}