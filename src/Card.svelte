<!--

    This Svelte component represents a memory card in a memory card game. 
    It handles the visual state of the card (face-down, face-up, matched) and animates the card accordingly using the `motion` library. 
    The component also handles click events to notify when a card is clicked.

    Props:
    - card_front (string): The URL of the image to display on the front of the card.
    - visualState (VisualState): The current visual state of the card. Can be 'face-down', 'face-up', or 'matched'.
    - position (number): The position of the card in the game grid.
    - clickable (boolean): Determines if the card is clickable.
    - onCardClicked (function): Optional callback function to handle card click events. Receives an object with the card's position.

    VisualState:
    - 'face-down': The card is facing down. 
    - 'face-up': The card is facing up.
    - 'matched': The card has been matched with another card.

    Functions:
    - handleClick: Handles the click event on the card and triggers the onCardClicked callback with the card's position.
    - animate_to_state: Animates the card to the specified visual state using the `motion` library.

    Effects:
    - An effect that triggers the animate_to_state function whenever the visualState prop changes (controlled by parent component).
-->
<script module lang="ts">
	export interface CardClickedEvent {
		position: number;
	}
	export type VisualState = 'face-down' | 'face-up' | 'matched';
</script>

<script lang="ts">
	import { animate } from 'motion';
	import img_back from '$lib/assets/card_images/card_back.png';

	let card: HTMLDivElement;
	let card_front_element: HTMLDivElement;
	let card_back_element: HTMLDivElement;
	let card_container_element: HTMLButtonElement;

	/**
	 * Props interface for the Card component.
	 *
	 * @property {string} card_front - The image or content displayed on the front of the card.
	 * @property {VisualState} visualState - The current visual state of the card (e.g., face-up, face-down).
	 * @property {number} position - The position or index of the card in the game grid.
	 * @property {boolean} clickable - Indicates whether the card is clickable or not.
	 * @property {(e: CardClickedEvent) => void} [onCardClicked] - Optional callback function that is triggered when the card is clicked.
	 */
	interface Props {
		card_front: string;
		visualState: VisualState;
		position: number;
		clickable: boolean;
		onCardClicked?: (e: CardClickedEvent) => void;
	}
	let {
		card_front,
		visualState = 'face-down',
		position,
		clickable,
		onCardClicked
	}: Props = $props();

	const handleClick = () => {
		onCardClicked?.({ position });
	};

	$effect(() => {
		animate_to_state(visualState);
	});
	function animate_to_state(visualState: VisualState) {
		switch (visualState) {
			case 'face-down':
				animate(card, {
					rotateY: 0
				});
				animate(card_front_element, {
					transform: 'translateZ(-2px)' // support for Android/mobile
				});
				animate(card_back_element, {
					transform: 'translateZ(2px)' // support for Android/mobile
				});
				break;
			case 'face-up':
				animate(card, {
					rotateY: 180
				});
				break;
			case 'matched':
				animate(
					card,
					{
						rotateY: 180,
						scale: [1, 0.8, 1.2, 1]
					},
					{
						duration: 0.5,
						easing: 'ease-in-out'
					}
				);
		}
	}
</script>

<div class={clickable ? 'transition-transform hover:scale-110' : ''}>
	<button
		class={'card_container transition-duration-1000 transition-all' +
			(visualState === 'matched' ? ' opacity-50' : '')}
		onclick={handleClick}
		bind:this={card_container_element}
		disabled={!clickable}
	>
		<div class={'card ' + ' rounded-lg shadow-lg'} bind:this={card}>
			<div class="card_front overflow-hidden rounded-lg">
				<img src={card_front} alt="front" class="h-4/5 w-4/5" bind:this={card_front_element} />
			</div>
			<div class="card_back overflow-hidden rounded-lg" bind:this={card_back_element}>
				<img src={img_back} alt="back" class="h-3/4 w-3/4" />
			</div>
		</div>
	</button>
</div>

<style>
	.card_container {
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	.card {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		/* Support for iOS/Safari */
		-webkit-transform-style: preserve-3d;
	}
	.card_front,
	.card_back {
		position: absolute;
		height: 100%;
		width: 100%;
		backface-visibility: hidden;
		/* Support for iOS/Safari */
		-webkit-backface-visibility: hidden;
		background-color: white;
		/* image should be 50% and centered */
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card_front {
		transform: rotateY(180deg);
		/* Support for iOS/Safari */
		-webkit-transform: rotateY(180deg);
	}
</style>
