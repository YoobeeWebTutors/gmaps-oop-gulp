// Load all the modules from package.json
var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  watch = require('gulp-watch'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  wait = require('gulp-wait')
  concat = require('gulp-concat');


// Default error handler
var onError = function (err) {
  console.log('An error occured:', err.message);
  this.emit('end');
}

// This task creates two files, the regular and
// the minified one.
gulp.task('scss', function () {
  return gulp.src('stylesheets/main.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(wait(1500))
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', function () {
  // return gulp.src('./js/*.js')
  return gulp.src(['./js/MapManager.js', './js/main.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js/'));
});


gulp.task('watch', function () {
  gulp.watch(['./js/**/*.js'], ['scripts'])
  gulp.watch('./stylesheets/**/*.scss', ['scss']);
});


gulp.task('default', ['watch'], function () {
  // Does nothing in this task, just triggers the dependent 'watch'
});
