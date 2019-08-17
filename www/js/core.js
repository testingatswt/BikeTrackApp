// Initialize app
const server_url= 'http://68.183.189.31'; // like https://www.example.com
//http://68.183.189.31
//https://kingridersapp.solutionwin.net

const _server = server_url+'/api/', // api url
      _apkFileUrl=server_url+'/application/Dorbean.apk',
      _appVersionUrl=server_url+"/application/version.json";
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
    debug_mode: false,
    domain: 'misto.alrasub.com',
//    server: 'http://www.eshmar.com/dev/biketrack/public/api/',
    server: _server,
    app_version: '',
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
            setTimeout(function(){ 
                $$.ajaxSetup({cache: false});
                $$.getJSON(core.app_version_url, function (response) {
                    var _version = response.version;
                    cordova.getAppVersion(function(app_version) {
                        core.app_version=app_version;
                        var _isVersion = helpers.compareVersionNumbers(app_version,_version)
                        core.log("Version: "+_isVersion);
                        if(_isVersion === -1){//need to update
                            core.isUpdating=true;
                            var permissions = cordova.plugins.permissions;
                            permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
                                if (!status.hasPermission) {
                                    var errorCallback = function() {
                                        core.isUpdating=false;
                                        alert("App requires storage permission to update");
                                    };
                                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE,
                                        function(status) {
                                            if (!status.hasPermission)
                                                errorCallback();
                                            else {
                                                initUpdate();
                                            }
                                        },
                                        errorCallback);
                                } else {
                                    initUpdate();
                                }
                            }, null);
                            var initUpdate = function() {
                                var pBar=null;
                                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileSystem) {
                                    var entry = "";
                                    entry = fileSystem;
                                    entry.getDirectory("kingridersapp_updates", {
                                        create: true,
                                        exclusive: false
                                    }, onGetDirectorySuccess, onGetDirectoryFail);
                                    function onGetDirectorySuccess(dir) {
                                        downloadFile(dir);
                                    };
                                    function onGetDirectoryFail(err) {
                                        if(pBar) myApp.closeModal(pBar);
                                        core.isUpdating=false;
                                        core.log("[Updating] error: "+err);
                                    }
                                    var downloadFile = function(fileSystem) {
                                        var fileUri = fileSystem.nativeURL;
                                        window.resolveLocalFileSystemURL(
                                            fileUri,
                                            onFileResolved,
                                            onFileResolveError);
            
                                        function onFileResolved(fe) {
                                            fe.getFile('KingridersApp_v'+_version+'.apk', {
                                                create: true,
                                                exclusive: false
                                            }, function(fileEntry) {
                                                core.log("[Updating] apk donwload started");
                                                var localPath = fileEntry.toURL(),
                                                    fileTransfer = new FileTransfer();
                                                pBar=myApp.modal({
                                                    title: 'Updating',
                                                    text: 'Please wait while app is updating..',
                                                    afterText:'<p class="progress_bar my-5"></p>',
                                                });
                                                var container = $$(pBar).find('.progress_bar');
                                                    
                                                // Simluate Loading Something
                                                var progress = 0;
                                                if (container.children('.progressbar').length <=0){
                                                    myApp.showProgressbar(container, 0, 'orange');
                                                }
                                                fileTransfer.onprogress = function(progressEvent) {
                                                    
                                                    if (progressEvent.lengthComputable) {
                                                        progress = (progressEvent.loaded / progressEvent.total)*100;
                                                    } else {
                                                        progress++;
                                                    }
                                                    core.log("[Updating] progress: "+progress);
                                                    myApp.setProgressbar(container, progress);
                                                };
                                                var apkURL = encodeURI(core.apk_url);
                                                fileTransfer.download(apkURL, localPath, function(entry) {
                                                    core.log("[Updating] apk download complete");
                                                    
                                                    cordova.plugins.fileOpener2.open(
                                                        entry.toURL(),
                                                        'application/vnd.android.package-archive',
                                                        {
                                                            error : function(e) {
                                                                core.log('[Updating] Error status: ' + e.status + ' - Error message: ' + e.message);
                                                            },
                                                            success : function () {
                                                                core.log('[Updating] file opened successfully');
                                                            }
                                                        }
                                                    );
                                                   // myApp.hideProgressbar(container);
                                                    if(pBar) myApp.closeModal(pBar);
                                                    core.isUpdating = false;
                                                    core.log("[Updating] apk installation triggered");
                                                }, function(error) {
                                                    core.isUpdating = false;
                                                    if(pBar) myApp.closeModal(pBar);
                                                    core.log("[Updating] Error downloading APK: " + error.message);
                                                });
                                            }, function(evt) {
                                                if(pBar) myApp.closeModal(pBar);
                                                core.isUpdating = false;
                                                core.log("[Updating] error getting root filesytem: " + evt);
                                            });
                                            core.log("[Updating] resovled the root folder,URL" + fe.toURL())
                                        }
            
                                        function onFileResolveError(er) {
                                            core.isUpdating = false;
                                            if(pBar) myApp.closeModal(pBar);
                                            core.log("[Updating] Error while resolving the root folder:" + er.message)
                                        }
                                    };
                                }, function(evt) {
                                    core.isUpdating = false;
                                    if(pBar) myApp.closeModal(pBar);
                                    alert("Error preparing to download the latest updates! - Err - " + evt.target.error.code);
                                    
                                });
                            }


                            // myApp.modal({
                            //     title:  'Outdated',
                            //     text: 'Your app is outdated, please update.',
                            //     buttons: [
                            //       {
                            //         text: 'Update',
                            //         onClick: function() {
                            //             if (core.isOnline()) {
                            //                 var url = core.apk_url;
                            //                 if (core.deviceType() == 'iphone') {
                            //                     core.openIosExternalLink(url);
                            //                 } else {
                            //                     core.openAndroidExternalLink(url);
                            //                 }
                            //                 core.isUpdating = false;
                            //             }
                            //         }
                            //       }
                            //     ]
                            // })  
                        }
                    });
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
            $.ajax({
                url: req_url,
                method: "GET"
            })
            .done(function(data) {
                //Ajax request was successful.
                if (show_spinner == 'yes') {
                    myApp.hideIndicator();
                }
                if(data.status_code && data.status_code===404){
                    //logout
                   login.logout();
                   myApp.alert('Your session is expired. Please login.', 'Session expired');
                   return false;
                }
                callback(data, 'success');
            })
            .fail(function(xhr, status, error) {
                if (show_spinner == 'yes') {
                    myApp.hideIndicator();
                }
                core.log(xhr.status + ': ' + xhr.statusText);
                //Ajax request failed.
                if(xhr.status===404){
                    //logout
                    login.logout();
                    myApp.alert('Your session is expired. Please login.', 'Session expired');
                    return false;
                }
                callback(error, 'error');
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
            $.ajax({
                url: req_url,
                context: document.body,
                data: post_data,
                dataType:'JSON', 
                method: "POST"
            })
            .done(function(data) {  
                //Ajax request was successful.
                if (show_spinner == 'yes') {
                    myApp.hideIndicator();
                }
                if(data.status_code && data.status_code===404){
                    //logout
                   login.logout();
                   myApp.alert('Your session is expired. Please login.', 'Session expired');
                   return false;
                }
                callback(JSON.stringify(data), 'success');
            })
            .fail(function(xhr, status, error) {
                if (show_spinner == 'yes') {
                    myApp.hideIndicator();
                }
                core.log(xhr);
                core.log(xhr.status + ': ' + xhr.statusText);
                //Ajax request failed.
                if(xhr.status===404){ // page not found
                    //logout
                   login.logout();
                   myApp.alert('Your session is expired. Please login.', 'Session expired');
                   return false;
                }
                if(xhr.status===400){ // server side error
                    myApp.alert('A server side error occurs. Please contact the admin', 'Error');
                }
                callback(JSON.stringify(data), 'error');
            });
        } else {
            callback('', 'offline');
        }
    },
    goBack: function (e) {
        if(mainView.activePage.name==="profile"){
            e.preventDefault();
            mainView.router.back({
                url: '/',
            });
        }
        else{
            if ($$('.modal-in').length > 0 && !$$('.modal-in').hasClass('login-screen')) { 
                e.preventDefault();
                myApp.closeModal();
                return false;
            }
            var page_center = $$('.navbar .navbar-on-center a').attr('href');
            if (typeof page_center == 'undefined' || page_center == 'exit') {
                navigator.app.exitApp();
            } else {
                var login_status = localStorage.getItem('login_status');
                if (login_status === true || login_status === 'true') {
                    e.preventDefault();
                    mainView.router.back({
                        url: page_center,
                    });
                } else {
                    navigator.app.exitApp();
                }
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

