import gulp from 'gulp';
import gru2 from 'gulp-rollup-2';
import sassGlob from 'gulp-sass-glob';
import concat from 'gulp-concat';
import jsonToScss from '@valtech-commerce/json-to-scss';
import { readFile, writeFile } from 'fs';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('variables', (done) => {
	readFile(`./theme.json`, 'utf8', async(error, theme) => {
		if (error) {
			console.log(error);
			done();
		}
		const scss = jsonToScss.convert(`${ theme }`);
		if (scss) {
			await writeFile('scss/_variables.scss', scss, '', () => {
				console.log('theme.json converted to SCSS variables');
				done();
			});
		}
		else {
			console.log('Problem with converting theme.json to SCSS variables');
			done();
		}
	})

});
gulp.task('theme', (done) => {
	gulp.src('scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'))
	done();
});

gulp.task('editor', (done) => {
	gulp.src('scss/styles-editor.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
	done();
});

gulp.task('admin', (done) => {
	gulp.src('scss/styles-admin.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
	done();
});

gulp.task('scripts', (done) => {
	gulp.src('./js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(
			gru2.rollup({
				input: 'js/theme.js',
				external: ['window'],
				cache: true,
				output: [
					{
						file: 'theme.bundle.js',
						format: 'es',
						globals: { window: 'window' },
					},
				],
			}),
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./js/dist'));
	done();
});

gulp.task('vendor', (done) => {
	gulp.src('./js/vendor/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.js'))
		.pipe(
			gru2.rollup({
				input: './js/vendor.js',
				external: ['window'],
				cache: true,
				output: [
					{
						file: 'vendor.bundle.js',
						format: 'es',
						globals: { window: 'window' },
					},
				],
			}),
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('js/dist'))
	done();
});

gulp.task('default', function() {
	gulp.watch('theme.json', { ignoreInitial: false  }, gulp.series('variables', 'theme', 'editor', 'admin'));
	gulp.watch('scss/**/!(_variables).scss', { ignoreInitial: false, events: ['change'] }, gulp.parallel('theme', 'editor'));
	gulp.watch('scss/styles-admin.scss', { ignoreInitial: false }, gulp.series('admin'));
	gulp.watch('js/theme/*.js', { ignoreInitial: false }, gulp.series('scripts'));
	gulp.watch('js/theme.js', { ignoreInitial: false }, gulp.series('scripts'));
	gulp.watch('js/vendor/[^_]*.js', { ignoreInitial: false }, gulp.series('vendor'));
});
