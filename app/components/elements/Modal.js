import React, { Component } from 'react';
import { View, Modal as NativeModal, TouchableNativeFeedback } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { Text } from './index';
import styleVars from '../../styles/variables';

const modalHorizontalPadding = styleVars.horizontalRhythm;

const styles = {
	Background: {
		backgroundColor: styleVars.colors.transparentBlack1,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	Modal: {
		backgroundColor: styleVars.colors.white1,
		width: 500,
	},

	ModalTitle: {
		paddingHorizontal: modalHorizontalPadding,
		paddingVertical: (styleVars.verticalRhythm / 2) - 1,
		borderBottomWidth: 2,
		borderBottomColor: styleVars.theme.mainColor,
	},

	ModalActions: {
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lighter,
		flexDirection: 'row',
	},

	ModalAction: {
		flex: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.theme.lighter,
		paddingVertical: (styleVars.verticalRhythm / 2) - 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},

	ModalActionText: {
		color: styleVars.theme.mainColor,
	},

	ModalActionLast: {
		borderRightWidth: 0,
	},

	ModalTitleText: {
		color: styleVars.theme.mainColor,
		fontSize: styleVars.bigFontSize,
	},

	ModalContent: {
		paddingHorizontal: modalHorizontalPadding,
		paddingVertical: styleVars.verticalRhythm,
	},
};

const propTypes = {
	title: React.PropTypes.string,
	onRequestClose: React.PropTypes.func,
	onActionPress: React.PropTypes.func,
	children: React.PropTypes.node.isRequired,
	actions: React.PropTypes.object,
};

const defaultProps = {
	title: null,
	onRequestClose: null,
	onActionPress: null,
	actions: null,
};

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
	 * else we close the modal.
	 */
	onRequestClose() {
		if (this.props.onRequestClose) {
			this.props.onRequestClose();
		}

		this.close();
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
	 * Opens the modal
	 */
	open() {
		this.visible = true;
	}

	/**
	 * Closes the modal
	 */
	close() {
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
			const actionStyles = [styles.ModalAction];

			if (key === lastActionKey) {
				actionStyles.push(styles.ModalActionLast);
			}

			return (
				<TouchableNativeFeedback key={key} onPress={() => { this.onActionPress(key); }}>
					<View style={actionStyles}>
						<Text style={styles.ModalActionText}>{ label }</Text>
					</View>
				</TouchableNativeFeedback>
			);
		});
	}

	render() {
		let title = null;
		let actions = null;

		if (this.props.title) {
			title = (
				<View style={styles.ModalTitle}>
					<Text style={styles.ModalTitleText}>{ this.props.title }</Text>
				</View>
			);
		}

		if (this.props.actions) {
			actions = (
				<View style={styles.ModalActions}>
					{ this.renderActions() }
				</View>
			);
		}

		return (
			<NativeModal
				visible={this.visible}
				onRequestClose={() => { this.onRequestClose(); }}
				animationType="none"
				transparent
			>
				<View style={styles.Background}>
					<View style={styles.Modal} elevation={4}>
						{ title }
						<View style={styles.ModalContent}>
							{ this.props.children }
						</View>
						{ actions }
					</View>
				</View>
			</NativeModal>
		);
	}
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
