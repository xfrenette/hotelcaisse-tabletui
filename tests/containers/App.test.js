import { RouterStore } from 'lib/mobx-react-router';
import AppContainer from 'containers/App';

// Required when using mobx-react/native with jest
jest.mock('mobx-react/native', () => require('mobx-react/custom'));

let appContainer;

beforeEach(() => {
	appContainer = new AppContainer({ routes: [] });
});

describe('getStores()', () => {
	test('returns all expected stores', () => {
		const res = appContainer.getStores();
		expect(res).toEqual(expect.objectContaining({
			routing: expect.any(RouterStore),
		}));
	});
});
