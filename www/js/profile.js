var $$ = Dom7;
$$(document).on('pageInit', '.page[data-page="profile"]', function (e) {
    profile.loadSetting();
    profile.loadMap();
    profile.getFromServer();
});

var profile = {
    template_route: 'templates/profile/',
    tableName: 'PROFILE',

    showSideMenuName: function () {
        var full_name = Cookies.get('full_name')||"";
        var vehicle_number = Cookies.get('vehicle_number')||"";
        $$('.user_profile_row h3').html(full_name);
        $('.user_profile_row .user_name').html(full_name);
        $('.user_profile_row .vehicle_number').html(vehicle_number);
        var driver_pic = Cookies.get('driver_pic')||"";
        if (driver_pic) {
            var url = driver_pic;
            $$('.user_profile_row img').attr('src', url);
        }
    },

    loadSetting: function () {

        var full_name = Cookies.get('full_name')||"";
        var email = Cookies.get('email')||"";
        var restaurant_name = Cookies.get('restaurant_name')||"";
        var restaurant_address = Cookies.get('restaurant_address')||"";
        var mobile = Cookies.get('mobile')||"";
        var driver_pic = Cookies.get('driver_pic')||"";
        $('input[name=full_name]').val(full_name);
        $('input[name=mobile]').val(mobile);
        $('input[name=email]').val(email);
        $('input[name=restaurant_name]').val(restaurant_name);
        $('input[name=restaurant_address]').val(restaurant_address);
        $('#profile_picture_change').val('no');
        if (driver_pic) {
            var url = driver_pic;
            $$('.user_profile_row img').attr('src', url);
            $$('.user_picture img').attr('src', url);
            $$('.profile_picture').val(url);
        }

    },

    getFromServer: function () {
        var driver_id = Cookies.get('driver_id')||"";
        var login_status = Cookies.get(login.login_status)||"";
        if(typeof login_status == "undefined" || login_status == "")return;
        if(typeof driver_id == "undefined" || driver_id == ""){
            // session expire
            login.logout();
            myApp.alert('Your session is expired. Please login.', 'Session expired');
            return;
        }
        var params = [driver_id];
        var url = 'rider/latestData';
        core.getRequest(url, params, function (response, status) {
            if (status === 'success') {
                var result = response;
                if (result.status === 'success') {
                    app.saveSession(result);
                }
            }

        });
    },

    displayImage: function (img_full_path) {
        $$('.user_picture img').attr('src', img_full_path);
        $('#profile_picture').val(img_full_path);
        $('#profile_picture_change').val('yes');
    },
    loadMap: function () {
        var restaurant_name = Cookies.get('restaurant_name')||"";
        var restaurant_latitude = parseFloat(Cookies.get('restaurant_latitude'))||0;
        var restaurant_longitude = parseFloat(Cookies.get('restaurant_longitude'))||0;
        if (restaurant_latitude == '' && restaurant_longitude == '') {
            return false;
        }
        var mapOptions = {
            center: {lat: restaurant_latitude, lng: restaurant_longitude},
//            center: {lat: 37.3318907, lng: -122.0318303},
            zoom: 8,
            disableDefaultUI: true,
        };
        if (core.isOnline()) {
            if (typeof google !== 'undefined') {
                if($("#returant_mapcanvas").length){
                    var current_lat_long = mapOptions.center;
                    map = new google.maps.Map(Dom7('#returant_mapcanvas')[0], mapOptions);
                    var marker = new google.maps.Marker({
                        position: current_lat_long,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: restaurant_name
                    });
                    marker.addListener('click', function () {
                        if (marker.getAnimation() !== null) {
                            marker.setAnimation(null);
                        } else {
                            marker.setAnimation(google.maps.Animation.BOUNCE);
                        }
                    });
                    maps.infowindow = new google.maps.InfoWindow();
                    marker.setMap(map);
                }
            }
        }
    }

};