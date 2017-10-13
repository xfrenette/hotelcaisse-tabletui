import BackgroundTimer from 'react-native-background-timer';
import Application from 'hotelcaisse-app/dist/Application';
import ApiServer from 'hotelcaisse-app/dist/servers/Api';
import ApiAuth from 'hotelcaisse-app/dist/auth/ApiServer';
import Business from 'hotelcaisse-app/dist/business/Business';
import Device from 'hotelcaisse-app/dist/business/Device';
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
import UUIDGenerator from '../../app/lib/UUIDGenerator';
import strings from '../../locales/fr-CA';
import MemoryLogger from '../../app/lib/MemoryLogger';

const logger = new MemoryLogger(50);

/*
 * Local storages
 */
const serverStorage = new LocalStorage('com.xavierfrenette.hirdlpos@server');
const localBusinessStorage = new LocalStorage('com.xavierfrenette.hirdlpos@business', Business);
const localDeviceStorage = new LocalStorage('com.xavierfrenette.hirdlpos@device', Device);

const localStorages = {
	ApiServer: serverStorage,
	Device: localDeviceStorage,
	Business: localBusinessStorage,
};

/*
 * Server instance
 */
server = new ApiServer('https://venteshirdl.com/api/1.0/hirdl');
server.writer = serverStorage;
// Must be inside a function
server.setTimeout = (cb, delay) => BackgroundTimer.setTimeout(cb, delay);
server.setLogger(logger);

/*
 * Auth instance
 */
auth = new ApiAuth(server);

/*
 * Readers for autoloaded data (use the First reader)
 */
const businessDataReader = new FirstReader([
	localBusinessStorage,
	new BusinessServerReader(server),
]);
const deviceDataReader = new FirstReader([
	localDeviceStorage,
	new DeviceServerReader(server),
]);

/*
 * Plugins
 */
const apiServerPingPlugin = new ApiServerPing(server);
// Must be inside a function
apiServerPingPlugin.setInterval = (cb, delay) => BackgroundTimer.setInterval(cb, delay);

const plugins = [
	// Autosave plugins to local local writers (must be before autoloads, because the loaded
	// objects must be saved locally)
	new BusinessSaveWriter(localBusinessStorage),
	new DeviceSaveWriter(localDeviceStorage),
	// Autosave plugins to server
	new BusinessSaveServer(server),
	new DeviceSaveServer(server),
	// App update plugin when data is loaded from the server
	new ApiServerUpdatesListener(server),
	// Autoload plugins
	new ServerAutoload(serverStorage, server),
	new BusinessAutoload(businessDataReader),
	new DeviceAutoload(deviceDataReader),
	// Server ping plugin
	apiServerPingPlugin,
];

/*
 * App instance
 */
const app = new Application({
	plugins,
});

/*
 * Export of the object to use as a UI instance config
 * module.exports instead of export because it is an optional require in index.
 */
module.exports = {
	app,
	auth,
	logger,
	localStorages,
	ordersServer: server,
	uuidGenerator: new UUIDGenerator(),
	locale: 'fr-CA',
	currency: 'CAD',
	showConsole: false,
	moneyDenominations: [0.05, 0.1, 0.25, 1, 2, 5, 10, 20, 50, 100],
	strings: {
		'fr-CA': strings,
	},
};
