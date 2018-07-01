gulp       = require('gulp')
sass       = require('gulp-sass')
prefix     = require('gulp-autoprefixer')
cleanCSS   = require('gulp-clean-css')
rename     = require('gulp-rename')
concat     = require('gulp-concat')
uglify     = require('gulp-uglify')
coffee     = require('gulp-coffee')
livereload = require('gulp-livereload')

# compiling sass
gulp.task 'sass', ->
    gulp.src ['assets/sass/*.sass', 'assets/sass/**/*.sass']
        .pipe sass()
        .pipe prefix {
            browsers: ['last 5 versions']
            cascade:  false
        }
        .pipe gulp.dest 'public/css/'
