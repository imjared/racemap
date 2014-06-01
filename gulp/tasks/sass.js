var gulp       = require('gulp');
var sass       = require('gulp-sass');
var notify     = require('gulp-notify');
var debug      = require('gulp-debug');
var csso       = require('gulp-csso');

gulp.task('sass', function() {
    return gulp.src('./build/scss/*.scss')
        .pipe(sass({
            style: 'compressed',
            sourceComments: 'map'
        }))
        // .pipe(csso())
        .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "SASS Error"
        }))
        .pipe(gulp.dest( './stylesheets' ))
});
