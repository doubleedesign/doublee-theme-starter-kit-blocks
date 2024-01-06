import gulp from 'gulp';
import gru2 from 'gulp-rollup-2';
import sassGlob from 'gulp-sass-glob';
import jsonToScss from '@valtech-commerce/json-to-scss';
import { readFile, writeFile } from 'fs';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import React from 'react';
import ReactDOM from 'react-dom';

// Generate SCSS variables from  theme-vars.json file
gulp.task('scss-variables', (done) => {
	readFile(`./theme-vars.json`, 'utf8', async(error, theme) => {
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
			console.log('Problem with converting theme-vars.json to SCSS variables');
			done();
		}
	})
});

// WordPress theme.json generator
gulp.task('theme-json', async(done) => {
	readFile(`./theme-vars.json`, 'utf8', async(error, data) => {
		if (error) {
			console.log(error);
			done();
		}

		const theme = JSON.parse(data);
		const wpFormat = {
			colorPalette: Object.entries(theme.colours).map(([name, value]) => {
				return {
					name: name,
					slug: name,
					color: value
				}
			})
		}

		const themeJson = {
			version: 2,
			"$schema": "https://schemas.wp.org/trunk/theme.json",
			settings: {
				// Defaults
				appearanceTools: false,
				typography: {
					customFontSize: false,
					lineHeight: false,
					dropCap: false,
					fontStyle: false,
					fontWeight: false,
					letterSpacing: false,
					textDecoration: false,
					textTransform: false,
					fontSizes: [],
					fontFamilies: []
				},
				color: {
					text: false,
					background: false,
					link: false,
					defaultPalette: false
				},
				// Block-level overrides
				blocks: {
					'core/heading': {
						color: {
							palette: wpFormat.colorPalette,
							text: true,
							background: false
						}
					},
					'core/cover': {
						color: {
							palette: wpFormat.colorPalette,
						}
					}
				}
			}
		}

		await writeFile('theme.json', JSON.stringify(themeJson, null, 4), '', () => {
			console.log('theme.json created');
			done();
		});
	});
});

// Generate core theme style.css
gulp.task('theme-css', (done) => {
	gulp.src('scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'))
	done();
});

// Subset of core shared styles to also be loaded in the editor
gulp.task('editor-css', (done) => {
	gulp.src('scss/styles-editor.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));

	gulp.src('./blocks/common.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./blocks/'));

	done();
});

// Style customisations for the WP admin more broadly
gulp.task('admin-css', (done) => {
	gulp.src('scss/styles-admin.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
	done();
});

// Not currently using, but may need in the future
/*gulp.task('theme-js-vendor', (done) => {
	gulp.src('./js/vendor/!**!/!*.js')
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
});*/

// Block editor customisations that have to be done in JS (rather than PHP or any block-level files)
// Note that admin-hacks.js also exists for broader UI customisations that I haven't worked out a better way to do than hack the DOM, but that file doesn't need to be compiled
gulp.task('editor-js', (done) => {
	gulp.src(['./js/admin/block-editor.js'])
		.pipe(sourcemaps.init())
		.pipe(
			gru2.rollup({
				input: 'js/admin/block-editor.js',
				output: {
					file: 'editor.bundle.js',
					format: 'iife',
					globals: {
						react: 'React',
						'react-dom': 'ReactDOM',
						wp: 'wp',
					},
				},
				external: ['window', 'wp'],
				plugins: [
					replace({
						"process.env.NODE_ENV": JSON.stringify('production')
					}),
					babel({
						exclude: 'node_modules/**',
					}),
					nodeResolve({
						browser: true,
					}),
					commonjs({
						namedExports: {
							'react': Object.keys(React),
							'react-dom': Object.keys(ReactDOM),
						}
					}),
				],
				cache: false,
			}),
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./js/dist'));
	done();
})

// Run and watch all the things when the gulp command is run
gulp.task('default', function() {
	// CSS
	gulp.watch('theme-vars.json', { ignoreInitial: false  }, gulp.series('scss-variables', 'theme-css', 'editor-css', 'admin-css'));
	gulp.watch('scss/**/!(_variables).scss', { ignoreInitial: false, events: ['change'] }, gulp.parallel('theme-css', 'editor-css'));
	gulp.watch('scss/styles-admin.scss', { ignoreInitial: false }, gulp.series('admin-css'));

	// JS
	//gulp.watch('js/vendor/[^_]*.js', { ignoreInitial: false }, gulp.series('theme-js-vendor')); // not currently using
	gulp.watch('js/admin/block-editor.js', { ignoreInitial: false }, gulp.series('editor-js'));
});
