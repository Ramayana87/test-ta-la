import { create } from 'zustand';
import { initGame, GAME_PHASES, calculateFinalScores } from '../game/gameEngine';
import { findBestPhomCombination, aiChooseDiscard, aiShouldEatDiscard } from '../game/aiPlayer';
import { calculateDeadScore, findAllPhoms } from '../game/phomRules';
import { shuffleDeck, createDeck } from '../game/cardUtils';

const AI_DELAY = 1200;

const useGameStore = create((set, get) => ({
  game: null,
  gameMode: 'selecting',
  selectedCards: [],
  message: '',
  showResult: false,

  startGameMode: (mode) => {
    set({ gameMode: mode });
  },

  startGame: () => {
    const game = initGame();
    // Tính điểm ban đầu
    game.players[0].score = calculateDeadScore(
      game.players[0].hand,
      findBestPhomCombination(game.players[0].hand)
    );
    set({ game, selectedCards: [], message: 'Ván mới bắt đầu! Bạn đánh trước.', showResult: false, gameMode: 'ai' });
  },

  sortCards: () => {
    set(state => {
      const humanPlayer = state.game.players[0];
      const sorted = [...humanPlayer.hand].sort((a, b) => {
        const suits = ['♠', '♥', '♦', '♣'];
        const suitDiff = suits.indexOf(a.suit) - suits.indexOf(b.suit);
        if (suitDiff !== 0) return suitDiff;
        const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
      });
      return {
        game: {
          ...state.game,
          players: state.game.players.map(p =>
            p.id === 0 ? { ...p, hand: sorted } : p
          ),
        },
      };
    });
  },

  selectCard: (card) => {
    set(state => {
      const selected = state.selectedCards;
      const exists = selected.find(c => c.id === card.id);
      if (exists) {
        return { selectedCards: selected.filter(c => c.id !== card.id) };
      }
      return { selectedCards: [...selected, card] };
    });
  },

  drawFromDeck: () => {
    const { game } = get();
    if (game.phase !== GAME_PHASES.DRAW || game.currentPlayer !== 0) return;
    if (game.deck.length === 0) return;

    const newDeck = [...game.deck];
    const drawnCard = newDeck.pop();
    const newPlayers = game.players.map(p =>
      p.id === 0 ? { ...p, hand: [...p.hand, drawnCard] } : p
    );

    const newGame = {
      ...game,
      deck: newDeck,
      players: newPlayers,
      phase: GAME_PHASES.DISCARD,
    };

    // Cập nhật điểm
    newGame.players[0].score = calculateDeadScore(
      newGame.players[0].hand,
      findBestPhomCombination(newGame.players[0].hand)
    );

    set({ game: newGame, message: 'Đã rút bài. Chọn lá để đánh.' });
  },

  drawFromDiscard: () => {
    const { game } = get();
    if (game.phase !== GAME_PHASES.DRAW || game.currentPlayer !== 0) return;
    if (game.discardPile.length === 0) return;

    const newDiscardPile = [...game.discardPile];
    const drawnCard = newDiscardPile.pop();
    const newPlayers = game.players.map(p =>
      p.id === 0 ? { ...p, hand: [...p.hand, drawnCard] } : p
    );

    const newGame = {
      ...game,
      discardPile: newDiscardPile,
      players: newPlayers,
      phase: GAME_PHASES.DISCARD,
    };

    set({ game: newGame, message: `Ăn ${drawnCard.rank}${drawnCard.suit}. Chọn lá để đánh.` });
  },

  discardCard: () => {
    const { game, selectedCards } = get();
    if (game.phase !== GAME_PHASES.DISCARD || game.currentPlayer !== 0) return;
    if (selectedCards.length !== 1) {
      set({ message: 'Hãy chọn 1 lá bài để đánh!' });
      return;
    }

    const cardToDiscard = selectedCards[0];
    const newPlayers = game.players.map(p =>
      p.id === 0
        ? { ...p, hand: p.hand.filter(c => c.id !== cardToDiscard.id) }
        : p
    );

    // Kiểm tra ù (hết bài)
    if (newPlayers[0].hand.length === 0) {
      set({
        game: { ...game, players: newPlayers, winner: 0, phase: GAME_PHASES.GAME_OVER },
        message: 'Bạn ÙN! Chiến thắng!',
        showResult: true,
        selectedCards: [],
      });
      return;
    }

    const newGame = {
      ...game,
      players: newPlayers,
      discardPile: [...game.discardPile, cardToDiscard],
      currentPlayer: 1,
      phase: GAME_PHASES.AI_TURN,
    };

    set({ game: newGame, selectedCards: [], message: 'Đã đánh. Lượt của AI...' });
    get().runAITurns();
  },

  layDownPhom: () => {
    const { game, selectedCards } = get();
    if (game.phase !== GAME_PHASES.DISCARD || game.currentPlayer !== 0) return;
    if (selectedCards.length < 3) {
      set({ message: 'Chọn ít nhất 3 lá để hạ phỏm!' });
      return;
    }

    const allPhoms = findAllPhoms(game.players[0].hand);
    const matchedPhom = allPhoms.find(phom =>
      phom.length === selectedCards.length &&
      selectedCards.every(sc => phom.find(pc => pc.id === sc.id))
    );

    if (!matchedPhom) {
      set({ message: 'Các lá đã chọn không tạo thành phỏm hợp lệ!' });
      return;
    }

    const newPlayers = game.players.map(p => {
      if (p.id === 0) {
        return {
          ...p,
          hand: p.hand.filter(c => !selectedCards.find(sc => sc.id === c.id)),
          laidPhoms: [...p.laidPhoms, selectedCards],
        };
      }
      return p;
    });

    const newGame = {
      ...game,
      players: newPlayers,
      phase: GAME_PHASES.DISCARD,
    };

    newGame.players[0].score = calculateDeadScore(
      newGame.players[0].hand,
      findBestPhomCombination(newGame.players[0].hand)
    );

    set({ game: newGame, selectedCards: [], message: 'Hạ phỏm thành công!' });
  },

  runAITurns: () => {
    const runNextAI = () => {
      const { game } = get();
      if (!game || game.phase !== GAME_PHASES.AI_TURN) return;
      if (game.currentPlayer === 0) {
        set(state => ({ game: { ...state.game, phase: GAME_PHASES.DRAW } }));
        return;
      }

      const aiPlayer = game.players[game.currentPlayer];

      setTimeout(() => {
        const { game } = get();
        if (!game) return;

        // AI rút bài
        let newHand = [...aiPlayer.hand];
        let newDeck = [...game.deck];
        let newDiscardPile = [...game.discardPile];

        // Kiểm tra có muốn ăn từ discard không
        if (newDiscardPile.length > 0 && aiShouldEatDiscard(newDiscardPile[newDiscardPile.length - 1], newHand)) {
          newHand.push(newDiscardPile.pop());
        } else if (newDeck.length > 0) {
          newHand.push(newDeck.pop());
        }

        // AI đánh bài
        const cardToDiscard = aiChooseDiscard(newHand);
        newHand = newHand.filter(c => c.id !== cardToDiscard.id);
        newDiscardPile.push(cardToDiscard);

        // AI hạ phỏm
        const phoms = findBestPhomCombination(newHand);
        let newLaidPhoms = [...aiPlayer.laidPhoms];
        for (const phom of phoms) {
          if (phom.length >= 3) {
            newLaidPhoms.push(phom);
            newHand = newHand.filter(c => !phom.find(pc => pc.id === c.id));
          }
        }

        // Kiểm tra ù
        if (newHand.length === 0) {
          const newPlayers = game.players.map(p =>
            p.id === aiPlayer.id
              ? { ...p, hand: newHand, laidPhoms: newLaidPhoms }
              : p
          );
          set({
            game: {
              ...game,
              players: newPlayers,
              deck: newDeck,
              discardPile: newDiscardPile,
              winner: aiPlayer.id,
              phase: GAME_PHASES.GAME_OVER,
            },
            message: `${aiPlayer.name} ÙN! Bạn thua rồi!`,
            showResult: true,
          });
          return;
        }

        const nextPlayer = (game.currentPlayer + 1) % 4;
        const newPlayers = game.players.map(p =>
          p.id === aiPlayer.id
            ? { ...p, hand: newHand, laidPhoms: newLaidPhoms }
            : p
        );

        set({
          game: {
            ...game,
            players: newPlayers,
            deck: newDeck,
            discardPile: newDiscardPile,
            currentPlayer: nextPlayer,
            phase: nextPlayer === 0 ? GAME_PHASES.DRAW : GAME_PHASES.AI_TURN,
          },
          message: nextPlayer === 0
            ? `${aiPlayer.name} đánh ${cardToDiscard.rank}${cardToDiscard.suit}. Đến lượt bạn!`
            : `${aiPlayer.name} đánh ${cardToDiscard.rank}${cardToDiscard.suit}...`,
        });

        if (nextPlayer !== 0) {
          runNextAI();
        }
      }, AI_DELAY);
    };

    runNextAI();
  },

  closeResult: () => set({ showResult: false }),
}));

export default useGameStore;