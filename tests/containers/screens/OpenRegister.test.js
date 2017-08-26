import Decimal from 'decimal.js';
import Register from 'hotelcaisse-app/dist/business/Register';
import OpenRegister from 'containers/screens/OpenRegister';
import UI from 'lib/UI';
import TestUUIDGenerator from '../../mock/TestUUIDGenerator';

jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let openRegister;
let localizer;
let router;
let register;
let ui;
const uuidGenerator = new TestUUIDGenerator();

beforeEach(() => {
	localizer = {
		t: () => {},
	};
	router = {
		replace: () => {},
	};
	register = new Register();
	ui = new UI();

	// wrappedComponent since the class uses @inject and we want the original component
	openRegister = new OpenRegister.wrappedComponent({ localizer, router, register, ui, uuidGenerator });
	openRegister.componentWillMount();
});

describe('onOpen()', () => {
	test('sets register props', () => {
		const employee = 'test-employee';
		const amount = 100.23;

		openRegister.onOpen(employee, new Decimal(amount));

		expect(register.employee).toBe(employee);
		expect(register.openingCash.toNumber()).toBe(amount);
	});

	test('redirects to home', () => {
		router.replace = jest.fn();
		openRegister.onOpen('test', new Decimal(123));
		expect(router.replace).toHaveBeenCalledWith('/');
	});
});
