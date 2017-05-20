import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	style: View.propTypes.style,
	children: PropTypes.node,
};

const defaultProps = {
	style: null,
	children: null,
};

const Group = (props) => {
	const containerStyle = [styles.group, props.style];
	const count = React.Children.count(props.children);
	let i = 0;

	const children = React.Children.map(props.children, (child) => {
		const isFirst = i === 0;
		const isLast = i === count - 1;
		i += 1;

		const style = [styles.child];

		if (isFirst) {
			style.push(styles.first);
		}

		if (isLast) {
			style.push(styles.last);
		}

		return <View style={style}>{ child }</View>;
	});

	return <View style={containerStyle}>{ children }</View>;
};

Group.propTypes = propTypes;
Group.defaultProps = defaultProps;

const styles = {
	group: {
		flexDirection: 'row',
	},
	child: {
		marginHorizontal:	styleVars.horizontalRhythm,
		flex: 1,
	},
	first: {
		marginLeft: 0,
	},
	last: {
		marginRight: 0,
	},
};

export default Group;
