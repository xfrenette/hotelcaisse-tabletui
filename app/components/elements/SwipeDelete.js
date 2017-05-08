import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-swipeable';
import { Text } from '../elements';
import styleVars from '../../styles/variables';

const propTypes = {
	children: Swipeable.propTypes.children,
	label: PropTypes.string,
	onDelete: PropTypes.func,
};

const defaultProps = {
	children: null,
	label: '',
	onDelete: null,
};

class SwipeDelete extends Component {
	/**
	 * Called when the delete button is pressed
	 */
	onDelete() {
		if (this.props.onDelete) {
			this.props.onDelete();
		}
	}

	/**
	 * Returns the delete button shown when swiping to the left.
	 *
	 * @return {Component}
	 */
	getRightButton() {
		return [
			<View style={styles.swipedContainer}>
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.rightSwipeItem, styles.delete]}
						onPress={() => { this.onDelete(); }}
					>
						<Text style={styles.deleteText}>{ this.props.label }</Text>
					</TouchableOpacity>
				</View>
			</View>,
		];
	}

	render() {
		return (
			<Swipeable
				rightButtons={this.getRightButton()}
				rightButtonWidth={buttonWidth + leftPadding}
			>
				{ this.props.children }
			</Swipeable>
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
		backgroundColor: styleVars.theme.dangerBackgroundColor,
		flex: 1,
	},
	rightSwipeItem: {
		flex: 1,
		justifyContent: 'center',
		width: buttonWidth,
	},
	delete: {
		width: buttonWidth,
	},
	deleteText: {
		color: 'white',
		textAlign: 'center',
	},
};

SwipeDelete.propTypes = propTypes;
SwipeDelete.defaultProps = defaultProps;

export default SwipeDelete;
