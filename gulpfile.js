const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const sequence = require('run-sequence');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// compile sass and run postcss
gulp.task('styles', function () {
    var plugins = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()
    ];
    return gulp.src('src/assets/scss/*.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe(browserSync.stream());

});
// copy all html files
gulp.task('copy-html', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});
// copy all css files
// gulp.task('copy-css', function(){
//     gulp.src('src/assets/styles/*.css')
//         .pipe(gulp.dest('dist/assets/styles/'));
// });
// image compression
gulp.task('copy-compress-images', () =>
    gulp.src('src/assets/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
);
// concat scripts with compression
gulp.task('concat-scripts', function(){
    gulp.src('src/assets/scripts/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/scripts'))
        .pipe(gulp.dest('src/assets/scripts'))
});
// watch and serve
gulp.task('serve', function(){
	browserSync.init({
		server: './dist'
	});
    gulp.watch(['src/assets/scss/*.scss'], ['build']).on('change', browserSync.reload);
    gulp.watch(['src/*.html','src/*.js'], ['build']).on('change', browserSync.reload);
    gulp.start('build');
});

// build for dist
gulp.task('build', function (done) {
    sequence('styles','copy-html', 'copy-compress-images', 'concat-scripts', done);
});

// default
gulp.task('default', ['serve']);