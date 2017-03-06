import vars from './variables';
import { StyleSheet } from 'react-native';

export default {
	buttons: {
		// All buttons are built on the base
		default: {
			button: {
				height: 2 * vars.verticalRhythm,
				backgroundColor: vars.colors.grey1,
				paddingLeft: 16,
				paddingRight: 16,
				borderRadius: 2,
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
				paddingLeft: 0,
				paddingRight: 0,
				borderRadius: 0,
				justifyContent: 'flex-start',
			},
			text: {
				color: vars.colors.blue1,
				fontSize: vars.baseFontSize,
				lineHeight: vars.baseLineHeight,
				includeFontPadding: false,
			},
		},
		big: {
			button: {
				borderRadius: 3,
				paddingLeft: 24,
				paddingRight: 24,
			},
			text: {
				fontSize: vars.rem(1.2),
				top: -1,
			},
		},
	},
};
