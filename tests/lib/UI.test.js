import { autorun } from 'mobx';
import UI, { STATES } from 'lib/UI';
import TestAuth from '../mock/TestAuth';

let ui;
let disposer;

beforeEach(() => {
	ui = new UI();

	if (disposer) {
		disposer();
		disposer = null;
	}
});

describe('constructor()', () => {
	test('sets auth if present', () => {
		const auth = new TestAuth();
		ui = new UI({ auth });
		expect(ui.auth).toBe(auth);
	});

	test('sets uuidGenerator if present', () => {
		const uuidGenerator = { generate: () => {} };
		ui = new UI({ uuidGenerator });
		expect(ui.uuidGenerator).toBe(uuidGenerator);
	});

	test('sets logger if present', () => {
		const logger = { log: () => {} };
		ui = new UI({ logger });
		expect(ui.logger).toBe(logger);
	});

	test('sets Localizer', () => {
		const locale = 'fr-CA';
		const strings = { 'fr-CA': { a: 'b' } };
		ui = new UI({ locale, strings });
		expect(ui.localizer.locale).toBe(locale);
		expect(ui.localizer.t('a')).toBe('b');
	});

	test('sets ordersServer if present', () => {
		const ordersServer = {};
		ui = new UI({ ordersServer });
		expect(ui.ordersServer).toBe(ordersServer);
	});
});

describe('state', () => {
	test('is observable', (done) => {
		const newValue = 'test';
		autorun(() => {
			if (ui.state === newValue) {
				done();
			}
		});
		ui.state = newValue;
	});
});

describe('startLoading()', () => {
	test('sets state to "loading" at first', () => {
		ui.appLoadingPromise = new Promise((resolve) => {
			setTimeout(resolve, 200);
		});
		ui.startLoading();
		expect(ui.state).toBe(STATES.LOADING);
	});

	test('sets state to "ready" when finished', (done) => {
		ui.appLoadingPromise = Promise.resolve();
		ui.startLoading().then(() => {
			expect(ui.state).toBe(STATES.READY);
			done();
		});
	});
});

describe('getStores()', () => {
	test('contains UI itself', () => {
		expect(ui.getStores().ui).toBe(ui);
	});

	test('contains router', () => {
		ui.initRouter();
		expect(ui.getStores().router).toBe(ui.router);
	});

	test('contains auth', () => {
		ui.initRouter();
		expect(ui.getStores().auth).toBe(ui.auth);
	});

	test('contains localizer', () => {
		expect(ui.getStores().localizer).toBe(ui.localizer);
	});

	test('contains business', () => {
		ui.app = { business: { test: true } };
		expect(ui.getStores().business).toBe(ui.app.business);
	});

	test('contains register', () => {
		ui.app = { register: { test: true } };
		expect(ui.getStores().register).toBe(ui.app.register);
	});

	test('contains uuidGenerator', () => {
		ui.uuidGenerator = { generate: () => {} };
		expect(ui.getStores().uuidGenerator).toBe(ui.uuidGenerator);
	});

	test('contains logger', () => {
		ui.logger = { log: () => {} };
		expect(ui.getStores().logger).toBe(ui.logger);
	});

	test('contains ordersServer', () => {
		ui.ordersServer = {};
		expect(ui.getStores().ordersServer).toBe(ui.ordersServer);
	});
});
