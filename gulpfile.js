const { src, dest, series } = require('gulp')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')

const data = {
  js: {
    files: 'assets/js/**/*.js',
    concat: 'main.js',
    dest: 'public/build/'
  },
  css: {
    files: 'assets/css/**/*.css',
    main: 'public/build/main.css',
    dest: 'public/build/'
  },
  sass: {
    files: 'assets/sass/**/*.sass',
    concat: 'sass-compiled.css',
    dest: 'assets/css/'
  }
}

const sass = () => {
	return src(data.sass.files)
		.pipe(sass())
		.pipe(concat(data.sass.concat))
		.pipe(dest(data.sass.dest))
}

const css = () => {
	return src(data.css.files)
		.pipe(concat(data.css.concat))
		.pipe(dest(data.css.dest))
}

const cssMinify = () => {
  return src(data.css.main)
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(data.css.dest))
}

const js = () => {
	return src(data.js.files)
		.pipe(uglify())
		.pipe(concat(data.js.concat))
		.pipe(dest(data.js.dest))
}

const jsMinify = () => {
	return src(data.js.dest + data.js.concat)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(data.js.dest))
}

const minify = () => {
  return series(cssMinify, jsMinify)
}

const production = () => {
  return series(sass, css, js, minify)
}

module.exports.default = sass
module.exports.css = css
module.exports.cssMinify = cssMinify
module.exports.js = js
module.exports.jsMinify = jsMinify
module.exports.minify = minify
module.exports.production = production
