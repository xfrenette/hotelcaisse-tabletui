import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CreditModel from 'hotelcaisse-app/dist/business/Credit';
import { Text } from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	credit: PropTypes.instanceOf(CreditModel).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	cellStyles: PropTypes.object.isRequired,
};

const defaultProps = {
};

class Credit extends Component {
	/**
	 * Update only if it is not the same Credit (different UUID)
	 *
	 * @param {Object} newProps
	 * @return {Boolean}
	 */
	shouldComponentUpdate(newProps) {
		return newProps.credit.uuid !== this.props.credit.uuid;
	}

	render() {
		const credit = this.props.credit;
		const amount = credit.amount.toNumber() * -1;
		const formattedAmount = this.props.localizer.formatCurrency(amount);

		return (
			<Row key={credit.uuid}>
				<Cell style={this.props.cellStyles.name} first>
					<Text>{ credit.note } </Text>
				</Cell>
				<Cell style={this.props.cellStyles.subtotal} last>
					<Text>{ formattedAmount }</Text>
				</Cell>
			</Row>
		);
	}
}

Credit.propTypes = propTypes;
Credit.defaultProps = defaultProps;

export default Credit;
