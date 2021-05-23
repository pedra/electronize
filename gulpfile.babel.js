/*  
	By Bill Rocha <prbr@ymail.com>

	*** Este script requer o Babel & Gulp 4 ou posterior *** 
	Antes de usar, instale a última versão do GULP-CLI e os plugins necessários:

	npm i --save-dev @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/register
	npm i --save-dev gulp@4 gulp-autoprefixer gulp-clean-css gulp-concat gulp-html-minifier2 gulp-if gulp-watch gulp-babel
	npm i --save-dev gulp-javascript-obfuscator gulp-sass gulp-uglify uglify-es del yargs

	adicione essas linhas no seu package.js

	"babel": {
		"presets": [ "@babel/preset-env"]
	},

 */

'use strict'

//import { exec, spawn } from 'child_process'
import { gulp, series, parallel, src, dest } from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import minifyCSS from 'gulp-clean-css'
import streamqueue from 'streamqueue'
import htmlmin from 'gulp-html-minifier2'
import concat from 'gulp-concat'
import header from 'gulp-header'
import yargs from 'yargs'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglifyes from 'uglify-es'
import composer from 'gulp-uglify/composer'
//import path from 'path'
//import del from 'del'
//import imagemin from 'gulp-imagemin'
//import sftp from 'gulp-sftp-up4'

const uglify = composer(uglifyes, console)
const argv = yargs.argv

const target = 'src/host/public'

// args
let PRO = argv.p !== undefined // gulp -p (production mode)
let OBF = (argv.o || false) && PRO // gulp -o (obfuscator)
let BABEL = argv.b !== undefined // gulp -b (to run Babel)

// show config
console.log(
	'\n---------------------------------------------------\n    ' +
	(!PRO ? "DEVELOPMENT mode ['gulp -p' to production]" : 'PRODUCTION mode') +
	'\n---------------------------------------------------\n'
)

/**
 * Concatenate and minify html files
 * @param {Array} files Files to process
 * @param {String} output Output path/file 
 * @param {String} destination Output path/file
 * @returns void
 */
const html_compress = (files, output = 'index.html', destination = target) =>
	src(files)
		.pipe(concat(output))
		.pipe(
			gulpif(
				PRO,
				htmlmin({
					collapseWhitespace: true,
					removeComments: true,
					removeEmptyAttributes: true
				})
			)
		)
		.pipe(dest(destination))

/**
 * Configuration for html processing
 * @returns void
 */
const html = () => {
	return html_compress(
		[
			`${target}/src/html/inc/header${PRO ? '' : '_dev'}.html`, // carrega os css - quando cirar um novo adicionar nesse arquivo
			`${target}/src/html/page/empty.html`,
			`${target}/src/html/page/auth.html`,
			`${target}/src/html/page/profile.html`,
			`${target}/src/html/page/file.html`,
			`${target}/src/html/page/notify.html`,
			`${target}/src/html/page/chat.html`,
			`${target}/src/html/inc/footer.html`
		]
	)
}

// ----------------------------------------------------------------------------

/**
 * Join and minify (production mode) styles
 * @returns void
 */
const style = () =>
	streamqueue(
		{ objectMode: true },
		//src(['src/sass/**/*.scss']).pipe(sass()),
		src([
			`${target}/src/css/font.css`,
			`${target}/src/css/style.css`,
			`${target}/src/css/layout.css`,
			// Parts ------------------------------
			`${target}/src/css/part/keyframe.css`,
			`${target}/src/css/part/bmenu.css`,
			`${target}/src/css/part/report.css`,
			`${target}/src/css/part/page.css`,
			// Pages ------------------------------
			`${target}/src/css/page/empty.css`,
			`${target}/src/css/page/auth.css`,
			`${target}/src/css/page/profile.css`,
			`${target}/src/css/page/notify.css`,
			`${target}/src/css/page/chat.css`,
			`${target}/src/css/page/file.css`
		])
	)
		.pipe(concat('style.css'))
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest(`${target}/css`))

/**
 * Move and minify (production mode) theme files
 * @returns void
 */
const style_theme = () =>
	streamqueue(
		{ objectMode: true },
		//src(['src/sass/**/*.scss']).pipe(sass()),
		src([
			`${target}/src/css/theme/light.css`,
			`${target}/src/css/theme/dark.css`
		])
	)
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest(`${target}/css`))

// ----------------------------------------------------------------------------

/**
 * Merge e minify (production mode) javascript files
 * @returns void
 */
const js = () =>
	src([
		`${target}/src/js/utils.js`,
		`${target}/src/js/utils.js`,
		// Libs -----------------------------------
		`${target}/src/js/lib/page.js`,
		`${target}/src/js/lib/event.js`,
		`${target}/src/js/lib/storage.js`,
		`${target}/src/js/lib/bmenu.js`,
		// Entities -------------------------------
		`${target}/src/js/entity/app.js`,
		`${target}/src/js/entity/me.js`,
		`${target}/src/js/entity/user.js`,
		// Pages ----------------------------------
		`${target}/src/js/page/auth.js`,
		`${target}/src/js/page/chat.js`,
		`${target}/src/js/page/file.js`,
		`${target}/src/js/page/profile.js`,
		`${target}/src/js/page/notify.js`,
		// Main -------------------------------
		`${target}/src/js/main.js`,
	])
		.pipe(gulpif(BABEL, babel()))
		.pipe(concat('temp.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
		.pipe(dest(`${target}/src/js`))

/**
 * Merge vendors and javascript files into "script.js"
 * @returns void
 */
const js_final = () =>
	src([
		// Vendors --------------------------------
		`${target}/src/js/vendor/socket.io.min.js`,
		`${target}/src/js/vendor/index-min.js`,
		// Components -----------------------------
		`${target}/src/js/temp.js`
	])
		.pipe(concat('script.js'))
		.pipe(dest(target))

// ----------------------------------------------------------------------------

/**
 * Copy source code from node_modules to the "src/js/vendor" path.
 * @returns void
 */
const vendor = () =>
	src([
		'src/node_modules/socket.io/client-dist/socket.io.min.js',
		'src/node_modules/idb/build/iife/index-min.js'
	])
		.pipe(dest(`${target}/src/js/vendor`))



// ----------------------------------------------------------------------------

/**
 * Merge files to crete a service worker file.
 * @returns void
 */
const sw = () => src([
	`${target}/src/js/sw/file${PRO ? '_pro' : ''}.js`,
	`${target}/src/js/sw/sw.js`
])
	.pipe(gulpif(BABEL, babel()))
	.pipe(concat('sw.js'))
	.pipe(header('const VERSION="' + new Date().getTime() + (PRO ? '' : '-dev') + '";\r'))
	.pipe(gulpif(PRO, uglify()))
	.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
	.pipe(dest(target))



// ----------------------------------------------------------------------------

// "default" runs all tasks ==> gulp [-pbo]
exports.default = parallel(html, style, style_theme, sw, series(js, js_final))

exports.html = html

// Style tasks
exports.style_app = style
exports.style_theme = style_theme
exports.style = parallel(style, style_theme)

// Javascript tasks
exports.js_app = js
exports.js_final = js_final
exports.js = series(js, js_final)

// Service worker
exports.sw = sw

/* ATT!!
	Copy the node_modules files to src / js / vendor
	Use only when installing (npm i) or updating any "vendor".
*/
exports.vendor = vendor