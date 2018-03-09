// ImageMagick required to run this script
// https://www.imagemagick.org/script/index.php

const gulp = require('gulp');
const imageResize = require('gulp-image-resize');
var parallel = require('concurrent-transform');

gulp.task('resizeImages', function () {
  return gulp.src('./img/1.jpg')
    .pipe(parallel(
      imageResize({ width : 300 })
    ))
    .pipe(gulp.dest('./img/small/'));
});