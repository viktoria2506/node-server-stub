const gulp = require('gulp');
const run    = require('gulp-run');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
    return gulp
        .src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.results(results => {
            if (results.warningCount === 0 && results.errorCount === 0)
                console.log(`Correct!`);
        }));
});

gulp.task('test', () => {
    return run('mocha test/**/*-test.js').exec();
});

gulp.task('start', () => {
    return run('node src/app.js').exec();
});

gulp.task('testcafe', () => {
    return run('testcafe chrome test/functional/test.js').exec();
});

gulp.task('check', gulp.series('lint', 'test', 'testcafe'));
