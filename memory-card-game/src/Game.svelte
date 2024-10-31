<!--

    Connects game logic with UI for a memory card game. 
    Components:
    - Card: Represents an individual card in the game.
    - ResponsiveGrid: A grid layout component for arranging the cards.

    Functions:
    - get_visual_state(position: number): Determines the visual state of a card based on its position and the current game state.
    - cardClickHandler(e: CardClickedEvent): Handles the card click event, updates the game state, and checks for pairs.

    State Variables:
    - gameState: The current state of the game, including card positions and matches.
    - isCheckingPairs: A flag indicating whether the game is currently checking for pairs.

    UI Elements:
    - A grid of cards, each represented by the Card component.
    - A win screen that appears when the game is finished, offering options to restart the game at different difficulty levels.

    Transitions:
    - fade: Used for the win screen transition effect.

    Usage:
    - The game starts with an initial game state created by createInitialGameState().
    - When a card is clicked, cardClickHandler is triggered to handle the game logic.
    - The win screen is displayed when the game is finished, allowing the user to restart the game with different difficulty levels.
-->
<script lang="ts">
	import Card from './Card.svelte';
	import { fade } from 'svelte/transition';
	import ResponsiveGrid from './ResponsiveGrid.svelte';
	import type { VisualState } from './Card.svelte';
	import {
		createInitialGameState,
		pickCard,
		checkPairs,
		hard_card_set,
		medium_card_set
	} from './gameLogic';

	let gameState = createInitialGameState();
	let isCheckingPairs = false;

	function get_visual_state(position: number): VisualState {
		if (gameState.cards[position].isMatched) return 'matched';
		if (
			gameState.first_choice_position === position ||
			gameState.second_choice_position === position
		) {
			return 'face-up';
		}
		return 'face-down';
	}

	async function cardClickHandler(e: CardClickedEvent) {
		console.log(e);
		const prev_matches = gameState.matches;
		gameState = pickCard(gameState, e.position);
		// Wait a little before checking pairs to allow the user to see the second card flipped
		// Dirty workaround for now, should check if cards are done flipping
		if (gameState.second_choice_position !== null) {
			isCheckingPairs = true;
			await new Promise((resolve) => setTimeout(resolve, 1200));
			isCheckingPairs = false;
			gameState = checkPairs(gameState);
		}
	}
</script>

<div class="bg-gray-50">
	<ResponsiveGrid num_items={gameState.cards.length}>
		{#each gameState.cards as card, i}
			<div class={'aspect-w-4 aspect-h-4 w-full '}>
				<Card
					card_front={card.card.image_path}
					visualState={get_visual_state(i)}
					position={i}
					clickable={get_visual_state(i) === 'face-down' && !isCheckingPairs}
					onCardClicked={cardClickHandler}
				/>
			</div>
		{/each}
	</ResponsiveGrid>
</div>

<!-- win screen -->
{#if gameState.isGameFinished}
	<div
		transition:fade
		class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
	>
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-8">
			<h1 class="text-center text-4xl font-bold">You won!</h1>
			<p class="text-center text-lg">
				You finished the game in {gameState.turns} moves. Want to play again?
			</p>
			<div class="mt-4 flex flex-col space-y-4">
				<button
					class="rounded-lg bg-blue-500 px-4 py-2 text-white"
					on:click={() => (gameState = createInitialGameState())}>Easy</button
				>
				<button
					class="rounded-lg bg-blue-500 px-4 py-2 text-white"
					on:click={() => (gameState = createInitialGameState(medium_card_set))}>Medium</button
				>
				<button
					class="rounded-lg bg-blue-500 px-4 py-2 text-white"
					on:click={() => (gameState = createInitialGameState(hard_card_set))}>Hard</button
				>
			</div>
		</div>
	</div>
{/if}
