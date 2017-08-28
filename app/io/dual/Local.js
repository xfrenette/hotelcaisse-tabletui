import { AsyncStorage } from 'react-native';
import { deserialize, getDefaultModelSchema, serialize } from 'serializr';
import Dual from 'hotelcaisse-app/dist/io/dual/Dual';

/**
 * Writer and Reader that writes/reads from the local storage (using React Native AsyncStorage).
 * Receives a key (where to save/read the data) and an optional class used to serialized (if no
 * serializing class is supplied, will simply JSON encode/decode the data).
 */
class Local extends Dual {
	/**
	 * Key where to save data in AsyncStorage
	 *
	 * @type {String}
	 */
	key = null;
	/**
	 * If provided, the data will be de/serialized with the class's schema (serializr).
	 *
	 * @type {Class}
	 */
	serializingClass = null;

	constructor(key, serializingClass = null) {
		super();
		this.key = key;
		this.serializingClass = serializingClass;
	}

	/**
	 * Serializes the data (use serializingClass if set) and saves the JSON string to AsyncStorage.
	 * Returns the Promise returned by AsyncStorage.setItem.
	 *
	 * @param {mixed} data
	 * @return {Promise}
	 */
	write(data) {
		const serialized = this.serializeData(data);
		return AsyncStorage.setItem(this.key, serialized);
	}

	/**
	 * Clears data saved in the local storage
	 * @return {Promise}
	 */
	clear() {
		return AsyncStorage.removeItem(this.key);
	}

	/**
	 * Retrieves the JSON data in AsyncStorage and deserializes it. Returns a Promise.
	 *
	 * @return {Promise}
	 */
	read() {
		return this.readRaw()
			.then(data => this.deserializeData(data));
	}

	/**
	 * Retrieves the JSON data in AsyncStorage (as a string). Returns a Promise.
	 *
	 * @return {Promise}
	 */
	readRaw() {
		return AsyncStorage.getItem(this.key)
	}

	/**
	 * If serializingClass is set, serializes the data using the class's schema and returns the JSON
	 * stringified. Else, stringify the data and returns it.
	 *
	 * @param {mixed} rawData
	 * @return {String}
	 */
	serializeData(rawData) {
		let data = rawData;

		if (this.serializingClass) {
			const schema = getDefaultModelSchema(this.serializingClass);
			data = serialize(schema, rawData);
		}

		return JSON.stringify(data);
	}

	/**
	 * Takes a stringified JSON object and parses it. If no serializingClass, returns it as is, else
	 * deserializes it using the class's schema. If cannot parse the JSON, or cannot deserialize,
	 * throws an error.
	 *
	 * @param {String} rawData
	 * @return {mixed}
	 */
	deserializeData(rawData) {
		let data;
		try {
			data = JSON.parse(rawData);
		} catch (error) {
			throw new Error(`Cannot parse JSON: ${rawData}`);
		}

		if (this.serializingClass) {
			const schema = getDefaultModelSchema(this.serializingClass);
			try {
				return deserialize(schema, data);
			} catch (error) {
				throw new Error(`Cannot deserialize data: ${rawData}`);
			}
		}

		return data;
	}
}

export default Local;
