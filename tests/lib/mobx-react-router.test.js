import { RouterStore, syncHistoryWithStore } from 'lib/mobx-react-router';
import { createMemoryHistory } from 'history';

let routerStore;

beforeEach(() => {
	routerStore = new RouterStore();
});

describe('RouterStore', () => {
	test('_updateLocation()', () => {
		routerStore._updateLocation({ data: true });
	});
});

describe('syncHistoryWithStore', () => {
	test('constructor', () => {
		syncHistoryWithStore(createMemoryHistory(), routerStore);
	});
});
