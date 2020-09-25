import gulp from 'gulp';
import run from 'gulp-run';
import eslint from 'gulp-eslint';

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

