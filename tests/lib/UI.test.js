import { autorun } from 'mobx';
import UI, { STATES } from 'lib/UI';
import TestLoader from '../mock/TestLoader';
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
	test('sets routes only if present', () => {
		ui = new UI();
		expect(ui.routes).toEqual([]);
		const routes = [{ test: true }];
		ui = new UI({ routes });
		expect(ui.routes).toEqual(routes);
	});

	test('sets loader only if present', () => {
		ui = new UI();
		expect(ui.loader).toBeNull();
		const loader = new TestLoader();
		ui = new UI({ loader });
		expect(ui.loader).toBe(loader);
	});

	test('sets auth if present', () => {
		const auth = new TestAuth();
		ui = new UI({ auth });
		expect(ui.auth).toBe(auth);
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
	test('sets state to "ready" if no loader', () => {
		ui.start();
		expect(ui.state).toBe(STATES.READY);
	});

	test('sets state to "loading" if loader', () => {
		ui.loader = new TestLoader(false);
		ui.start();
		expect(ui.state).toBe(STATES.LOADING);
	});

	test('calls loader start()', () => {
		const loader = new TestLoader(false);
		loader.start = jest.fn();
		ui.loader = loader;
		ui.start();
		expect(loader.start).toHaveBeenCalled();
	});

	test('sets state when loader loads', (done) => {
		const loader = new TestLoader(true);
		disposer = autorun(() => {
			if (ui.state === STATES.READY) {
				done();
			}
		});
		ui.loader = loader;
		ui.startLoading();
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
});
