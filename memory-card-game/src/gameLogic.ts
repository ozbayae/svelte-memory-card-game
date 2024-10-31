interface Card {
	id: number;
	image_path: string;
}

const cards: Card[] = [
	{ id: 1, image_path: '$lib/assets/card_images/1.png' },
	{ id: 2, image_path: '$lib/assets/card_images/2.png' },
	{ id: 3, image_path: '$lib/assets/card_images/3.png' },
	{ id: 4, image_path: '$lib/assets/card_images/4.png' }
];

interface CardInstance {
	card: Card;
	position: number;
	isMatched: boolean;
}

interface GameState {
	cards: CardInstance[];
	turns: number;
	matches: number;
	isGameFinished: boolean;
	first_choice_position: number | null;
	second_choice_position: number | null;
}

export function createInitialGameState(): GameState {
	const duplicatedCards = [...cards, ...cards];
	const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);

	const cardInstances = shuffledCards.map(
		(card, index): CardInstance => ({
			card,
			position: index,
			isMatched: false
		})
	);

	return {
		cards: cardInstances,
		turns: 0,
		matches: 0,
		isGameFinished: false,
		first_choice_position: null,
		second_choice_position: null
	};
}

/**
 * Picks a card from the game state at the specified position and returns the new GameState.
 * Does not mutate the original game state.
 *
 * @param gameState - The current state of the game.
 * @param position - The position of the card to pick.
 * @returns The new game state after picking the card.
 * @throws Will throw an error if the game is already finished, the card is already matched, the same card is picked twice, or more than two cards are picked.
 *
 */
export function pickCard(gameState: GameState, position: number): GameState {
	if (gameState.isGameFinished) {
		throw new Error('Game is already finished');
	}
	if (gameState.cards[position].isMatched) {
		throw new Error('Cannot pick already matched card');
	}
	if (position === gameState.first_choice_position) {
		throw new Error('Cannot pick the same card twice');
	}
	if (gameState.first_choice_position !== null && gameState.second_choice_position !== null) {
		throw new Error('Cannot pick more than two cards');
	}

	return {
		...gameState,
		first_choice_position:
			gameState.first_choice_position === null ? position : gameState.first_choice_position,
		second_choice_position: gameState.first_choice_position !== null ? position : null
	};
}

/**
 * Checks if the two selected cards form a pair and updates the game state accordingly.
 *
 * @param gameState - The current state of the game.
 * @returns The updated game state after checking the selected cards.
 * @throws Will throw an error if two cards are not selected.
 *
 * Increments the number of turns by 1.
 */
export function checkPairs(gameState: GameState): GameState {
	if (gameState.first_choice_position === null || gameState.second_choice_position === null) {
		throw new Error('Need to pick two cards first');
	}

	const firstCard = gameState.cards[gameState.first_choice_position];
	const secondCard = gameState.cards[gameState.second_choice_position];

	if (firstCard.card.id === secondCard.card.id) {
		const newCards = gameState.cards.map((card, index) => {
			if (index === gameState.first_choice_position || index === gameState.second_choice_position) {
				return {
					...card,
					isMatched: true
				};
			}
			return card;
		});

		const isGameFinished = newCards.every((card) => card.isMatched);
		return {
			...gameState,
			cards: newCards,
			turns: gameState.turns + 1,
			matches: gameState.matches + 1,
			isGameFinished,
			first_choice_position: null,
			second_choice_position: null
		};
	}

	return {
		...gameState,
		turns: gameState.turns + 1,
		first_choice_position: null,
		second_choice_position: null
	};
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('creates a new game state with the correct number of cards and valid number of pairs', () => {
		const gameState = createInitialGameState();
		expect(gameState.cards.length).toBe(8);
		expect(gameState.cards.filter((card) => card.isMatched === false).length).toBe(8);
		//count number of pairs
		const cardIds = gameState.cards.map((card) => card.card.id);
		const uniqueCardIds = new Set(cardIds);
		expect(uniqueCardIds.size).toBe(4);
	});
	it('picks a card and sets it to visible', () => {
		const gameState = createInitialGameState();
		const pickedCardPosition = 0;
		const newGameState = pickCard(gameState, pickedCardPosition);
		expect(newGameState.first_choice_position).toBe(pickedCardPosition);
		//nothing else is visible, turns should not increase, still 0 matches
		expect(newGameState.turns).toBe(0);
		expect(newGameState.matches).toBe(0);
	});
	it('picks two matching cards and sets them to matched', () => {
		const gameState = createInitialGameState();
		const firstCardPosition = 0;
		const secondCardPosition = gameState.cards.findIndex(
			(card) =>
				card.card.id === gameState.cards[firstCardPosition].card.id &&
				card.position !== firstCardPosition
		);
		const newGameState = pickCard(pickCard(gameState, firstCardPosition), secondCardPosition);
		const newGameStateAfterCheckPairs = checkPairs(newGameState);
		expect(newGameStateAfterCheckPairs.cards[firstCardPosition].isMatched).toBe(true);
		expect(newGameStateAfterCheckPairs.cards[secondCardPosition].isMatched).toBe(true);
		expect(newGameStateAfterCheckPairs.matches).toBe(1);
		//turns should increase by 1
		expect(newGameStateAfterCheckPairs.turns).toBe(1);
	});
	it('picks two non-matcheng cards and increases number of turns, can pick card afterwards', () => {
		const gameState = createInitialGameState();
		const firstCardPosition = 0;
		const secondCardPosition = gameState.cards.findIndex(
			(card) =>
				card.card.id !== gameState.cards[firstCardPosition].card.id &&
				card.position !== firstCardPosition
		);
		const newGameState = pickCard(pickCard(gameState, firstCardPosition), secondCardPosition);
		const newGameStateAfterCheckPairs = checkPairs(newGameState);
		expect(newGameStateAfterCheckPairs.cards[firstCardPosition].isMatched).toBe(false);
		expect(newGameStateAfterCheckPairs.cards[secondCardPosition].isMatched).toBe(false);
		expect(newGameStateAfterCheckPairs.matches).toBe(0);
		expect(newGameStateAfterCheckPairs.turns).toBe(1);
		//can pick a card again
		const newGameStateAfterPicking = pickCard(newGameStateAfterCheckPairs, 0);
		expect(newGameStateAfterPicking.first_choice_position).toBe(0);
	});
	it('lets you win the game', () => {
		const gameState = createInitialGameState();
		//sort cards by id
		const sortedCards = gameState.cards.sort((a, b) => a.card.id - b.card.id);
		//for each pair, pick the cards
		let newGameState = gameState;
		for (let i = 0; i < sortedCards.length; i += 2) {
			newGameState = pickCard(pickCard(newGameState, i), i + 1);
			newGameState = checkPairs(newGameState);
		}
		expect(newGameState.isGameFinished).toBe(true);
	});
}
