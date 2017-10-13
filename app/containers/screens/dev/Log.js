import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject } from 'mobx-react/native';
import LogScreen from '../../../components/screens/dev/Log';

@inject('logger', 'localizer', 'router')
class Log extends Component {
	/**
	 * Logger instance currently listening to
	 *
	 * @type {Logger}
	 */
	logger = null;
	/**
	 * Listener function currently on the logger.
	 *
	 * @type {Function}
	 */
	logListener = null;
	/**
	 * Log entries
	 *
	 * @type {Array}
	 */
	@observable
	entries = [];

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	componentWillMount() {
		this.entries.replace(this.props.logger.entries);
		this.listenToLogger(this.props.logger);
	}

	componentWillReceiveProps(newProps) {
		// If the logger changed, we listen to the new one
		if (newProps.logger !== this.props.logger) {
			this.stopListeningToLogger();
			this.listenToLogger(newProps.logger);
		}
	}

	componentWillUnmount() {
		this.stopListeningToLogger();
	}

	/**
	 * Start listening to the supplied Logger and sets the logger and logListener attributes.
	 *
	 * @param {Logger} logger
	 */
	listenToLogger(logger) {
		this.logListener = (...params) => {
			this.onLog(...params);
		};

		logger.on('log', this.logListener);
		this.logger = logger;
	}

	/**
	 * Stop listening to the currently listen logger and clears the logger and logListener
	 * attributes.
	 */
	stopListeningToLogger() {
		if (this.logger) {
			this.logger.removeListener('log', this.logListener);
		}

		this.logger = null;
		this.logListener = null;
	}

	/**
	 * Called when the Logger sends the 'log' event. Will add a new entry.
	 *
	 * @param {String} type
	 * @param {String} namespace
	 * @param {String} message
	 * @param {mixed} data
	 * @return {[type]}
	 */
	onLog(date, type, namespace, message, data) {
		this.entries.push({
			date,
			type,
			namespace,
			message,
			data,
		});
	}

	onPressHome() {
		this.props.router.replace('/');
	}

	render() {
		return (
			<LogScreen
				localizer={this.props.localizer}
				onPressHome={() => { this.onPressHome(); }}
				entries={this.entries}
			/>
		);
	}
}

export default Log;
