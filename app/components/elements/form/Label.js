import React, { Component } from 'react';
import Text from '../Text';
import styleVars from '../../../styles/variables';

const styles = {
	Label: {
		fontWeight: 'bold',
		marginVertical: styleVars.verticalRhythm / 2,
		color: styleVars.theme.mainColor,
	},
};

const propTypes = {
	style: Text.propTypes.style,
};

const defaultProps = {
	style: null,
};

class Label extends Component {
	render() {
		const style = [styles.Label, this.props.style];
		return <Text style={style}>{ this.props.children }</Text>;
	}
}

Label.propTypes = propTypes;
Label.defaultProps = defaultProps;

export default Label;
