import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { Button, Text, Title } from '../../elements';
import { MainContent, Screen, TopBar } from '../../layout';
import styleVars from '../../../styles/variables';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer),
	storages: PropTypes.array,
	storagesContent: PropTypes.object.isRequired,
	loadingStorages: PropTypes.object.isRequired,
	onClearPress: PropTypes.func,
	onPressHome: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	onClearPress: null,
	onPressHome: null,
};

class LocalStorages extends Component {
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

	onClearPress(key) {
		if (this.props.onClearPress) {
			this.props.onClearPress(key);
		}
	}

	renderStorages() {
		return this.props.storages.map((key) => {
			const loading = this.props.loadingStorages[key] === true;
			const content = loading
				? this.t('dev.localStorages.loading')
				: this.props.storagesContent[key];

			return (
				<View key={key} style={layoutStyles.section}>
					<Title style={layoutStyles.title}>{key}</Title>
					<View style={viewStyles.content}>
						<Text>
							{content || this.t('dev.localStorages.empty')}
						</Text>
					</View>
					<View style={viewStyles.buttons}>
						<Button
							title={this.t('dev.localStorages.actions.clear')}
							onPress={() => { this.onClearPress(key); }}
						/>
					</View>
				</View>
			);
		});
	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('screens.dev.localStorages.title')}
					onPressHome={this.props.onPressHome}
				/>
				<MainContent>
					<ScrollView>
						{this.renderStorages()}
					</ScrollView>
				</MainContent>
			</Screen>
		);
	}
}

const viewStyles = {
	buttons: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	content: {
		marginBottom: styleVars.verticalRhythm,
	},
};

LocalStorages.propTypes = propTypes;
LocalStorages.defaultProps = defaultProps;

export default LocalStorages;
