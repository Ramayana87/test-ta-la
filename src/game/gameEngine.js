import { createDeck, shuffleDeck } from './cardUtils';
import { findBestPhomCombination } from './aiPlayer';
import { findAllPhoms, calculateDeadScore } from './phomRules';

export const GAME_PHASES = {
  WAITING: 'waiting',
  DEALING: 'dealing',
  PLAYER_TURN: 'player_turn',
  DRAW: 'draw',
  DISCARD: 'discard',
  AI_TURN: 'ai_turn',
  GAME_OVER: 'game_over',
};

export const PLAYER_COUNT = 4;
export const INITIAL_HAND_SIZE = 9; // Người đầu 10, còn lại 9
export const BET_AMOUNT = 200000;

export function initGame() {
  const deck = shuffleDeck(createDeck());
  const players = [
    { id: 0, name: 'Bạn', money: 50000000, isHuman: true, avatar: '🎮', hand: [], laidPhoms: [], score: 0 },
    { id: 1, name: 'Bò lạc', money: 21400000, isHuman: false, avatar: '👩', hand: [], laidPhoms: [], score: 0 },
    { id: 2, name: 'Dương sún', money: 15200000, isHuman: false, avatar: '👨', hand: [], laidPhoms: [], score: 0 },
    { id: 3, name: 'Triển ròm', money: 12600000, isHuman: false, avatar: '🧢', hand: [], laidPhoms: [], score: 0 },
  ];

  // Chia bài: người đầu 10 lá, còn lại 9 lá
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const count = i === 0 ? 10 : 9;
    players[i].hand = deck.splice(0, count);
  }

  return {
    players,
    deck,
    discardPile: [],
    currentPlayer: 0,
    phase: GAME_PHASES.DISCARD, // Người đầu có 10 lá, phải đánh ngay
    round: 1,
    winner: null,
    lastAction: null,
    selectedCards: [],
    pot: BET_AMOUNT * PLAYER_COUNT,
  };
}

export function calculateFinalScores(players) {
  return players.map(player => {
    const phoms = findBestPhomCombination(player.hand);
    const deadScore = calculateDeadScore(player.hand, phoms);
    return { ...player, finalScore: deadScore, phoms };
  });
}