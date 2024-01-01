# double-e-dev-starterkit-blocks (WIP)

**A WordPress theme starterkit for developers of bespoke websites.**

This version is designed for the new block editor (otherwise known as Gutenberg) and is in the early stages of development.

For classic themes using ACF Flexible Content, check out my (more mature) [classic theme starterkit](https://github.com/doubleedesign/doublee-theme-starter-kit).

---

## Working with this starter kit

The development process is largely the same as my classic starterkit, with some adaptations for the block editor.

### Getting started

- Fork this repo, set it up in your IDE, and rename `starterkit` and `Starterkit` everywhere to your own theme name (do a case-sensitive find-and-replace)
- Get the plugins/licenses described below if relevant (or make adjustments accordingly)
- Install [Gulp](https://gulpjs.com/) globally
- Navigate to the theme folder in your terminal
- Run `npm install`
- Update `theme-vars.json` with your settings
- Run `gulp` to do an initial compilation of the theme and watch SCSS, JS, and `theme-vars.json` for changes
- Get theming!

### Build tools

The `theme-vars.json` file is designed to be a single source of truth for the block editor, theme CSS, and theme PHP files to use for, well, theme variables. But for much of this to work, a compiling step is required.

#### Compiling theme files

A Gulpfile is included to:

- Generate the [`theme.json`](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/) file for the block editor; this includes disabling options I don't want to use* as well as updating the colour palette according to the `theme-vars.json` file
- Concatenate JS files, including support for ES6 module imports
- Update the SCSS variables file using the `theme-vars.json` file
- Compile, concatenate and minify SCSS files into the theme's `style.css`
- Generate sourcemaps for JS and SCSS.

*where doing so in `theme.json` is supported. There are other customisations in `cms/class-block-editor.php` and `js/admin/`.

Gulp needs to be installed globally: `npm install gulp-cli -g`.

#### Code formatting and linting

Scripts are set up in `package.json` for:

- [eslint](https://eslint.org)
- [stylelint](https://stylelint.io/) with [SCSS plugin](https://www.npmjs.com/package/stylelint-scss)

I use PHPStorm which has some built-in formatting and code quality options (inspections) for PHP, so I use those rather
than a separate PHP linting/code quality tool. My preferences are included in this repo (in the `.idea` folder) but you
can easily override them in your own projects using PHPStorm's preferences dialog.

You can see the results of PHPStorm's inspections as you go using the Problems tool window. I configure mine to just
check the theme and/or any custom plugins I'm working on in the project.

#### Committing to Git

[Commitizen](https://github.com/commitizen/cz-cli) is set up to run with the `npm run commit` command.
It will also lint staged files before proceeding to the commit options.

### File structure and approach

Block output is done with custom PHP template parts, largely the "old" way rather than the new comments-based approach. This allows me to reuse more of my pre-existing code, and I think will be more easily transferrable when I eventually write a Vue or React-based version of this theme.

### Licensing, plugins, and APIs

To use this kit you will need:
- Your own [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/) licence
- Your own [Hover.css](https://ianlunn.github.io/Hover/) licence if using for a commercial project
- Your own [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key) key (with Maps JavaScript API and Places API enabled) if using any of the map-related content modules
- Your own [Font Awesome Pro](https://fontawesome.com/) licence (or change the icons throughout the theme code to use only free icons or a different icon library of your choice)


Common plugins I use and will include styling for include:
- [Ninja Forms](https://ninjaforms.com/)
- [WooCommerce](https://woocommerce.com/)
...but it's early days. 

Some parts of the code have been pulled from open source libraries and modified to suit my needs, for example the [Bootstrap](https://getbootstrap.com/) grid (though I have modified this) and some Bootstrap functions/mixins. I have included attribution comments where this is the case.
