// Modules
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');

// SASS directories
const dir = 'css/';
const src = path.join(dir, 'main.scss');
const dest = '../app/stylesheets/';

// Tasks
gulp.task('make', function() {
  return gulp.src(src)
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefix({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(gulp.dest(dir))
  .pipe(gulp.dest(dest));
});

gulp.task('sass:watch', function() {
  return gulp.watch(path.join(dir, '**/*.scss'), ['make']);
});

gulp.task('default', ['make', 'sass:watch']);
