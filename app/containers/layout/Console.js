import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { observable } from 'mobx';
import ConsoleComponent from '../../components/layout/Console';

@inject('logger')
@observer
class Console extends Component {
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

	constructor(props) {
		super(props);
		this.listenToLogger(props.logger);
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

	/**
	 * Called when the user wants to clear the log.
	 */
	onClear() {
		this.entries = [];
	}

	render() {
		return (
			<ConsoleComponent
				entries={this.entries.slice()}
				onClear={() => { this.onClear(); }}
			/>
		);
	}
}

export default Console;
