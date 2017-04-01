import Business from 'hotelcaisse-app/dist/business/Business';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';

/**
 * Returns a Business instance that is the "locally saved" Business instance when the app starts.
 */

const register = new Register();
register.state = REGISTER_STATES.CLOSED;

const business = new Business();
//business.deviceRegister = register;

export default business;
