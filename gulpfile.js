var gulp = require('gulp'),
    screeps = require('gulp-screeps')
    ts = require ('gulp-typescript');

var tsProject = ts.createProject("tsconfig.json");

gulp.task('default', ['upload'], function() {

})

gulp.task('typescript-compile', function() {
  return tsProject.src()
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest("dist"));
})

gulp.task('upload', function () {
  // credentials file not in repo. It should have format similar to:
  // module.exports = {
  //     email: '????',
  //     password: '????',
  //     branch: 'default',
  //     ptr: false
  // };

  var credentials = require('./credentials.js')
  return gulp.src('dist/*.js').pipe(screeps(credentials))
})
