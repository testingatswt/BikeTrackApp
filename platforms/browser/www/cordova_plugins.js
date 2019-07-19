cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-android-permissions/www/permissions-dummy.js",
        "id": "cordova-plugin-android-permissions.Permissions",
        "pluginId": "cordova-plugin-android-permissions",
        "clobbers": [
            "cordova.plugins.permissions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-mauron85-background-geolocation/www/BackgroundGeolocation.js",
        "id": "cordova-plugin-mauron85-background-geolocation.BackgroundGeolocation",
        "pluginId": "cordova-plugin-mauron85-background-geolocation",
        "clobbers": [
            "BackgroundGeolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-mauron85-background-geolocation/www/radio.js",
        "id": "cordova-plugin-mauron85-background-geolocation.radio",
        "pluginId": "cordova-plugin-mauron85-background-geolocation"
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/src/browser/network.js",
        "id": "cordova-plugin-network-information.NetworkInfoProxy",
        "pluginId": "cordova-plugin-network-information",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/src/browser/SplashScreenProxy.js",
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "pluginId": "cordova-plugin-splashscreen",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-android-permissions": "1.0.0",
    "cordova-plugin-console": "1.0.7",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-geolocation": "4.0.2",
    "cordova-plugin-mauron85-background-geolocation": "3.0.3",
    "cordova-plugin-network-information": "2.0.2",
    "cordova-plugin-splashscreen": "5.0.3",
    "cordova-plugin-statusbar": "1.0.1",
    "cordova-plugin-whitelist": "1.2.2"
}
// BOTTOM OF METADATA
});