//package
const package = require('./package.json');

// Gulp Dependencies
var gulp = require('gulp');
//var rename = require('gulp-rename');

// Build Dependencies
var uglify = require('gulp-uglify');
var beautify = require('gulp-beautify');
var del = require('del');
var runSequence = require('run-sequence');
var pump = require('pump');

// Development Dependencies
var eslint = require('gulp-eslint');


const path = {
  'serverjs': './server/*.js',
  'clientjs': 'client/js/*.js',
  //'clientjs' : ['./client/js/index.js'],
  'pages': './client/*.html',
  'buildserver': './build/server/',
  'buildclient': './build/client/'
};

gulp.task('clean', function() {
  return del(path.build);
});

gulp.task('beautify-server', function() {
  gulp.src(path.serverjs)
    .pipe(beautify(package.beautify))
    .pipe(gulp.dest('./server/'));
});

gulp.task('beautify-client', function() {
  gulp.src(path.clientjs)
    .pipe(beautify(package.beautify))
    .pipe(gulp.dest('./client/js/'));
});


/**
 * Lint all the code using the configuration
 * specified in the package.json file
 */
gulp.task('lint-client', function() {
  return gulp.src(path.clientjs)
    .pipe(eslint(package.eslintConfig))
    .pipe(eslint.format());
    //.pipe(eslint.failAfterError());
});

gulp.task('lint-server', function() {
  return gulp.src(path.serverjs)
    .pipe(eslint(package.eslintConfig))
    .pipe(eslint.format());
    //.pipe(eslint.failAfterError());
});

// gulp.task('ugly-client', function (cb) {
//   pump([
//         gulp.src(path.clientjs),
//         uglify(),
//         gulp.dest(path.buildclient)
//     ],
//     cb
//   );
// });

// gulp.task('ugly-server', function (cb) {
//   pump([
//         gulp.src(path.serverjs),
//         uglify(),
//         gulp.dest(path.buildserver)
//     ],
//     cb
//   );
// });

gulp.task(
  'default',
  function(callback) {
    runSequence(
      'clean',
      'lint-client',
      'lint-server',
      'beautify-client',
      'beautify-server',
      //'ugly-client',
      //'ugly-server',
      callback);
  }
);