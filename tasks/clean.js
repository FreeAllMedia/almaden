import gulp from "gulp";
import del from "del";
import paths from "../paths.json";

gulp.task("clean", function () {
	return del([paths.build.directories.lib, paths.build.directories.spec]);
});
