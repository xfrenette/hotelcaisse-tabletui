import Decimal from 'decimal.js';
import Register from 'hotelcaisse-app/dist/business/Register';
import Business from 'hotelcaisse-app/dist/business/Business';
import CloseRegister from 'containers/screens/CloseRegister';
import UI from 'lib/UI';

jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let closeRegister;
let localizer;
let router;
let ui;
let business;
let register;

beforeEach(() => {
	localizer = {
		t: () => {},
	};
	router = {
		replace: () => {},
	};
	ui = new UI();
	business = new Business();
	register = new Register();
	register.open('Test', new Decimal(100));

	// wrappedComponent since the class uses @inject and we want the original component
	closeRegister = new CloseRegister.wrappedComponent({ localizer, router, business, register, ui });
});

describe('onClose()', () => {
	test('calls register.close with correct values', () => {
		const amount = new Decimal(321.23);
		const POSTRef = '123-456';
		const POSTAmount = new Decimal(123.45);

		closeRegister.onClose(amount, POSTRef, POSTAmount);

		expect(register.POSTRef).toBe(POSTRef);
		expect(register.POSTAmount).toEqual(POSTAmount);
		expect(register.closingCash).toEqual(amount);
	});

	test('redirects to home', () => {
		router.replace = jest.fn();
		closeRegister.onClose(new Decimal(123), 'test', new Decimal(123));
		expect(router.replace).toHaveBeenCalledWith('/');
	});
});
