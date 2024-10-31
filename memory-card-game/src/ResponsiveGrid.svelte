<!--

    ResponsiveGrid.svelte

    This component creates a responsive grid layout that adjusts the number of columns based on the number of items and the screen's aspect ratio.
    Tries to minimize empty space.

    Props:
    - num_items (number): The number of items to be displayed in the grid.
    - children (function): A function that returns the children elements to be rendered inside the grid.

    Variables:
    - cols (number): The number of columns in the grid, initially set to 4.

    Functions:
    - getAspectRatio(): Calculates the aspect ratio of the screen.
    - getCols(gridItems: number, aspectRatio: number): Calculates the optimal number of columns based on the number of grid items and the screen's aspect ratio.

    Lifecycle:
    - onMount: Sets the initial number of columns based on the number of items and the screen's aspect ratio. Adds an event listener to recalculate the number of columns whenever the screen is resized.

    Styles:
    - .responsive-gap: Adds a gap of 4% between grid items.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	interface Props {
		num_items: number;
		children?: () => any;
	}

	/**
	 * Props for the ResponsiveGrid component.
	 *
	 * @property {number} num_items - The number of items to be displayed in the grid.
	 * @property {any} children - The child elements to be rendered within the grid (may be put in slot).
	 */
	let { num_items, children }: Props = $props();

	let cols = $state(4);

	onMount(() => {
		cols = getCols(num_items, getAspectRatio());
		//whenever the screen is resized, recalculate the number of cols
		window.addEventListener('resize', () => {
			cols = getCols(num_items, getAspectRatio());
		});
	});

	//function to calculate aspect ratio of screen
	function getAspectRatio() {
		if (browser === undefined) return 1;
		if (window === undefined) return 1;
		return window.innerWidth / window.innerHeight;
	}

	//function to calculate optimal num of cols depending on number of grid items, based on screen aspect ratio
	function getCols(gridItems: number, aspectRatio: number) {
		const aspectRatioMultiplier = 1 / aspectRatio;
		const cols = Math.ceil(Math.sqrt(gridItems / aspectRatioMultiplier));
		return cols;
	}
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div
		class="responsive-gap h-11/12 grid w-11/12 max-w-screen-2xl"
		style={`grid-template-columns: repeat(${cols}, 1fr);`}
	>
		{@render children?.()}
	</div>
</div>

<style>
	.responsive-gap {
		gap: 4%;
	}
</style>
