import gulp from "gulp";
import gutil from "gulp-util";
import sass from "gulp-sass";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";

const staticDir = gutil.env.static_dir || "./static/";

const production = !!gutil.env.production;

gulp.task("sass", () =>
    gulp
        .src([
            "assets/styles/base.scss",
            "assets/styles/sidebar.scss",
            "assets/styles/article-list.scss",
            "assets/styles/article.scss",
            "assets/styles/summernote.scss"
        ])
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                browsers: ["last 2 versions", "safari >= 7", "ie >= 10"]
            })
        )
        .pipe(production ? cssmin() : gutil.noop())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(staticDir + "css/"))
);

gulp.task("optimize-images", () =>
    gulp
        .src(["assets/img/**/*"])
        .pipe(production ? imagemin() : gutil.noop())
        .pipe(gulp.dest(staticDir + "img/"))
);

gulp.task("build-js", () =>
    gulp
        .src([
            "./assets/js/base.js",
            "./assets/js/index.js",
            "./assets/js/article.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(production ? uglify() : gutil.noop())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(staticDir + "js/"))
);

gulp.task("copy-js", () =>
    gulp
        .src([
            "assets/js/summernote-gallery-plugin.js",
            "assets/js/summernote-krimilink-plugin.js",
            "assets/js/siema.min.js"
        ])
        .pipe(gulp.dest(staticDir + "js/"))
);

gulp.task("copy-txt", () =>
    gulp
        .src(["assets/robots.txt", "assets/security.txt"])
        .pipe(gulp.dest(staticDir + ""))
);

gulp.task("build", [
    "sass",
    "optimize-images",
    "build-js",
    "copy-js",
    "copy-txt"
]);

gulp.task("watch", ["build"], () => {
    gulp.watch("./assets/js/*.js", ["build-js", "copy-js"]);
    gulp.watch("./assets/styles/**/*.scss", ["sass"]);
    gulp.watch("./assets/img/*.{svg,png,gif,jpg,jpeg}", ["optimize-images"]);
});

if (production) {
    gulp.task("default", ["build"]);
} else {
    gulp.task("default", ["build", "watch"]);
}
