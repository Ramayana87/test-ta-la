import React from 'react';

const AVATARS = {
  0: '🎮',
  1: '👩‍🦰',
  2: '🧔',
  3: '🧢',
};

const AVATAR_COLORS = ['#1a5f8a', '#2d2d2d', '#1a5f8a', '#1a5f8a'];

export default function PlayerInfo({ player, isActive, position }) {
  const formatMoney = (amount) => {
    return '$' + amount.toLocaleString('vi-VN').replace(/\./g, '.');
  };

  return (
    <div className={`player-info player-info-${position} ${isActive ? 'player-active' : ''}`}>
      <div className="player-avatar-wrapper">
        <div className="player-avatar" style={{ background: AVATAR_COLORS[player.id] }}>
          <span style={{ fontSize: position === 'bottom' ? '2rem' : '1.5rem' }}>{AVATARS[player.id]}</span>
          {isActive && <div className="active-indicator" />}
        </div>
      </div>
      <div className="player-details">
        <div className="player-name">{player.name}</div>
        <div className="player-money">{formatMoney(player.money)}</div>
        {position === 'bottom' && (
          <div className="player-level">Lv. {Math.floor(player.money / 10000000) + 1}</div>
        )}
      </div>
      {position === 'bottom' && (
        <div className="player-score-badge">
          <span>{player.score || 0}</span>
          <small>Điểm</small>
        </div>
      )}
    </div>
  );
}