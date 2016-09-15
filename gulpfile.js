/* 
* Path to folder which contains all Less files.
* Path related to gulpfile.js location
*/
var less_src = 'www/less/';

/* 
* Name of the main Less file inside Less source folder
*/
var less_main_filename = 'bootstrap';
// var less_main_filename = 'landing';

/*
* Path to folder which will contain all result CSS files
*/
var css_dest = 'www/css/';

/* 
* Name of the main Less file inside Less source folder
*/
var css_result_filename = 'style';
// var css_result_filename = 'landing';

/*
* List of JS files which should be concatenated.
*/
var js_concat_files = ['www/js/transition.js', 'www/js/collapse.js', 'www/js/app.js'];

/* 
* Concatenated JS file.
*/
var js_concat_res_path = 'www/js/';
var js_concat_res_file = 'script.js';




/*
* List of required pugins
*/
var gulp = require('gulp');
var path = require('path');
var less  = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer'); 
//var jade = require('gulp-jade');



var indexFile = 'www/index.html';
var lessFiles = less_src + '**/*.less';
var lessMain = less_src + '' + less_main_filename + '.less';

gulp.task('less', function() {	
	return gulp.src(lessMain)
	.pipe(less({
		generateSourceMap: true,
		      paths: [ path.join(__dirname, 'less') ]
	}))
	.on('error', swallowError)
	.pipe(rename({
		basename: css_result_filename
	}))
	.pipe(gulp.dest(css_dest));
});

gulp.task('minify-css', ['less'], function() {
	gulp.src(css_dest+css_result_filename+'.css')
    		.pipe(minifyCSS({keepBreaks:true}))
    		.pipe(rename({
    			basename: css_result_filename,
    			suffix: '.min'
    		}))
   		.pipe(gulp.dest(css_dest))
});

gulp.task('js-concat', function() {
	gulp.src(js_concat_files)
		.pipe(concat(js_concat_res_file))
		.pipe(gulp.dest(js_concat_res_path))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(js_concat_res_path))
		.on('error', swallowError)
});

/*// Jade
gulp.task('jade', function(){
  gulp.src('./www/jade/*.jade')
    .pipe(jade({"pretty": true}))
  	.on('error', swallowError)
    .pipe(gulp.dest('./www/'))
});*/

var localhost = '192.168.1.56';
// var localhost  = '192.168.1.18';
gulp.task('browser-sync', function() {
	browserSync({
        		server: {
			baseDir: './www'
		}
    });
});

gulp.task('autoprefixer', function() {
	return gulp.src('src/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('browser-reload', ['minify-css'], function() {
	browserSync.reload();
});

gulp.task('browser-reload-htmlonly', function() {
    browserSync.reload();
});


gulp.task('watch',function () { 
	gulp.start(['browser-sync','less']);
	gulp.watch(indexFile,['browser-reload-htmlonly']);
	gulp.watch(lessFiles,['browser-reload']);
	//gulp.watch(lessFiles,['less','minify-css']);
	gulp.watch(js_concat_files,['js-concat']);
	//gulp.watch('./www/jade/*.jade',['jade']);
});

gulp.task('default', ['minify-css', 'autoprefixer', 'js-concat','watch']);

function swallowError (error) {
	console.log(error.toString());
	this.emit('end');
}