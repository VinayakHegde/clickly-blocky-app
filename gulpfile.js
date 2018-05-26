var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var babel = require("gulp-babel");

gulp.task('default', ['connect', 'build', 'less', 'watch']);

gulp.task("build", function () {
  return gulp.src("app/javascript/grid.js")
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest("dist"));
})

gulp.task('connect', function () {
    connect.server({
        livereload: true,
        port: 9100
    });
});

gulp.task('less', function () {
    gulp.src('app/less/*less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('reload', function () {
    gulp.src('dist/**/*')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['app/less/*less'], ['less']);
    gulp.watch(['app/javascript/*js'], ['build']);
    gulp.watch(['dist/**/*'], ['reload']);
});
