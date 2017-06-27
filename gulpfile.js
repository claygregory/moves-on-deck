const gulp = require('gulp');
const clean = require('gulp-clean');

const babelify = require('babelify');
const browserify = require('browserify');
const bundleCollapser = require('bundle-collapser/plugin');
const envify = require('envify');
const uglify = require('gulp-uglify');

const sass = require('gulp-sass');
const npmSass = require('npm-sass');
const sassInlineImage = require('sass-inline-image');

const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');

const watchify = require('watchify');
const webserver = require('gulp-webserver');

const production = gutil.env.type === 'production';

gulp.task('build', ['build-html', 'build-js', 'build-css']);

gulp.task('build-html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('build-js', function () {
  process.env.NODE_ENV = production ? 'production' : 'development';
  return browserify({ entries: 'app/js/app.jsx', extensions: ['.js', '.jsx'], debug: !production })
      .plugin(bundleCollapser)
      .transform(babelify, { presets: ['es2015', 'react'], plugins: ['transform-object-rest-spread'] })
      .transform(envify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(production ? uglify() : gutil.noop())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build-css', function () {
  return gulp.src('app/**/*.scss')
    .pipe(sass({
      functions: sassInlineImage({ base: './app/images' }),
      importer: npmSass.importer,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('watch', ['build'], function () {
  gulp.watch('app/**/*.html', ['build-html']);
  gulp.watch('app/**/*.{js,jsx}', ['build-js']);
  gulp.watch('app/**/*.{sass,scss}', ['build-css']);
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({ host: "0.0.0.0", livereload: true, open: true }));
});

gulp.task('default', ['watch', 'webserver']);
