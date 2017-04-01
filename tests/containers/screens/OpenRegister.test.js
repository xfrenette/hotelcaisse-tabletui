import { observable, autorun } from 'mobx';
import Decimal from 'decimal.js';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';
import Business from 'hotelcaisse-app/dist/business/Business';
import OpenRegister from 'containers/screens/OpenRegister';

jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let openRegister;
let localizer;
let router;
let business;

beforeEach(() => {
	localizer = {
		t: () => {},
	};
	router = {
		replace: () => {},
	};
	business = new Business();

	// wrappedComponent since the class uses @inject and we want the original component
	openRegister = new OpenRegister.wrappedComponent({ localizer, router, business });
	openRegister.componentWillMount();
});

describe('onOpen()', () => {
	test('sets business.deviceRegister', () => {
		const employee = 'test-employee';
		const amount = 100.23;

		openRegister.onOpen(employee, new Decimal(amount));

		expect(business.deviceRegister).toBeInstanceOf(Register);
		expect(business.deviceRegister.employee).toBe(employee);
		expect(business.deviceRegister.openingCash.toNumber()).toBe(amount);
	});

	test('redirects to home', () => {
		router.replace = jest.fn();
		openRegister.onOpen('test', new Decimal(123));
		expect(router.replace).toHaveBeenCalledWith('/');
	});
});

describe('listenToRegisterState', () => {
	test('cancels if register state changes outside', (done) => {
		router.replace = (path) => {
			expect(path).toBe('/');
			done();
		};

		// We change the state of the Register outside the component and it should automatically
		// initiate a "cancel" (redirect)
		const register = new Register();
		register.open('orig-employee', new Decimal(1));
		business.deviceRegister = register;
	});

	test('cancels immediately if the register was opened BEFORE', (done) => {
		const register = new Register();
		register.open('orig-employee', new Decimal(1));
		business.deviceRegister = register;
		router.replace = (path) => {
			expect(path).toBe('/');
			done();
		};

		openRegister = new OpenRegister.wrappedComponent({ localizer, router, business });
		openRegister.componentWillMount();
	});
});
