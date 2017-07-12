const gulp = require('gulp');
const clean = require('gulp-clean');

const babelify = require('babelify');
const browserify = require('browserify');
const bundleCollapser = require('bundle-collapser/plugin');
const dotenv = require('dotenv');
const envify = require('envify');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const sass = require('gulp-sass');
const npmSass = require('npm-sass');
const sassInlineImage = require('sass-inline-image');

const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const prettyTime = require('pretty-hrtime');
const source = require('vinyl-source-stream');

const webserver = require('gulp-webserver');

const production = gutil.env.type === 'production';
process.env.NODE_ENV = production ? 'production' : 'development';

dotenv.config();

const bundle = watch => {

  const browserifyOptions = {
    entries: 'app/js/app.jsx',
    extensions: ['.js', '.jsx'],
    debug: !production,
    cache: {},
    packageCache: {}
  };
  const bundler = (watch ? watchify(browserify(browserifyOptions)) : browserify(browserifyOptions))
      .plugin(bundleCollapser)
      .transform(babelify, { presets: ['es2015', 'react'], plugins: ['transform-object-rest-spread'] })
      .transform(envify);

  const doBundle = () => {
    return bundler
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(production ? uglify() : gutil.noop())
      .pipe(gulp.dest('dist/js'));
  }

  bundler.on('update', () => {
    gutil.log('Starting \'' + gutil.colors.cyan('bundle') + '\'...');
    doBundle();
  });

  bundler.on('time', (duration) => {
    const time = prettyTime([0, duration * 1e6]);
    gutil.log('Finished \'' + gutil.colors.cyan('bundle') + '\' after ' + gutil.colors.magenta(time));
  });

  return doBundle();
}

gulp.task('build', ['build-html', 'build-js', 'build-css']);

gulp.task('build-html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('build-js', function () {
  return bundle(false);
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
  bundle(true);
  gulp.watch('app/**/*.html', ['build-html']);
  gulp.watch('app/**/*.{sass,scss}', ['build-css']);
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({ host: "0.0.0.0", livereload: true, open: true }));
});

gulp.task('default', ['watch', 'webserver']);
