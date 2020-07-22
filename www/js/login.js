var $$ = Dom7;

login = {
    login_status: 'auth',

    process: function () {
        if (core.isOnline()) {
            var email = $$('.login_form .email').val();
            var password = $$('.login_form .password').val();
            if (email === '') {
                core.alert('Error', 'Email required', 'OK', function () {
                    return;
                });
                return;
            }
            if (password === '') {
                core.alert('Error', 'Password required', 'OK', function () {
                    return;
                });
                return;
            }
            myApp.showIndicator();

            var login_data = {email: email, password: password, login: true};
            var url = "login";
            core.postRequest(url, login_data, function (response, status) {
                if (status === 'success') {
                    var result = JSON.parse(response);
                    
                    if (result.status === 'success') {
                        //store emirate id in local storage so next time if will load from cache
                        localStorage.setItem('emirate_id', email);
                        $$('.login_form .email').val('');
                        $$('.login_form .password').val('');
                        Cookies.set('isStarted', true, {expires: helpers.session_expire}); 
                        myApp.closeModal('.login-screen')
                        app.setSession(result);
                        //app.startLocationTracking();
                    } else {
                        myApp.alert(result.error, 'Error');
                    }

                }
            });

        }
    },

    forgotPassword: function () {
        if (core.isOnline()) {
            var email = $$('.forgot_password_form .email').val();
            if (email === '') {
                core.alert('Error', 'Email required', 'OK', function () {
                    return;
                });
                return;
            }

            var login_data = {email: email};
            var url = "login.php/forgot_password";
            core.postRequest(url, login_data, function (response, status) {
                if (status === 'success') {
                    var result = JSON.parse(response);
                    if (result.status === 'success') {
                        core.alert('Success',
                                'Your password reset request has been received. Please check your email for reset instructions.',
                                'OK');
                        register.showForm('change_password_form');
                    } else if (result.status == 'error') {
                        var error = result.msg;
                        if (error == '') {
                            error = 'This user not exist';
                        }
                        core.alert('Error', error, 'OK', function () {
                            return;
                        });
                    } else {
                        myApp.alert(result.msg, 'Error');
                    }

                }
            });
        }
    },

    changePassword: function ($form) {
        if (core.isOnline()) {
            var current_password = $$($form).find('[name="current"]').val().trim();
            var password = $$($form).find('[name="new"]').val().trim();
            var repeat_password = $$($form).find('[name="confirm"]').val().trim();

            if (current_password === '') {
                myApp.alert('Current Password required', 'Error');
                return;
            }
            if (password === '') {
                myApp.alert('Password required', 'Error');
                return;
            }
            if (repeat_password === '') {
                myApp.alert('Confirm Password required', 'Error');
                return;
            }

            if (password !== repeat_password) {
                $$($form).find('[name="confirm"]').val('');
                myApp.alert('Confirm Password required', 'Error');
                return;
            }
            return;

            var login_data = {forgot_password: forgot_password, password: password};
            var url = "login.php/change_password";
            core.postRequest(url, login_data, function (response, status) {
                if (status === 'success') {
                    var result = JSON.parse(response);
                    if (result.status === 'success') {
                        core.alert('Success',
                                'Password Change Successfull',
                                'OK');
                        register.showForm('login_form');
                    } else if (result.status == 'error') {
                        var error = result.msg;
                        if (error == '') {
                            error = 'This user not exist';
                        }
                        core.alert('Error', error, 'OK', function () {
                            return;
                        });
                    } else {
                        core.alert('Error', result.msg, 'OK');
                    }

                }
            });


        }
    },

    logout: function () {
        myApp.closeModal();
        var drive_id = Cookies.get('driver_id')||"";
        BackgroundGeolocation.startTask(function (taskKey) {
            // execute long running task
            // eg. ajax post location
            // IMPORTANT: task has to be ended by endTask
            
            maps.sendStatus(2, drive_id, taskKey);
            
        });
        helpers.removeAllCookies();
        $('#btn--working').text('Start day');
        $('.online_status').prop('checked', false);
        //app.startLocationTracking();
        myApp.loginScreen();
        maps.start_background_location(false);

        login.fillData();
    },
    inputMask:function(){
        var input = $('#login-screen [name="email"]');
        login.IMask=IMask(
            input[0], {
            mask: '000-0000-0000000-0'
        });
    },
    IMask:null,
    fillData:function(){
        var emirate_id = localStorage.getItem('emirate_id');
        if(emirate_id){
            $('#login-screen [name="email"]').val(emirate_id);
        }
    }
};