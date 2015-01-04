var gulp        = require('gulp');
var sourcemaps  = require('gulp-sourcemaps');
var $           = require('gulp-load-plugins')();
var rimraf      = require('rimraf');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var handleErrors = function() {
    var args = Array.prototype.slice.call(arguments);
    $.notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);

    this.emit('end');
}

gulp.task('styles', function() {
    return gulp.src( 'build/scss/screen.scss' )
        .pipe(sourcemaps.init())
        .pipe($.sass({
            style: 'compressed',
            onError: function(err){
                $.notify().write(err);
            }
        }))
        .pipe($.sourcemaps.write())
        .pipe($.autoprefixer('last 2 versions'))
        .pipe(gulp.dest( 'dist/stylesheets' ))
});

// clean output directory
gulp.task('clean', function (cb) {
    rimraf('dist', cb);
});

gulp.task('assetMover', function() {

    gulp.src('js/**')
        .pipe(gulp.dest('dist/js'));

    gulp.src('geodata-formatted.json')
        .pipe(gulp.dest('dist'));

    gulp.src('bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));

});

gulp.task('viewMover', function() {
    gulp.src([
        'index.html',
        'index.php'
    ], {base: './'})
        .pipe(gulp.dest('dist/'))
});

gulp.task('webserver', function() {
    browserSync({
        tunnel: true,
        logLevel: 'info',
        files: 'dist/stylesheets/screen.css',
        injectChanges: true,
        server: {
            baseDir: ['dist'],
        }
    });
});

gulp.task('watch', function() {
    gulp.watch([
        'dist/js/**',
        'dist/stylesheets/**',
        'dist/bower_components',
        'dist/index.html'
    ], reload);
    gulp.watch([
        'js/**',
        'bower_components/**'
    ], ['assetMover']);
    gulp.watch('index.html', ['viewMover']);
    gulp.watch('build/**/*.scss', ['styles']);
});

gulp.task('default', function( cb ) {
    runSequence( 'clean', 'viewMover', 'assetMover', 'styles', ['watch', 'webserver'], cb );
});
