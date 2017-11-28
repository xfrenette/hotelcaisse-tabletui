import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Dimensions,
	Modal as NativeModal,
	ScrollView,
	TouchableNativeFeedback,
	View,
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import omit from 'lodash.omit';
import { Text } from './index';
import styleVars from '../../styles/variables';

const propTypes = {
	title: PropTypes.string,
	onRequestClose: PropTypes.func,
	onActionPress: PropTypes.func,
	onShow: PropTypes.func,
	children: PropTypes.node.isRequired,
	actions: PropTypes.object,
	fullScreen: PropTypes.bool,
};

const defaultProps = {
	title: null,
	onRequestClose: null,
	onActionPress: null,
	onShow: null,
	actions: null,
	fullScreen: false,
};

const regularWidth = 500;

@observer
class Modal extends Component {
	/**
	 * Observable boolean that shows or hide the modal
	 *
	 * @type {Boolean}
	 */
	@observable
	visible = false;

	/**
	 * When the back button is pressed on Android. If a onRequestClose props is defined, we call it,
	 * else we hide the modal.
	 */
	onRequestClose() {
		if (this.props.onRequestClose) {
			this.props.onRequestClose();
		} else {
			this.hide();
		}
	}

	/**
	 * Called when an action button is pressed. The key is passed. If a onActionPress prop is
	 * defined, we call it with the actionKey.
	 *
	 * @param {String} actionKey
	 */
	onActionPress(actionKey) {
		if (this.props.onActionPress) {
			this.props.onActionPress(actionKey);
		}
	}

	/**
	 * Shows the modal
	 */
	show() {
		this.visible = true;
	}

	/**
	 * Hides the modal
	 */
	hide() {
		this.visible = false;
	}

	/**
	 * Render the action buttons. Returns them as an array
	 *
	 * @return {Array}
	 */
	renderActions() {
		const actionsArray = Object.entries(this.props.actions);
		const lastActionKey = actionsArray[actionsArray.length - 1][0];

		return actionsArray.map(([key, label]) => {
			const actionStyles = [styles.action];

			if (key === lastActionKey) {
				actionStyles.push(styles.actionLast);
			}

			return (
				<TouchableNativeFeedback key={key} onPress={() => {
					this.onActionPress(key);
				}}>
					<View style={actionStyles}>
						<Text style={styles.actionText}>{label}</Text>
					</View>
				</TouchableNativeFeedback>
			);
		});
	}

	render() {
		let title = null;
		let actions = null;
		let width = regularWidth;
		let height = null;

		if (this.props.title) {
			title = (
				<View style={styles.title}>
					<Text style={styles.titleText}>{this.props.title}</Text>
				</View>
			);
		}

		if (this.props.actions) {
			actions = (
				<View style={styles.actions}>
					{this.renderActions()}
				</View>
			);
		}

		if (this.props.fullScreen) {
			const dim = Dimensions.get('window');
			width = dim.width - 100;
		}

		const modalStyle = { width, };

		if (height) {
			modalStyle.height = height;
		}

		let content = (
			<View style={styles.content}>
				{ this.props.children }
			</View>
		);

		if (this.props.fullScreen) {
			content = (
				<ScrollView>
					{ content }
				</ScrollView>
			);
		}

		const modalProps = omit(this.props, [
			'title', 'onRequestClose', 'onActionPress', 'onShow', 'children', 'actions', 'fullScreen'
		]);

		return (
			<NativeModal
				visible={this.visible}
				onRequestClose={() => {
					this.onRequestClose();
				}}
				animationType="none"
				transparent
				onShow={this.props.onShow}
				{...modalProps}
			>
				<View style={styles.container}>
					<View style={[styles.modal, modalStyle]} elevation={4}>
						{ title }
						{ content }
						{ actions }
					</View>
				</View>
			</NativeModal>
		);
	}
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

const modalHorizontalPadding = styleVars.horizontalRhythm;

const styles = {
	container: {
		backgroundColor: styleVars.colors.transparentBlack1,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingVertical: styleVars.verticalRhythm,
	},

	modal: {
		backgroundColor: styleVars.colors.white1,
	},

	title: {
		paddingHorizontal: modalHorizontalPadding,
		paddingVertical: (styleVars.verticalRhythm / 2) - 1,
		borderBottomWidth: 2,
		borderBottomColor: styleVars.theme.mainColor,
	},

	titleText: {
		color: styleVars.theme.mainColor,
		fontSize: styleVars.bigFontSize,
	},

	actions: {
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lighter,
		flexDirection: 'row',
	},

	action: {
		flex: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.theme.lighter,
		paddingVertical: (styleVars.verticalRhythm / 2) - 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},

	actionText: {
		color: styleVars.theme.mainColor,
	},

	actionLast: {
		borderRightWidth: 0,
	},

	content: {
		paddingHorizontal: modalHorizontalPadding,
		paddingVertical: styleVars.verticalRhythm,
	},
};

export default Modal;
