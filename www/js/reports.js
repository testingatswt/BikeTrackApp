var $$ = Dom7;

var $r = 0;
var timeInterval_Timer,
    timeInterval_Selector=$('.work__desc');
    timeInterval_Interval=45 * 1000; //45 seconds
var timeInterval_Callback = function(){
    var _time = Cookies.get("riding_start_time");
    if(typeof _time === "undefined"){
        clearInterval(timeInterval_Timer);
        return false;
    }
    var _timeSince = helpers.timeSince(new Date(_time))+" ago";
    core.log(_timeSince);
    timeInterval_Selector.text('Started: '+_timeSince);

}
var reports = {
    reports___datePicker:null,
    get_previous_reports:function(){ 
        if(reports.reports___datePicker){
         var _result_container = $('#reports__search-result ul');
         _result_container.html('');
         var _datePickerValue = reports.reports___datePicker.value; 
         var driver_id = Cookies.get('driver_id')||"";
         var _dates = [];
         _datePickerValue.forEach(function(_v,_i){
            _dates.push(new Date(_v).format('dd-mm-yyyy'));
         });
         var __data ={date:_dates[0], rider_id:driver_id};
         var url="get-trips";
         core.postRequest(url, __data, function (response, status) {
            core.log('reports_status: '+status);
            core.log(response);
            if(status==="success"){
                var result = JSON.parse(response);
                if(result.status==="success"){
                    var _report = result.reports;
                    
                        core.log(_report);  
                        var _card = $('<li class="card" />');
                            var _cardHeader = $('<div class="card-header" />');
                            var _cardContent = $('<div class="card-content" />');
                            var _cardContentInner = $('<div class="card-content-inner" />');
                            var _timingHTML = '';
                            var no_of_trips = 0;
                            var isEmpty = true;
                            if(_report!==null){
                                if(_report.no_of_trips!=null){
                                    no_of_trips = _report.no_of_trips;
                                    isEmpty = false;
                                }
                            } 
                            core.log("empty: "+isEmpty); 
                            var _html='';
                            if(isEmpty){
                            _html =  '     '  + 
                            '<div class="w-full">    '  + 
                            '    <div class="w-full text-center font-bold mb-3">  '  + 
                            '       <div class="block my-7">  '  + 
                            '           <span class="trip_text text-2xl" data-trips="'+no_of_trips+'">'+no_of_trips+'</span>&nbsp;Trips  '  + 
                            '       </div>  '  + 
                            '       <div class="accordion-item">  '  + 
                            '       <div class="accordion-item-toggle">  '  + 
                            '           <button class="w-1/2 bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline">  '  + 
                            '               Add Trip  '  + 
                            '           </button>  '  +
                            '           </div>  '  + 
                            '           <div class="accordion-item-content">  '  + 
                            '               <form id="frmTrip" class="px-8 pt-5" onsubmit="reports.addtrip(this);return false;">  '  + 
                            '                   <div class="flex">  '  + 
                            '                       <input type="text" name="no_of_trips" placeholder="Enter trips" class="appearance-none mr-1 border-2 w-9/12 py-2 px-2 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 font-mono">  '  + 
                            '                       <button type="submit" class="p-0 py-2 w-3/12 bg-blue-700 text-white text-center">Save</button>  '  + 
                            '                                                                 '  + 
                            '                   </div>  '  + 
                            '               </form>  '  + 
                            '           </div>  '  + 
                            '       </div>  '  + 
                            '   </div>    '  + 
                            '</div>   '  ; 
                            }
                            else{
                                _html=''+
                                '   <div class="w-full">    '  + 
                                '     <div class="w-full text-center font-bold mb-3 reports__card-inner">  '  + 
                                '       <form onsubmit="reports.update_trip(this);return false;">  '  + 
                                '         <div class="block my-7">  '  + 
                                '             <div class="flex justify-center content-center">   '  + 
                                '                 <input type="hidden" name="trip_id" value="'+_report.id+'">   '  + 
                                '                 <input type="text" name="no_of_trips" value="'+no_of_trips+'" readonly class="text-center appearance-none mr-1 border-2 w-12 py-2 px-2 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 font-mono">  '  + 
                                '                 <span class="pt-1 text-xl">Trips</span>  '  + 
                                '             </div>  '  + 
                                '                                                     '  + 
                                '         </div>  '  + 
                                '         <div class="flex justify-center content-center">   '  + 
                                '             <button disabled type="submit" class="w-1/2 bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline">  '  + 
                                '                 Update  '  + 
                                '             </button>  '  + 
                                '             <a href="#" class="reports__btn-edit bg-blue-700 w-10 text-white py-2 mx-5">  '  + 
                                '                 <i class="f7-icons">edit</i>  '  + 
                                '             </a>  '  + 
                                '         </div>  '  + 
                                '       </form>  '  + 
                                '     </div>    '  + 
                                '   </div>   ' ;
                            }
                            _cardContentInner.append(_html);




                            _cardContent.append(_cardContentInner);
                            _card.append(_cardContent);
                            _result_container.append(_card);
                    //     _reports.forEach(function(report,_i){
                    //         var _card = $('<li class="card" />');
                    //         var _cardHeader = $('<div class="card-header" />');
                    //         var _cardContent = $('<div class="card-content" />');
                    //         var _cardContentInner = $('<div class="card-content-inner" />');
                    //         var _timingHTML = '';
                    //         if(report.start_time && report.start_time!=='null' && report.end_time && report.end_time!=='null'){
                    //             _timingHTML+=new Date(report.start_time+' UTC').format("hh:MM tt");
                    //             _timingHTML+=' - '+new Date(report.end_time+' UTC').format("hh:MM tt");
                    //         }
                    //         var _hrt = (parseFloat(report.online_hours)*1000).millisecondsToHumanreadable();
                    //         // var _html =  '     '  + 
                    //         // '    <div class="w-full">  '  + 
                    //         // '       <div class="w-full text-center font-bold mb-3">  '  + 
                    //         // '           <span>'+_timingHTML+'</span>  '  + 
                    //         // '       </div>  '  + 
                    //         // '       <div class="">  '  + 
                    //         // '           <label>Number of trips: </label>  '  + 
                    //         // '           <span>'+report.no_of_trips+'</span>  '  + 
                    //         // '       </div>  '  + 
                    //         // '       <div class="">  '  + 
                    //         // '           <label>Number of hours: </label>  '  + 
                    //         // '           <span>'+report.no_of_hours+'</span>  '  + 
                    //         // '       </div>  '  + 
                    //         // '       <div class="">  '  + 
                    //         // '           <label>Milage: </label>  '  + 
                    //         // '           <span>'+report.mileage+'</span>  '  + 
                    //         // '       </div>  '  + 
                    //         // '       <div class="">  '  + 
                    //         // '           <label>Online for: </label>  '  + 
                    //         // '           <span>'+_hrt+'</span>  '  + 
                    //         // '       </div>  '  + 
                    //         // '  </div>  ' ; 
                    //         var no_of_trips = 0;
                    //         var isEmpty = true;
                    //         if(report.no_of_trips&&report.no_of_trips!=='null'){
                    //             no_of_trips = report.no_of_trips;
                    //             isEmpty = false;
                    //         } 
                    //         var _html =  '     '  + 
                    //         '    <div class="w-full">  '  + 
                    //         '       <div class="w-full text-center font-bold mb-3">  '  + 
                    //         '           <span>'++' trips</span>  '  + 
                    //         '       </div>  '  + 
                    //         '  </div>  ' ; 
                    //         _cardContentInner.append(_html);




                    //         _cardContent.append(_cardContentInner);
                    //         _card.append(_cardContent);
                    //         _result_container.append(_card);
                    //     });
                    // }
                    // else{
                    //     var _card = $('<li class="card" />');
                    //     var _cardHeader = $('<div class="card-header" />');
                    //     var _cardContent = $('<div class="card-content" />');
                    //     var _cardContentInner = $('<div class="card-content-inner" />');

                    //     var _html = '<span class="text-center w-full font-bold">No record found</span>';
                    //     _cardContentInner.append(_html);
                    //     _cardContent.append(_cardContentInner);
                    //     _card.append(_cardContent);
                    //     _result_container.append(_card);
                    // }
                    
                }
            }
            core.log(status);
         });

        }
    },
    update_trip:function($form){
        var _form = $($form);
        var driver_id = Cookies.get('driver_id')||"";
        var __data = helpers.getFormData(_form);
        __data.rider_id=driver_id;
        var _datePickerValue = reports.reports___datePicker.value; 
        var _dates = [];
        _datePickerValue.forEach(function(_v,_i){
            _dates.push(new Date(_v).format('yyyy-mm-dd HH:MM:ss'));
        });
        __data.date=_dates[0];
        var _datatarget=_form.attr('data-target');
        if(typeof _datatarget!== "undefined" && _datatarget !== false && _datatarget !== '')_datatarget=_datatarget;
        else _datatarget='none';
        var url = "update-trip";
        core.postRequest(url, __data, function (response, status) {
            core.log(response);
            var result = JSON.parse(response);
            if(status==="success"){
                if(result.status==="success"){
                    reports.get_previous_reports();
                    return;
                }
            }
            myApp.alert("An error occured, please try again.", 'Error'); 
        });
    },
    addtrip: function($form){
        var _form = $($form);
        var driver_id = Cookies.get('driver_id')||"";
        var __data = helpers.getFormData(_form);
        __data.rider_id=driver_id;
        var _datePickerValue = reports.reports___datePicker.value; 
        var _dates = [];
        _datePickerValue.forEach(function(_v,_i){
            _dates.push(new Date(_v).format('yyyy-mm-dd HH:MM:ss'));
        });
        __data.date=_dates[0];
        var _datatarget=_form.attr('data-target');
        if(typeof _datatarget!== "undefined" && _datatarget !== false && _datatarget !== '')_datatarget=_datatarget;
        else _datatarget='none';
        var url = "add-trip";
        core.postRequest(url, __data, function (response, status) {
            core.log(response);
            var result = JSON.parse(response);
            if(status==="success"){
                if(result.status==="success"){
                    reports.get_previous_reports();
                    return;
                }
            }
            myApp.alert("An error occured, please try again.", 'Error'); 
        });
    },
    endday:function($form){ 
        var _form = $($form);
        var driver_id = Cookies.get('driver_id')||"";
        var __data = helpers.getFormData(_form);
        __data.rider_id=driver_id;
        __data.status=3; // online status => logout - no marker will show
        // var _data = {driver_id: driver_id, status:3, no_of_trips: no_of_trips, location: location};
        var _datatarget=_form.attr('data-target');
        if(typeof _datatarget!== "undefined" && _datatarget !== false && _datatarget !== '')_datatarget=_datatarget;
        else _datatarget='none';
        var url = "endday";
        core.postRequest(url, __data, function (response, status) {
            myApp.showPreloader("Syncing locations...");
            BackgroundGeolocation.forceSync(function(){
                myApp.hidePreloader();
            });

            var result = JSON.parse(response);
            if(status==="success"){
                if(result.status==="success"){
                    Cookies.remove("isRidingStarted");
                    Cookies.remove("riding_start_time");
                    Cookies.remove("starting_location");
                    $('#btn--working').text('Start day');
                    Cookies.remove('isStarted');
                    $('.online_status').prop('checked', false);
                    timeInterval_Selector.hide();
                    myApp.closeModal();
                    if(_datatarget ==='btn--working'){
                        // myApp.accordionClose('#accordion__report');
                    }
                    if(_datatarget==='logout'){
                        login.logout();
                    }
                }
            }
        });
    },
    startRiding:function($self){
        // maps.getCurrentLocation(function(err, current_loc){
        //     if(err) core.log(err)
        //     if(current_loc){
        //         core.log(current_loc);
        //     }
        // });
        // return;
        $self = $($self);
        $self.prop('disabled', true);
        var _datatarget=$self.attr('data-target');
        if(typeof _datatarget!== "undefined" && _datatarget !== false && _datatarget !== '')_datatarget=_datatarget;
        else _datatarget='none';
        
        clearInterval(timeInterval_Timer);
        var isRidingStarted = Cookies.get("isRidingStarted")||"";
        if(typeof isRidingStarted === "undefined") isRidingStarted = false;
        if(isRidingStarted==="true" || isRidingStarted === true){//started...
            //end it
            
            var _started_at = Cookies.get("riding_start_time")||"";
            var _ended_at=Date.now();
            var _started_loc = Cookies.get("starting_location")||"";
            var _end_loc = null;
            var _form = $('#frmEndDay');
            if(typeof _started_at === "undefined") _started_at = null;
            if(_started_at){
                var _started_atFORMAT = new Date(_started_at);
                $('#ed__started_at').text(_started_atFORMAT.format("mmm dd, yyyy hh:MM TT"));
            }
            var _ended_atFORMAT = new Date(_ended_at);
            $('#ed__ended_at').text(_ended_atFORMAT.format('mmm dd, yyyy hh:MM TT'));
            
            

            
            _form.attr('data-target',_datatarget);
            
            core.log('data target: '+_datatarget);
            _form.find('[name="started_at"]').val(new Date(_started_at).format('yyyy-mm-dd HH:MM:ss', true));
            _form.find('[name="ended_at"]').val(new Date(_ended_at).format('yyyy-mm-dd HH:MM:ss', true));
            var _htmlElem = $('#popup-endday') ;
            
            _htmlElem.find('.reports_heading').text('Save details and end day');
            if(_datatarget==="logout"){
                _htmlElem.find('.reports_heading').text('Save details and Logout');
            }
            var popupHTML = _htmlElem.wrap('<p/>').parent().html();
            _htmlElem.unwrap();
            // if(_datatarget==='btn--working'){
            //     //popup__inner-content
            //     var _accordionHTML = $(popupHTML).find('.popup__inner-content').html();
            //     $('#accordion__report .accordion-item-content').html(_accordionHTML);
            //     myApp.accordionToggle('#accordion__report');
            // }
            // else{
            //     myApp.popup(popupHTML);
            // }
            myApp.showPreloader("Please Wait..");
            if(typeof _started_loc !== "undefined"){
                _form.find('[name="start_loc"]').val(_started_loc);
                maps.getCurrentLocation(function(err, current_loc){
                    
                    if(err) {
                        //trying again..
                        maps.getCurrentLocation(function(err, current_loc){
                            myApp.hidePreloader();
                            if(err) myApp.alert(err, 'Error');
                            if(current_loc){
                                _end_loc=JSON.stringify(current_loc);
                                core.log(_end_loc);
                                _form.find('[name="end_loc"]').val(_end_loc);
                                
                                myApp.confirm('Do you want to end your day?', 'Message',function () {
                                    maps.start_background_location(false);
                                    _form.trigger('submit');
                                });
                            }
                        })
                    }
                    else{
                        myApp.hidePreloader();
                        if(current_loc){
                            // $('#ed__start_loc').html('<a href="#"  data-start-loc="'+_started_loc+'" data-end-loc="'+JSON.stringify(current_loc)+'" class="ed__startEndLoc">Click to see</a>');
                            _end_loc=JSON.stringify(current_loc);
                            core.log(_end_loc);
                            _form.find('[name="end_loc"]').val(_end_loc);
                            
                            myApp.confirm('Do you want to end your day?', 'Message',function () {
                                _form.trigger('submit');
                                maps.start_background_location(false);
                            });
                        }
                    }
                });
            }
            
            
            
            

        }
        else{//stopped...
            //start it
            //chk if not logout
            if(_datatarget==="logout"){
                login.logout();
            }
            else if(_datatarget==='btn--working'){ //if start working pressed
                var rider_id = Cookies.get('driver_id')||"";
                if(typeof rider_id === "undefined"){
                    login.logout();
                }
                else{
                    maps.getCurrentLocation(function(err, current_loc){
                        if(err) myApp.alert(err, 'Error');
                        if(current_loc){
                            var login_data = {rider_id: rider_id, location:JSON.stringify(current_loc)};
                            var url = "startday";
                            core.postRequest(url, login_data, function (response, status) {
                                if (status === 'success') {
                                    var result = JSON.parse(response);
                                    if (result.status === 'success') {
                                        Cookies.set('isRidingStarted', true, {expires: helpers.session_expire});
                                        Cookies.set('riding_start_time',  new Date(result.start_time+" UTC"), {expires: helpers.session_expire});
                                        Cookies.set('starting_location',  JSON.stringify(current_loc), {expires: helpers.session_expire});
                                        maps.start_background_location(true);
                                        timeInterval_Callback();
                                        timeInterval_Selector.show();
                                        timeInterval_Timer = setInterval(timeInterval_Callback,timeInterval_Interval);
                                        $self.text('End day').removeClass('color-blue');
                                        Cookies.set('isStarted', true, {expires: helpers.session_expire});
                                        // app.setSession(result);
                                        profile.getFromServer();
                                        //app.startLocationTracking();
                                    } else {
                                        core.alert('Error', result.error, 'OK');
                                    }

                                }
                            });
                        }
                    });
                    
                }
            }
        }
    },
    checkIfStartRiding: function($self){
        $self = $($self);
        clearInterval(timeInterval_Timer);
               
        var isRidingStarted = Cookies.get("isRidingStarted")||"";
        if(typeof isRidingStarted === "undefined") isRidingStarted = false;
        core.log(isRidingStarted);
        if(isRidingStarted==="true" || isRidingStarted === true){//started...
            $self.text('End day').removeClass('color-blue');
            maps.start_background_location(true);
            timeInterval_Callback();
            timeInterval_Selector.show();
            timeInterval_Timer = setInterval(timeInterval_Callback,timeInterval_Interval);
        }
    },
    salaryslip:function(callback){
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
        var url = 'rider/salaryslip';
        core.getRequest(url, params, function (response, status) {
            if (status === 'success') {
                var result = response;
                var html = result.html;
                if(result.status!="success"){
                    //means it is warning on something
                    html ='<p class="text-xl text-gray-600 text-center mt-10 py-3">'+html+'</p>';
                }
                $('#salaryslip-result').html(html);
                if(callback && typeof callback == "function") callback();
            }

        });
    }
}


reports.reports___datePicker = myApp.calendar({
    input: '#reports-datepicker',
    dateFormat: 'DD, MM dd, yyyy'
});

$('body').on('click', '.reports__btn-edit', function(){
    $(this).parents('form').find('input').prop('readonly', false);
    $(this).parents('form').find('[type="submit"]').prop('disabled', false);
    $(this).hide();
});

