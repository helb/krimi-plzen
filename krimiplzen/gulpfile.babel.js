import gulp from "gulp";
import webpack from "webpack-stream";
import gutil from "gulp-util";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import uglify from "gulp-uglify";
import csso from "gulp-csso";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";

const mode = require("gulp-mode")({
    modes: ["production", "development"],
    default: "development"
});

const browserSync = require("browser-sync").create();

gulp.task("sass", () => {
    gulp.src(["assets/styles/base.scss", "assets/styles/summernote.scss"])
        .pipe(mode.development(sourcemaps.init()))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["> 5%"]
        }))
        .pipe(mode.production(csso()))
        .pipe(mode.development(sourcemaps.write("./")))
        .pipe(mode.development(browserSync.stream({
            match: "**/*.css"
        })))
        .pipe(gulp.dest("/home/helb/www/static2.krimi-plzen.cz/htdocs/static/css/"));
});

gulp.task("images", () => {
    gulp.src(["assets/img/**/*"])
        .pipe(mode.production(imagemin()))
        .pipe(gulp.dest("/home/helb/www/static2.krimi-plzen.cz/htdocs/static/img/"))
        .pipe(mode.development(browserSync.reload({
            stream: true
        })));
});

gulp.task("js", () => {
    gulp.src("")
        .pipe(webpack(require("./webpack.config.js")))
        // .pipe(mode.production(uglify()))
        .pipe(gulp.dest("/home/helb/www/static2.krimi-plzen.cz/htdocs/static/js/"))
        .pipe(mode.development(browserSync.reload({
            stream: true
        })));
});

gulp.task("copy-js", () => {
    gulp
    .src("assets/js/summernote-gallery-plugin.js")
    .pipe(gulp.dest("/home/helb/www/static2.krimi-plzen.cz/htdocs/static/js/"));
    gulp
    .src("assets/js/polyfill.min.js")
    .pipe(gulp.dest("/home/helb/www/static2.krimi-plzen.cz/htdocs/static/js/"));
});

gulp.task("robots", () => gulp
    .src("assets/robots.txt")
    .pipe(gulp.dest("/home/helb/www/static2.krimi-plzen.cz/htdocs/static/")));

gulp.task("devserver", ["watch"], () => {
    browserSync.init({
        server: "/home/helb/www/static2.krimi-plzen.cz/htdocs/static/"
    });
});

gulp.task("watch", ["build"], () => {
    gulp.watch("assets/styles/**/*.scss", ["sass"]);
    gulp.watch("assets/img/**/*", ["images"]);
    gulp.watch("assets/js/**/*.js", ["js", "copy-js"]);
});

gulp.task("build", ["sass", "images", "js", "copy-js", "robots"]);
gulp.task("default", ["watch"]);
