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

beforeEach(() => {
	localizer = {
		t: () => {},
	};
	router = {
		replace: () => {},
	};
	ui = new UI();
	business = new Business();
	business.deviceRegister = new Register();
	business.deviceRegister.open('Test', new Decimal(100));

	// wrappedComponent since the class uses @inject and we want the original component
	closeRegister = new CloseRegister.wrappedComponent({ localizer, router, business, ui });
});

describe('onClose()', () => {
	test('calls register.close with correct values', () => {
		const amount = new Decimal(321.23);
		const POSTRef = '123-456';
		const POSTAmount = new Decimal(123.45);

		closeRegister.onClose(amount, POSTRef, POSTAmount);

		expect(business.deviceRegister.POSTRef).toBe(POSTRef);
		expect(business.deviceRegister.POSTAmount).toEqual(POSTAmount);
		expect(business.deviceRegister.closingCash).toEqual(amount);
	});

	test('redirects to home', () => {
		router.replace = jest.fn();
		closeRegister.onClose(new Decimal(123), 'test', new Decimal(123));
		expect(router.replace).toHaveBeenCalledWith('/');
	});

	test('shows alert if in error', () => {
		ui.showErrorAlert = jest.fn();
		closeRegister.onClose(new Decimal(-5), '', new Decimal(-5));
		expect(ui.showErrorAlert).toHaveBeenCalled();
	});
});

describe('validateValues()', () => {
	test('returns false if amount is not Decimal or negative', () => {
		const POSTRef = 'test-ref';
		const POSTAmount = new Decimal(123);
		[null, 5, new Decimal(-3)].forEach((amount) => {
			expect(closeRegister.validateValues(amount, POSTRef, POSTAmount)).toBe(false);
		});
	});

	test('returns false if POSTAmount is not Decimal or negative', () => {
		const POSTRef = 'test-ref';
		const amount = new Decimal(123);
		[null, 5, new Decimal(-3)].forEach((POSTAmount) => {
			expect(closeRegister.validateValues(amount, POSTRef, POSTAmount)).toBe(false);
		});
	});

	test('returns false if no POSTRef', () => {
		const amount = new Decimal(3);
		const POSTAmount = new Decimal(123);
		['', null, ' '].forEach((POSTRef) => {
			expect(closeRegister.validateValues(amount, POSTRef, POSTAmount)).toBe(false);
		});
	});

	test('returns true if all valid', () => {
		const employee = 'test-employee';
		const amount = new Decimal(12.34);
		const POSTAmount = new Decimal(34.56);
		expect(closeRegister.validateValues(amount, employee, POSTAmount)).toBe(true);
	});
});
