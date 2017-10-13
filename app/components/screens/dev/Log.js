import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, } from 'react-native';
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
			const dataText = typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data);
			data = <View style={styles.entryData}><Text>{ dataText }</Text></View>;
		}

		return (
			<View key={index}>
				<Text>
					<Text style={styles.entryDate}>[{ entry.date.getTime() / 1000 }]</Text>
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

	entryDate: {
	},

	entryData: {
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
