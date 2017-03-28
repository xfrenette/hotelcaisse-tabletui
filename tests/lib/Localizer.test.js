import Localizer from 'lib/Localizer';

let localizer;
const strings = {
	string: 'test-string',
	group: {
		string: 'test-group-string',
		group: {
			string: 'test-group-group-string',
		},
	},
};

beforeEach(() => {
	localizer = new Localizer();
	localizer.locale = 'fr-CA';
	localizer.setStrings('fr-CA', strings);
});

describe('t()', () => {
	test('works with a single level', () => {
		expect(localizer.t('string')).toBe(strings.string);
	});

	test('returns path if non-existing', () => {
		[
			'nonExisting',
			'group.nonExisting',
			'group.string.nonExisting'
		].forEach((path) => {
			expect(localizer.t(path)).toBe(path);
		});
	});

	test('works multi-level', () => {
		expect(localizer.t('group.string')).toBe(strings.group.string);
		expect(localizer.t('group.group.string')).toBe(strings.group.group.string);
	});

	test('uses locale', () => {
		const enStrings = {
			group: {
				string: 'test-en-string',
			}
		};
		localizer.setStrings('en-CA', enStrings);
		// Before we change the locale
		expect(localizer.t('group.string')).toBe(strings.group.string);
		// Change locale
		localizer.locale = 'en-CA';
		expect(localizer.t('group.string')).toBe(enStrings.group.string);
		// Change locale to non-existent
		localizer.locale = 'xx-XX';
		expect(localizer.t('group.string')).toBe('group.string');
	});

	test('doesn\'t crash if no locale', () => {
		localizer = new Localizer();
		expect(localizer.t('group.string')).toBe('group.string');
	});
});
