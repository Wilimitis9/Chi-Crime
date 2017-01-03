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
        for (var i = 0; i < primaryFilteredMarkers.length; i++) {
            if (primaryFilteredMarkers[i].crimeData.primary_type == button.id) {
                primaryFilteredMarkers[i].setVisible(true);
                primaryFilteredMarkers.splice(i, 1);
                explicitlyVisibleMarkers.push(primaryFilteredMarkers[i]);
            }
        }
    }
    else {
        primaryFilters.push(button.id);
        for (var i = 0; i < explicitlyVisibleMarkers.length; i++) {
            if (primaryFilters.indexOf(explicitlyVisibleMarkers[i].crimeData.primary_type) == -1) {
                explicitlyVisibleMarkers[i].setVisible(false);
                explicitlyVisibleMarkers.splice(i, 1);
                primaryFilteredMarkers.push(explicitlyVisibleMarkers[i]);
            }
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
    for (var i = 0; i < primaryFilteredMarkers.length; i++) {
        primaryFilteredMarkers[i].setVisible(true);
    }
    
    // reset references to markers hidden by primary filters
    primaryFilteredMarkers = [];
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
                      '<button type="button" id="submit-date-filter" class="btn btn-lg btn-primary time-frame-button">Submit Date Range</button>'+
                      '<button type="button" id="reset-date-filter" class="btn btn-lg btn-success time-frame-button">Reset Date Range</button>'+
                      '</div></form><br>');
    $('#timeframe-form').append(dateForm);
    
    // Append options to the date dropboxes
    var months = "";
    for (var i = 1; i < 13; i++) {
        months += "<option value='"+i+"'>"+i+"</option>";
    }
    $('#first-month').html(months);
    $('#second-month').html(months);
    var days = "";
    for (var i = 1; i < 32; i++) {
        days += "<option value='"+i+"'>"+i+"</option>";
    }
    $('#first-day').html(days);
    $('#second-day').html(days);
    var years = "";
    for (var i = 2001; i < 2016; i++) {
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
                markers[i].setVisible(false);
                timeFilteredMarkers.push(markers[i]);
            }
        }
    }
    else {  
        for (var i = 0; i < markers.length; i++){
            if (!((markers[i].crimeData.date.substring(11).localeCompare(firstTime) >=0)&&(markers[i].crimeData.date.substring(11).localeCompare(secondTime) <=0))) {
                markers[i].setVisible(false);
                timeFilteredMarkers.push(markers[i]);
            }
        }
    }
}

// Time range reset clicked
function timeRangeResetClicked(button) {
    
    // Show markers hidden by the time filter
    for (var i = 0; i < timeFilteredMarkers.length; i++) {
        timeFilteredMarkers[i].setVisible(true);
    }
    
    // Reset the array of marker references
    timeFilteredMarkers = [];
}