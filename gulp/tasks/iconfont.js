var gulp        = require('gulp');
var iconfont    = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

var fontName = 'Icons';

gulp.task('iconfont', function(){
    gulp.src( 'build/icon/*.svg', { base: 'public' } )
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'scss',
            targetPath: '../../build/scss/modules/_icons.scss',
            fontPath: '/fonts/'
        }))
        .pipe(iconfont({
            fontName: fontName
        }))
        .pipe(gulp.dest( 'public/fonts' ))
});
