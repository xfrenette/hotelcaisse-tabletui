import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import validate from 'hotelcaisse-app/dist/Validator';
import { Modal, NumberInput } from '../../elements';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	maxQuantity: PropTypes.number,
	onRefund: PropTypes.func,
};

const defaultProps = {
	maxQuantity: 1,
	onRefund: null,
};

class ModalRefund extends Component {
	modalRef = null;
	quantityValue = 1;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path, vars) {
		return this.props.localizer.t(path, vars);
	}

	get valueConstraints() {
		return {
			numericality: {
				greaterThan: 0,
				lessThanOrEqualTo: this.props.maxQuantity
			}
		};
	}

	get valueIsValid() {
		const constraints = { value: this.valueConstraints };
		const res = validate({ value: this.quantityValue }, constraints);
		return res === undefined;
	}

	componentWillReceiveProps(newProps) {
		this.quantityValue = newProps.maxQuantity;
	}

	onActionPress(action) {
		if (action === 'save') {
			if (this.props.onRefund && this.valueIsValid) {
				this.props.onRefund(this.quantityValue);
			}
		}

		this.modalRef.hide();
	}

	show() {
		this.modalRef.show();
	}

	render() {
		const actions = {
			'cancel': this.t('actions.cancel'),
			'save': this.t('actions.save'),
		};

		return (
			<Modal
				ref={(node) => { this.modalRef = node; }}
				onActionPress={(a) => { this.onActionPress(a); }}
				actions={actions}
				title={this.t('order.itemRefund.modal.title', { max: this.props.maxQuantity })}
			>
				<View style={viewStyles.modalContent}>
					<View style={viewStyles.inputContainer}>
						<NumberInput
							defaultValue={this.quantityValue}
							showIncrementors
							onChangeValue={(v) => { this.quantityValue = v; }}
						/>
					</View>
				</View>
			</Modal>
		);
	}
}

const viewStyles = {
	modalContent: {
		alignItems: 'center',
	},
	inputContainer: {
		width: 150,
	},
};

ModalRefund.propTypes = propTypes;
ModalRefund.defaultProps = defaultProps;

export default ModalRefund;
