import { flattenRoutes } from 'lib/routesBuilder';

describe('flattenRoutes()', () => {
	test('flattens route objects', () => {
		const routes = [
			{ a: 'a' },
			{
				routes: [
					{ b: 'b' },
					{ c: 'c' },
					{
						routes: [
							{ d: 'd' },
						],
					},
				],
			},
		];
		const expected = [
			{ a: 'a' },
			{ b: 'b' },
			{ c: 'c' },
			{ d: 'd' },
		];
		expect(flattenRoutes(routes)).toEqual(expected);
	});

	test('accumulates guards', () => {
		const g1 = { ga: 'ga' };
		const g2 = { gb: 'gb' };
		const g3 = { gc: 'gc' };
		const g4 = { gd: 'gd' };
		const routes = [
			{ a: 'a' },
			{
				guards: [g1],
				routes: [
					{ b: 'b' },
					{ c: 'c', guards: [g2] },
					{
						guards: [g3],
						routes: [
							{ d: 'd', guards: [g4] },
						],
					},
				],
			},
			{
				guards: [g3],
				routes: [
					{ e: 'e' },
				],
			}
		];
		const expected = [
			{ a: 'a' },
			{ b: 'b', guards: [g1] },
			{ c: 'c', guards: [g1, g2] },
			{ d: 'd', guards: [g1, g3, g4] },
			{ e: 'e', guards: [g3] },
		];
		expect(flattenRoutes(routes)).toEqual(expected);
	});
});
