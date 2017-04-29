import React from 'react';
import Text from '../Text';
import styleVars from '../../../styles/variables';

const propTypes = {
	style: Text.propTypes.style,
	children: React.PropTypes.node,
};

const defaultProps = {
	style: null,
	children: null,
};

const Label = (props) => {
	const style = [styles.label, props.style];
	return <Text style={style}>{ props.children }</Text>;
};

Label.propTypes = propTypes;
Label.defaultProps = defaultProps;

const styles = {
	label: {
		fontWeight: 'bold',
		marginVertical: styleVars.verticalRhythm / 2,
		color: styleVars.theme.mainColor,
	},
};

export default Label;
