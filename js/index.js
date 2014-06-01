var currentDate = moment();
var endingDate = moment( currentDate.year() + "December 31");
var range = moment().range( currentDate, endingDate );
var months = moment.months();
var geoJson;
var map;
var featureLayer;

$.ajax({
    url: '/geodata-formatted.json',
    success: function( data, textStatus, jqXHR ) {
        geoJson = data;
        initMap();
    }
});

// zoom map to user
function getLocation() {
    var options = {
        enableHighAccuracy: true
    };
    function success(pos) {
        var crd = pos.coords;
        map.setView([crd.latitude, crd.longitude], 8)
    };
    function error() {
        console.log( 'something went wrong' );
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( success, error, options );
    }
}


function initMap() {
    map = L.mapbox.map('map', 'imjared.iah0ll3p').setView([39.12367, -96.81229], 5);
    // var markers = new L.MarkerClusterGroup();

    featureLayer = L.mapbox.featureLayer().addTo(map);

    // Pass features and a custom factory function to the map
    featureLayer
        .setGeoJSON(geoJson)
        .setFilter(function( geoJson ) {
            var momentMonth = moment( geoJson.properties.month + currentDate.year() );
            return momentMonth.within(range);
        });

    // add html5 location controls
    L.control.locate({
        locateOptions: {
            maxZoom: 8
        }
    }).addTo(map);

    // getLocation();
}

function updateRange( val ) {
    var currentYear = currentDate.year();
    var start = parseInt(val[0]);
    var end = parseInt(val[1]);
    // this may need to get updated to month - 1 to include current month
    var startDate = moment( months[start] + currentDate.year() );
    var endDate = moment( months[end] + currentDate.year() );
    range = moment.range( startDate, endDate );
    featureLayer.setFilter(function( geoJson ) {
        var momentMonth = moment( geoJson.properties.month + currentDate.year() );
        return momentMonth.within(range);
    });
}

jQuery(document).ready(function() {

    var months = moment.months();

    $("#slider").noUiSlider({
        start: [ currentDate.month(), 11],
        step: 1,
        connect: true,
        margin: 1,
        range: {
            'min': 0,
            'max': 11
        }
    })
    .on('set', function( e, val ) {
        var lower = parseInt(val[0]);
        var upper = parseInt(val[1]);
        $('#date-now').text( months[lower] );
        $('#date-end').text( months[upper] );
        updateRange( val );
    });
    ;

});
