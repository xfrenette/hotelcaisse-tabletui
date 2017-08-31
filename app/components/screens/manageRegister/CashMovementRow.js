import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import { Swipeable, Text, } from '../../elements';
import { Cell, Row } from '../../elements/table';

const propTypes = {
	cashMovement: PropTypes.instanceOf(CashMovement).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	cellStyles: PropTypes.object.isRequired,
	onDelete: PropTypes.func,
};

const defaultProps = {
	onDelete: null,
};

class CashMovementRow extends Component {
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
		const cellStyles = this.props.cellStyles;
		const cashMovement = this.props.cashMovement;
		const time = this.props.localizer.formatDate(cashMovement.createdAt, { skeleton: 'Hm' });
		const amount = cashMovement.amount.toNumber();
		const formattedAmount = this.props.localizer.formatCurrency(amount);

		return (
			<Swipeable
				label={this.t('actions.delete')}
				onPress={this.props.onDelete}
			>
				<Row>
					<Cell style={cellStyles.time} first><Text>{ time }</Text></Cell>
					<Cell style={cellStyles.note}><Text>{ cashMovement.note }</Text></Cell>
					<Cell style={cellStyles.amount} last>
						<Text>{ amount > 0 ? '+' : '' }{ formattedAmount }</Text>
					</Cell>
				</Row>
			</Swipeable>
		);
	}
}

CashMovementRow.propTypes = propTypes;
CashMovementRow.defaultProps = defaultProps;

export default CashMovementRow;
