import 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import NumberInput from 'components/elements/NumberInput';

jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let numberInput;
let localizer;
const baseValue = 5;

beforeEach(() => {
	localizer = new Localizer('fr-CA', 'CAD');
	numberInput = new NumberInput({ value: baseValue, localizer });
});

describe('getDecimalSeparator()', () => {
	test('returns localized separator', () => {
		expect(numberInput.getDecimalSeparator()).toBe(localizer.getDecimalSeparator());
	});

	test('returns dot if no localizer', () => {
		numberInput.props.localizer = null;
		expect(numberInput.getDecimalSeparator()).toBe('.');
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
		const expected = 1234;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('returns negative if starts with "-"', () => {
		const value = '-1234';
		const expected = -1234;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('ignores following "-" if starts with "-"', () => {
		const values = ['--1234', '-1 2-34'];
		const expected = -1234;

		values.forEach((value) => {
			expect(numberInput.parseValue(value)).toBe(expected);
		});
	});

	test('returns null if no number', () => {
		const values = [' ', '', 'hello', '-', ',', null];

		values.forEach((value) => {
			expect(numberInput.parseValue(value)).toBeNull();
		});
	});

	test('works with decimal separator', () => {
		const value = '12,345';
		const expected = 12.345;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('only keeps last decimal separator', () => {
		const value = '1012,34,56';
		const expected = 101234.56;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('ignores last decimal if last character', () => {
		const value = '12,34,';
		const expected = 1234;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	test('uses dot as decimal separator if no localizer', () => {
		numberInput.props.localizer = null;
		const value = '12.34';
		const expected = 12.34;

		expect(numberInput.parseValue(value)).toBe(expected);
	});

	// The default decimal separator is '.' and it is used in different regular expression. This test
	// ensures it works as expected.
	test('If no localizer, escapes the "."', () => {
		numberInput.props.localizer = null;
		const value = '66';
		const expected = 66;

		expect(numberInput.parseValue(value)).toBe(expected);
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
		numberInput.props.localizer = null;
		const value = -5567.23;
		const expected = '-5567.23';
		expect(numberInput.formatValue(value)).toBe(expected);
	});
});

describe('formatValueUsingModel()', () => {
	test('works with simple numbers', () => {
		const model = '5034';
		const value = 123;
		const expected = '123';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);
	});

	test('adds trailing zeros', () => {
		let model = '1,30200';
		let value = 21.302;
		let expected = '21,30200';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);

		model = '1,00';
		value = 12;
		expected = '12,00';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);
	});

	test('returns minus if only char', () => {
		const model = '-';
		const value = null;
		const expected = '-';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);
	});

	test('keeps trailing decimal separator', () => {
		const model = '1 234,';
		const value = 23;
		const expected = '23,';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);
	});

	test('prepends with 0 if only a decimal separator', () => {
		const model = ',';
		const value = null;
		const expected = '0,';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);
	});

	test('keeps negative zero', () => {
		const model = '-0,0';
		const value = 0;
		const expected = '-0,0';
		expect(numberInput.formatValueUsingModel(value, model)).toBe(expected);
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
