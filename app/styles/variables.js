const verticalRhythm = 24;
const baseFontSize = 16;
const horizontalRhythm = 24;

const sidePadding = horizontalRhythm;

const colors = {
	blue1: '#33b5e6',
	blue2: '#46ccfb',
	white1: '#ffffff',
	darkGrey1: '#555555',
	grey1: '#e1e1e1',
	grey2: '#aaaaaa',
};

const variables = {
	verticalRhythm,
	baseFontSize,
	horizontalRhythm,
	sidePadding,
	mainTextColor: colors.darkGrey1,
	rem(value) {
		return value * baseFontSize;
	},
	theme: {
		mainColor: colors.blue1,
		lighter: colors.blue2,
		overlayColor: colors.white1,
	},
	button: {
		fontSize: baseFontSize,
		backgroundColor: colors.grey1,
		color: colors.darkGrey1,
		sidePadding: 16,
		rippleColor: colors.grey2,
		borderRadius: 2,
	},
};

export default variables;
