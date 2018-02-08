var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var pug = require('gulp-pug');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');

var notify = require('gulp-notify')
var plumber = require('gulp-plumber');

var autoprefixer = require('gulp-autoprefixer');
var removeComments = require('gulp-strip-css-comments');

var imagemin = require('gulp-imagemin');

var rimraf = require('rimraf');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

var path = {
	src: {
		pug: 'src/pug/main.pug',
		ts: 'src/ts/**/*.ts',
		sass: 'src/sass/main.sass',
		img: 'src/img/**/*.*', 
	},
	build: {
		html: 'build',
		js: 'build/js',
		css: 'build/css',
		img: 'build/img'
	},
	watch: {
		pug: 'src/pug/**/*.pug',
		ts: 'src/ts/**/*.ts',
		sass: 'src/sass/**/*.sass',
		img: 'src/img/**/*.*',
	},
	clean: 'build'
};

gulp.task('browser-sync', function(){
	browserSync.init({
		server: {baseDir: 'build'}
	});
});

gulp.task('sass-build', function(){
	return gulp.src(path.src.sass)
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return{
				title: 'Error sass',
				message: err.message
			}
		})
	}))
	.pipe(sass({
		// outputStyle: 'compressed'
	}))
	.pipe(autoprefixer({
		browsers: ['last 5 versions'],
		cascade: true
	}))
	.pipe(removeComments())
	.pipe(gulp.dest(path.build.css))
	.pipe(browserSync.stream());
});

gulp.task('pug-build', function(){
	return gulp.src(path.src.pug)
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return{
				title: 'Error pug',
				message: err.message
			}
		})
	}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(rename('index.html'))
	.pipe(gulp.dest(path.build.html))
	.pipe(browserSync.stream());
});

gulp.task('ts-build', function () {
	var tsProject = ts.createProject('tsconfig.json');
	var tsResult = tsProject.src()
		.pipe(tsProject());
	return tsResult.js.pipe(gulp.dest(''))
		.pipe(browserSync.stream());
});
gulp.task('copy-img', function() {
	gulp.src(path.src.img)
	    .pipe(gulp.dest(path.build.img));
});

gulp.task('compress-img', function() {
	gulp.src(path.src.img)
	.pipe(imagemin({
		optimizationLevel: 3,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.img))
});

gulp.task('watch', function(){
	gulp.watch(path.watch.pug, ['pug-build']);
	gulp.watch(path.watch.sass, ['sass-build']); 
	gulp.watch(path.watch.ts, ['ts-build']); 
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('build', function(cb){
	runSequence('clean', 'pug-build', ['sass-build', 'ts-build'], cb); 
	gulp.src('bower_components/jquery/dist/jquery.js')
		.pipe(gulp.dest(path.build.js)); 
});
gulp.task('prodaction', function (cb) {
	runSequence('build', 'compress-img', ['browser-sync', 'watch'], cb);
	gulp.watch(path.watch.img, ['compress-img']);
});

gulp.task('default', function (cb) {
	runSequence('build', 'copy-img', ['browser-sync', 'watch'], cb);
	gulp.watch(path.watch.img, ['copy-img']);
});
