import React, { Component } from 'react';
import { Text as NativeText } from 'react-native';
import styles from '../../styles';

class Text extends Component {
	render() {
		let style = [styles.Text];

		if (Array.isArray(this.props.style)) {
			style = [
				...style,
				...this.props.style,
			];
		} else if (this.props.style) {
			style.push(this.props.style);
		}

		return <NativeText style={style}>{ this.props.children }</NativeText>;
	}
}

Text.propTypes = {
	style: React.PropTypes.object,
};

Text.defaultProps = {
};

export default Text;
