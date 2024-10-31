<script module lang="ts">
	export interface CardClickedEvent {
		position: number;
	}
	export type VisualState = 'face-down' | 'face-up' | 'matched';
</script>

<script lang="ts">
	import { animate } from 'motion';

	let card: HTMLDivElement;
	let card_container: HTMLButtonElement;

	const img_back = '/src/lib/assets/card_images/card_back.png';

	interface Props {
		card_front: string;
		visualState: VisualState;
		position: number;
		onCardClicked?: (e: CardClickedEvent) => void;
	}
	let {
		card_front = '/src/lib/assets/card_images/1.png',
		visualState = 'face-down',
		position,
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
						scale: [1.2, 1]
					},
					{
						duration: 0.5,
						easing: 'ease-in-out'
					}
				);
				animate(
					card_container,
					{
						filter: ['grayscale(0%)', 'grayscale(100%)']
					},
					{
						duration: 1,
						easing: 'ease-in-out'
					}
				);
		}
	}
</script>

<button class={'card_container '} onclick={handleClick} bind:this={card_container}>
	<div class={'card ' + ' rounded-lg shadow-lg'} bind:this={card}>
		<div class="card_front overflow-hidden rounded-lg">
			<img src={card_front} alt="front" class="h-4/5 w-4/5" />
		</div>
		<div class="card_back overflow-hidden rounded-lg">
			<img src={img_back} alt="back" class="h-3/4 w-3/4" />
		</div>
	</div>
</button>

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
	}
	.card_front,
	.card_back {
		position: absolute;
		height: 100%;
		width: 100%;
		backface-visibility: hidden;
		background-color: white;
		/* image should be 50% and centered */
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card_front {
		transform: rotateY(180deg);
	}
</style>
