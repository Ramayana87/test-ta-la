import { findAllPhoms, calculateDeadScore, isPhom } from './phomRules';
import { rankIndex } from './cardUtils';

// AI chọn lá bài để đánh ra
export function aiChooseDiscard(hand) {
  const phoms = findBestPhomCombination(hand);
  const usedIds = new Set(phoms.flat().map(c => c.id));
  const deadCards = hand.filter(c => !usedIds.has(c.id));

  if (deadCards.length === 0) {
    // Tất cả đều trong phỏm, đánh lá có điểm cao nhất
    return hand.reduce((max, c) => c.value > max.value ? c : max, hand[0]);
  }

  // Đánh lá có điểm cao nhất trong dead cards
  return deadCards.reduce((max, c) => c.value > max.value ? c : max, deadCards[0]);
}

// Tìm tổ hợp phỏm tốt nhất (ít điểm âm nhất)
export function findBestPhomCombination(hand) {
  const allPhoms = [];
  // Đơn giản: greedy approach
  const remaining = [...hand];
  const chosen = [];

  const tryAdd = (cards) => {
    if (isPhom(cards)) {
      chosen.push(cards);
      return true;
    }
    return false;
  };

  // Thử từng tổ hợp
  const byRank = {};
  for (const card of remaining) {
    if (!byRank[card.rank]) byRank[card.rank] = [];
    byRank[card.rank].push(card);
  }

  for (const rank in byRank) {
    if (byRank[rank].length >= 3) {
      chosen.push(byRank[rank].slice(0, Math.min(4, byRank[rank].length)));
    }
  }

  return chosen;
}

// AI quyết định có hạ phỏm không
export function aiShouldLayDown(hand) {
  const phoms = findBestPhomCombination(hand);
  return phoms.length > 0 && calculateDeadScore(hand, phoms) < 15;
}

// AI quyết định có ăn bài vứt không
export function aiShouldEatDiscard(card, hand) {
  const testHand = [...hand, card];
  const beforeScore = calculateDeadScore(hand, findBestPhomCombination(hand));
  const afterScore = calculateDeadScore(testHand, findBestPhomCombination(testHand));
  return afterScore < beforeScore;
}