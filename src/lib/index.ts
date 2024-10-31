// place files you want to import through the `$lib` alias in this folder.
if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('should have a test to supress failed test file'),
		() => {
			expect(true).toBe(true);
		};
}
