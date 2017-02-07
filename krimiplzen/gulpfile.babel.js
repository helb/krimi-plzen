import gulp from "gulp";
import webpack from "webpack-stream";
import gutil from "gulp-util";
import sass from "gulp-sass";
import autoprefixer from "autoprefixer";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import cssnano from "cssnano";
import flexibility from "postcss-flexibility";
import flexbugs from "postcss-flexbugs-fixes";
import mqpacker from "css-mqpacker";

const staticDir = "/home/helb/tmp/krimi_static/static/";

const mode = require("gulp-mode")({
    modes: ["production", "development"],
    default: "development"
});

const browserSync = require("browser-sync").create();

gulp.task("sass", () => {
    const processors = [
        autoprefixer({browsers: ["> 2%"]}),
        // flexbugs(),
        flexibility(),
        mqpacker(),
        cssnano()
    ];
    gulp.src(["assets/styles/base.scss", "assets/styles/summernote.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(staticDir + "css/"));
});

gulp.task("images", () => {
    gulp.src(["assets/img/**/*"])
        .pipe(mode.production(imagemin()))
        .pipe(gulp.dest(staticDir + "img/"))
        .pipe(mode.development(browserSync.reload({
            stream: true
        })));
});

gulp.task("js", () => {
    gulp.src("")
        .pipe(webpack(require("./webpack.config.js")))
        // .pipe(mode.production(uglify()))
        .pipe(gulp.dest(staticDir + "js/"))
        .pipe(mode.development(browserSync.reload({
            stream: true
        })));
});

gulp.task("copy-js", () => {
    gulp
    .src("assets/js/summernote-gallery-plugin.js")
    .pipe(gulp.dest(staticDir + "js/"));
    gulp
    .src("assets/js/summernote-krimilink-plugin.js")
    .pipe(gulp.dest(staticDir + "js/"));
    gulp
    .src("assets/js/flexibility.js")
    .pipe(gulp.dest(staticDir + "js/"));
    gulp
    .src("assets/js/polyfill.min.js")
    .pipe(gulp.dest(staticDir + "js/"));
});

gulp.task("robots", () => gulp
    .src("assets/robots.txt")
    .pipe(gulp.dest(staticDir + "")));

gulp.task("devserver", ["watch"], () => {
    browserSync.init({
        server: staticDir + ""
    });
});

gulp.task("watch", ["build"], () => {
    gulp.watch("assets/styles/**/*.scss", ["sass"]);
    gulp.watch("assets/img/**/*", ["images"]);
    gulp.watch("assets/js/**/*.js", ["js", "copy-js"]);
});

gulp.task("build", ["sass", "images", "js", "copy-js", "robots"]);
gulp.task("default", ["watch"]);
