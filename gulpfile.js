// Modules
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');

// SASS directories
const dir = path.join(__dirname, 'sass');
const src = path.join(dir, 'main.scss');
const dest = 'public/assets/styles';

// Tasks
gulp.task('make-css', () => gulp.src(src)
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefix({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(gulp.dest(dir))
  .pipe(gulp.dest(dest)));

gulp.task('sass:watch', () => gulp.watch(path.join(dir, '**/*.scss'), ['make-css']));

gulp.task('default', ['make-css']);
