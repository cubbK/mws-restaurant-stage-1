// GraphicsMagick required to run this script

const gulp = require('gulp');
const gm = require('gulp-gm');
const imagemin = require('gulp-imagemin');

gulp.task('image-resize-small', function () {
  return gulp.src('./img/*.jpg')
    .pipe(gm(function (gmfile) {
      return gmfile.resize(300);
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('./img/small/'));
});

gulp.task('image-resize-medium', () => 
  gulp.src('./img/*.jpg')
  .pipe(gm(function (gmfile) {
    return gmfile.resize(500);
  }))
  .pipe(imagemin())
  .pipe(gulp.dest('./img/medium/'))
)

gulp.task('default', ['image-resize-small', 'image-resize-medium'])