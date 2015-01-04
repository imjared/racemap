var fs = require('fs');
var cheerio = require('cheerio');

var xml = fs.readFileSync('data/data-saturday.xml', 'utf-8');
$ = cheerio.load( xml, {
    normalizeWhitespace: true,
    xmlMode: true
});

var races = [];
$('circle').each(function(i, el) {
    var meta = $(this).attr('t').split('\\n');
    races[i] = {
        'name'         : meta[0],
        'location'     : removeFirstSpaceCharacter( meta[1] ),
        'month'        : removeFirstSpaceCharacter( meta[2] ),
        'url'          : $(this).attr('u'),
        'marker-color' : '#' +$(this).attr('c').split('0x')[1],
        'day'          : 'saturday'

    }
});

function removeFirstSpaceCharacter( str ) {
    var noSpacesHere = '';
    if ( str.indexOf(' ') === 0 ) {
        noSpacesHere = str.replace(' ', '');
    }
    return noSpacesHere;
}

var output = JSON.stringify(races);

fs.writeFile('data/output/races-preGeo-saturday.json', output, 'utf-8', function( err ) {
    if ( err ) {
        throw err;
    } else {
        console.log( 'done' );
    }
});
