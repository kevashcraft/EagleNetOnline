var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var del = require('del');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var vulcanize = require('gulp-vulcanize');
var fs = require('fs');
var exec = require('child_process').exec;
var pages = [
  'announcements',
  'schedule',
  'protocol',
  'net-control-stations',
  'arrl-section-officials',
];

var prod = false;
prod = true;

var abspath = prod ? '/home/kevin/dev/eaglenet.online/pre' : '';



gulp.task('clean', function(cb) {
  del('pre');
  return del('dist');
});

gulp.task('data', ['clean'], function(cb) {
  exec('php app/index.php', function (err, stdout, stderr) {
    data = JSON.parse(fs.readFileSync('./data.json'));
    cb(err);
  });
});

// twig rendering
gulp.task('render', ['data'], function() {
  'use strict';
  data.abspath = abspath;
  data.pages = pages;
  var stream = gulp.src('./twig/pages/**/*.twig')
    .pipe(twig({
      errorLogToConsole: true,
      base: './twig',
      data: data,
    }))
    .pipe(gulpif(prod, minifyHTML({
      collapseWhitespace: true,
    })))
    .pipe(gulp.dest('pre'));
  return stream;
});

// sass compilation
gulp.task('styles', ['render'], function(cb) {
  var stream = gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(prod, minifyCSS()))
    .pipe(gulp.dest('pre/styles/'));
  return stream;
});

// minify JS
gulp.task('minify-js', ['styles'], function(cb) {
  var stream = gulp.src('./scripts/**/*.js')
    .pipe(gulpif(prod, minifyJS({
      ext: {
        min: '.js',
      },
      noSource: true,
    })))
    .pipe(gulp.dest('pre/scripts/'));
  return stream;
});

// vulcanize
gulp.task('vulcanize', ['minify-js'], function() {
  var stream = gulp.src('pre/**/*.html')
  .pipe(gulpif(prod, vulcanize({
    abspath: '',
    inlineCss: true,
    inlineScripts: true,
  })))
  .pipe(gulp.dest('dist'));

  if (!prod) {
    gulp.src('pre/**/*.css').pipe(gulp.dest('dist'));
    gulp.src('pre/**/*.js').pipe(gulp.dest('dist'));
  }

  gulp.src(['static/**/*', 'static/**/.*']).pipe(gulp.dest('dist'));
  return stream;
})

gulp.task('default', ['vulcanize']);

gulp.task('watch', ['vulcanize'], function() {
  gulp.watch('sass/**/*.scss', ['vulcanize']);
  gulp.watch('scripts/**/*.js', ['vulcanize']);
  gulp.watch('twig/**/*.twig', ['vulcanize']);
});

