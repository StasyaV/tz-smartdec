"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var sass = require("gulp-sass");
var minifyCss = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var server = require("browser-sync").create();
var jsmin = require("gulp-jsmin");
var htmlmin = require("gulp-htmlmin");

gulp.task("clean", function () {
  return del("build");
});

gulp.task("fonts", function () {
  return gulp.src("source/fonts/**/*.*")
    .pipe(gulp.dest("build/fonts/"))
});

gulp.task("styles", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minifyCss())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/**/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("js", function (done) {
  gulp
    .src("source/js/**/*.js")
    .pipe(jsmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/js/**/*.js", gulp.series("js"));
});
gulp.task("refresh", function (done) {
  server.reload();
  done();
});;

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel(
      "fonts",
      "styles",
      "images",
      "webp",
      "sprite",
      "html",
      "js"
    )
  )
);
