'use strict';

var path       = require( 'path' );
var gulp       = require( 'gulp' );
var gutil      = require( 'gulp-util' );
var uglify     = require( 'gulp-uglify' );
var sourcemaps = require( 'gulp-sourcemaps' );
var livereload = require( 'gulp-livereload' );
var bsfy       = require( 'browserify' );
var watchify   = require( 'watchify' );
var babelify   = require( 'babelify' );
var source     = require( 'vinyl-source-stream' );
var buffer     = require( 'vinyl-buffer' );
var argv       = require( 'minimist' )( process.argv.slice( 2 ) );

const BUILD_DIR = path.join( __dirname, 'build' );

// Packages to factor out of the page bundle, and include in its own bundle
const FACTORED_PACKAGES = [
    'jquery',
    'react',
    'react-dom'
];

// Build the 3rd-party package bundle
gulp.task( 'jsc:packages', () => {
    const JS_PACK_FILENAME = 'packages.js';

    var b = bsfy();

    // Include and expose factored packages
    b.require( FACTORED_PACKAGES );

    return b.bundle()
        .pipe( source( JS_PACK_FILENAME ) )
        .pipe( buffer() )
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        //.pipe( uglify() )
        .on( 'error', gutil.log )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( BUILD_DIR ) );
} );

// Build the main bundle
gulp.task( 'jsc:main', () => {
    const SRC_FILE = path.join( 'js', 'main.js' );

    var b = bsfy( Object.assign( {
        entries:   SRC_FILE,
        debug:     true,
        transform: [ babelify ],
    }, watchify.args ) );

    // Exclude factored packages, look for them externally
    b.external( FACTORED_PACKAGES );

    var bundle = b => {
        var stream = b.bundle()
            .on( 'error', err => {
                console.log();
                console.log( err.toString() );
                console.log( err.codeFrame );
                console.log();
                stream.emit( 'end' );
            } )
            .pipe( source( path.basename( SRC_FILE ) ) )
            .pipe( buffer() )
            .pipe( sourcemaps.init( { loadMaps: true } ) )
            //.pipe( uglify() )
            .on( 'error', gutil.log )
            .pipe( sourcemaps.write( './' ) )
            .pipe( gulp.dest( BUILD_DIR ) );

        return stream;
    };

    // Watch source files and rebuild on changes if `--watch` is set. Supports
    // the livereload Chrome extension: https://goo.gl/Q1euOF
    if ( argv.watch ) {
        console.log( `Watching ${SRC_FILE} for changes... Press ctrl-c to stop.` );
        livereload.listen();
        var w = watchify( b );
        w.on( 'update', ids => {
            console.log( `Rebuilding ${ids}` );
            return bundle( w )
                .pipe( livereload() );
        } );
        w.on( 'log', msg => {
            console.log( msg );
        } );
    }

    return bundle( b );
} );

gulp.task( 'default', [
    'jsc:packages',
    'jsc:main'
] );
