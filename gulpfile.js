var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var minifyCss   = require('gulp-minify-css');
var rev         = require('gulp-rev');
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
};

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
        .pipe($.csso())
        .pipe(gulp.dest( 'dist/stylesheets' ));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
        .pipe($.usemin({
            css: [minifyCss(), 'concat'],
            js: [uglify(), rev()],
            js1: [uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

// clean output directory
gulp.task('clean', function (cb) {
    rimraf('dist', cb);
});

gulp.task('assetMover', function() {

    gulp.src('geodata-formatted.json')
        .pipe(gulp.dest('dist'));

    gulp.src('build/img/**/*', {base: './build'})
        .pipe(gulp.dest('dist'));

});

gulp.task('viewMover', function() {
    gulp.src([
        'index.php'
    ], {base: './'})
        .pipe(gulp.dest('dist/'));
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
        'dist/stylesheets/*.css',
        'dist/index.html'
    ], reload);
    gulp.watch('index.html', ['usemin']);
    gulp.watch('build/**/*.scss', ['styles']);
});

gulp.task('default', function( cb ) {
    runSequence( 'clean', 'viewMover', 'assetMover', 'styles', 'usemin', ['watch', 'webserver'], cb );
});
