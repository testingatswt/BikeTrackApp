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
            initializeMap();
        }


        
        if (core.isOnline()) {
            var login_status = Cookies.get(login.login_status);
            if (login_status === true || login_status === 'true') {
                //app.startLocationTracking();
            }
            
        }
        profile.showSideMenuName();
        login.inputMask();
        login.fillData();
    },
    checkLogin: function (callback) {
        $$('body').removeClass('tailor_wrapper');
        $$('body').removeClass('user_wrapper');
        var login_status = Cookies.get(login.login_status);
       
        if (login_status === true || login_status === 'true') {
            core.user_id = Cookies.get('user_id');
            callback(true);
        } else {
            mainView.router.loadPage('templates/login-screen-page.html');
            callback(false);
        }
    },
    startLocationTracking: function(){
        // maps.setCurrentLocation(function(err,current_loc){
        //     if(err) core.log(err);
        //     maps.show_map('mapcanvas');
        // });
        
        // var status = Cookies.get('isStarted');
        // if(status == true || status == 'true'){
        //     $('.online_status').prop('checked',true);
        // }
        //initializeMap();
        
        
    },
    setSession: function (data) {
        Cookies.set(login.login_status, true, {expires: helpers.session_expire});
        app.saveSession(data);
    },
    saveSession: function (result) {
        Cookies.set('user_id', result.user_id, {expires:helpers.session_expire});
        Cookies.set('driver_id', result.rider_id, {expires:helpers.session_expire});
        Cookies.set('full_name', result.full_name, {expires:helpers.session_expire});
        Cookies.set('mobile', result.mobile, {expires:helpers.session_expire});
        Cookies.set('email', result.email, {expires:helpers.session_expire});
        Cookies.set('driver_pic', result.driver_pic, {expires:helpers.session_expire});
        Cookies.set('vehicle_number', result.vehicle_number, {expires:helpers.session_expire});
        Cookies.set('restaurant_address', result.restaurant_address, {expires:helpers.session_expire});
        Cookies.set('restaurant_name', result.restaurant_name, {expires:helpers.session_expire});
        Cookies.set('restaurant_latitude', result.restaurant_latitude, {expires:helpers.session_expire});
        Cookies.set('restaurant_longitude', result.restaurant_longitude, {expires:helpers.session_expire});
        profile.showSideMenuName();
        profile.loadSetting();
        profile.loadMap();

        if(result.report){
            Cookies.set('riding_start_time',  new Date(result.report.start_time+" UTC"), {expires: helpers.session_expire});
            Cookies.set('starting_location',  result.report.started_location, {expires: helpers.session_expire});
        }
        else{
            // stop working if started
            var isRidingStarted = Cookies.get("isRidingStarted")||"";
            if(typeof isRidingStarted === "undefined" || isRidingStarted=="") isRidingStarted = false;
            if(isRidingStarted==="true" || isRidingStarted === true){
                //end it
                myApp.showPreloader("Syncing locations...");

                maps.start_background_location(false);
                BackgroundGeolocation.forceSync(function(){
                    myApp.hidePreloader();
                });
                Cookies.remove("isRidingStarted");
                Cookies.remove("riding_start_time");
                Cookies.remove("starting_location");
                $('#btn--working').text('Start day');
                Cookies.remove('isStarted');
                $('.online_status').prop('checked', false);
                clearInterval(timeInterval_Timer);
                timeInterval_Selector.hide();
                myApp.closeModal();
            }
        }
        
    },
    
};