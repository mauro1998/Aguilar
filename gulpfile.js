// Modules
const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');

// SASS directories
const dir = 'style_guide/css';
const src = path.join(dir, 'main.scss');
const dest = 'public/assets/styles';

// Tasks
gulp.task('make-css', function() {
  return gulp.src(src)
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefix({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(gulp.dest(dir))
  .pipe(gulp.dest(dest));
});

gulp.task('sass:watch', function() {
  return gulp.watch(path.join(dir, '**/*.scss'), ['make-css']);
});

gulp.task('copy-vendor', function() {
  return gulp.src([
    'node_modules/requirejs/require.js',
    'node_modules/requirejs-text/text.js',
    'node_modules/underscore/underscore.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/backbone/backbone.js'
  ]).pipe(uglify())
  .pipe(gulp.dest('public/vendor'));
});

gulp.task('default', ['make-css', 'copy-vendor']);
