import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import Decimal from 'decimal.js';
import ManageRegisterScreen from '../../components/screens/ManageRegister';

@inject('router', 'business', 'localizer', 'ui')
class ManageRegister extends Component {

	onFinish() {
		this.props.router.goBack();
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	onAddCashMovement(type, rawDescription, amount) {
		const description = rawDescription.trim();
	}

	validateEntries(description, amount) {
		const result = {
			valid: true,
			message: null,
		};

		if (typeof amount !== 'number' || amount <= 0) {
			result.valid = false;
			result.message = this.t('manageRegister.errors.invalidAmount');
			return result;
		}

		if (typeof description !== 'string' || description.trim() === '') {
			result.valid = false;
			result.message = this.t('manageRegister.errors.emptyDescription');
			return result;
		}

		return result;
	}

	render() {
		return (
			<ManageRegisterScreen
				onFinish={() => { this.onFinish(); }}
				localizer={this.props.localizer}
				validation={(...params) => this.validateEntries(...params) }
				onAddCashMovement={(...params) => { this.onAddCashMovement(...params); }}
			/>
		);
	}
}

export default ManageRegister;
