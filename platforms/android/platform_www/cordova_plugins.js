cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-android-permissions.Permissions",
    "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
    "pluginId": "cordova-plugin-android-permissions",
    "clobbers": [
      "cordova.plugins.permissions"
    ]
  },
  {
    "id": "cordova-plugin-mauron85-background-geolocation.BackgroundGeolocation",
    "file": "plugins/cordova-plugin-mauron85-background-geolocation/www/BackgroundGeolocation.js",
    "pluginId": "cordova-plugin-mauron85-background-geolocation",
    "clobbers": [
      "BackgroundGeolocation"
    ]
  },
  {
    "id": "cordova-plugin-mauron85-background-geolocation.radio",
    "file": "plugins/cordova-plugin-mauron85-background-geolocation/www/radio.js",
    "pluginId": "cordova-plugin-mauron85-background-geolocation"
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "runs": true
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.2.2",
  "cordova-plugin-console": "1.0.7",
  "cordova-plugin-statusbar": "1.0.1",
  "cordova-plugin-splashscreen": "5.0.3",
  "cordova-plugin-network-information": "2.0.2",
  "cordova-plugin-device": "2.0.3",
  "cordova-plugin-android-permissions": "1.0.0",
  "cordova-plugin-mauron85-background-geolocation": "3.0.3",
  "cordova-plugin-geolocation": "4.0.2"
};
// BOTTOM OF METADATA
});