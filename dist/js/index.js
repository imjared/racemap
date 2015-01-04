var currentDate = moment();
var endingDate = moment( currentDate.year() + " 12 31", "YYYY MM DD");
var range = moment().range( currentDate, endingDate );
var months = moment.months();
var geoJson;
var map;
var featureLayer;

$.ajax({
    url: './geodata-formatted.json',
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

    featureLayer = L.mapbox.featureLayer().addTo(map);

    featureLayer.on('layeradd', function(e) {
        var marker = e.layer,
            feature = marker.feature,
            popupContent =  '<div class="popup">' +
                                     '<p class="race-time">' + feature.properties.day + '</p>' +
                                     '<p class="race-time">' + feature.properties.month + '</p>' +
                                     '<p class="race-title">' + feature.properties.name + '</p>' +
                                     '<p class="race-location">' + feature.properties.location + '</p>' +
                                     '<p class="race-location"><a href="' + feature.properties.url + '">View race information</a></p>' +
                                 '</div>';
            marker.bindPopup(popupContent,{
                closeButton: false,
                minWidth: 320
            });
    });

    // Pass features and a custom factory function to the map
    featureLayer
        .setGeoJSON(geoJson)
        .setFilter(function( geoJson ) {
            var month = moment().month( geoJson.properties.month )
            return month.within(range);
        });

    // add html5 location controls
    L.control.locate({
        locateOptions: {
            maxZoom: 8
        }
    }).addTo(map);

    // getLocation();
}

function updateRange( val, day ) {
    var currentYear = currentDate.year();
    var start       = parseInt(val[0]) + 1;
    var end         = parseInt(val[1]) + 1;
    var startDate   = moment( start + ' ' + currentYear, "M YYYY" );
    var endDate     = moment( end + ' ' + currentYear, "M YYYY" ).endOf('month');
    var range       = moment.range( startDate, endDate );
    featureLayer.setFilter(function( geoJson ) {
        var momentMonth = moment( geoJson.properties.month + ' ' + currentYear, "MMM YYYY" );
        if ( day === "all" ) {
            return momentMonth.within(range);
        } else {
            if ( momentMonth.within(range) && geoJson.properties.day === day ) {
                return true
            } else {
                return false;
            }
        }
    });
}

function setTimeVals() {
    var val = $("#slider").val();
    var day = $('select').val();
    var lower = parseInt(val[0]);
    var upper = parseInt(val[1]);
    if ( months[lower] != months[upper] ) {
        $('.multimonth').removeClass('is-hidden');
        $('.singlemonth').addClass('is-hidden')
        $('#date-now').text( months[lower] );
        $('#date-end').text( months[upper] );
    } else {
        $('.multimonth').addClass('is-hidden');
        $('.singlemonth').removeClass('is-hidden');
    }
    updateRange( val, day );
}

jQuery(document).ready(function() {

    var months = moment.months();

    $('#map-details select').on('change', setTimeVals);

    $("#slider").noUiSlider({
        start: [ currentDate.month(), 11],
        step: 1,
        connect: true,
        // margin: 1,
        range: {
            'min': 0,
            'max': 11
        }
    })
    .on('set', function() {
        setTimeVals();
    });

});
