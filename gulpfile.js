var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

var TS_FILES = ['app/**/*.ts'];

gulp.task('build', function() {
  var tsResult = gulp.src(TS_FILES)
    .pipe(ts({
        noImplicitAny: true,
        suppressImplicitAnyIndexErrors: true,
        outFile:"../app.js",
        removeComments: true,
        sortOutput: true
      }));
      
      return tsResult.js.pipe(gulp.dest('app'));
});
 
gulp.task('watch', function () {
  gulp.watch(TS_FILES, ['lint', 'build']);
});

gulp.task("lint", function(){
    gulp.src(TS_FILES)
        .pipe(tslint())
        .pipe(tslint.report("prose",{
            emitError: false
        }));
});

gulp.task("default", ['lint', 'build']);