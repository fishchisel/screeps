var gulp = require('gulp'),
    screeps = require('gulp-screeps')
    ts = require ('gulp-typescript');

var credentials = require('./credentials.js')

// NOTE
// credentials file not in repo. It should have format similar to:
// module.exports = {
//     email: '????',
//     password: '????',
// };


var tsProject = ts.createProject("tsconfig.json");

/* Default Task */
gulp.task('default', ['typescript-compile'], function() {

})

/* Compiles all typescript */
gulp.task('typescript-compile', function() {
  return tsProject.src()
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest("dist"));
})

/* Uploads to default branch */
gulp.task('upload', ['typescript-compile'], function () {
  credentials.branch = 'default';
  credentials.ptr = false;

  return gulp.src('dist/**/*.js').pipe(screeps(credentials))
})

/* Uploads to sim branch */
gulp.task('upload-sim', ['typescript-compile'], function () {
  credentials.branch = 'sim';
  credentials.ptr = false;

  return gulp.src('dist/**/*.js').pipe(screeps(credentials))
})
