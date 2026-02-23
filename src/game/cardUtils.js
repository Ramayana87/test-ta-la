export const SUITS = ['♠', '♥', '♦', '♣'];
export const SUIT_NAMES = { '♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs' };
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const RANK_VALUES = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10 };

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}${suit}`, rank, suit, value: RANK_VALUES[rank] });
    }
  }
  return deck;
}

export function shuffleDeck(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function cardScore(card) {
  return RANK_VALUES[card.rank];
}

export function handScore(hand) {
  return hand.reduce((sum, c) => sum + cardScore(c), 0);
}

export function isRed(suit) {
  return suit === '♥' || suit === '♦';
}

export function rankIndex(rank) {
  return RANKS.indexOf(rank);
}