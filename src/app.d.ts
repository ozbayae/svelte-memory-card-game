// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('should have a test to supress failed test file'),
		() => {
			expect(true).toBe(true);
		};
}
