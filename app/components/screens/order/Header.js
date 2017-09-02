import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import { Button } from '../../elements';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	hasNotes: PropTypes.bool,
	onNotesEdit: PropTypes.func,
};

const defaultProps = {
	hasNotes: false,
	onNotesEdit: null,
};

class Header extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	render() {
		const postIconstyles = [textStyles.postIcon];

		if (this.props.hasNotes) {
			postIconstyles.push(textStyles.postIconActive);
		}

		return (
			<View style={viewStyles.buttons}>
				<View style={viewStyles.button}>
					<Button
						layout={buttonLayouts.small}
						title={this.t('order.actions.editNotes')}
						onPress={this.props.onNotesEdit}
						postIcon={this.props.hasNotes ? 'star' : 'star-o'}
						postIconStyle={postIconstyles}
					/>
				</View>
			</View>
		);
	}
}

const viewStyles = {
	buttons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	button: {
		marginLeft: styleVars.horizontalRhythm,
	},
};

const textStyles = {
	postIcon: {
		fontSize: 15,
		top: 0,
	},
	postIconActive: {
		color: styleVars.theme.mainColor,
	},
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
