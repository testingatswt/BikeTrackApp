map = '';
previousLocation = '';
locationMarkers = [];
stationaryCircles = [];
currentLocationMarker = '';
locationAccuracyCircle = '';
path = '';
var mapOptions = {
    center: {lat: 25.204849, lng: 55.270782},
    zoom: 12,
    disableDefaultUI: true,
};
function initializeMap() {
    console.log('initializeMap called')
    var status = localStorage.getItem('isStarted');
    var driver_id = localStorage.getItem('driver_id');
    BackgroundGeolocation.configure({
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 5,
        distanceFilter: 1,
        // notificationIconColor: "#4CAF50",
        notificationTitle: 'Background tracking',
        notificationText: 'Enabled',
        debug: false,
        stopOnTerminate: false,
        interval: 60000,
        fastestInterval: 15000,
        activitiesInterval: 60000,
        url: core.server + 'rider/store_location',
        // syncUrl: core.server + 'rider/store_sync_location',
        // syncThreshold: 100,
        // customize post properties
        postTemplate: {
            accuracy: "@accuracy",
            altitude: "@altitude",
            bearing: "@bearing",
            latitude: "@latitude",
            locationProvider: "@locationProvider",
            longitude: "@longitude",
            provider: "@provider",
            radius: "@radius",
            speed: "@speed",
            time: "@time",
            driver_id: driver_id
        }
    });
    core.log('i m inside tracking');
        BackgroundGeolocation.on('location', function (location) {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
             //setCurrentLocation(location);
             core.log('[Background Location] Location recieved');
             core.log(location);
             storeLocationServer(location);
            // BackgroundGeolocation.startTask(function (taskKey) {
            //     // execute long running task
            //     // eg. ajax post location
            //     // IMPORTANT: task has to be ended by endTask
            //     BackgroundGeolocation.endTask(taskKey);
            // });
        });

        BackgroundGeolocation.on('error', function(error) {
            console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
          });
          BackgroundGeolocation.on('start', function() {
            console.log('[INFO] BackgroundGeolocation service has been started');
          });
        
          BackgroundGeolocation.on('stop', function() {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
          });
          BackgroundGeolocation.on('stationary', function(stationaryLocation) {
            // handle stationary locations here
            console.log('[INFO] stationary');
          });
          BackgroundGeolocation.on('background', function() {
            console.log('[INFO] App is in background');
            // you can also reconfigure service (changes will be applied immediately)
            //BackgroundGeolocation.configure({ debug: true });
          });
          BackgroundGeolocation.on('foreground', function() {
            console.log('[INFO] App is in foreground');
            //BackgroundGeolocation.configure({ debug: false });
          });
          BackgroundGeolocation.on('abort_requested', function() {
            console.log('[INFO] Server responded with 285 Updates Not Required');
         
            // Here we can decide whether we want stop the updates or not.
            // If you've configured the server to return 285, then it means the server does not require further update.
            // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
            // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
          });
        BackgroundGeolocation.on('authorization', function (status) {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(function () {
                    core.confirm("Permission denied", "App requires location tracking permission. Would you like to open app settings?", function () {
                        return BackgroundGeolocation.showAppSettings();
                    }, function () {}, "Yes", "No");
                }, 1000);
            }else{

            }
        });


        
    
    
}


function setCurrentLocation(location) {
    storeLocationServer(location);

    core.log('[DEBUG] location recieved');
    map = new google.maps.Map(document.getElementsByClassName('mapcanvas')[0], mapOptions);
    if (core.isOnline()) {
        
        if (!currentLocationMarker) {
            currentLocationMarker = new google.maps.Marker({
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3,
                    fillColor: 'gold',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 1
                }
            });
            locationAccuracyCircle = new google.maps.Circle({
                fillColor: 'purple',
                fillOpacity: 0.4,
                strokeOpacity: 0,
                map: map});
        }
        if (!path) {
            path = new google.maps.Polyline({
                map: map,
                strokeColor: 'blue',
                fillOpacity: 0.4});
        }
        
        var latlng = new google.maps.LatLng(Number(location.latitude), Number(location.longitude));
        if (previousLocation) {
            locationMarkers.push(new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 3,
                    fillColor: 'green',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 1
                },
                map: map,
                position: new google.maps.LatLng(previousLocation.latitude, previousLocation.longitude)
            }));
        } else {
            map.setCenter(latlng);
            if (map.getZoom() < 15) {
                map.setZoom(15);
            }
        }

        currentLocationMarker.setPosition(latlng);
        locationAccuracyCircle.setCenter(latlng);
        locationAccuracyCircle.setRadius(location.accuracy);

        path.getPath().push(latlng);
        previousLocation = location;
    }
}

function storeLocationServer(location) {
    var driver_id = localStorage.getItem('driver_id');
    location.driver_id = driver_id;
    var url = 'rider/store_location';
    core.postRequest(url, location, function () {
        
    },'no');
}