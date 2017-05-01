import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Button from './Button';
import buttonLayouts from '../../styles/buttons';

const propTypes = {
	hitSlop: TouchableWithoutFeedback.propTypes.hitSlop,
};

const defaultProps = {
	hitSlop: null,
};

/**
 * Special implementation of a Button: the cancel or 'back' in the bottom bar
 */
const BottomBarBackButton = props => (
	<Button
		type="back"
		hitSlop={props.hitSlop || { top: 20, right: 20, bottom: 20, left: 20 }}
		layout={buttonLayouts.text}
		{...props}
	/>
);

BottomBarBackButton.propTypes = propTypes;
BottomBarBackButton.defaultProps = defaultProps;

export default BottomBarBackButton;
