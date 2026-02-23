import { rankIndex } from './cardUtils';

// Kiểm tra phỏm: bộ 3+ cùng rank (sảnh đôi) hoặc 3+ liên tiếp cùng suit (thông)
export function isPhom(cards) {
  if (!cards || cards.length < 3) return false;
  return isSameRankSet(cards) || isStraightFlush(cards);
}

// Bộ cùng rank (3 hoặc 4 lá cùng giá trị)
export function isSameRankSet(cards) {
  if (cards.length < 3 || cards.length > 4) return false;
  return cards.every(c => c.rank === cards[0].rank);
}

// Thông: 3+ lá liên tiếp cùng chất
export function isStraightFlush(cards) {
  if (cards.length < 3) return false;
  if (!cards.every(c => c.suit === cards[0].suit)) return false;
  const indices = cards.map(c => rankIndex(c.rank)).sort((a, b) => a - b);
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) return false;
  }
  return true;
}

// Tìm tất cả các phỏm có thể từ bài trên tay
export function findAllPhoms(hand) {
  const phoms = [];
  const n = hand.length;

  // Tìm phỏm cùng rank
  const byRank = {};
  for (const card of hand) {
    if (!byRank[card.rank]) byRank[card.rank] = [];
    byRank[card.rank].push(card);
  }
  for (const rank in byRank) {
    const group = byRank[rank];
    if (group.length >= 3) {
      phoms.push(group.slice(0, 3));
      if (group.length === 4) phoms.push(group.slice(0, 4));
    }
  }

  // Tìm thông (straight flush)
  const bySuit = {};
  for (const card of hand) {
    if (!bySuit[card.suit]) bySuit[card.suit] = [];
    bySuit[card.suit].push(card);
  }
  for (const suit in bySuit) {
    const group = bySuit[suit].sort((a, b) => rankIndex(a.rank) - rankIndex(b.rank));
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 2; j < group.length; j++) {
        const sub = group.slice(i, j + 1);
        if (isStraightFlush(sub)) phoms.push(sub);
      }
    }
  }

  return phoms;
}

// Tính điểm âm (lá không nằm trong phỏm nào)
export function calculateDeadScore(hand, phoms) {
  const usedIds = new Set(phoms.flat().map(c => c.id));
  return hand.filter(c => !usedIds.has(c.id)).reduce((sum, c) => sum + c.value, 0);
}

// Kiểm tra có thể ăn quân đánh ra vào phỏm đã hạ không
export function canEatCard(card, existingPhom) {
  const newPhom = [...existingPhom, card];
  return isPhom(newPhom);
}