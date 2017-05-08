const verticalRhythm = 24;
const baseFontSize = 16;
const smallFontSize = 14;
const bigFontSize = 18;
const horizontalRhythm = 24;

const sidePadding = horizontalRhythm;
const mainContentSidePadding = 2 * horizontalRhythm;
const baseLineHeight = verticalRhythm;
const baseBlockMargin = verticalRhythm;

const colors = {
	black1: '#000',
	blue1: '#33b5e6',
	blue2: '#46ccfb',
	white1: '#ffffff',
	white2: '#fbfbfb',
	darkGrey1: '#555555',
	darkGrey2: '#333',
	darkGrey3: '#444',
	grey1: '#e1e1e1',
	grey2: '#aaaaaa',
	lightGrey1: '#fafafa',
	green1: '#31c544',
	green2: '#279b36',
	transparentBlack1: 'rgba(0, 0, 0, 0.4)',
	red1: '#aa0000',
	red2: '#cc0000',
	orange1: '#ce9d13',
	orange2: '#edbf40',
};

const variables = {
	verticalRhythm,
	baseFontSize,
	smallFontSize,
	bigFontSize,
	baseLineHeight,
	horizontalRhythm,
	sidePadding,
	mainContentSidePadding,
	baseBlockMargin,
	colors,
	mainTextColor: colors.darkGrey1,
	button: {
		backgroundColor: colors.grey1,
	},
	fontSize: {
		big: 1.2 * baseFontSize,
		super: 2 * baseFontSize,
		small: 0.8 * baseFontSize,
	},

	input: {
		borderColor: colors.blue1,
		borderRadius: 3,
		height: 2 * verticalRhythm,
		sidePadding: horizontalRhythm / 2,
		backgroundColor: colors.white1,
		placeholderColor: colors.grey2,
		errorColor: colors.red1,
	},
	theme: {
		backgroundColor: colors.white2,
		mainColor: colors.blue1,
		lighter: colors.blue2,
		overlayColor: colors.white1,
		shadow: colors.grey1,
		lineColor: colors.grey1,
		dangerColor: colors.red1,
		dangerBackgroundColor: colors.red2,
	},
};

export default variables;
