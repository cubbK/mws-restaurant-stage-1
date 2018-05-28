// GraphicsMagick required to run this script

const gulp = require('gulp');
const gm = require('gulp-gm');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');

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

gulp.task('css', () => {
  gulp.src('./css/styles.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('./css/minified/'));
})

gulp.task('js', () => {
  gulp.src('./js/*.js')
  .pipe(minify())
  .pipe(gulp.dest('./js/minified/'))
})

gulp.task('default', ['image-resize-small', 'image-resize-medium'])