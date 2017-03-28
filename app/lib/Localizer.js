import get from 'lodash.get';

/**
 * Classes used for localizing content.
 */
class Localizer {
	/**
	 * Strings in different locales.
	 *
	 * @type {Object}
	 */
	strings = {};
	/**
	 * Current locale
	 *
	 * @type {[type]}
	 */
	locale = null;

	/**
	 * Returns the string specified by the path in the current locale. If the string is not found,
	 * returns the path.
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (!this.locale) {
			return path;
		}

		if (!this.strings[this.locale]) {
			return path;
		}

		return get(this.strings[this.locale], path, path);
	}

	/**
	 * Sets the strings object for the specified locale.
	 *
	 * @param {String} locale
	 * @param {Object} strings
	 */
	setStrings(locale, strings) {
		this.strings[locale] = strings;
	}
}

export default Localizer;
