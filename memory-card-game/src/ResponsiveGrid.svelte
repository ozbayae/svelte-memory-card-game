<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	interface Props {
		num_items: number;
		children?: () => any;
	}
	let { num_items, children }: Props = $props();

	let cols = $state(8);

	onMount(() => {
		cols = getCols(num_items, getAspectRatio());
		//whenever the screen is resized, recalculate the number of cols
		window.addEventListener('resize', () => {
			cols = getCols(16, getAspectRatio());
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
	<div class="h-11/12 grid w-11/12 gap-4" style={`grid-template-columns: repeat(${cols}, 1fr);`}>
		{@render children?.()}
	</div>
</div>
