let gulp = require('gulp');
let sass = require('gulp-sass');
let prefix = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
let rename = require('gulp-rename');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let livereload = require('gulp-livereload');

let jsInternals = [
	'assets/javascript/**/*'
]
let jsExternals = [
	'node_modules/jquery/dist/jquery.js',
	// 'node_modules/popper.js/dist/popper.js',
	'node_modules/bootstrap/dist/js/bootstrap.js',
]

// compile sass
gulp.task('sass', function() {
	return gulp.src('assets/sass/*.sass')
		.pipe(sass())
		.pipe(prefix({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(livereload())
		.pipe(gulp.dest('public/build/'));
});

// concat internal js
gulp.task('js:internals', function() {
	return gulp.src(jsInternals)
		.pipe(uglify())
		.pipe(concat('internals.js'))
		.pipe(livereload())
		.pipe(gulp.dest('public/build/'))
});

// concat external js
gulp.task('js:externals', function() {
	return gulp.src(jsExternals)
		.pipe(uglify())
		.pipe(concat('externals.js'))
		.pipe(livereload())
		.pipe(gulp.dest('public/build/'))
});

//
// minify functions

// minify css
gulp.task('css:minify', function() {
	return gulp.src('public/build/main.css')
		.pipe(cleanCSS({
			debug: true, compatibility: 'ie8'
		}))
		.pipe(prefix({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(rename({ suffix:'.min' }))
		.pipe(livereload())
		.pipe(gulp.dest('public/build/'))
});

// minify js
gulp.task('js:minify', function() {
	return gulp.src('public/build/internals.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(livereload())
		.pipe(gulp.dest('public/build/'))
});

// minify all types
gulp.task('minify', ['css:minify', 'js:minify']);

// concat scripts
gulp.task('js:all', function() {
	return gulp.src(['public/build/externals.js', 'public/build/internals.min.js'])
		.pipe(concat('main.min.js'))
		.pipe(livereload())
		.pipe(gulp.dest('public/build/'))
});

// build
gulp.task('production', ['sass', 'css:minify', 'js:minify', 'js:all']);

// css:watch
gulp.task('sass:watch', function() {
	livereload.listen();
	gulp.watch('assets/sass/**/*.sass', ['sass'], { awaitWriteFinish: true });
});

// watch all
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('assets/sass/**/*.sass', ['sass'],   { awaitWriteFinish: true });
	gulp.watch('assets/angular/**/*.js', ['js:internals'], { awaitWriteFinish: true });
});
