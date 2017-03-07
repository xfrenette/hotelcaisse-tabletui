const verticalRhythm = 24;
const baseFontSize = 16;
const horizontalRhythm = 24;

const sidePadding = horizontalRhythm;
const mainContentSidePadding = 2 * horizontalRhythm;
const baseLineHeight = verticalRhythm;
const baseBlockMargin = verticalRhythm;

const colors = {
	blue1: '#33b5e6',
	blue2: '#46ccfb',
	white1: '#ffffff',
	white2: '#fbfbfb',
	darkGrey1: '#555555',
	grey1: '#e1e1e1',
	grey2: '#aaaaaa',
	lightGrey1: '#fafafa',
	green1: '#31c544',
	green2: '#279b36',
};

const variables = {
	verticalRhythm,
	baseFontSize,
	baseLineHeight,
	horizontalRhythm,
	sidePadding,
	mainContentSidePadding,
	baseBlockMargin,
	colors,
	mainTextColor: colors.darkGrey1,
	rem(value) {
		return value * baseFontSize;
	},
	input: {
		borderRadius: 3,
		height: 2 * verticalRhythm,
	},
	theme: {
		backgroundColor: colors.white2,
		mainColor: colors.blue1,
		lighter: colors.blue2,
		overlayColor: colors.white1,
		shadow: colors.grey1,
		lineColor: colors.grey1,
	},
};

export default variables;
