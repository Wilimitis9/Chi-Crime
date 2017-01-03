// Require JavaScript
if (typeof jQuery === 'undefined') {
  throw new Error('This JavaScript requires jQuery')
}


// Function to request Socrata data and return in JSON
function pullSocrata(requestURL) {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': requestURL,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
}


