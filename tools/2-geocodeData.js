// this script geocodes data from a provided file
// format required:
//     {
//         location: 'location name'
//     }

var fs = require('fs');
var geocoder = require('omnigeo');

var data = require('../data/output/races-preGeo-combined.json');

var iterator = 0;
var numberOfLocations = data.length;

var writeData = function() {
    fs.writeFile('data/output/geodata.json', JSON.stringify(data), function(err) {
        if ( err ) {
            console.log( err );
        } else {
            console.log("The file was saved!");
        }
    });
}

var geocodeData = (function geocodeData() {
    if ( iterator < numberOfLocations - 1 ) {
        geocoder().geocode(data[iterator].location, function(res) {
            data[iterator].latitude = res.lat;
            data[iterator].longitude = res.lon;
            iterator++;
            console.log( 'just wrote: ' + data[iterator].location );
            setTimeout(function() {
                geocodeData();
            }, 250)
        });
    } else {
        writeData();
    }
})();
