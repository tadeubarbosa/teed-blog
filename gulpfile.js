const { watch, src, dest, series } = require('gulp')
const gulpSass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const gulpImage = require('gulp-image')

const data = {
  js: {
    files: 'assets/js/**/*.js',
    concat: 'main.js',
    dest: 'public/build/'
  },
  css: {
    files: 'assets/css/**/*.css',
    concat: 'main.css',
    dest: 'public/build/'
  },
  sass: {
    files: 'assets/sass/**/*.sass',
    concat: 'sass-compiled.css',
    dest: 'assets/css/'
  },
  image: {
    files: 'assets/images/**/*',
    dest: 'public/images/'
  }
}

const sass = () => {
	return src(data.sass.files)
		.pipe(gulpSass())
		.pipe(concat(data.sass.concat))
		.pipe(dest(data.sass.dest))
}

const css = () => {
	return src(data.css.files)
		.pipe(concat(data.css.concat))
		.pipe(dest(data.css.dest))
}

const cssMinify = () => {
  return src(data.css.dest + data.css.concat)
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

const image = () => {
  return src(data.image.files)
        .pipe(gulpImage())
        .pipe(dest(data.image.dest))
}

const watchSass = () => {
  return watch(data.sass.files, (done) => {
    series(sass, css)()
    done()
  })
}

module.exports.default = sass
module.exports.sass = sass
module.exports.css = css
module.exports.cssMinify = cssMinify
module.exports.js = js
module.exports.jsMinify = jsMinify
module.exports.image = image

module.exports.minify = series(cssMinify, jsMinify)
module.exports.production = series(sass, css, js, series(cssMinify, jsMinify))

module.exports.watchSass = watchSass
