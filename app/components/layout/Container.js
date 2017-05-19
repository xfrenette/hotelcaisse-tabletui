import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const propTypes = {
	children: PropTypes.node,
	style: View.propTypes.style,
	layout: PropTypes.string,
};

const defaultProps = {
	children: null,
	style: null,
	layout: null,
};

const Container = (props) => {
	const contentStyle = [];
	contentStyle.push(props.style);

	if (props.layout && layouts[props.layout]) {
		contentStyle.push(layouts[props.layout]);
	}

	return (
		<View style={styles.container}>
			<View style={contentStyle}>
				{ props.children }
			</View>
		</View>
	);
};

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

const styles = {
	container: {
		alignItems: 'center',
	},
};

const layouts = {
	oneColCentered: {
		width: 700,
	},
};

export default Container;
