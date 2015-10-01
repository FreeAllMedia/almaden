import gulp from "gulp";
import babel from "gulp-babel";

import paths from "../paths.json";

gulp.task("build-lib", ["clean"], () => {
	return gulp.src(paths.source.lib)
		.pipe(babel())
		.pipe(gulp.dest(paths.build.directories.lib));
});
