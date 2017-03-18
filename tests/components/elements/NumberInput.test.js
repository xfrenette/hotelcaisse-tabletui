import 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import NumberInput from 'components/elements/NumberInput';

/*
Tests qui marchent pas:
	- Rajouter un chiffre en plein milieu quand il y a déjà une espace.
	  Ex: la valeur actuelle du champ est '5 123' et, avec le curseur, je veux
	  rajouter un '4' après le '1', donc ça devient '5 1423', mais le parseNumber
	  ne fonctionne pas.
	- Aussi, ça "glitch" quand on écrit une valeur qui ne se peut pas
	- Quand j'ai '1,2' et que j'efface le '2', la virgule disparaît aussi
 */

let numberInput;
const localizer = new Localizer('fr-CA');
const baseValue = 5;

beforeEach(() => {
	numberInput = new NumberInput({ value: baseValue, localizer });
});

describe('getValue()', () => {
	test('returns value', () => {
		expect(numberInput.getValue()).toBe(baseValue);
	});

	test('returns 0 if falsy', () => {
		const values = [null, undefined, 0];
		values.forEach((value) => {
			numberInput.props.value = value;
			expect(numberInput.getValue()).toBe(0);
		});
	});
});

describe('adjustValue()', () => {
	test('increments with "more"', () => {
		const expected = baseValue + 1;
		numberInput.props.onChangeValue = jest.fn();
		numberInput.adjustValue('more');
		expect(numberInput.props.onChangeValue).toHaveBeenCalledWith(expected);
	});

	test('decrements with "less"', () => {
		const expected = baseValue - 1;
		numberInput.props.onChangeValue = jest.fn();
		numberInput.adjustValue('less');
		expect(numberInput.props.onChangeValue).toHaveBeenCalledWith(expected);
	});
});

describe('processDanglingDecimalSeparator()', () => {
	beforeEach(() => {
		numberInput.setState = jest.fn();
	});

	test('sets danglingDecimalSeparator = true if dangling separator', () => {
		numberInput.processDanglingDecimalSeparator('12,');
		expect(numberInput.setState).toHaveBeenCalledWith({ danglingDecimalSeparator: true });
	});

	test('does not call setState() if not required', () => {
		numberInput.state.danglingDecimalSeparator = true;
		numberInput.processDanglingDecimalSeparator('12,');
		numberInput.state.danglingDecimalSeparator = false;
		numberInput.processDanglingDecimalSeparator('12');
		expect(numberInput.setState).not.toHaveBeenCalled();
	});

	test('sets danglingDecimalSeparator = false if no separator', () => {
		numberInput.state.danglingDecimalSeparator = true;
		numberInput.processDanglingDecimalSeparator('12');
		expect(numberInput.setState).toHaveBeenCalledWith({ danglingDecimalSeparator: false });
	});

	test('sets danglingDecimalSeparator = false if separator not dangling', () => {
		numberInput.state.danglingDecimalSeparator = true;
		numberInput.processDanglingDecimalSeparator('12,5');
		expect(numberInput.setState).toHaveBeenCalledWith({ danglingDecimalSeparator: false });
	});

	test('sets danglingDecimalSeparator = false if multiple separator', () => {
		numberInput.state.danglingDecimalSeparator = true;
		numberInput.processDanglingDecimalSeparator('12,5,');
		expect(numberInput.setState).toHaveBeenCalledWith({ danglingDecimalSeparator: false });
	});

	test('returns string without dangling', () => {
		expect(numberInput.processDanglingDecimalSeparator('12,')).toBe('12');
		expect(numberInput.processDanglingDecimalSeparator('12,5')).toBe('12,5');
		expect(numberInput.processDanglingDecimalSeparator('12,5,')).toBe('12,5,');
	});

	test('refuses dangling separator if maxDecimals is 0', () => {
		numberInput.props.maxDecimals = 0;
		const res = numberInput.processDanglingDecimalSeparator('12,');
		expect(numberInput.setState).not.toHaveBeenCalled();
		expect(res).toBe('12');
	});
});

describe('processDecimalDigits()', () => {
	test('set minDecimalDigits in state', () => {
		numberInput.setState = jest.fn();
		numberInput.state.minDecimalDigits = 10;
		numberInput.processDecimalDigits('8 345');
		expect(numberInput.setState).toHaveBeenLastCalledWith({ minDecimalDigits: 0 });
		numberInput.processDecimalDigits('8 345,000');
		expect(numberInput.setState).toHaveBeenLastCalledWith({ minDecimalDigits: 3 });
		numberInput.processDecimalDigits('444,6700');
		expect(numberInput.setState).toHaveBeenLastCalledWith({ minDecimalDigits: 4 });
		numberInput.processDecimalDigits('0,05678');
		expect(numberInput.setState).toHaveBeenLastCalledWith({ minDecimalDigits: 5 });
	});

	test('works if no decimals', () => {
		numberInput.setState = jest.fn();
		numberInput.state.minDecimalDigits = 10;
		numberInput.processDecimalDigits('456');
		expect(numberInput.setState).toHaveBeenCalledWith({ minDecimalDigits: 0 });
	});

	test('does not call setState if not necessary', () => {
		numberInput.setState = jest.fn();
		numberInput.state.minDecimalDigits = 3;
		numberInput.processDecimalDigits('5,670');
		expect(numberInput.setState).not.toHaveBeenCalled();
	});
});

describe('limitDecimals()', () => {
	test('limits decimals with maxDecimals', () => {
		numberInput.props.maxDecimals = 3;
		expect(numberInput.limitDecimals('3 456')).toBe('3 456');
		expect(numberInput.limitDecimals('3 456,12')).toBe('3 456,12');
		expect(numberInput.limitDecimals('3 456,123')).toBe('3 456,123');
		expect(numberInput.limitDecimals('3 456,1234')).toBe('3 456,123');
	});

	test('allows only integer if maxDecimals = 0', () => {
		numberInput.props.maxDecimals = 0;
		expect(numberInput.limitDecimals('3 456')).toBe('3 456');
		expect(numberInput.limitDecimals('3 456,12')).toBe('3 456');
	});
});

describe('parseNumber()', () => {
	test('returns null if falsy or NaN', () => {
		const values = ['', null, undefined, '  ', 'nan'];
		values.forEach((value) => {
			expect(numberInput.parseNumber(value)).toBeNull();
		});
	});

	test('works with locale\'s format', () => {
		const values = {
			'-5 345,0': -5345,
			'-0,0': 0,
			'0,2': 0.2,
			'8888,88': 8888.88,
		};
		Object.entries(values).forEach(([value, expected]) => {
			expect(numberInput.parseNumber(value)).toBe(expected);
		});
	});
});

describe('onChangeText()', () => {
	beforeEach(() => {
		numberInput.setState = jest.fn();
	});

	test('calls onChangeValue with expected values', () => {
		const values = {
			'-3 456,76': -3456.76, // Note the special space
			'-3 456,': -3456, // Note the special space
			'1000,00': 1000,
			'0': 0,
		};
		Object.entries(values).forEach(([value, expected]) => {
			numberInput.props.onChangeValue = jest.fn();
			numberInput.onChangeText(value);
			expect(numberInput.props.onChangeValue).toHaveBeenCalledWith(expected);
		});
	});

	test('doesn\'t call again if same number', () => {
		numberInput.props.onChangeValue = jest.fn();
		numberInput.props.value = 3;
		numberInput.onChangeText('3,0');
		expect(numberInput.props.onChangeValue).not.toHaveBeenCalled();
	});

	test('calls setState if dangling decimal separator', () => {
		numberInput.onChangeText('12,');
		expect(numberInput.setState).toHaveBeenCalledWith({ danglingDecimalSeparator: true });
	});

	test('calls setState with minDecimalDigits', () => {
		numberInput.props.value = 3;
		numberInput.onChangeText('3,00');
		expect(numberInput.setState).toHaveBeenCalledWith({ minDecimalDigits: 2 });
	});

	test('limits number of decimals', () => {
		numberInput.props.onChangeValue = jest.fn();
		numberInput.props.maxDecimals = 2;
		numberInput.onChangeText('12,123');
		expect(numberInput.props.onChangeValue).toHaveBeenCalledWith(12.12);
	});

	test('ignores if invalid number', () => {
		numberInput.props.onChangeValue = jest.fn();
		// Following character is invalid, so ignore
		numberInput.onChangeText('3,5k');
		expect(numberInput.props.onChangeValue).not.toHaveBeenCalled();
	});
});

describe('formatValue()', () => {
	test('returns empty if null or undefined', () => {
		numberInput.props.value = null;
		expect(numberInput.formatValue()).toBe('');
		numberInput.props.value = undefined;
		expect(numberInput.formatValue()).toBe('');
	});

	test('returns locale formatted string', () => {
		const values = {
			'-12,5': -12.5,
			'4': 4,
			'3 456,06': 3456.06, // Note that the space is a special space
		};
		numberInput = new NumberInput({ localizer });
		Object.entries(values).forEach(([expected, value]) => {
			numberInput.props.value = value;
			expect(numberInput.formatValue()).toBe(expected);
		});
	});

	test('adds decimal separator if flag', () => {
		const value = 6;
		numberInput.props.value = value;
		numberInput.state.danglingDecimalSeparator = true;
		expect(numberInput.formatValue()).toBe(`${value},`);

		numberInput.state.danglingDecimalSeparator = false;
		expect(numberInput.formatValue()).toBe(`${value}`);
	});

	test('respects minimum number of decimals', () => {
		numberInput.props.value = 6;
		numberInput.state.minDecimalDigits = 2;
		expect(numberInput.formatValue()).toBe('6,00');
		numberInput.props.value = 6.1;
		expect(numberInput.formatValue()).toBe('6,10');
		numberInput.props.value = 6.123;
		expect(numberInput.formatValue()).toBe('6,123');
		numberInput.state.minDecimalDigits = null;
		expect(numberInput.formatValue()).toBe('6,123');
		numberInput.state.minDecimalDigits = 0;
		expect(numberInput.formatValue()).toBe('6,123');
	});

	test('respects maxDecimals', () => {
		numberInput.props.value = 6;
		numberInput.state.minDecimalDigits = 4;
		numberInput.props.maxDecimals = null;
		expect(numberInput.formatValue()).toBe('6,0000');
		numberInput.props.maxDecimals = Infinity;
		expect(numberInput.formatValue()).toBe('6,0000');
		numberInput.props.maxDecimals = 2;
		expect(numberInput.formatValue()).toBe('6,00');
		numberInput.state.minDecimalDigits = 0;
		expect(numberInput.formatValue()).toBe('6');
		numberInput.props.value = 6.3;
		numberInput.props.maxDecimals = 0;
		expect(numberInput.formatValue()).toBe('6');
	});
});

describe('componentWillReceiveProps()', () => {
	beforeEach(() => {
		numberInput.props.value = 3;
		numberInput.setState = jest.fn();
	});

	test('resets state when new value', () => {
		numberInput.state = {
			danglingDecimalSeparator: true,
			minDecimalDigits: 2,
		};
		numberInput.componentWillReceiveProps({ value: 5, localizer: numberInput.localizer });
		expect(numberInput.setState).toHaveBeenCalledWith({
			danglingDecimalSeparator: false,
			minDecimalDigits: 0,
		});
	});

	test('resets state when new maxDecimals', () => {
		numberInput.state = {
			danglingDecimalSeparator: true,
			minDecimalDigits: 2,
		};
		numberInput.componentWillReceiveProps({ maxDecimals: 3, localizer: numberInput.localizer });
		expect(numberInput.setState).toHaveBeenCalledWith({
			danglingDecimalSeparator: false,
			minDecimalDigits: 0,
		});
	});

	test('resets state when new localizer', () => {
		numberInput.state = {
			danglingDecimalSeparator: true,
			minDecimalDigits: 2,
		};
		numberInput.componentWillReceiveProps({ localizer: new Localizer('fr-CA') });
		expect(numberInput.setState).toHaveBeenCalledWith({
			danglingDecimalSeparator: false,
			minDecimalDigits: 0,
		});
	});

	test('does not update state if same props', () => {
		const baseProps = {
			value: 3,
			maxDecimals: 4,
			localizer: new Localizer('fr-CA'),
		};
		numberInput.props = baseProps;
		numberInput.componentWillReceiveProps(baseProps);
		expect(numberInput.setState).not.toHaveBeenCalled();
	});
});
