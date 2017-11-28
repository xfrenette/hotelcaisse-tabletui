import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, TouchableHighlight, Alert } from 'react-native';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { observer } from 'mobx-react/native';
import { MainContent, Screen, TopBar } from '../../layout';
import Localizer from 'hotelcaisse-app/dist/Localizer';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer),
	entries: MobxPropTypes.observableArray,
	onPressHome: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	entries: [],
	onPressHome: null,
};

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

@observer
class Log extends Component {
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

	onShowFullData(entry, formattedText) {
		Alert.alert(entry.message, formattedText);
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
			const previewLength = 100;
			let dataString = typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data);
			let moreButton = null;

			if (dataString.length > previewLength) {
				const fullText = dataString;
				dataString = `${dataString.substring(0, previewLength)} ... `;
				moreButton = (
					<TouchableHighlight
						onPress={() => { this.onShowFullData(entry, fullText) }}
					>
						<Text style={styles.viewFull}>View full</Text>
					</TouchableHighlight>
				);
			}

			data = (
				<View style={styles.entryData}>
					<Text>{ dataString }</Text>
					{ moreButton }
				</View>
			);
		}

		const dateTime = entry.date;
		const y = dateTime.getFullYear();
		const M = pad(dateTime.getMonth() + 1, 2);
		const d = pad(dateTime.getDate(), 2);
		const h = pad(dateTime.getHours(), 2);
		const m = pad(dateTime.getMinutes(), 2);
		const s = pad(dateTime.getSeconds(), 2);
		const ms = pad(dateTime.getMilliseconds(), 3);
		const dateTimeText = `${y}-${M}-${d} ${h}:${m}:${s}.${ms}`;

		return (
			<View key={index}>
				<Text>
					<Text style={styles.entryDate}>[{ dateTimeText }]</Text>
					<Text> </Text>
					<Text style={styles.entryNamespace}>{ entry.namespace }</Text>
					<Text> </Text>
					<Text style={style}>{ entry.message }</Text>
				</Text>
				{ data }
			</View>
		);
	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('screens.dev.log.title')}
					onPressHome={this.props.onPressHome}
				/>
				<MainContent>
					<ScrollView>
						{ this.renderEntries() }
					</ScrollView>
				</MainContent>
			</Screen>
		);
	}
}

Log.propTypes = propTypes;
Log.defaultProps = defaultProps;

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
		padding,
	},

	entryNamespace: {
		fontWeight: 'bold',
		color: '#999',
	},

	entryData: {
		marginLeft: 30,
		justifyContent: 'flex-start',
		flexDirection: 'row',
	},

	viewFull: {
		color: 'green',
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

export default Log;
