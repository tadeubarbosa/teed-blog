gulp       = require('gulp')
sass       = require('gulp-sass')
prefix     = require('gulp-autoprefixer')
cleanCSS   = require('gulp-clean-css')
rename     = require('gulp-rename')
concat     = require('gulp-concat')
uglify     = require('gulp-uglify')
coffee     = require('gulp-coffee')
livereload = require('gulp-livereload')

jsInternals = [
	'assets/javascript/**/*'
	'assets/angular/main.js'
	'assets/angular/**/*.js'
]
jsExternals = [
	'node_modules/jquery/dist/jquery.js'
	'node_modules/popper.js/dist/popper.js'
	'node_modules/bootstrap/dist/js/bootstrap.js'
	'node_modules/angular/angular.js'
]

# compile sass
gulp.task 'sass', ->
	gulp.src 'assets/sass/*.sass'
		.pipe sass()
		.pipe prefix {
			browsers: ['last 5 versions']
			cascade: false
		}
		.pipe gulp.dest 'public/build/'

# concat internal js
gulp.task 'js:internals', ->
	gulp.src jsInternals
		.pipe uglify()
		.pipe concat 'internals.js'
		.pipe gulp.dest 'public/build/'

# concat external js
gulp.task 'js:externals', ->
	gulp.src jsExternals
		.pipe uglify()
		.pipe concat 'externals.js'
		.pipe gulp.dest 'public/build/'

####
# minify functions

# minify css
gulp.task 'css:minify', ->
	gulp.src 'public/build/main.css'
		.pipe cleanCSS ({
			debug: true, compatibility: 'ie8'
		})
		.pipe prefix {
			browsers: ['last 5 versions']
			cascade: false
		}
		.pipe rename { suffix: '.min' }
		.pipe gulp.dest 'public/build/'
		null

# minify js
gulp.task 'js:minify', ->
	gulp.src 'public/build/internals.js'
		.pipe uglify()
		.pipe rename { suffix: '.min' }
		.pipe gulp.dest 'public/build/'

# minify all types
gulp.task 'minify', ['css:minify', 'js:minify']

# compile angularjs coffee
gulp.task 'compile:ang.coffee', ->
	gulp.src ['assets/angular/config/*.coffee', 'assets/angular/**/*.coffee']
		.pipe coffee { bare: true }
		.pipe concat 'main.js'
		.pipe gulp.dest 'assets/angular/'

# compile coffee
gulp.task 'compile:coffee', ->
	gulp.src ['assets/coffee/*.coffee', 'assets/coffee/**/*.coffee']
		.pipe coffee { bare: true }
		.pipe concat 'coffee.builded.js'
		.pipe gulp.dest 'assets/javascript/'

# compile coffee and add to internals
gulp.task 'coffee', ['compile:coffee', 'js:internals']

# concat scripts
gulp.task 'js:all', ->
	gulp.src ['public/build/externals.js', 'public/build/internals.min.js']
		.pipe concat 'main.min.js'
		.pipe gulp.dest 'public/build/'

# build
gulp.task 'production', ['sass', 'css:minify', 'coffee', 'js:minify', 'js:all']

# css:watch
gulp.task 'sass:watch', ->
	livereload.listen()
	gulp.watch 'assets/sass/**/*.sass', ['sass'], { awaitWriteFinish: true }

# coffee:watch
gulp.task 'coffee:watch', ->
	livereload.listen()
	gulp.watch 'assets/coffee/**/*.coffee', ['coffee'], { awaitWriteFinish: true }

# angular:watch
gulp.task 'angular:watch', ->
	livereload.listen()
	gulp.watch ['assets/angular/**/*.coffee','assets/angular/**/*.js'], ['coffee'], { awaitWriteFinish: true }

# watch all
gulp.task 'watch', ->
	livereload.listen()
	gulp.watch 'assets/sass/**/*.sass', ['sass'],   { awaitWriteFinish: true }
	gulp.watch 'assets/angular/**/*.coffee', ['coffee'], { awaitWriteFinish: true }
	gulp.watch 'assets/angular/**/*.js', ['js:internals'], { awaitWriteFinish: true }
