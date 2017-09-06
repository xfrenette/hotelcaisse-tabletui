import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Product from 'hotelcaisse-app/dist/business/Product';
import { Modal, NumberInput, TextInput } from '../../elements';
import { Field, Group, Label } from '../../elements/form';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	product: PropTypes.instanceOf(Product),
	onSave: PropTypes.func,
	validate: PropTypes.func,
};

const defaultProps = {
	onSave: null,
	validate: null,
};

@observer
class ModalCustomProduct extends Component {
	modalRef = null;
	name = '';
	price = 0;
	@observable
	errors = {
		name: null,
		price: null,
	};
	nodeRefs = {
		name: null,
		price: null,
	};

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	get priceAsDecimal() {
		return this.price === null ? null : new Decimal(this.price);
	}

	componentWillMount() {
		this.resetInputs(this.props);
	}

	componentWillReceiveProps(newProps) {
		this.resetInputs(newProps);
	}

	resetInputs(props) {
		this.errors.name = null;
		this.errors.price = null;

		if (props.product) {
			this.name = props.product.name;
			this.price = props.product.price.toNumber();
		} else {
			this.name = '';
			this.price = 0;
		}
	}

	show() {
		this.resetInputs(this.props);
		this.modalRef.show();
	}

	validate(fields) {
		if (!this.props.validate) {
			return true;
		}

		const res = this.props.validate(fields);
		return res === undefined;
	}

	onSave() {
		const values = {
			name: this.name,
			price: this.priceAsDecimal,
		};

		if (this.validate(values)) {
			if (this.props.onSave) {
				this.props.onSave(this.props.product, values.name, values.price);
			}

			return true;
		}

		return false;
	}

	onActionPress(action) {
		if (action === 'save') {
			if (this.onSave()) {
				this.modalRef.hide();
			}
		} else {
			this.modalRef.hide();
		}
	}

	onShow() {
		this.nodeRefs.name.focus();
	}

	onNameBlur() {
		const valid = this.validate({ name: this.name });
		if (!valid) {
			this.errors.name = this.t('order.customProduct.modal.errors.name');
		} else {
			this.errors.name = null;
		}
	}

	onPriceBlur() {
		const valid = this.validate({ price: this.priceAsDecimal });
		if (!valid) {
			this.errors.price = this.t('order.customProduct.modal.errors.price');
		} else {
			this.errors.price = null;
		}
	}

	render() {
		const actions = {
			'cancel': this.t('actions.cancel'),
			'save': this.t('actions.save'),
		};

		return (
			<Modal
				ref={(node) => { this.modalRef = node; }}
				onShow={() => { this.onShow(); }}
				onActionPress={(a) => { this.onActionPress(a); }}
				actions={actions}
				title={this.t(`order.customProduct.modal.title`)}
			>
				<Group>
					<Field>
						<Label>{this.t('order.customProduct.modal.fields.name')}</Label>
						<TextInput
							ref={(n) => { this.nodeRefs.name = n; }}
							defaultValue={this.name}
							onChangeText={(t) => { this.name = t; }}
							returnKeyType="next"
							onSubmitEditing={() => { this.nodeRefs.price.focus(); }}
							error={this.errors.name}
							onBlur={() => { this.onNameBlur(); }}
							autoCapitalize="sentences"
							selectTextOnFocus
						/>
					</Field>
					<Field>
						<Label>{this.t('order.customProduct.modal.fields.price')}</Label>
						<NumberInput
							ref={(n) => { this.nodeRefs.price = n; }}
							defaultValue={this.price}
							onChangeValue={(v) => { this.price = v; }}
							type="money"
							localizer={this.props.localizer}
							returnKeyType="done"
							error={this.errors.price}
							onBlur={() => { this.onPriceBlur(); }}
							onSubmitEditing={() => { this.onActionPress('save'); }}
							selectTextOnFocus
						/>
					</Field>
				</Group>
			</Modal>
		);
	}
}

ModalCustomProduct.propTypes = propTypes;
ModalCustomProduct.defaultProps = defaultProps;

export default ModalCustomProduct;
