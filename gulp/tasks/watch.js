var gulp       = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('watch', function(){
  gulp.watch('build/scss/**', ['sass']);
  livereload();
});
