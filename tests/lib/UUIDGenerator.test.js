import UUIDGenerator from 'lib/UUIDGenerator';

test('generates string', () => {
	const generator = new UUIDGenerator();
	const res = generator.generate();
	expect(typeof res).toBe('string');
	expect(res.length).toBe(36);
});
