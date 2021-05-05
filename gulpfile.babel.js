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

import { exec, spawn } from 'child_process'
import { gulp, series, parallel, src, dest } from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import minifyCSS from 'gulp-clean-css'
import htmlmin from 'gulp-html-minifier2'
import concat from 'gulp-concat'
import header from 'gulp-header'
import yargs from 'yargs'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglifyes from 'uglify-es'
import composer from 'gulp-uglify/composer'
import path from 'path'
import del from 'del'
import imagemin from 'gulp-imagemin'
//import sftp from 'gulp-sftp-up4'

const uglify = composer(uglifyes, console)
const argv = yargs.argv

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

// HTML  ------------------------------------------------------------------------------------------
const html_compress = (files, output, destination = false) =>
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
		.pipe(dest(destination ? destination : 'public'))

const html = () => {
	return html_compress(
		[
			`html/inc/header${PRO ? '' : '_dev'}.html`, // carrega os css - quando cirar um novo adicionar nesse arquivo
			'html/home.html',
			'html/msg.html',
			'html/node.html',
			'html/file.html',
			'html/closed.html',
			'html/user.html',
			`html/inc/footer${PRO ? '' : '_dev'}.html` // carrega os js - quando cirar um novo adicionar nesse arquivo
		],
		'index.html',
		'public'
	)
}

const vendor = () =>
	src(['src/node_modules/socket.io/client-dist/socket.io.min.js'])
		.pipe(dest('src/host/public/js/src/vendor'))


// SERVICE WORKER  ------------------------------------------------------------------------------------------
const sw = () => src([
	`src/host/public/js/src/sw/file${PRO ? '_pro' : ''}.js`,
	'src/host/public/js/src/sw/sw.js'
])
	.pipe(gulpif(BABEL, babel()))
	.pipe(concat('sw.js'))
	.pipe(header('const VERSION="' + new Date().getTime() + (PRO ? '' : '-dev') + '";\r'))
	.pipe(gulpif(PRO, uglify()))
	.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
	.pipe(dest('src/host/public'))


/* TASKs ----------------------------------------------------------- [TASKs]*/
exports.default = sw
exports.vendor = vendor