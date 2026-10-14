var gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' )( require( 'sass' ) ),
	cleanCSS = require( 'gulp-clean-css' ),
	concat = require( 'gulp-concat' ),
	autoprefixer = require( 'autoprefixer' ),
	postcss = require( 'gulp-postcss' ),
	babel = require( 'gulp-babel' ),
	uglify = require( 'gulp-uglify' ),
	sourcemaps = require( 'gulp-sourcemaps' );
const { src, dest, series } = require( 'gulp' );
const zip = require( 'gulp-zip' );
const clean = require( 'gulp-clean' );
const run = require( 'gulp-run' );

var paths = {
	adminAssets: {
		src: 'admin/assets/src/',
		dest: 'admin/assets/dist/',
	},
	adminStyles: {
		src: 'admin/assets/src/scss/*.scss',
		dest: 'admin/assets/dist/css/',
	},
	adminVendorStyles: {
		src: 'admin/assets/vendor/scss/*.scss',
		dest: 'admin/assets/vendor/css/',
	},
	adminVendorScripts: {
		src: 'admin/assets/src/lib/js/*.js',
		dest: 'admin/assets/dist/js/',
	},
	publicAssets: {
		src: 'public/assets/src/',
		dest: 'public/assets/dist/',
	},
	publicStyles: {
		src: 'public/assets/src/scss/*.scss',
		dest: 'public/assets/dist/css/',
	},
	publicScripts: {
		src: 'public/assets/src/js/easyjobs-public.js',
		dest: 'public/assets/dist/js/',
	},
};
function adminStyles() {
	return gulp
		.src( paths.adminStyles.src )
		.pipe( sourcemaps.init() )
		.pipe( postcss( [ autoprefixer() ] ) )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( cleanCSS() )
		.pipe( concat( 'easyjobs-admin.min.css' ) )
		.pipe( sourcemaps.write( '' ) )
		.pipe( gulp.dest( paths.adminStyles.dest ) );
}

function adminVendorScripts() {
	return (
		gulp
			.src( paths.adminVendorScripts.src )
			//.pipe(sourcemaps.init())
			.pipe(
				babel( {
					presets: [ '@babel/env' ],
				} )
			)
			// Keep /*! … */ licence headers of the bundled libraries.
			.pipe( uglify( { output: { comments: /^!/ } } ) )
			.pipe( concat( 'easyjobs-admin-vendor-bundle.min.js' ) )
			//.pipe(sourcemaps.write(""))
			.pipe( gulp.dest( paths.adminVendorScripts.dest ) )
	);
}
function publicStyles() {
	return gulp
		.src( paths.publicStyles.src )
		.pipe( sourcemaps.init() )
		.pipe( postcss( [ autoprefixer() ] ) )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( cleanCSS() )
		.pipe( concat( 'easyjobs-public.min.css' ) )
		.pipe( sourcemaps.write( '' ) )
		.pipe( gulp.dest( paths.publicStyles.dest ) );
}
function publicScripts() {
	return (
		gulp
			.src( paths.publicScripts.src )
			//.pipe(sourcemaps.init())
			.pipe( uglify() )
			.pipe( concat( 'easyjobs-public.min.js' ) )
			//.pipe(sourcemaps.write(""))
			.pipe( gulp.dest( paths.publicScripts.dest ) )
	);
}
function watch() {
	gulp.watch( paths.adminAssets.src + 'scss/**/*.scss', adminStyles );
	gulp.watch( paths.adminVendorScripts.src, adminVendorScripts );
	gulp.watch( paths.publicAssets.src + 'scss/**/*.scss', publicStyles );
	gulp.watch( paths.publicScripts.src, publicScripts );
}
var build = gulp.parallel(
	adminStyles,
	adminVendorScripts,
	publicStyles,
	publicScripts
);

// build zip

function buildJS() {
	return run( 'gulp build' ).exec();
}

function cleanDist() {
	return src( './dist', { read: false, allowEmpty: true } ).pipe( clean() );
}

function makeDist() {
	return src( [
		'./**/*.*',
		'!./gulpfile.js',
		'!./.git',
		'!./node_modules/**/*.*',
		'!./dist/**/*.*',
		'!./**/*.zip',
		'!./.gitignore',
		'!./package-lock.json',
		'!./package.json',
		'!./dist/**/*.*',
		'!./src/**/*.*',
		'!./admin/assets/src/**/*.*',
		'!./admin/assets/dist/css/*.map',
		'!./admin/assets/dist/js/*.map',
		'!./admin/assets/dist/js/easyjobs.js',
		'!./admin/assets/vendor/scss/**/*.*',
		'!./admin/assets/vendor/**/*.map',
		'!./public/assets/src/**/*.*',
		'!./public/assets/dist/css/*.map',
		'!./public/assets/dist/js/*.map',
	] ).pipe( dest( 'dist/easyjobs/' ) );
}

function cleanZip() {
	return src( './easyjobs.zip', { read: false, allowEmpty: true } ).pipe(
		clean()
	);
}

function makeZip() {
	return src( './dist/**/*.*' )
		.pipe( zip( '../easyjobs.zip' ) )
		.pipe( dest( './' ) );
}

gulp.task(
	'makeZip',
	series( cleanDist, cleanZip, buildJS, makeDist, makeZip, cleanDist )
);

// end build zip

gulp.task( 'build', build );
/*
 * watch task
 */
gulp.task( 'watch', watch );
/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task( 'default', build );
