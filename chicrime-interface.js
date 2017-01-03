// Require JavaScript
if (typeof jQuery === 'undefined') {
  throw new Error('This JavaScript requires jQuery');
}

// Change button background on click
function buttonSelected(button) {
        
    if (lastDown != null)
        $(lastDown).toggleClass("active");

    $(button).toggleClass("active");

    lastDown = button;
}

// Event for TYPE main menu button clicked
function typesMenuClicked(button) {
    
    // Don't do anything if already on this menu
    if (lastDown == button)
        return;
    
    // Button gui
    buttonSelected(button);
    
    // Remove previous interface
    $("#interface").empty();
    
    // Post new menu
    var panel = $('<div id="type-header" class = "panel panel-info filter-header"></div>');
    $('#interface').append(panel);
    
    var panelHeader = $('<div class="panel-heading"><h1>Type Filters</h1></div>');
    $('#type-header').append(panelHeader);
    
    var panelBody = $('<div class="panel-body"><h4>Press one or more buttons to show crime data from only the selected types!<h4></div>');
    $('#type-header').append(panelBody);
    
    var typeButtons = $('<div id="type-buttons"></div>');
    $('#interface').append(typeButtons);
    
    // Append sorted button types
    appendTypeButtons();
    
    // Re-activate previous buttons pressed
    for (var i = 0; i < primaryFilters.length; i++){
        var button = document.getElementById(primaryFilters[i])
        $(button).toggleClass("btn-info");
        $(button).toggleClass("btn-primary");
    }
    
}

// Append type buttons
function appendTypeButtons() {

    var resetButton = $('<input type="button" id="type-reset" class="btn btn-success btn-lg type-button" onClick="primaryTypeResetClicked(this)" value="Reset Type Filter"/><br>');
    $("#type-buttons").append(resetButton);
    
    for (var i = 0; i < crimeTypes.length; i++) {
        var newButton = $('<input type="button" id="'+crimeTypes[i]+'" class="btn btn-info btn-lg type-button" onClick="primaryTypeClicked(this)" value="'+i+'. '+crimeTypes[i]+'"/><br>');
        $("#type-buttons").append(newButton);
    }
}

// Primary Type Filter Clicked
function primaryTypeClicked(button) {

    // Change button background
    $(button).toggleClass("btn-info");
    $(button).toggleClass("btn-primary");

    // Check if "un-selecting" filter
    var index;
    if ((index = primaryFilters.indexOf(button.id)) != -1) {
        primaryFilters.splice(index, 1);
    }
    else {
        primaryFilters.push(button.id);
    }
        
    for (var i = 0; i < markers.length; i++) {
        if (primaryFilters.indexOf(markers[i].crimeData.primary_type) == -1) {
            markers[i].setVisible(false);
            markers[i].p_tag = 1;
        }
        else {
            markers[i].p_tag = 0;
            if (markers[i].p_tag == 0 && markers[i].t_tag == 0 && markers[i].d_tag == 0 && markers[i].l_tag == 0)
                markers[i].setVisible(true);
        }
    }
}

// Primary Type Reset Clicked
function primaryTypeResetClicked(button) {
    
    // unclick all primary type buttons currently pressed
    for (var i = 0; i < primaryFilters.length; i++){
        var button = document.getElementById(primaryFilters[i])
        $(button).toggleClass("btn-info");
        $(button).toggleClass("btn-primary");
    }
    
    // reset primary types filter
    primaryFilters = [];
    
    // reshow all crime markers
    for (var i = 0; i < markers.length; i++) {
        
        // reset primary tag
        markers[i].p_tag = 0;
        
        // check if other tags true, else show visible
        if (markers[i].p_tag == 0 && markers[i].t_tag == 0 && markers[i].d_tag == 0 && markers[i].l_tag == 0)
            markers[i].setVisible(true);
    }
}

// Apply correct icon to markers
function setMarkerIcons(markers, crimeTypes) {
    for (var i = 0; i < markers.length; i++)
        markers[i].setIcon('blueicons/number_' + crimeTypes.indexOf(markers[i].crimeData.primary_type) + '.png');
}

// Event for TIME FRAME main menu button clicked
function timeframeMenuClicked(button) {
    
    // Don't do anything if already on this menu
    if (lastDown == button)
        return;
    
    // Button gui
    buttonSelected(button);
    
    // Remove previous interface
    $("#interface").empty();
    
    // Post new menu
    var panel = $('<div id="timeframe-header" class = "panel panel-info filter-header"></div>');
    $('#interface').append(panel);
    
    var panelHeader = $('<div class="panel-heading"><h1>Time Frame Filter</h1></div>');
    $('#timeframe-header').append(panelHeader);
    
    var panelBody = $('<div class="panel-body"><h4>Enter a time frame to filter crime data!<h4></div>');
    $('#timeframe-header').append(panelBody);
    
    var timeFrameForm = $('<div id="timeframe-form" role="form"></div>');
    $('#interface').append(timeFrameForm);
    
    // Append the time dropboxes
    var hoursForm = $('<form role="form" class="form-inline" id="hours-form">'+
                      '<div class="well timeframe-well"><h4>Time Range (HH:MM AM/PM)</h4></div>'+
                      '<div class="form-group"><label for="first-time"><h3>From:&nbsp;</h3></label>'+
                      '<select class="form-control" id="first-time"></select>&nbsp;&nbsp;'+
                      '<select class="form-control" id="first-ampm"></select>'+
                      '</div>'+
                      '<div class="form-group"><label for="second-time"><h3>&nbsp;Until:&nbsp;</h3></label>'+
                      '<select class="form-control" id="second-time"></select>&nbsp;&nbsp;'+
                      '<select class="form-control" id="second-ampm"></select>'+
                      '</div><br><br>'+
                      '<div class="form-group">'+
                      '<button type="button" id="submit-time-filter" onClick="timeRangeSubmitted(this)" class="btn btn-lg btn-primary time-frame-button">Submit Time Range</button>'+
                      '<button type="button" id="reset-time-filter" onClick="timeRangeResetClicked(this)" class="btn btn-lg btn-success time-frame-button">Reset Time Range</button>'+
                      '</div><br><br></form>');
    $('#timeframe-form').append(hoursForm);
    
    // Append options to the time dropboxes
    var selection = "";
    var i = 0;
    selection += "<option value='12:00:00.000'>12:00</option>";
    selection += "<option value='12:30:00.000'>12:30</option>";
    for(var i = 1; i < 12; i++){
        var j = zeroFill(i, 2);
        selection += "<option value='"+ j +":00:00.000'>"+ j + ":00" + "</option>";
        selection += "<option value='"+ j +":30:00.000'>"+ j + ":30" + "</option>";
    }
    $("#first-time").html(selection);
    $("#second-time").html(selection);
    $("#first-ampm").append('<option value="AM">AM</option><option value="PM">PM</option>');
    $("#second-ampm").append('<option value="AM">AM</option><option value="PM">PM</option>');
    
    // Append the date dropboxes
    var dateForm = $('<form role="form" class="form-inline" id="date-form">'+
                      '<div class="well timeframe-well"><h4>Date Range (MM/DD/YYYY)</h4></div>'+
                      '<div class="form-group"><label for="first-month"><h3>From:&nbsp;</h3></label>'+
                      '<select class="form-control" id="first-month"></select>&nbsp;&nbsp;'+
                      '<select class="form-control" id="first-day"></select>&nbsp;&nbsp;'+
                      '<select class="form-control" id="first-year"></select>'+
                      '</div>'+
                      '<div class="form-group"><label for="second-month"><h3>&nbsp;Until:&nbsp;</h3></label>'+
                      '<select class="form-control" id="second-month"></select>&nbsp;&nbsp;'+
                      '<select class="form-control" id="second-day"></select>&nbsp;&nbsp;'+
                      '<select class="form-control" id="second-year"></select><br>'+
                      '</div><br><br>'+
                      '<div class="form-group">'+
                      '<button type="button" id="submit-date-filter" onClick="dateRangeSubmitted(this)" class="btn btn-lg btn-primary time-frame-button">Submit Date Range</button>'+
                      '<button type="button" id="reset-date-filter" onClick="dateRangeResetClicked(this)" class="btn btn-lg btn-success time-frame-button">Reset Date Range</button>'+
                      '</div></form><br>');
    $('#timeframe-form').append(dateForm);
    
    // Append options to the date dropboxes
    var months = "";
    for (var i = 1; i < 13; i++) {
        var j = zeroFill(i, 2);
        months += "<option value='"+j+"'>"+j+"</option>";
    }
    $('#first-month').html(months);
    $('#second-month').html(months);
    var days = "";
    for (var i = 1; i < 32; i++) {
        var j = zeroFill(i, 2);
        days += "<option value='"+j+"'>"+j+"</option>";
    }
    $('#first-day').html(days);
    $('#second-day').html(days);
    var years = "";
    for (var i = 2015; i > 2000; i--) {
        years += "<option value='"+i+"'>"+i+"</option>";
    }
    $('#first-year').html(years);
    $('#second-year').html(years);
}

// Append 0's to strings for time chooser
function zeroFill(number, width) {
    width -= number.toString().length;
    if ( width > 0 )
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    return number + "";
}

// Time range submitted
function timeRangeSubmitted(button) {
    
    // Reset any original timeframes
    timeRangeResetClicked(button);
    
    // Get select box values
    var firstTime = $('#first-time').val();
    var secondTime = $('#second-time').val();
    var firstAMPM = $('#first-ampm').val();
    var secondAMPM = $('#second-ampm').val();
    
    // Convert first to military time if 'PM'
    if(firstAMPM == "PM") {
        var militaryHour = parseInt(firstTime.substring(0,2), 10) + 12;
        var minutes = firstTime.substring(2);
        firstTime = militaryHour.toString() + minutes;
        
    }
    else if (firstTime == "12:00:00.000")
        firstTime = "00:00:00.000";
    else if (firstTime == "12:30:00.000")
        firstTime = "00:30:00.000";
    
    // Convert second to military time if 'PM'
    if(secondAMPM == "PM") {
        var militaryHour = parseInt(secondTime.substring(0,2), 10) + 12;
        var minutes = secondTime.substring(2);
        secondTime = militaryHour.toString() + minutes;
    }
    else if (secondTime == "12:00:00.000")
        secondTime = "00:00:00.000";
    else if (secondTime == "12:30:00.000")
        secondTime = "00:30:00.000";
    
    // Make markers outside of range invisible
    if (firstTime.localeCompare(secondTime) > 0) {
        for (var i = 0; i < markers.length; i++){
            if (!((markers[i].crimeData.date.substring(11).localeCompare(firstTime) >=0)||(markers[i].crimeData.date.substring(11).localeCompare(secondTime) <=0))) {
                markers[i].t_tag = 1;
                markers[i].setVisible(false);
            }
        }
    }
    else {  
        for (var i = 0; i < markers.length; i++){
            if (!((markers[i].crimeData.date.substring(11).localeCompare(firstTime) >=0)&&(markers[i].crimeData.date.substring(11).localeCompare(secondTime) <=0))) {
                markers[i].t_tag = 1;
                markers[i].setVisible(false);
            }
        }
    }
}

// Time range reset clicked
function timeRangeResetClicked(button) {
    
    // Show markers hidden by the time filter
    for (var i = 0; i < markers.length; i++) {
        markers[i].t_tag = 0;
        
        if (markers[i].p_tag == 0 && markers[i].t_tag == 0 && markers[i].d_tag == 0 && markers[i].l_tag == 0)
            markers[i].setVisible(true);
    }
}

// Date range submitted
function dateRangeSubmitted(button) {
    
    // reset previous date range
    dateRangeResetClicked(button);
    
    // get input data
    var firstMonth = $('#first-month').val();
    var firstDay = $('#first-day').val();
    var firstYear = $('#first-year').val();
    var secondMonth = $('#second-month').val();
    var secondDay = $('#second-day').val();
    var secondYear = $('#second-year').val();
    
    var firstDate = firstYear + "-" + firstMonth + "-" + firstDay;
    var secondDate = secondYear + "-" + secondMonth + "-" + secondDay;
    
    for (var i = 0; i < markers.length; i++){
            if (!((markers[i].crimeData.date.substring(0,10).localeCompare(firstDate) >=0)&&(markers[i].crimeData.date.substring(0,10).localeCompare(secondDate) <=0))) {
                markers[i].d_tag = 1;
                markers[i].setVisible(false);
            }
        }
}

// Date range reset clicked
function dateRangeResetClicked(button) {
    
    // Show markers hidden by the time filter
    for (var i = 0; i < markers.length; i++) {
        markers[i].d_tag = 0;
        
        if (markers[i].p_tag == 0 && markers[i].t_tag == 0 && markers[i].d_tag == 0 && markers[i].l_tag == 0)
            markers[i].setVisible(true);
    }
}

// Takes two lat/lng args and returns the distance between them!
function distance(latLngA, latLngB) {
    return google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
}

// Event for LOCATION main menu button clicked
function locationMenuClicked(button) {
    
    // Don't do anything if already on this menu
    if (lastDown == button)
        return;
    
    // Button gui
    buttonSelected(button);
    
    // Remove previous interface
    $("#interface").empty();
    
    // Post new menu
    var panel = $('<div id="location-header" class = "panel panel-info filter-header"></div>');
    $('#interface').append(panel);
    
    var panelHeader = $('<div class="panel-heading"><h1>Location Filter</h1></div>');
    $('#location-header').append(panelHeader);
    
    var panelBody = $('<div class="panel-body"><h4>Select a location and find crimes within the selected radius!<h4></div>');
    $('#location-header').append(panelBody);
    
    
    var locationForm = $('<div id="location-form" role="form"></div>');
    $('#interface').append(locationForm);
    
    // Append the location interface
    var radiusForm = $('<form role="form" class="form-inline" id="radius-form">'+
                      '<div class="well location-well"><h4>To place/move marker, click "Drop Marker" and then click on the map!</h4></div>'+
                      '<div class="form-group">'+
                      '<button type="button" id="drop-marker" onClick="dropMarker(this)" class="btn btn-lg btn-danger location-button">Drop Marker</button>'+
                      '</div><br><br>'+
                      '<div class="form-group"><label for="radius"><h3>Miles&nbsp;</h3></label>'+
                      '<select class="form-control" id="radius"></select>'+
                      '</div><br><br>'+
                      '<div class="form-group">'+
                      '<button type="button" id="submit-location-filter" onClick="locationSubmitted(this)" class="btn btn-lg btn-primary location-button">Submit Location</button>'+
                      '<button type="button" id="reset-location-filter" onClick="locationResetClicked(this)" class="btn btn-lg btn-success location-button">Reset Location</button>'+
                      '</div><br><br></form>');
    $('#location-form').append(radiusForm);
    
    // Add radius options to miles dropdown
    for (var i = 1; i < 11; i++) {
        $('#radius').append('<option value='+i+'>'+i+'</option>');
    }
    
}

// Location radius clicked
function locationSubmitted(button) {
    
    var radius = 0;
    
    if (!locationMarked)
        alert("Plase drop a marker first!");
    else {
        radius = $('#radius').val() * 1609.340;
        circle = new google.maps.Circle({
            map: map,
            radius: radius,
            fillColor: '#44B449',
            strokeColor: '#229216'
        });
        circle.bindTo('center', locationMarker, 'position');
        
        for (var i = 0; i < markers.length; i++) {
            if (distance(new google.maps.LatLng(markers[i].crimeData.location.coordinates[1], markers[i].crimeData.location.coordinates[0]), locationMarker.position) > radius) {
                markers[i].l_tag = 1;
                markers[i].setVisible(false);
            }
        }
    }
}

// Drop marker clicked
function dropMarker(button) {
    
    $(button).toggleClass("active");
    
    google.maps.event.addListener(map, 'click', function (event) {
        
        if ($(button).hasClass('active')) {
        
            if (locationMarker != null)
                locationMarker.setMap(null);

            locationMarker = new google.maps.Marker({

                position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
            });
            locationMarker.setMap(map);
            
            locationMarked = 1;
            
            $(button).toggleClass("active");
        }
    });
}

// Location reset clicked
function locationResetClicked(button) {
    locationMarked = 0;
    
    if (locationMarker != null)
        locationMarker.setMap(null);
    
    for (i = 0; i < markers.length; i++) {
        markers[i].l_tag = 0;
    
        if (markers[i].p_tag == 0 && markers[i].t_tag == 0 && markers[i].d_tag == 0 && markers[i].l_tag == 0)
            markers[i].setVisible(true);
    }
    
    if (circle != null)
        circle.setMap(null);
}

// Get tweets in JSON for TWEETS filter
function getTweets() {
    
    var oReq = new XMLHttpRequest();
    oReq.onload = function() {
        console.log(this.responseText);
    };
    oReq.open("get", "chicrime-twitter.php", false);
    oReq.send();
}

// Event for TWEETS main menu button clicked
function tweetsMenuClicked(button) {

    // Don't do anything if already on this menu
    if (lastDown == button)
        return;
    
    // Button gui
    buttonSelected(button);
    
    // Remove previous interface
    $("#interface").empty();
    
    // Post new menu
    var panel = $('<div id="location-header" class = "panel panel-info filter-header"></div>');
    $('#interface').append(panel);
    
    var panelHeader = $('<div class="panel-heading"><h1>Tweets Filter</h1></div>');
    $('#location-header').append(panelHeader);
    
    var panelBody = $('<div class="panel-body"><h4>UNDER CONSTRUCTION<br>When active, will display recent tweets related to potential crime threats on the map!<h4></div>');
    $('#location-header').append(panelBody);
}

// Event for ROUTES main menu button clicked
function routesMenuClicked(button) {

    // Don't do anything if already on this menu
    if (lastDown == button)
        return;
    
    // Button gui
    buttonSelected(button);
    
    // Remove previous interface
    $("#interface").empty();
    
    // Post new menu
    var panel = $('<div id="routes-header" class = "panel panel-info filter-header"></div>');
    $('#interface').append(panel);
    
    var panelHeader = $('<div class="panel-heading"><h1>Routes Filter</h1></div>');
    $('#routes-header').append(panelHeader);
    
    var panelBody = $('<div class="panel-body"><h4>Enter an origin and a destination and find how many crimes are <br>within 1/4 of a mile from any point on the route!<h4></div>');
    $('#routes-header').append(panelBody);
    
    /*// Get a directions service
    directionsService = new google.maps.DirectionsService();
    
    // Get a directions renderer
    var rendererOptions = {
        map: map,
        draggable: true
    }
    
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        routeChanged(directionsDisplay.getDirections());
    });*/
    
    var warningsPanel = $('<div id="warnings-panel" role="form"></div>');
    $('#interface').append(warningsPanel);
    
    var routesForm = $('<div id="routes-form"></div>');
    $('#interface').append(routesForm);
    
    var directionsForm = $('<form id="directions-form" role="form" class="form">'+
                           '<div class="form-group"><label for="origin" class="label-center"><h3>Origin:</h3></label>'+
                           '<input type="text" class="form-control" id="origin">'+
                           '</div>'+
                           '<div class="form-group"><label for="destination" class="label-center"><h3>Destination:</h3></label>'+
                           '<input type="text" class="form-control" id="destination">'+
                           '</div>'+
                           '<div id="details"></div>'+
                           '<div class="form-group">'+
                           '<button type="button" id="submit-route" onClick="displayRoute(this)" class="btn btn-lg btn-primary route-button">Display Route</button>'+
                           '<button type="button" id="reset-route" onClick="resetRoute(this)" class="btn btn-lg btn-success route-button">Reset Route</button>'+
                           '</form>');
    $('#routes-form').append(directionsForm);
    
    autocomplete_orig = new google.maps.places.Autocomplete(document.getElementById('origin'));
    autocomplete_dest = new google.maps.places.Autocomplete(document.getElementById('destination'));
}

// Display route clicked
function displayRoute(button) {
    
    var request = {
        origin: $('#origin').val(),
        destination: $('#destination').val(),
        travelMode: google.maps.TravelMode.WALKING
    };
    
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var warnings = $('#warnings-panel');
            warnings.innerHTML = "" + response.routes[0].warnings[0] + "";
            directionsDisplay.setDirections(response);
        }
    });
    
    directionsDisplay.setMap(map);
}

// Route has been changed
function routeChanged (response) {
    
    for (var i = 0; i < markers.length; i++)
        markers[i].r_tag = 0;
    
    var crimeScore = 0;
    
    for (var i = 0; i < response.routes[0].overview_path.length; i++) {
        for (var j = 0; j < markers.length; j++) {
            var markerLatLng = new google.maps.LatLng(markers[j].crimeData.location.coordinates[1], markers[j].crimeData.location.coordinates[0]);
            var routeLatLng = new google.maps.LatLng(response.routes[0].overview_path[i].G, response.routes[0].overview_path[i].K);
            
            if ((distance(markerLatLng, routeLatLng)/1609.340) < 0.25) {
                
                // Count markers not already counted
                if (markers[j].r_tag == 0) {
                    markers[j].r_tag = 1;
                    crimeScore ++;
                }
            }
        }
    }
    $('#details').empty();
    $('#details').append('<h3>Details:</h3><h4>*Click on the map and drag the route around to find a route with a lower crime score!*</h4><h2 id="crimeScore">Crime Score: &nbsp;<b>'+crimeScore+'</h2>');
    $('#crimeScore').css("color", function () {
        return colorPicker(crimeScore);
    });
}

// Color Picker
function colorPicker(crimeScore) {
    if (crimeScore < 21) return '#00CC00'
    else if (crimeScore < 31) return '#CCFF33'
    else if (crimeScore < 41) return '#FFFF00'
    else if (crimeScore < 51) return '#FFCC00'
    else if (crimeScore < 61) return '#FF6600'
    else if (crimeScore < 71) return '#FF3300'
    else if (crimeScore < 81) return '#FF0000'
    else return '#8F0000'
}

// Reset route
function resetRoute(button) {
    $('#details').empty();
    autocomplete_orig = null;
    autocomplete_dest = null;
    directionsDisplay.setMap(null);
}

// Reset all clicked
function resetAll(button) {
    primaryTypeResetClicked(null);
    timeRangeResetClicked(null);
    dateRangeResetClicked(null);
    locationResetClicked(null);
    resetRoute(null);
}