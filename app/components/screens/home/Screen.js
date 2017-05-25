import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Image,
	TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import { Text } from '../../elements';
import styleVars from '../../../styles/variables';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer),
	registerState: PropTypes.number.isRequired,
	onButtonPress: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	onButtonPress: null,
};

/**
 * Renders a "main" button. The opts can contain the following, other attributes will be passes as
 * props to the button:
 * - title (required) : title of the button
 * - icon (optional) : icon to show on the button
 * - primary (optional/false): if true, use a "primary button" look
 *
 * @param {Object} opts
 * @return {Node}
 */
function renderMainButton(opts) {
	let iconNode = null;
	const { title, icon, primary, ...otherProps } = opts;
	const style = [buttonStyles.main, buttonStyles.button];

	if (icon) {
		iconNode = <Icon name={icon} style={buttonStyles.mainIcon} />;
	}

	if (primary) {
		style.push(buttonStyles.primary);
	}

	return (
		<TouchableNativeFeedback {...otherProps}>
			<View style={style}>
				{ iconNode }
				<Text style={buttonStyles.mainText}>{ title }</Text>
			</View>
		</TouchableNativeFeedback>
	);
}

/**
 * Renders a "sub" button. The opts can contain the following, other attributes will be passes as
 * props to the button:
 * - title (required) : title of the button
 * - icon (optional) : icon to show on the button
 *
 * @param {Object} opts
 * @return {Node}
 */
function renderSubButton(opts) {
	let iconNode = null;
	const { title, icon, ...otherProps } = opts;
	const style = [buttonStyles.sub, buttonStyles.button];

	if (icon) {
		iconNode = <Icon name={icon} style={buttonStyles.subIcon} />;
	}

	return (
		<TouchableNativeFeedback {...otherProps}>
			<View style={style} elevation={1}>
				{ iconNode }
				<Text style={buttonStyles.subText}>{ title }</Text>
			</View>
		</TouchableNativeFeedback>
	);
}

class Home extends Component {
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
	 * Returns a boolean indicating if the register is opened
	 *
	 * @return {Boolean}
	 */
	get registerIsOpened() {
		return this.props.registerState === STATES.OPENED;
	}

	/**
	 * When we press on a button
	 *
	 * @param {String} key
	 */
	onButtonPress(key) {
		if (this.props.onButtonPress) {
			this.props.onButtonPress(key);
		}
	}

	/**
	 * Renders the main logo
	 *
	 * @return {Node}
	 */
	renderLogo() {
		return (
			<View style={styles.logo}>
				<Image
					style={styles.logoImage}
					source={require('../../../medias/hi-logo.png')}
					resizeMode="contain"
				/>
				<View>
					<Text style={styles.logoText1}>Auberge Internationale</Text>
					<Text style={styles.logoText2}>de Rivière-du-Loup</Text>
				</View>
			</View>
		);
	}

	/**
	 * Renders all the "main" buttons
	 *
	 * @return {Node}
	 */
	renderMainButtons() {
		const buttons = [];

		if (this.registerIsOpened) {
			buttons.push(
				renderMainButton({
					key: 'new-order',
					title: this.t('home.actions.newOrder'),
					icon: 'address-card',
					primary: true,
					onPress: () => { this.onButtonPress('new-order'); },
				})
			);
		} else {
			buttons.push(
				renderMainButton({
					key: 'open-register',
					title: this.t('home.actions.openRegister'),
					icon: 'sign-in',
					primary: true,
					onPress: () => { this.onButtonPress('open-register'); },
				})
			);
		}

		buttons.push(
			renderMainButton({
				key: 'find-order',
				title: this.t('home.actions.findOrder'),
				icon: 'search',
				onPress: () => { this.onButtonPress('find-order'); },
			})
		);

		return buttons;
	}

	/**
	 * Renders the "sub" buttons
	 *
	 * @return {Node}
	 */
	renderSubButtons() {
		const buttons = [];

		if (this.registerIsOpened) {
			buttons.push(
				renderSubButton({
					key: 'manage-register',
					title: this.t('home.actions.manageRegister'),
					icon: 'money',
					onPress: () => { this.onButtonPress('manage-register'); },
				})
			);
			buttons.push(
				renderSubButton({
					key: 'close-register',
					title: this.t('home.actions.closeRegister'),
					icon: 'sign-out',
					onPress: () => { this.onButtonPress('close-register'); },
				})
			);
		}

		return buttons;
	}

	render() {
		return (
			<View style={styles.screenMain}>
				{ this.renderLogo() }
				<View style={styles.buttons}>
					<View style={styles.buttonsRow}>
						{ this.renderMainButtons() }
					</View>
					<View style={styles.buttonsRow}>
						{ this.renderSubButtons() }
					</View>
				</View>
			</View>
		);
	}
}

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

const styles = {
	screenMain: {
		flex: 1,
		justifyContent: 'center',
	},
	logo: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	logoImage: {
		height: 125,
		width: 164,
		marginRight: styleVars.horizontalRhythm * 2,
	},
	logoText1: {
		fontSize: styleVars.verticalRhythm * 1.5,
		lineHeight: styleVars.verticalRhythm * 2,
	},
	logoText2: {
		fontSize: styleVars.verticalRhythm * 2,
		lineHeight: (styleVars.verticalRhythm * 2) + 15,
		marginBottom: -13,
	},
	buttons: {
		marginTop: styleVars.verticalRhythm * 4,
	},
	buttonsRow: {
		marginTop: styleVars.verticalRhythm,
		flexDirection: 'row',
		justifyContent: 'center',
	},
};

const buttonStyles = {
	button: {
		marginHorizontal: styleVars.verticalRhythm / 2,
		width: styleVars.horizontalRhythm * 12,
	},
	main: {
		backgroundColor: styleVars.colors.blue1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		paddingHorizontal: styleVars.horizontalRhythm,
		height: styleVars.verticalRhythm * 6,
	},
	sub: {
		borderWidth: 1,
		borderColor: styleVars.colors.blue1,
		backgroundColor: styleVars.colors.white2,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 5,
		paddingHorizontal: styleVars.horizontalRhythm,
		height: styleVars.verticalRhythm * 3,
	},
	primary: {
		backgroundColor: styleVars.colors.green1,
	},
	mainText: {
		color: styleVars.colors.white1,
		fontSize: 24,
		lineHeight: 24 * 1.5,
		textAlign: 'center',
	},
	subText: {
		color: styleVars.colors.blue1,
		fontSize: 20,
		lineHeight: 20 * 1.5,
		textAlign: 'center',
		flex: 1,
	},
	mainIcon: {
		color: styleVars.colors.white1,
		fontSize: 48,
		lineHeight: 48,
		marginBottom: styleVars.verticalRhythm / 2,
	},
	subIcon: {
		color: styleVars.colors.blue1,
		fontSize: 24,
		lineHeight: 30,
	},
};

export default Home;
