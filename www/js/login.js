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
                        $$('.login_form .email').val('');
                        $$('.login_form .password').val('');
                        localStorage.setItem('isStarted', true); 
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

    changePassword: function () {
        if (core.isOnline()) {
            var forgot_password = $$('.change_password_form .forgot_password').val();
            var password = $('.change_password_form .password').val();
            var repeat_password = $('.change_password_form .repeat_password').val();

            if (password === '') {
                core.alert('Error', 'Password required', 'OK', function () {
                    return;
                });
                return;
            }
            if (repeat_password === '') {
                core.alert('Error', 'Repeat Password required', 'OK', function () {
                    return;
                });
                return;
            }

            if (password !== repeat_password) {
                $$('input[id=repeat_password]').addClass('empty');
                core.alert('Error',
                        "Repeat passwords don't match. Try again?",
                        'OK',
                        function () {
                            return;
                        });
                return;
            }

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
        maps.sendStatus(3);
        localStorage.setItem(login.login_status, false);
        localStorage.setItem('user_id', '');
        localStorage.setItem('driver_id', '');
        localStorage.setItem('full_name', '');
        localStorage.setItem('email', '');
        localStorage.setItem('mobile', '');
        localStorage.setItem('driver_pic', '');
        localStorage.setItem('isStarted', false);
        $('.online_status').prop('checked', false);
        //app.startLocationTracking();
        myApp.loginScreen();
    },
};