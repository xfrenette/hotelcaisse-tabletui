import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import RNSwipeable from 'react-native-swipeable';
import { Text } from '../elements';
import styleVars from '../../styles/variables';

const propTypes = {
	children: RNSwipeable.propTypes.children,
	backgroundColor: PropTypes.string,
	label: PropTypes.string,
	autoCloseOnPress: PropTypes.bool,
	onPress: PropTypes.func,
};

const defaultProps = {
	children: null,
	backgroundColor: styleVars.theme.dangerBackgroundColor,
	label: '',
	autoCloseOnPress: false,
	onDelete: null,
};

class Swipeable extends Component {
	swipeableNode = null;

	/**
	 * Called when the button is pressed
	 */
	onPress() {
		if (this.props.onPress) {
			this.props.onPress();
		}

		if (this.props.autoCloseOnPress && this.swipeableNode) {
			this.swipeableNode.recenter();
		}
	}

	/**
	 * Returns the delete button shown when swiping to the left.
	 *
	 * @return {Component}
	 */
	getRightButton() {
		const buttonsStyle = {
			backgroundColor: this.props.backgroundColor,
		};

		return [
			<View style={styles.swipedContainer}>
				<View style={[styles.buttons, buttonsStyle]}>
					<TouchableOpacity
						style={[styles.rightSwipeItem, styles.button]}
						onPress={() => { this.onPress(); }}
					>
						<Text style={styles.buttonText}>{ this.props.label }</Text>
					</TouchableOpacity>
				</View>
			</View>,
		];
	}

	render() {
		return (
			<RNSwipeable
				ref={(n) => { this.swipeableNode = n; }}
				rightButtons={this.getRightButton()}
				rightButtonWidth={buttonWidth + leftPadding}
			>
				{ this.props.children }
			</RNSwipeable>
		);
	}
}

const buttonWidth = 140;
const leftPadding = 20;

const styles = {
	swipedContainer: {
		flex: 1,
		paddingLeft: leftPadding,
	},
	buttons: {
		flex: 1,
	},
	rightSwipeItem: {
		flex: 1,
		justifyContent: 'center',
		width: buttonWidth,
	},
	button: {
		width: buttonWidth,
	},
	buttonText: {
		color: 'white',
		textAlign: 'center',
	},
};

Swipeable.propTypes = propTypes;
Swipeable.defaultProps = defaultProps;

export default Swipeable;
