import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{js,ts}']
	},
	define: {
		'import.meta.vitest': 'undefined'
	}
});
