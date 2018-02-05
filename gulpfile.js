var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var sass = require('gulp-sass');
var pug = require('gulp-pug');
var ts = require('gulp-typescript');

var notify = require('gulp-notify')
var plumber = require('gulp-plumber');

var autoprefixer = require('gulp-autoprefixer');
var removeComments = require('gulp-strip-css-comments');

var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');

var rimraf = require('rimraf');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');

var nameMainJs = 'main.js';

var path = {
	src: {
		pug: 'src/pug/main.pug',
		ts: 'src/ts/**/*.ts',
		sass: 'src/sass/main.sass',
		img: 'src/img/background/**/*.*',
		sprite: 'src/img/sprite/**/*.*'
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
		img: 'src/img/background/**/*.*',
		sprite: 'src/img/sprite/**/*.*'
	},
	sprite: {
		sass: 'src/sass/varible'
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
	return gulp.src(path.src.ts)
	.pipe(ts({
		noImplicitAny: true,
		outFile: nameMainJs
	}))
	.pipe(gulp.dest(path.build.js))
	.pipe(browserSync.stream());
});

gulp.task('compress-img-background', function() {
	gulp.src(path.src.img)
	.pipe(imagemin({
		optimizationLevel: 3,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.img))
});

gulp.task('compress-sprite', function() {
	var spriteData = gulp.src(path.src.sprite)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprite.sass',
			cssFormat: 'sass',
			algorithm: 'binary-tree',
			cssTemplate: 'stylus.template.mustache',
			cssVarMap: function(sprite) {
				sprite.name = 's-' + sprite.name
			}
		}));

	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img));

	var sassStream = spriteData.css
		.pipe(gulp.dest(path.sprite.sass));

	return merge(imgStream, sassStream);
});

gulp.task('copy-img-background', function() {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('copy-img-sprite', function() {
    gulp.src(path.src.sprite)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('sprite', function() {
	var spriteData = gulp.src(path.src.sprite)
	.pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.sass',
		cssFormat: 'sass',
		algorithm: 'binary-tree',
		cssTemplate: 'stylus.template.mustache',
		cssVarMap: function(sprite) {
			sprite.name = 's-' + sprite.name
		}
	}));

	var imgStream = spriteData.img
	.pipe(gulp.dest(path.build.img));

	var sassStream = spriteData.css
	.pipe(gulp.dest(path.sprite.sass));

	return merge(imgStream, sassStream);
});

gulp.task('watch', function(){
	gulp.watch(path.watch.pug, ['pug-build']);
	gulp.watch(path.watch.sass, ['sass-build']);
	gulp.watch(path.watch.ts, ['ts-build']);
	gulp.watch(path.watch.img, ['compress-img-background']);
	gulp.watch(path.watch.sprite, ['sprite']);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('build', function(cb){
	runSequence('clean', ['pug-build', 'sass-build', 'ts-build'], cb);
});

gulp.task('prodaction', function (cb) {
    runSequence('build', 'compress-img-background', 'compress-sprite', ['browser-sync', 'watch'], cb);
});

gulp.task('default-img', function (cb) {
    runSequence('build', 'copy-img-background', 'copy-img-sprite', ['browser-sync', 'watch'], cb);
});

gulp.task('default', function (cb) {
    runSequence( 'build', 'copy-img-background', 'sprite', ['browser-sync', 'watch'], cb);
});
