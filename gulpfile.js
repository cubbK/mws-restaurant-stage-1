// GraphicsMagick required to run this script

const gulp = require('gulp');
var gm = require('gulp-gm');
var parallel = require('concurrent-transform');

gulp.task('default', function () {
  return gulp.src('./img/*.jpg')
    .pipe(gm(function (gmfile) {
      return gmfile.resize(100, 100);
    }))
    .pipe(gulp.dest('./img/small/'));
});