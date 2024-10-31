<script lang="ts">
	import Card from './Card.svelte';
	import type { VisualState } from './Card.svelte';
	import { createInitialGameState, pickCard, checkPairs } from './gameLogic';
	let gameState = createInitialGameState();
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
		gameState = pickCard(gameState, e.position);
		// wait for 2 seconds before checking pairs to allow the user to see the second card flipped
		// Dirty workaround for now, should check if cards are done flipping
		await new Promise((resolve) => setTimeout(resolve, 2000));
		if (gameState.second_choice_position !== null) {
			gameState = checkPairs(gameState);
		}
	}
</script>

<div class="grid grid-cols-4 gap-4">
	{#each gameState.cards as card, i}
		<div class="h-16 w-16">
			<Card
				card_front={card.card.image_path}
				visualState={get_visual_state(i)}
				position={i}
				onCardClicked={cardClickHandler}
			/>
		</div>
	{/each}
</div>
