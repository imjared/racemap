var express = require('express');
var compression = require('compression');
var fs = require('fs');

var app = express();
var publicdir = __dirname + '/dist';

// New call to compress content
app.use(compression())

// Static assets should be cached forever.
// Others we want the CDN to cache, and then expire on build.

app.use(function(req, res, next) {
    var matchUrl = '/static';
    var oneYear = 31557600000;
    if(req.url.substring(0, matchUrl.length) === matchUrl) {
        res.setHeader("Cache-Control", "public, max-age=" + oneYear);
        res.setHeader("Expires", new Date(Date.now() + (oneYear * 1000)).toUTCString());
    }
    return next();
});

// Serve .html files without the extension
app.use(function(req, res, next) {

    if (req.path.indexOf('.') === -1) {
        var file = publicdir + req.path + '.html';
        fs.exists(file, function(exists) {
            if (exists)
            req.url += '.html';
            next();
        });
    } else {
        next();
    }
});

app.use(express.static(publicdir));

var appPort = process.env.PORT || 3000;
app.listen(appPort);
console.log('Express started on port ' + appPort);
