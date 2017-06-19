import gulp from "gulp";
import gutil from "gulp-util";
import sass from "gulp-sass";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";

const staticDir = gutil.env.static_dir || "/tmp/kp-static/";

const production = !!gutil.env.production;

gulp.task("sass", () => {
    gulp.src(["assets/styles/base.scss", "assets/styles/summernote.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
	            browsers:  ["last 2 versions", "safari >= 7", "ie >= 10"]
	        }))
        .pipe(production ? cssmin() : gutil.noop())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(staticDir + "css/"));
});

gulp.task("optimize-images", () => {
    gulp.src(["assets/img/**/*"])
        .pipe(production ? imagemin() : gutil.noop())
        .pipe(gulp.dest(staticDir + "img/"));
});

gulp.task("build-js", () => {
    const files = [
        "./assets/js/base.js",
        "./assets/js/index.js",
        "./assets/js/article.js"
    ];
    return gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(production ? uglify() : gutil.noop())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(staticDir + "js/"));
});


gulp.task("copy-js", () => {
    gulp
        .src("assets/js/summernote-gallery-plugin.js")
        .pipe(gulp.dest(staticDir + "js/"));
    gulp
        .src("assets/js/summernote-krimilink-plugin.js")
        .pipe(gulp.dest(staticDir + "js/"));
});

gulp.task("robots", () => gulp
    .src("assets/robots.txt")
    .pipe(gulp.dest(staticDir + ""))
);


gulp.task("build", ["sass", "optimize-images", "build-js", "copy-js", "robots"]);

gulp.task("watch", ["build"], () => {
    gulp.watch("./assets/js/*.js", ["build-js", "copy-js"]);
    gulp.watch("./assets/styles/**/*.scss", ["sass"]);
    // gulp.watch("./krimiplzen/assets/**/*.{ttf,eot,woff}", ["copy-fonts"]);
    gulp.watch("./assets/img/*.{svg,png,gif,jpg,jpeg}", ["optimize-images"]);
});

if (production) {
    gulp.task("default", ["build"]);
} else {
    gulp.task("default", ["build", "watch"]);
}
