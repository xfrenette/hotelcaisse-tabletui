import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	TouchableWithoutFeedback,
	ScrollView,
	Button,
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

const propTypes = {
	entries: PropTypes.array,
	onClear: PropTypes.func,
};

const defaultProps = {
	entries: [],
	onClear: null,
};

@observer
class Console extends Component {
	/**
	 * Number of entries before receiving new ones.
	 *
	 * @type {Number}
	 */
	lastCount = 0;
	/**
	 * Number of entries not yet read
	 *
	 * @type {Number}
	 */
	unreadCount = 0;
	/**
	 * If true, the opened console is shown
	 *
	 * @type {Boolean}
	 */
	@observable
	opened = false;

	constructor(props) {
		super(props);
		this.unreadCount = props.entries.length;
	}

	componentWillReceiveProps(newProps) {
		/*
		 * Update the number of unread entries
		 */
		if (!this.opened) {
			this.unreadCount += newProps.entries.length - this.lastCount;
		}
		this.lastCount = newProps.entries.length;
	}

	/**
	 * Called when the user presses on the closed console.
	 */
	onOpenConsole() {
		this.unreadCount = 0;
		this.opened = true;
	}

	/**
	 * Called when the user presses on the "Close" button in the opened console.
	 */
	onCloseConsole() {
		this.opened = false;
	}
	/**
	 * Called when the user presses on the "Clear" button in the opened console.
	 */
	onClearConsole() {
		if (this.props.onClear) {
			this.props.onClear();
		}
	}

	/**
	 * Renders the list of entries.
	 *
	 * @return {Component}
	 */
	renderEntries() {
		const entries = this.props.entries.map((entry, index) => this.renderEntry(entry, index));

		return <View>{ entries }</View>;
	}

	/**
	 * Renders a single entry.
	 *
	 * @param {Object} entry
	 * @param {Number} index
	 * @return {Component}
	 */
	renderEntry(entry, index) {
		const style = [];
		let data = null;

		if (typeStyles[entry.type]) {
			style.push(typeStyles[entry.type]);
		}

		if (entry.data) {
			data = <View style={styles.entryData}><Text>{ entry.data }</Text></View>;
		}

		return (
			<View key={index}>
				<View style={styles.entry}>
					<Text style={styles.entryDate}>[{ entry.date.getTime() / 1000 }]</Text>
					<Text style={styles.entryNamespace}>{ entry.namespace }</Text>
					<Text style={style}>{ entry.message }</Text>
				</View>
				{ data }
			</View>
		);
	}

	renderOpenedConsole() {
		return (
			<View style={styles.opened} elevation={10}>
				<ScrollView style={styles.entries}>
					{ this.renderEntries() }
				</ScrollView>
				<View style={styles.actions}>
					<Button title="Clear" onPress={() => { this.onClearConsole(); }} />
					<Button title="Close" onPress={() => { this.onCloseConsole(); }} />
				</View>
			</View>
		);
	}

	renderClosedConsole() {
		return (
			<TouchableWithoutFeedback onPress={() => { this.onOpenConsole(); }}>
				<View style={styles.closed}>
					<Text style={styles.closedText}>({ this.unreadCount })</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	render() {
		if (!this.opened) {
			return this.renderClosedConsole();
		}

		return this.renderOpenedConsole();
	}
}

Console.propTypes = propTypes;
Console.defaultProps = defaultProps;

const padding = 15;

const styles = {
	closed: {
		position: 'absolute',
		backgroundColor: 'blue',
		left: 0,
		bottom: 0,
		padding: 5,
	},

	closedText: {
		color: '#fff',
	},

	opened: {
		position: 'absolute',
		backgroundColor: '#fbfbfb',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},

	entries: {
		flex: 1,
		padding,
	},

	entry: {
		flexDirection: 'row',
	},

	entryNamespace: {
		paddingRight: 5,
		fontWeight: 'bold',
		color: '#999',
	},

	entryDate: {
		paddingRight: 10,
	},

	entryData: {
		paddingLeft: 20,
	},

	actions: {
		flex: 0,
		padding,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
};

const typeStyles = {
	info: {
		color: 'blue',
	},
	error: {
		color: 'red',
	},
	warn: {
		color: 'orange',
	},
};

export default Console;
