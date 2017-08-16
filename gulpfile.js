"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var rigger = require('gulp-rigger');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var run = require('run-sequence');
var del = require('del');
var server = require('browser-sync');
var reload = server.reload;

var path = {
  public: {
    css: 'build/css',
    js: 'build/js',
    img: 'build/img',
    fonts: 'build/fonts'
  },
  src: {
    html: 'src/*.html',
    style: 'src/sсss/style.scss',
    js: 'src/js/*.js',
    images: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    style: 'src/scss/**/*.scss',
    js: "src/js/**/*.js",
    images: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  production: 'build/'
}

// Локальный сервер + слежение за изменением файлов
gulp.task('serv', function() {
  server({
    server: {
      baseDir: path.production
    },
    port: 8080,
    open: true,
    notify: false
  });
  gulp.watch(path.watch.html, ['html'])
  gulp.watch(path.watch.style, ['css']);
});

// Очистка папки build
gulp.task('clean', function() {
  return del(path.production);
});

// Cборка html
gulp.task('html', function () {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.production))
    .pipe(reload({stream: true}));
});

// Сборка стилей
gulp.task('css', function() {
  gulp.src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}),
      mqpacker({
				sort: false })
    ]))
    .pipe(gulp.dest(path.public.css))
    .pipe(minify())
    .pipe(rename('style-min.css'))
    .pipe(gulp.dest(path.public.css))
    .pipe(reload({stream: true}));
});

// Оптимизация изображений
gulp.task('images', function() {
  return gulp.src(path.src.images)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
		]))
    .pipe(gulp.dest(path.public.img))
    .pipe(reload({stream: true}));
});

// Оптимизация JS
gulp.task('js', function () {
  gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.public.js))
    .pipe(reload({stream: true}));
});

// Копирование шрифтов в папку build
gulp.task('copy', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.public.fonts));
});

// Запуск сборки проекта
gulp.task('build', function() {
  run(
    'clean',
    'html',
    'css',
    'images',
    'js',
    'copy'
  );
});
