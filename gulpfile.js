var browserify = require('browserify');
var exec = require('child_process').exec;
var fs = require('fs');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');
 
gulp.task('build', function() {
    exec('browserify index.js geo.js --s geojson3d > bundle.js')
});

gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             'localhost',
      port:             '8000',
      livereload:       true,
      directoryListing: false
    }));
});



gulp.task('watch', function () {
    // Watch .js files
    gulp.watch(['./*.js', "!./bundle.js"], ['build']);
});

gulp.task('dev', ['watch', 'webserver']);