const gulp = require('gulp');
const run    = require('gulp-run');
const eslint = require('gulp-eslint');
const testcafe = require('gulp-testcafe');
const babel = require('gulp-babel');

gulp.task('lint', () => {
    return gulp
        .src(['**/*.js', 'gulpfile.js', '!node_modules/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.results(results => {
            if (results.warningCount === 0 && results.errorCount === 0)
                console.log(`Correct!`);
        }));
});

gulp.task('unit-test', () => {
    return run('mocha --require babel-register test/unit/*-test.js').exec();
});

gulp.task('run-server', () => {
    require('./dist/app');
});

gulp.task('functional-test', () => {
    return gulp.src('test/functional/**/*.js')
        .pipe(testcafe({ browsers: ['chrome'], reporter: { name: 'spec' } }));
});

gulp.task('check', gulp.series('lint', 'unit-test', 'functional-test'));

gulp.task('build', () => {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

