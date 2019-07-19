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
    var status = localStorage.getItem('isStarted');
    var driver_id = localStorage.getItem('driver_id');
    BackgroundGeolocation.configure(setCurrentLocation,{
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 0,
        distanceFilter: 0,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        debug: false,
        interval: 15000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        url: core.server + 'rider/store_location',
        httpHeaders: {
            'X-FOO': 'bar'
        },
        // customize post properties
        postTemplate: {
            lat: '@latitude',
            lon: '@longitude',
            driver_id: driver_id
        }
    });
    core.log('i m inside tracking');
    if(status == true || status == 'true'){
        core.log('if tracking enabled');
        BackgroundGeolocation.on('location', function (location) {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            setCurrentLocation(location);
            BackgroundGeolocation.startTask(function (taskKey) {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                BackgroundGeolocation.endTask(taskKey);
            });
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


        BackgroundGeolocation.checkStatus(function (status) {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
            core.log(status);
            if (!status.isRunning) {
                BackgroundGeolocation.start();
            }else{

            }
        });

       
    }else{
        core.log('else tracking is not enabled');
        BackgroundGeolocation.stop();
        BackgroundGeolocation.on('stop', function () {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });
    }
    
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