// convers to geojson format
var fs = require('fs');
var geojson = require('GeoJSON');

var file = 'geodata.json';

fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }

    data = JSON.parse(data);

    formatData(data);
});

function formatData(data) {
    var output;
    geojson.parse( data, { Point: ['latitude', 'longitude'] }, function( geojson ) {
        output = JSON.stringify(geojson);
    });
    writeOutput( output );
}

function writeOutput( output ) {
    fs.writeFile('geodata-formatted.json', output, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}