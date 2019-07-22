// Initialize app
const _server = 'https://biketrack-dev.solutionwin.net/api/', // api url
      _appVersion = '1.0.2', // change this when updating app
      _apkFileUrl='https://biketrack.solutionwin.net/application/Dorbean.apk',
      _appVersionUrl="https://biketrack.solutionwin.net/application/version.json"; //
                    /** 
                     * version format:
                     *  {
                            "version": "1.0.1"
                        }
                    */


var userLoggedIn = false;
var myApp = new Framework7({ //
    preprocess: function (content, url, next) {
        var template = Template7.compile(content);
        var resultContent = template({
            app_icon: 'Dorbean',
            top_right_icon: '',
            back_botton: '<i class="pe-7s-angle-left"></i>',
            main_app_title: 'Savvy Tailor'
        });
        next(resultContent);
    },
    onPageInit: function (app, page) {
        var login_status = localStorage.getItem('auth');
        if (login_status === true || login_status === 'true') {

        } else {
//            app.loginScreen();
            app.popup('#login-screen');
        } 
        
    }
});
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});
var core = {
    debug_mode: true,
    domain: 'misto.alrasub.com',
//    server: 'http://www.eshmar.com/dev/biketrack/public/api/',
    server: _server,
    app_version: _appVersion,
    app_version_url: _appVersionUrl,
    isUpdating:false,
    apk_url: _apkFileUrl,
    user_id: '',
    login_status: '',
    app_state: '',
    current_screen: '',
    isOnline: function () {
        if (core.debug_mode) {
            return true;
        }
        if (typeof navigator.connection == 'undefined')
        {
            core.alert('Error', 'There is no Internet, please connect to the internet to perform this operation', 'OK')
            return false;
        } else {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN] = false;
            states[Connection.ETHERNET] = true;
            states[Connection.WIFI] = true;
            states[Connection.CELL_2G] = true;
            states[Connection.CELL_3G] = true;
            states[Connection.CELL_4G] = true;
            states[Connection.CELL] = true;
            states[Connection.NONE] = false;
            if (states[networkState] === false) {
                core.alert('Error', 'There is no Internet, please connect to the internet to perform this operation', 'OK')
            }
            return states[networkState];
        }

    },
    checkForUpdate: function(){
        if(!core.isUpdating){
            core.isUpdating = true;
            setTimeout(function(){ 
                $$.ajaxSetup({cache: false});
                $$.getJSON(core.app_version_url, function (response) {
                    var _version = response.version;
                    var _isVersion = helpers.compareVersionNumbers(core.app_version,_version)
                    console.log(_isVersion)
                    if(_isVersion === -1){//need to update
                        myApp.modal({
                            title:  'Outdated',
                            text: 'Your app is outdated, please update.',
                            buttons: [
                              {
                                text: 'Update',
                                onClick: function() {
                                    if (core.isOnline()) {
                                        var url = core.apk_url;
                                        if (core.deviceType() == 'iphone') {
                                            core.openIosExternalLink(url);
                                        } else {
                                            core.openAndroidExternalLink(url);
                                        }
                                        core.isUpdating = false;
                                    }
                                }
                              }
                            ]
                        })  
                    }
                    core.isUpdating = false;
                });
            }, 0);
        }
    },
    deviceType: function () {

        if (typeof device != 'undefined') {

            running_device = device.platform.toLowerCase();
            if (running_device == 'android') {

                return 'android';
            } else if ((running_device == 'ipad') || (running_device == 'ipad simulator') || (running_device == 'ios')) {

                return 'iphone';
                return 'ipad';
            } else if ((running_device == 'iphone') || (running_device == 'iphone simulator')) {

                return 'iphone';
            } else if (running_device == 'desktop') {

                return 'desktop';
            }

            return '';
        } else {
            return 'desktop';
        }

    },
    getRequest: function (url, parms, callback, show_spinner) {
        show_spinner = show_spinner || 'yes';
        if (core.isOnline()) {
            if (show_spinner == 'yes') {
                myApp.showIndicator();
            }

            var req_url = core.server + url;
            if (parms) {
                $.each(parms, function (key, value) {
                    req_url += '/' + value;
                });
            }
            core.log(req_url);
            $$.ajaxSetup({cache: false});
            $$.getJSON(req_url, function (response) {
                if (show_spinner == 'yes') {
                    myApp.hideIndicator();
                }
                callback(response, 'success');
            });
        } else {
            callback('', 'offline');
        }
    },
    postRequest: function (url, post_data, callback, show_spinner) {
        show_spinner = show_spinner || 'yes';
        if (core.isOnline()) {
            if (show_spinner == 'yes') {
                myApp.showIndicator();
            }
            var req_url = core.server + url;
            core.log(req_url);
            $$.ajax({
                url: req_url,
                context: document.body,
                data: post_data,
                method: "POST",
                error: function (data, transport) {
                    if (show_spinner == 'yes') {
                        myApp.hideIndicator();
                    }
                    callback(data, 'error');
                },
                success: function (response) {
                    if (show_spinner == 'yes') {
                        myApp.hideIndicator();
                    }
                    callback(response, 'success');
                }
            });
        } else {
            callback('', 'offline');
        }
    },
    goBack: function (e) {
        var page_center = $$('.navbar .navbar-on-center a').attr('href');
        if (typeof page_center == 'undefined' || page_center == 'exit') {
            navigator.app.exitApp();
        } else {
            var login_status = localStorage.getItem('login_status');
            if (login_status === true || login_status === 'true') {
                e.preventDefault();
                mainView.router.back({
                    url: page_center,
                    force: true,
                    ignoreCache: true
                });
            } else {
                navigator.app.exitApp();
            }
        }
    },
    onPause: function () {
        core.app_state = 'pause';
    },
    onResume: function () {
        core.app_state = 'active';
        core.checkForUpdate();
    },
    alert: function (title, message, button_label, callback) {

        if (typeof navigator.notification == 'undefined') {
            alert(message);
        } else {
            navigator.notification.alert(
                    message,
                    function () {
                        if (typeof callback == 'function') {
                            callback();
                        }
                    },
                    title,
                    button_label
                    );
        }

    },
    confirm: function (title, message, ok_callback, no_callback, yes_text, no_text) {

        if (typeof yes_text == undefined) {
            yes_text = 'Proceed';
            no_text = 'Cancel';
        }
        if (typeof navigator.notification == 'undefined') {

        } else {
            navigator.notification.confirm(message, function (button_index) {

                if (button_index == 1) {
                    ok_callback();
                } else {
                    no_callback();
                }

            }, title, [yes_text, no_text]);
        }


    },
    notificationSound: function () {
        var url = 'assets/sound/notification.mp3';
        var src = core.getMediaURL(url);
        if (core.my_media == null && src != 'undefined') {
            core.my_media = new Media(src, core.notificationSoundSuccess, core.notificationSoundError, core.notificationSoundStatus);
        }
        core.my_media.play();
    },
    getMediaURL: function (s) {
        if (device.platform.toLowerCase() === "android")
            return "/android_asset/www/" + s;
        return s;
    },
    notificationSoundSuccess: function (e) {
        core.log(e);
    },
    notificationSoundError: function (e) {
        core.log('error');
        core.log(e);
    },
    notificationSoundStatus: function (status) {
        if (core.my_media) {
            if (status == 4) {
                core.my_media = null;
            }
        }

    },
    log: function (log_data) {
        if (core.debug_mode === true) {

            if ($.isArray(log_data)) {
                console.log(JSON.stringify(log_data));
            } else {
                console.log(log_data);
            }
        } else if (core.debug_mode === 1) {
            if ($.isArray(log_data)) {
                alert(JSON.stringify(log_data));
            } else {
                alert(log_data);
            }
        }
    },
    currentDate: function () {
        var dt = new Date();
        var c_month = dt.getMonth() + 1;
        var c_day = dt.getDate();
        var c_year = dt.getFullYear();
        if (c_day < 10) {
            c_day = '0' + c_day;
        }
        if (c_month < 10) {
            c_month = "0" + c_month;
        }
        var current_time = c_year + '-' + c_month + '-' + c_day;
        return current_time;
    },
    loadExternalLink: function (url) {
        if (core.isOnline()) {
            if (core.deviceType() == 'iphone') {
                core.openIosExternalLink(url);
            } else {
                core.openAndroidExternalLink(url);
            }
        }
    },
    openIosExternalLink: function (url) {
        window.browserRef = window.open(url, '_blank', 'hidden=no,toolbar=yes,location=no,transitionstyle=crossdissolve,enableviewportscale=yes,suppressesIncrementalRendering=no,closebuttoncaption=< Back');
        browserRef.addEventListener('loadstart', function () {
            browserRef.executeScript({code: 'window.suppressDownloadAppLink = true;'});
        });
    },
    openAndroidExternalLink: function (url) {
        window.open(url, "_system", 'location=no,toolbar=no');
    },
    getProfileImagePath: function (callback) {
        var image_name = localStorage.getItem('agent_image');
        var img_url = '';
        if (image_name) {
            img_url = core.server + 'upload/' + image_name;
        } else {
            img_url = 'images/default-user.png';
        }
        callback(img_url);
    },
    getServerImagePath: function (image_name, callback) {
        var img_url = '';
        if (image_name) {
            img_url = core.server + 'upload/' + image_name;
        } else {
            img_url = 'assets/images/default-user.png';
        }
        callback(img_url);
    },

};
$(".ext-link").on("click", function () {
    if (core.isOnline()) {
        var url = $(this).attr('href');
        if (core.deviceType() == 'iphone') {
            core.openIosExternalLink(url);
        } else {
            core.openAndroidExternalLink(url);
        }
    }
});