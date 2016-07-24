var gulp = require('gulp'),
    screeps = require('gulp-screeps');


gulp.task('default', ['upload'], function() {

})

gulp.task('upload', function () {
  var credentials = require('./credentials.js')
  return gulp.src('game-code/*.js').pipe(screeps(credentials))
})
