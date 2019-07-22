var map;
var infowindow;
var $$ = Dom7;
var app = {
    pyrmont: {},
    push: {
        id: '924923450387'
    },
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        document.addEventListener("pause", core.onPause, false);
        document.addEventListener("resume", core.onResume, false);
        document.addEventListener("backbutton", core.goBack, false);

    },
    onDeviceReady: function () {
        core.current_screen = 'index';
        core.onResume();
        if (core.isOnline()) {
//            push.startNotification();
        }

        
        if (core.isOnline()) {
            var login_status = localStorage.getItem(login.login_status);
            if (login_status === true || login_status === 'true') {
                app.startLocationTracking();
            }
            
        }
        profile.showSideMenuName();
    },
    checkLogin: function (callback) {
        $$('body').removeClass('tailor_wrapper');
        $$('body').removeClass('user_wrapper');
        var login_status = localStorage.getItem(login.login_status);
       
        if (login_status === true || login_status === 'true') {
            core.user_id = localStorage.getItem('user_id');
            callback(true);
        } else {
            mainView.router.loadPage('templates/login-screen-page.html');
            callback(false);
        }
    },
    startLocationTracking: function(){
        console.log('asd')
        maps.setCurrentLocation(function(err,current_loc){
            if(err) console.log(err);
            maps.show_map('mapcanvas');
        });
        
        var status = localStorage.getItem('isStarted');
        if(status == true || status == 'true'){
            $('.online_status').prop('checked',true);
        }
        if(typeof BackgroundGeolocation === "undefined"){
            setTimeout(function(){
                initializeMap();
            },500); 
        }else{
            initializeMap();
        }
        
        
    },
    setSession: function (data) {
        localStorage.setItem(login.login_status, true);
        app.saveSession(data);
    },
    saveSession: function (result) {
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('driver_id', result.rider_id);
        localStorage.setItem('full_name', result.full_name);
        localStorage.setItem('mobile', result.mobile);
        localStorage.setItem('email', result.email);
        localStorage.setItem('driver_pic', result.driver_pic);
        localStorage.setItem('vehicle_number', result.vehicle_number);
        localStorage.setItem('restaurant_address', result.restaurant_address);
        localStorage.setItem('restaurant_name', result.restaurant_name);
        localStorage.setItem('restaurant_latitude', result.restaurant_latitude);
        localStorage.setItem('restaurant_longitude', result.restaurant_longitude);
        profile.showSideMenuName();
        profile.loadSetting();
        profile.loadMap();
    },
    
};