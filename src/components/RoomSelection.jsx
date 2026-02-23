import React, { useState } from 'react';

export default function RoomSelection({ onSelectMode }) {
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handlePlayWithAI = () => {
    onSelectMode('ai');
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      onSelectMode('room', {
        roomName: roomName.trim(),
        isHost: true,
      });
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      onSelectMode('room', {
        roomCode: roomCode.trim(),
        isHost: false,
      });
    }
  };

  return (
    <div className="room-selection">
      <div className="room-selection-content">
        <h1 className="game-title">🃏 Bài Phỏm</h1>
        <p className="game-subtitle">Chọn chế độ chơi</p>

        <div className="mode-options">
          {/* Chơi với máy */}
          <button className="mode-card mode-ai" onClick={handlePlayWithAI}>
            <div className="mode-icon">🤖</div>
            <div className="mode-name">Chơi với Máy</div>
            <div className="mode-desc">Chơi với 3 người chơi AI</div>
          </button>

          {/* Chơi online */}
          <button
            className="mode-card mode-online"
            onClick={() => setShowCreateRoom(!showCreateRoom)}
          >
            <div className="mode-icon">👥</div>
            <div className="mode-name">Chơi Online</div>
            <div className="mode-desc">Chơi cùng bạn bè</div>
          </button>
        </div>

        {showCreateRoom && (
          <div className="room-forms">
            {/* Tạo phòng */}
            <div className="room-form">
              <h3>Tạo Phòng</h3>
              <form onSubmit={handleCreateRoom}>
                <input
                  type="text"
                  placeholder="Tên phòng"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  maxLength="20"
                />
                <button type="submit" className="btn btn-primary">
                  Tạo Phòng
                </button>
              </form>
              <p className="form-hint">Mời 3 người khác vào phòng của bạn</p>
            </div>

            {/* Tham gia phòng */}
            <div className="room-form">
              <h3>Tham Gia Phòng</h3>
              <form onSubmit={handleJoinRoom}>
                <input
                  type="text"
                  placeholder="Mã phòng"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength="6"
                  pattern="[A-Z0-9]*"
                />
                <button type="submit" className="btn btn-primary">
                  Tham Gia
                </button>
              </form>
              <p className="form-hint">Nhập mã phòng của bạn bè</p>
            </div>
          </div>
        )}

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
