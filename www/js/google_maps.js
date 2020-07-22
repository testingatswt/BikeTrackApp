var map=null,
    directionsDisplay=null,
    directionsService=null;
var $$ = Dom7;


var maps = {
    current_map: '',
    current_lat_long: '',
    infowindow: '',
    setCurrentLocation: function (callback) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLattitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;
            maps.current_lat_long = {lat: currentLattitude, lng: currentLongitude};
            var current_loc = maps.current_lat_long;
            callback(null,current_loc);
        },
        function (error) {
            callback(error, null);
        }
        , {timeout: 5000});
    },
    getCurrentLocation: function (callback) {
        
        navigator.geolocation.getCurrentPosition(function (position) {
            
            currentLattitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;
            var current_loc = {lat: currentLattitude, lng: currentLongitude};
            callback(null,current_loc);
        },
        function (error) {
            if(error.message=="Illegal Access"){
                //need access
                myApp.confirm('App requires location tracking permission. Would you like to open app settings?', 'Permission denied', function () {
                    BackgroundGeolocation.showAppSettings();
                });
                return;
            }
            callback(error, null);
        }
        ,{timeout: 5000});
    },
    start_background_location:function(running){
        BackgroundGeolocation.checkStatus(function (status) {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
            core.log(status);
            if(running){
                //start
                if (!status.isRunning) {
                    BackgroundGeolocation.start();
                }
            }
            else{
                //stop
                if (status.isRunning) {
                    BackgroundGeolocation.stop();
                }
            }
            
        });
    },
    show_map: function (map_id) {
        if (typeof map_id == 'undefined') {
            map_id = 'map';
        }
        var current_loc = maps.current_lat_long;
        if (typeof current_loc == 'undefined' || current_loc == '') {
            maps.current_lat_long = {lat: 25.204849, lng: 55.270782};
        }
        //directionsDisplay = new google.maps.DirectionsRenderer;
        //directionsService = new google.maps.DirectionsService;
        map = new google.maps.Map(document.getElementsByClassName(map_id)[0], {
            center: maps.current_lat_long,
            zoom: 12
        });
        maps.current_map=map;
        // Define the LatLng coordinates for the polygon's path.
        // var triangleCoords = JSON.parse('[{"lat":31.3267154693604,"lng":74.0087432861329},{"lat":31.3319206237794,"lng":74.0171127319337},{"lat":31.3384265899659,"lng":74.0166625976562},{"lat":31.3501377105713,"lng":74.0095825195312},{"lat":31.3634624481202,"lng":74.0033187866211},{"lat":31.369821548462,"lng":74.0122375488282},{"lat":31.377353668213,"lng":74.0350952148439},{"lat":31.4012527465821,"lng":74.0501327514649},{"lat":31.415355682373,"lng":74.0385284423829},{"lat":31.4237823486329,"lng":74.048812866211},{"lat":31.4317207336427,"lng":74.1051483154296},{"lat":31.4218845367432,"lng":74.1259155273439},{"lat":31.4321403503417,"lng":74.137825012207},{"lat":31.4508800506591,"lng":74.1562728881836},{"lat":31.4649887084962,"lng":74.1741333007814},{"lat":31.4756946563721,"lng":74.1721267700195},{"lat":31.4931907653809,"lng":74.1661911010742},{"lat":31.5116996765137,"lng":74.1696395874023},{"lat":31.5184307098389,"lng":74.1844558715821},{"lat":31.5304050445557,"lng":74.2052307128907},{"lat":31.5601482391359,"lng":74.2323837280273},{"lat":31.5949249267578,"lng":74.2641601562501},{"lat":31.6190128326415,"lng":74.2818756103516},{"lat":31.6459655761719,"lng":74.2945404052734},{"lat":31.6774940490723,"lng":74.3112792968751},{"lat":31.6878414154053,"lng":74.3322982788087},{"lat":31.6961193084718,"lng":74.3669509887696},{"lat":31.7123012542725,"lng":74.4006271362305},{"lat":31.722484588623,"lng":74.4320907592773},{"lat":31.7309207916261,"lng":74.4631271362306},{"lat":31.7303848266602,"lng":74.4630279541016},{"lat":31.7331733703613,"lng":74.4727859497071},{"lat":31.7363033294678,"lng":74.4872665405274},{"lat":31.7386512756347,"lng":74.5068283081054},{"lat":31.7405757904054,"lng":74.5181045532227},{"lat":31.7229118347169,"lng":74.5172805786134},{"lat":31.7176876068116,"lng":74.5197830200196},{"lat":31.6980857849121,"lng":74.5302276611329},{"lat":31.6807289123535,"lng":74.5414886474611},{"lat":31.6571369171144,"lng":74.557113647461},{"lat":31.6485748291016,"lng":74.5625457763672},{"lat":31.6339473724366,"lng":74.5718154907228},{"lat":31.623405456543,"lng":74.5784988403321},{"lat":31.6064357757569,"lng":74.5863494873048},{"lat":31.592311859131,"lng":74.5926055908204},{"lat":31.5696105957031,"lng":74.6003036499023},{"lat":31.5678386688232,"lng":74.6009063720703},{"lat":31.5630664825441,"lng":74.601676940918},{"lat":31.5628509521486,"lng":74.6001129150391},{"lat":31.5597724914551,"lng":74.6002807617189},{"lat":31.558931350708,"lng":74.6023406982423},{"lat":31.5410041809083,"lng":74.6052322387696},{"lat":31.540189743042,"lng":74.6047897338868},{"lat":31.5359096527101,"lng":74.6043472290039},{"lat":31.5341110229492,"lng":74.6038513183594},{"lat":31.5332698822021,"lng":74.6026916503907},{"lat":31.5296001434327,"lng":74.6010665893555},{"lat":31.5275402069093,"lng":74.5989761352539},{"lat":31.5255126953125,"lng":74.5934829711914},{"lat":31.5251998901368,"lng":74.5882263183595},{"lat":31.5247898101806,"lng":74.5824127197266},{"lat":31.5238208770753,"lng":74.5793762207031},{"lat":31.521152496338,"lng":74.574806213379},{"lat":31.5206909179689,"lng":74.574676513672},{"lat":31.5195617675782,"lng":74.5729827880861},{"lat":31.5159397125245,"lng":74.5713958740235},{"lat":31.5144863128663,"lng":74.5713958740235},{"lat":31.5114498138428,"lng":74.5713958740235},{"lat":31.5103206634522,"lng":74.5724792480469},{"lat":31.5098705291748,"lng":74.5732803344727},{"lat":31.5091991424562,"lng":74.5734024047851},{"lat":31.5058116912841,"lng":74.5724792480469},{"lat":31.5053405761719,"lng":74.5717163085938},{"lat":31.5033206939698,"lng":74.568572998047},{"lat":31.5031776428223,"lng":74.5676574707032},{"lat":31.5028705596924,"lng":74.5659332275392},{"lat":31.5017280578614,"lng":74.5657958984375},{"lat":31.5008392333986,"lng":74.5662002563477},{"lat":31.4965896606446,"lng":74.5751266479492},{"lat":31.4956703186035,"lng":74.5796432495118},{"lat":31.498390197754,"lng":74.5825119018556},{"lat":31.4988594055177,"lng":74.5861663818361},{"lat":31.4986324310303,"lng":74.5883178710938},{"lat":31.4984111785889,"lng":74.5901260375978},{"lat":31.4999980926514,"lng":74.5930328369142},{"lat":31.5002326965331,"lng":74.5951080322267},{"lat":31.4997901916505,"lng":74.5956954956056},{"lat":31.4987506866456,"lng":74.5970764160156},{"lat":31.4981098175049,"lng":74.5973587036133},{"lat":31.4957427978515,"lng":74.6017532348633},{"lat":31.4948291778566,"lng":74.6027908325195},{"lat":31.489652633667,"lng":74.6043930053712},{"lat":31.4871807098389,"lng":74.6091232299805},{"lat":31.4861316680908,"lng":74.6130905151367},{"lat":31.48583984375,"lng":74.614128112793},{"lat":31.4870891571046,"lng":74.6220321655273},{"lat":31.4869174957276,"lng":74.6239471435546},{"lat":31.4866905212402,"lng":74.6264572143555},{"lat":31.4855327606202,"lng":74.6257400512696},{"lat":31.4824104309083,"lng":74.6238098144531},{"lat":31.4799919128419,"lng":74.6207122802734},{"lat":31.4788703918456,"lng":74.6203231811523},{"lat":31.4786396026611,"lng":74.6208496093751},{"lat":31.4779796600342,"lng":74.6207427978516},{"lat":31.4735698699951,"lng":74.6283798217773},{"lat":31.4723510742188,"lng":74.630729675293},{"lat":31.4712200164795,"lng":74.6320419311524},{"lat":31.4696407318116,"lng":74.6323165893556},{"lat":31.4686813354492,"lng":74.6337890625001},{"lat":31.4644794464112,"lng":74.6402282714844},{"lat":31.4636898040771,"lng":74.6407241821288},{"lat":31.4615497589112,"lng":74.6420669555663},{"lat":31.4599609375001,"lng":74.6420669555663},{"lat":31.4559097290039,"lng":74.6407928466797},{"lat":31.4522380828857,"lng":74.636329650879},{"lat":31.4409446716309,"lng":74.6319961547852},{"lat":31.4236183166504,"lng":74.6253433227539},{"lat":31.4226894378662,"lng":74.6243133544923},{"lat":31.4040374755859,"lng":74.6012039184571},{"lat":31.3970947265626,"lng":74.5945739746093},{"lat":31.3465385437012,"lng":74.5721206665039},{"lat":31.3408203125001,"lng":74.5696411132812},{"lat":31.3460884094239,"lng":74.5548553466798},{"lat":31.3492259979248,"lng":74.541343688965},{"lat":31.3503646850587,"lng":74.5341339111328},{"lat":31.3505611419678,"lng":74.5341644287109},{"lat":31.3522891998292,"lng":74.526969909668},{"lat":31.3523197174073,"lng":74.5101013183594},{"lat":31.3568458557129,"lng":74.487663269043},{"lat":31.3525485992431,"lng":74.4656524658203},{"lat":31.3408813476562,"lng":74.4400634765626},{"lat":31.3195419311523,"lng":74.4245223999024},{"lat":31.2976684570313,"lng":74.4285278320313},{"lat":31.2875385284424,"lng":74.4233093261719},{"lat":31.2866420745851,"lng":74.4064331054688},{"lat":31.2835006713867,"lng":74.3846969604493},{"lat":31.2731285095215,"lng":74.3652877807618},{"lat":31.2618541717529,"lng":74.3442535400391},{"lat":31.2639827728271,"lng":74.3118820190431},{"lat":31.2762355804444,"lng":74.2849884033204},{"lat":31.2729454040528,"lng":74.2579040527345},{"lat":31.2638416290284,"lng":74.231544494629},{"lat":31.2502765655519,"lng":74.2086029052735},{"lat":31.254955291748,"lng":74.191261291504},{"lat":31.2675209045411,"lng":74.1740112304688},{"lat":31.2776355743408,"lng":74.1653060913087},{"lat":31.2809181213379,"lng":74.1482086181642},{"lat":31.2779083251954,"lng":74.132911682129},{"lat":31.2876033782958,"lng":74.1212463378907},{"lat":31.2910385131837,"lng":74.109245300293},{"lat":31.2838325500489,"lng":74.0952224731445},{"lat":31.2822685241699,"lng":74.0764617919922},{"lat":31.2895412445068,"lng":74.0564727783204},{"lat":31.2898788452149,"lng":74.034782409668},{"lat":31.3026523590088,"lng":74.0191497802734},{"lat":31.3191051483154,"lng":74.0056991577149},{"lat":31.3267154693604,"lng":74.0087432861329}]');
   
        //   // Construct the polygon.
        //   var bermudaTriangle = new google.maps.Polygon({
        //     paths: triangleCoords,
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.8,
        //     strokeWeight: 2,
        //     fillColor: '#FF0000',
        //     fillOpacity: 0.35
        //   });
        //   bermudaTriangle.setMap(map);
        // directionsDisplay.setMap(map);
        // maps.calculateAndDisplayRoute(directionsService, directionsDisplay,maps.current_lat_long,{lat: 31.503701, lng: 74.354116});
        var marker = new google.maps.Marker({
            position: maps.current_lat_long,
            map: map,
            animation: google.maps.Animation.DROP,
            title: 'Hello World!'
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
    },
    
    changeTrackingStatus: function () { 
        var _isChecked = document.getElementById('online_status').checked;
        // var status = Cookies.get('isStarted');
        if(_isChecked){
            maps.sendStatus(1); // online
        }else{
            maps.sendStatus(2); //offline
        }
        Cookies.set('isStarted', _isChecked, {expires: helpers.session_expire});
        //app.startLocationTracking();
    },
    sendStatus: function (status, driver_id=Cookies.get('driver_id')||"", taskKey=null) {
        if(driver_id=="")return;
        var login_data = {rider_id : driver_id, status: status};
        var url = "rider/changeStatus";
        core.postRequest(url, login_data, function (response, status) {
            if(taskKey)BackgroundGeolocation.endTask(taskKey);
        });
    },
    calculateAndDisplayRoute:function(directionsService, directionsDisplay, origin, destination){
        var selectedMode = "DRIVING";
        directionsService.route({
          origin: origin,  // Haight.
          destination: destination,  // Ocean Beach.
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }
};