import vars from './variables';

const height = 2 * vars.verticalRhythm;

export default {
	TopBar: {
		backgroundColor: vars.theme.mainColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: height,
		paddingHorizontal: vars.sidePadding,
		borderTopWidth: 1,
		borderTopColor: vars.theme.lighter,
	},
	TopBarSideIcon: {
		width: 3 * vars.verticalRhythm,
	},
	TopBarText: {
		color: vars.theme.overlayColor,
		fontSize: vars.rem(1.2),
	},
	TopBarIcon: {
		color: vars.theme.overlayColor,
		fontSize: vars.verticalRhythm,
	},
};
