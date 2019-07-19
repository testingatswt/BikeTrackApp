var $$ = Dom7;
var $r = 0;
var timeInterval_Timer,
    timeInterval_Selector=$('.work__desc');
    timeInterval_Interval=45 * 1000; //45 seconds
var timeInterval_Callback = function(){
    // console.log(++$r);
    var _time = localStorage.getItem("riding_start_time");
    if(typeof _time === "undefined"){
        clearInterval(timeInterval_Timer);
        return false;
    }
    _time = parseFloat(_time);
    console.log(new Date(_time));
    var _timeSince = helpers.timeSince(new Date(_time))+" ago";
    console.log(_timeSince);
    timeInterval_Selector.text('Started: '+_timeSince);

}
var reports = {
    submit:function(){
        // var formData = myApp.formToData('#frmReport');
        var _formData = $('#frmReport').serialize();
        if(core.debug_mode){
            console.log("Reports data: ",JSON.stringify(_formData));
        }
    },
    endday:function($form){
        var _form = $($form);
        var driver_id = localStorage.getItem('driver_id');
        var __data = helpers.getFormData(_form);
        __data.rider_id=driver_id;
        __data.status=3; // online status => logout - no marker will show
        // var _data = {driver_id: driver_id, status:3, no_of_trips: no_of_trips, location: location};
        var url = "endday";
        core.postRequest(url, __data, function (response, status) {
            var result = JSON.parse(response);
            if(status==="success"){
                if(result.status==="success"){
                    localStorage.removeItem("isRidingStarted");
                    localStorage.removeItem("riding_start_time");
                    localStorage.removeItem("starting_location");
                    $('#btn--working').text('Start day').addClass('color-blue');
                    timeInterval_Selector.hide();
                    myApp.closeModal();
                }
            }
        });
    },
    startRiding:function($self){
        $self = $($self);
        $self.prop('disabled', true);
        clearInterval(timeInterval_Timer);
        var isRidingStarted = localStorage.getItem("isRidingStarted");
        if(typeof isRidingStarted === "undefined") isRidingStarted = false;
        if(isRidingStarted==="true" || isRidingStarted === true){//started...
            //end it
            
            var _started_at = localStorage.getItem("riding_start_time");
            var _ended_at=Date.now();
            var _started_loc = localStorage.getItem("starting_location");
            var _end_loc = null;
            var _form = $('#frmEndDay');
            if(typeof _started_at === "undefined") _started_at = null;
            if(_started_at){
                var _started_atFORMAT = new Date(parseFloat(_started_at));
                $('#ed__started_at').text(_started_atFORMAT.format("mmm dd, yyyy hh:MM TT"));
            }
            var _ended_atFORMAT = new Date(_ended_at);
            $('#ed__ended_at').text(_ended_atFORMAT.format('mmm dd, yyyy hh:MM TT'));
            
            if(typeof _started_loc !== "undefined"){
                _form.find('[name="start_loc"]').val(_started_loc);
                maps.getCurrentLocation(function(err, current_loc){
                    if(err) console.log(err)
                    if(current_loc){
                        // $('#ed__start_loc').html('<a href="#"  data-start-loc="'+_started_loc+'" data-end-loc="'+JSON.stringify(current_loc)+'" class="ed__startEndLoc">Click to see</a>');
                        _end_loc=JSON.stringify(current_loc);
                        console.log(_end_loc);
                        _form.find('[name="end_loc"]').val(_end_loc);
                    }
                });
            }


            
            _form.find('[name="started_at"]').val(new Date(parseFloat(_started_at)).format('dd-mm-yyyy HH:MM:ss', true));
            _form.find('[name="ended_at"]').val(new Date(_ended_at).format('dd-mm-yyyy HH:MM:ss', true));
            var _htmlElem = $('#popup-endday') ;
            var popupHTML = _htmlElem.wrap('<p/>').parent().html();
            _htmlElem.unwrap();
            myApp.popup(popupHTML);
            

        }
        else{//stopped...
            //start it
            var rider_id = localStorage.getItem('driver_id');
            if(typeof rider_id === "undefined"){
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
                app.startLocationTracking();
                myApp.loginScreen();
            }
            else{
                var login_data = {rider_id: rider_id};
                var url = "startday";
                core.postRequest(url, login_data, function (response, status) {
                    if (status === 'success') {
                        var result = JSON.parse(response);
                        if (result.status === 'success') {
                            localStorage.setItem("isRidingStarted", "true");
                            localStorage.setItem("riding_start_time", Date.now());
                            maps.getCurrentLocation(function(err, current_loc){
                                if(err) console.log(err)
                                if(current_loc){
                                    localStorage.setItem("starting_location", JSON.stringify(current_loc));  
                                }
                            });

                            timeInterval_Callback();
                            timeInterval_Selector.show();
                            timeInterval_Timer = setInterval(timeInterval_Callback,timeInterval_Interval);
                            $self.text('End day').removeClass('color-blue');
                            localStorage.setItem('isStarted', true);
                            app.setSession(result);
                            app.startLocationTracking();
                        } else {
                            core.alert('Error', result.error, 'OK');
                        }

                    }
                });
            }
        }
    },
    checkIfStartRiding: function($self){
        $self = $($self);
        clearInterval(timeInterval_Timer);
        var isRidingStarted = localStorage.getItem("isRidingStarted");
        if(typeof isRidingStarted === "undefined") isRidingStarted = false;
        if(isRidingStarted==="true" || isRidingStarted === true){//started...
            timeInterval_Callback();
            timeInterval_Selector.show();
            timeInterval_Timer = setInterval(timeInterval_Callback,timeInterval_Interval);
            $self.text('End day').removeClass('color-blue');
        }
    }
}
reports.checkIfStartRiding('#btn--working');