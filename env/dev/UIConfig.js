import Decimal from 'decimal.js';
import BackgroundTimer from 'react-native-background-timer';
import Application from 'hotelcaisse-app/dist/Application';
import ApiServer from 'hotelcaisse-app/dist/servers/Api';
import ApiAuth from 'hotelcaisse-app/dist/auth/ApiServer';
import Business from 'hotelcaisse-app/dist/business/Business';
import Order from 'hotelcaisse-app/dist/business/Order';
import Device from 'hotelcaisse-app/dist/business/Device';
import Register from 'hotelcaisse-app/dist/business/Register';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Business';
import DeviceAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Device';
import ServerAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Server';
import ApiServerUpdatesListener from 'hotelcaisse-app/dist/plugins/apiServer/UpdatesListener';
import ApiServerPing from 'hotelcaisse-app/dist/plugins/apiServer/Ping';
import FirstReader from 'hotelcaisse-app/dist/io/readers/First';
import BusinessServerReader from 'hotelcaisse-app/dist/io/readers/business/Server';
import DeviceServerReader from 'hotelcaisse-app/dist/io/readers/device/Server';
import BusinessSaveServer from 'hotelcaisse-app/dist/plugins/autosave/business/ToServer';
import DeviceSaveServer from 'hotelcaisse-app/dist/plugins/autosave/device/ToServer';
import BusinessSaveWriter from 'hotelcaisse-app/dist/plugins/autosave/business/ToWriter';
import DeviceSaveWriter from 'hotelcaisse-app/dist/plugins/autosave/device/ToWriter';
import LocalStorage from '../../app/io/dual/Local';
import storedBusiness from './storedBusiness';
import storedDevice from './storedDevice';
import MemoryLogger from '../../app/lib/MemoryLogger';
import TestAuth from '../../tests/mock/TestAuth';
import TestServer from '../../tests/mock/TestServer';
import dummyOrder from '../../tests/mock/dummyOrder';
import UUIDGenerator from '../../app/lib/UUIDGenerator';
import strings from '../../locales/fr-CA';

/*
Examples :

// Authentication that always fails (ex: because of an error)
const testAuth = new TestAuth(false);

// Authentication with a specific valid code waiting 2 secs before validating
const testAuth = new TestAuth();
testAuth.authenticated = false;
testAuth.validCode = '1234';
testAuth.delay = 2000;

// Business storage
const businessStorage = new TestReader(storedBusiness);
// With delay
businessStorage.delay = 3000;

*/

const useReal = false;
const useLocalStorage = false;
let server;
let auth;
const localStorages = {};
let serverStorage;
const dummyLocalizer = new Localizer('fr-CA', 'CAD');

const logger = new MemoryLogger(50);

if (useReal) {
	serverStorage = new LocalStorage('com.xavierfrenette.hirdlpos@server');
	// Do not forget to set application later
	server = new ApiServer('http://192.168.137.1:8000/api/1.0/hirdl');
	// server = new ApiServer('https://venteshirdl.com/api/1.0/hirdl');
	if (useLocalStorage) {
		server.writer = serverStorage;
	}
	server.setLogger(logger);
	server.setTimeout = (cb, delay) => BackgroundTimer.setTimeout(cb, delay);
	auth = new ApiAuth(server);
	auth.authenticated = true;
	localStorages['ApiServer'] = serverStorage;
} else {
	server = new TestServer();
	server.localizer = dummyLocalizer;
	//server.delay = 2000;
	server.business = storedBusiness;
	server.device = storedDevice;
	server.maxOrderLoads = 2;

	auth = new TestAuth();
	auth.authenticated = true;
	// auth.validCode = '1234';
	// auth.delay = 4000;
}

const localBusinessStorage = new LocalStorage('com.xavierfrenette.hirdlpos@business', Business);
const localDeviceStorage = new LocalStorage('com.xavierfrenette.hirdlpos@device', Device);

localStorages['Device'] = localDeviceStorage;
localStorages['Business'] = localBusinessStorage;

// 'First' reader for the Business: takes different readers and returns the data of the first that
// resolves and doesn't return null
let storages = [
	new BusinessServerReader(server),
];
if (useLocalStorage) {
	storages.unshift(localBusinessStorage);
}
const businessStorage = new FirstReader(storages);

// 'First' reader for the Device: takes different readers and returns the data of the first that
// resolves and doesn't return null
storages = [
	new DeviceServerReader(server),
];
if (useLocalStorage) {
	storages.unshift(localDeviceStorage);
}
const deviceStorage = new FirstReader(storages);

const apiServerPingPlugin = new ApiServerPing(server);
// Must be inside a function
apiServerPingPlugin.setInterval = (cb, delay) => BackgroundTimer.setInterval(cb, delay);

const appConfig = {
	logger,
	plugins: [
		// Autoload the business
		new BusinessAutoload(businessStorage),
		// Autoload the business
		new DeviceAutoload(deviceStorage),
		// Auto save Business to server
		new BusinessSaveServer(server),
		// Auto save Device to server
		new DeviceSaveServer(server),
		apiServerPingPlugin,
	],
};

if (useLocalStorage) {
	// Autosave plugins to local local writers must be before autoloads, since the latter will
	// load objects that must be saved once loaded

	// Auto save Business to local
	appConfig.plugins.unshift(new BusinessSaveWriter(localBusinessStorage));
	appConfig.plugins.unshift(new DeviceSaveWriter(localDeviceStorage));
}

if (useReal) {
	appConfig.plugins.unshift(new ServerAutoload(serverStorage, server)); // must be first
	appConfig.plugins.unshift(new ApiServerUpdatesListener(server));
}

const app = new Application(appConfig);
const orderPath = {
	pathname: '/order',
	state: {
		order: dummyOrder(storedBusiness, null, dummyLocalizer),
		new: false,
	},
};
const loadingPath = {
	pathname: '/loading',
	state: {
		redirectWhenLoaded: false,
	},
};
const falseRegister = new Register();
falseRegister.number = 1234;
falseRegister.open('Xavier Test', new Decimal(100));
falseRegister.close(new Decimal(265.36), '8542', new Decimal(968.41));

const registerClosedPath = {
	pathname: '/register/closed', // to work: register must not be opened
	state: {
		register: falseRegister,
	},
};

// module.exports instead of export because it is an optional require in index.
module.exports = {
	app,
	logger,
	ordersServer: server,
	// initialRoutes: [loadingPath],
	// initialRoutes: ['/', orderPath],
	// initialRoutes: ['/register/close'],
	// initialRoutes: [registerClosedPath],
	uuidGenerator: new UUIDGenerator(),
	auth,
	locale: 'fr-CA',
	currency: 'CAD',
	showConsole: true,
	moneyDenominations: [0.05, 0.1, 0.25, 1, 2, 5, 10, 20, 50, 100],
	localStorages,
	strings: {
		'fr-CA': strings,
	},
};
