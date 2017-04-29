import Decimal from 'decimal.js';
import Business from 'hotelcaisse-app/dist/business/Business';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';

/**
 * Returns a Business instance that is the "locally saved" Business instance when the app starts.
 */

const register = new Register();
register.open('Xavier Frenette', new Decimal(100));

const cashMovement1 = new CashMovement('cm1', new Decimal(12));
cashMovement1.note = 'Test cash in avec une note qui est vraiment longue';
cashMovement1.uuid = 'test-uuid-1';

const cashMovement2 = new CashMovement('cm2', new Decimal(-1.45));
cashMovement2.note = 'Test cash out';
cashMovement2.uuid = 'test-uuid-2';

register.addCashMovement(cashMovement1);
register.addCashMovement(cashMovement2);

const business = new Business();
business.deviceRegister = register;

export default business;
