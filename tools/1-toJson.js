var fs = require('fs');
var cheerio = require('cheerio');

var days = ['saturday', 'sunday'];
var races = [];

for (var i = 0; i < days.length; i++) {

    var day = days[i];

    var xml = fs.readFileSync('data/data-' + day +'.xml', 'utf-8');
    $ = cheerio.load( xml, {
        normalizeWhitespace: true,
        xmlMode: true
    });

    $('circle').each(function(i, el) {
        var meta = $(this).attr('t').split('\\n');
        races.push({
            'name'         : meta[0],
            'location'     : removeFirstSpaceCharacter( meta[1] ),
            'month'        : removeFirstSpaceCharacter( meta[2] ),
            'url'          : $(this).attr('u'),
            'marker-color' : '#' +$(this).attr('c').split('0x')[1],
            'day'          : day
        });
    });

    function removeFirstSpaceCharacter( str ) {
        var noSpacesHere = '';
        if ( str.indexOf(' ') === 0 ) {
            noSpacesHere = str.replace(' ', '');
        }
        return noSpacesHere;
    }

};

var output = JSON.stringify(races);

fs.writeFile('data/output/races-preGeo.json', output, 'utf-8', function( err ) {
    if ( err ) {
        throw err;
    } else {
        console.log( 'done' );
    }
});
