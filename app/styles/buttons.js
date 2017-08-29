import vars from './variables';

/**
 * Buttons styles that can be passed to layout in <Button layout={...} />
 */
export default {
	// All buttons are built on the base
	default: {
		button: {
			height: 2 * vars.verticalRhythm,
			backgroundColor: vars.button.backgroundColor,
			paddingHorizontal: 16,
			borderRadius: 3,
			justifyContent: 'center',
		},
		text: {
			color: vars.colors.darkGrey1,
			fontSize: vars.baseFontSize,
			lineHeight: vars.verticalRhythm,
			top: -3,
		},
		rippleColor: vars.colors.grey2,
	},
	primary: {
		button: {
			backgroundColor: vars.colors.green1,
		},
		text: {
			color: vars.colors.white1,
		},
		rippleColor: vars.colors.green2,
	},
	text: {
		button: {
			height: vars.verticalRhythm,
			backgroundColor: 'transparent',
			paddingHorizontal: 0,
			borderRadius: 0,
			justifyContent: 'flex-start',
		},
		text: {
			color: vars.colors.blue1,
			fontSize: vars.baseFontSize,
			lineHeight: vars.baseLineHeight,
			includeFontPadding: false,
			top: 1,
		},
	},
	big: {
		button: {
			borderRadius: 3,
			paddingHorizontal: 24,
		},
		text: {
			fontSize: vars.bigFontSize,
			top: -1,
		},
	},
	small: {
		button: {
			height: vars.verticalRhythm * 1.2,
		},
		text: {
			lineHeight: vars.verticalRhythm,
			fontSize: vars.smallFontSize,
		},
	},
};
