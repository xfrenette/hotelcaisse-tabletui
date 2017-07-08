import { AsyncStorage } from 'react-native';
import { serialize } from 'serializr';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Local from 'io/dual/Local';

const key = 'test-key';
let savedData = '{}';
let local;
let sampleRoomSelection;

beforeEach(() => {
	local = new Local(key);
	AsyncStorage.setItem = jest.fn(() => Promise.resolve());
	AsyncStorage.getItem = jest.fn(() => Promise.resolve(savedData));
	sampleRoomSelection = new RoomSelection('test-room-selection-uuid');
	sampleRoomSelection.startDate = new Date();
});

describe('write()', () => {
	test('returns Promise', () => {
		expect(local.write({})).toBeInstanceOf(Promise);
	});

	test('serializes data if serializingClass is set', () => {
		const serialized = JSON.stringify(serialize(sampleRoomSelection));
		local.serializingClass = RoomSelection;
		local.write(sampleRoomSelection);
		expect(AsyncStorage.setItem).toHaveBeenCalledWith(expect.anything(), serialized);
	});

	test('converts object to json if no serializingClass', () => {
		const data = { a: ['b'] };
		const serialized = JSON.stringify(data);
		local.write(data);
		expect(AsyncStorage.setItem).toHaveBeenCalledWith(expect.anything(), serialized);
	});

	test('calls AsyncStorage.setItem with correct key', () => {
		local.write('test');
		expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, expect.anything());
	});

	test('rejects on AsyncStorage error', (done) => {
		AsyncStorage.setItem = () => Promise.reject();
		local.write('test')
			.catch(() => done());
	});
});

describe('read()', () => {
	test('returns Promise', () => {
		expect(local.read()).toBeInstanceOf(Promise);
	});

	test('resolves with data if no serializingClass', (done) => {
		const data = { a: ['b'] };
		savedData = JSON.stringify(data);
		local.read()
			.then((readData) => {
				expect(readData).toEqual(data);
				done();
			});
	});

	test('deserialize objects if serializingClass', (done) => {
		local.serializingClass = RoomSelection;
		savedData = JSON.stringify(serialize(sampleRoomSelection));
		local.read()
			.then((readData) => {
				expect(readData).toBeInstanceOf(RoomSelection);
				expect(readData.uuid).toEqual(sampleRoomSelection.uuid);
				done();
			});
	});

	test('resolves with null if no data', (done) => {
		savedData = null;
		local.read()
			.then((readData) => {
				expect(readData).toBeNull();
				done();
			});
	});

	test('rejects if AsyncStorage.getItem rejects', (done) => {
		AsyncStorage.getItem = () => Promise.reject();
		local.read()
			.catch(() => done());
	});

	test('rejects if storage has non valid JSON - no serializingClass', (done) => {
		savedData = 'invalid-json';
		local.read()
			.catch(() => done());
	});

	test('rejects if storage has invalid instance - with serializingClass', (done) => {
		savedData = '["invalid-instance"]';
		local.serializingClass = RoomSelection;
		local.read()
			.catch(() => done());
	});
});
