import vars from './variables';

export default {
	button: {
		height: 2 * vars.verticalRhythm,
		backgroundColor: vars.button.backgroundColor,
		paddingLeft: vars.button.sidePadding,
		paddingRight: vars.button.sidePadding,
		borderRadius: vars.button.borderRadius,
		justifyContent: 'center',
	},
	buttonText: {
		color: vars.button.color,
		fontSize: vars.button.fontSize,
		lineHeight: vars.verticalRhythm,
		top: -3,
	},
};
