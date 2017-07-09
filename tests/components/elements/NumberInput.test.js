import 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import NumberInput from 'components/elements/numberInput/NumberInput';

jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let numberInput;
let localizer;
const baseValue = 5;

beforeEach(() => {
	localizer = new Localizer('fr-CA', 'CAD');
	numberInput = new NumberInput({ value: baseValue, localizer });
	numberInput.componentWillMount();
});

describe('saveDecimalSeparator()', () => {
	test('returns localized separator', () => {
		numberInput.saveDecimalSeparator(localizer);
		expect(numberInput.decimalSeparator).toBe(localizer.getDecimalSeparator());
	});

	test('returns dot if no localizer', () => {
		numberInput.saveDecimalSeparator(null);
		expect(numberInput.decimalSeparator).toBe('.');
	});
});

describe('parseValue()', () => {
	test('works with numbers only', () => {
		const value = '123';
		const expected = 123;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('ignores non-number', () => {
		const value = ' 1x234 é';
		const expected = 1;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('returns negative if starts with "-"', () => {
		const value = '-1234';
		const expected = -1234;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('only keeps the valid number at beginning', () => {
		const values = ['-1234.x', '-1234 5', '-1234,0.4'];
		const expected = -1234;

		values.forEach((value) => {
			expect(numberInput.parseValue(value)).toBe(expected);
		});
	});

	test('returns null if no number', () => {
		const values = [' ', '', 'hello', '-', ',', '--', null];

		values.forEach((value) => {
			expect(numberInput.parseValue(value)).toBeNull();
		});
	});

	test('works with decimal separator', () => {
		const value = '12,345';
		const expected = 12.345;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('ignores last decimal if last character', () => {
		const value = '12,34,';
		const expected = 12.34;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('uses dot as decimal separator if no localizer', () => {
		numberInput.saveDecimalSeparator(null);
		const value = '12.34';
		const expected = 12.34;

		expect(numberInput.parseValue(value)).toBe(expected);
	});
});

describe('textIsValid()', () => {
	test('returns true for null', () => {
		expect(numberInput.textIsValid(null)).toBe(true);
	});

	test('returns true if only a minus', () => {
		expect(numberInput.textIsValid('-')).toBe(true);
	});

	test('returns true if single leading 0', () => {
		const values = ['0', '-0', '0,', '-0,'];
		values.forEach((value) => {
			expect(numberInput.textIsValid(value)).toBe(true);
		});
	});

	test('returns false if more than one leading 0', () => {
		const values = ['00', '-00', '00,', '-00,'];
		values.forEach((value) => {
			expect(numberInput.textIsValid(value)).toBe(false);
		});
	});

	test('returns true if trailing 0 after separator', () => {
		const values = ['0,0', '-0,00', '0,00', '-0,000'];
		values.forEach((value) => {
			expect(numberInput.textIsValid(value)).toBe(true);
		});
	});

	test('returns false for other invalid strings', () => {
		const values = ['--', ' 1', '1.2.3', '1x', 'x2'];
		values.forEach((value) => {
			expect(numberInput.textIsValid(value)).toBe(false);
		});
	});

	// Since the method uses a regular expression and in some languages the decimal separator is the
	// dot, which has a specific meaning in regular expression, this tests ensures the dot is
	// considered a real dot, not 'any character'. Ex : if the decimal separator is '.', the
	// following could be considered valid "12,23" if the regular expression is:
	//  /[0-9]+${ds}[0-9]+/ where ${ds} would be replaced by '.'
	test('escapes the dot', () => {
		numberInput.saveDecimalSeparator(null);
		expect(numberInput.textIsValid('12,34')).toBe(false);
	});
});

describe('formatValue()', () => {
	test('uses localizer', () => {
		const value = 1234.56;
		const expected = '1234,56';
		expect(numberInput.formatValue(value)).toBe(expected);
	});

	test('returns empty string if null value', () => {
		const value = null;
		const expected = '';
		expect(numberInput.formatValue(value)).toBe(expected);
	});

	test('works with simple numbers', () => {
		const value = 4;
		const expected = '4';
		expect(numberInput.formatValue(value)).toBe(expected);
	});

	test('works with negative numbers', () => {
		const value = -5.23;
		const expected = '-5,23';
		expect(numberInput.formatValue(value)).toBe(expected);
	});

	test('works without a localizer', () => {
		numberInput.saveDecimalSeparator(null);
		const value = -5567.23;
		const expected = '-5567.23';
		expect(numberInput.formatValue(value)).toBe(expected);
	});
});

describe('getTextInputPreText()', () => {
	test('returns nothing if type is not "money"', () => {
		expect(numberInput.getTextInputPreText()).toBe('');
	});

	test('returns nothing if a locale without pre money symbol', () => {
		numberInput.props.type = 'money';
		expect(numberInput.getTextInputPreText()).toBe('');
	});

	test('returns currency symbol if a locale with pre money symbol', () => {
		localizer.setLocale('en');
		numberInput.props.type = 'money';
		expect(numberInput.getTextInputPreText()).toBe('CA$');
	});
});

describe('getTextInputPostText()', () => {
	test('returns nothing if type is not "money"', () => {
		expect(numberInput.getTextInputPostText()).toBe('');
	});

	test('returns nothing if a locale without post money symbol', () => {
		localizer.setLocale('en');
		numberInput.props.type = 'money';
		expect(numberInput.getTextInputPostText()).toBe('');
	});

	test('returns currency symbol if a locale with post money symbol', () => {
		numberInput.props.type = 'money';
		expect(numberInput.getTextInputPostText()).toBe('$');
	});
});
