import Decimal from 'decimal.js';
import Business from 'hotelcaisse-app/dist/business/Business';
import ManageRegister from 'containers/screens/ManageRegister';
import UI from 'lib/UI';
import TestUUIDGenerator from '../../mock/TestUUIDGenerator';

jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let manageRegister;
let localizer;
let router;
let business;
let ui;

beforeEach(() => {
	localizer = {
		t: () => {},
	};
	router = {
		replace: () => {},
	};
	business = new Business();
	ui = new UI();

	// wrappedComponent since the class uses @inject and we want the original component
	manageRegister = new ManageRegister.wrappedComponent({ localizer, router, business, ui });
	manageRegister.componentWillMount();
});

describe('createCashMovement()', () => {
	test('generates a UUID', () => {
		const uuid = 'test-uuid';
		const generator = new TestUUIDGenerator();
		generator.staticValue = uuid;
		manageRegister.props.uuidGenerator = generator;

		const res = manageRegister.createCashMovement('test-description', new Decimal(12));
		expect(res.uuid).toBe(uuid);
	});
});
