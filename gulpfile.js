// Modules
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');

// SASS directories
const dir = path.join(__dirname, 'sass');
const src = path.join(dir, 'main.scss');
const dest = path.join(__dirname, 'public/');
const styles = path.join(dest, 'assets/styles');
const vendor = path.join(dest, 'vendor');

// Tasks
gulp.task('make-css', () => gulp.src(src)
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefix({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(gulp.dest(dir))
  .pipe(gulp.dest(styles))
);

gulp.task('copy-vendor', () => gulp.src([
    path.join(__dirname, '../lib/jquery.js')
  ]).pipe(gulp.dest(vendor))
);

gulp.task('sass:watch', () => gulp.watch(path.join(dir, '**/*.scss'), ['make-css']));

gulp.task('default', ['make-css', 'copy-vendor']);
