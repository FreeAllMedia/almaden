import gulp from "gulp";

gulp.task("build", ["clean", "build-lib", "build-spec", "build-lib-assets", "build-spec-assets"]);
