# Double-E WP Theme Starterkit (Block Editor edition)

**A WordPress theme starterkit for developers of bespoke websites.**

This version is designed for the new block editor (otherwise known as Gutenberg) and is in the early stages of development.

For classic themes using ACF Flexible Content, check out my (more mature) [classic theme starterkit](https://github.com/doubleedesign/doublee-theme-starter-kit).

---

The development process using this starter kit is largely the same as my classic one, with some adaptations for the block editor.

## Getting started

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

A Gulpfile is included to:

- Generate the [`theme.json`](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/) file for the block editor; this includes disabling options I don't want to use* as well as updating the colour palette according to the `theme-vars.json` file
- Concatenate JS files, including support for ES6 module imports
- Update the SCSS variables file using the `theme-vars.json` file
- Compile, concatenate and minify SCSS files into the theme's `style.css`
- Generate sourcemaps for JS and SCSS.

*where doing so in `theme.json` is supported. There are other customisations in `cms/class-block-editor.php` and `js/admin/`.

Gulp needs to be installed globally: `npm install gulp-cli -g`.

:star: It is intended that there will be less need for repeated compiling in the future as I move to using [Vue](https://vuejs.org/) (with [Vue 3 SFC Loader](https://github.com/FranckFreiburger/vue3-sfc-loader) so there's not even a need for a build step for Vue) but this is a work in progress.

[Commitizen](https://github.com/commitizen/cz-cli) is set up to run with the `npm run commit` command.
It will also lint staged files before proceeding to the commit options.

## Creating blocks

### File structure and approach

Custom blocks are built using  along with custom code as needed to create and manage custom blocks, much like I did with Flexible Content in my [classic starterkit](https://github.com/doubleedesign/doublee-theme-starter-kit).

Block output is done the PHP-based way, using [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/)'s [ACF Blocks](https://www.advancedcustomfields.com/resources/blocks/) feature under the hood to handle using the same files in the editor and on the front end. However, output does differ slightly as I am experimenting with using [Vue](https://vuejs.org/) for output, eliminating the need for an SCSS compile step for block-level styles as well as making other Vue features available.

While I am leaning on ACF to handle rendering, I'm leaning towards using inner blocks (particularly setting up default blocks and limiting allowed blocks) where possible for a more intuitive editing experience than having all data in ACF fields. (Big thanks to Michael LaRoy for his article [WordPress ACF Blocks with block.json and InnerBlocks](https://www.michaellroy.com/blog/using-advanced-custom-fields-pro-blocks-without-the-gutenberg-editor) which helped me a lot with this.)

A lot of core blocks are disabled in favour of custom blocks, and the output of some core blocks is overridden with custom template parts on the front-end. These must be located in `blocks/custom` and `blocks/core` respectively. Custom block names must use the namespace `custom/` for them to be found as expected automatically. The `Starterkit_Theme_Frontend_Utils::output_custom_blocks($blocks)` function should be used with an array of blocks to ensure the custom template parts are used for both directly inserted blocks and their inner blocks.

### Using Vue components for block output

Never used Vue before? Never fear! I work with React for my day job but firmly believe Vue has a much shallower learning curve, especially using the Options API. It's a much smaller step away from vanilla HTML, and I have purposely stuck with using good ol' SCSS rather than trying to use a CSS-in-JS solution. Thanks to [Vue 3 SFC Loader](https://github.com/FranckFreiburger/vue3-sfc-loader), I've set things up so there's not even a need for a build step for Vue or a compile step for SCSS! You can get to work creating blocks with Vue straight away!

:warning: :warning: :warning: Unfortunately, due to how the build-step-free processing of SCSS works, the `scoped` property (e.g.,, `<style scoped lang="scss">`) currently **does not work**, i.e., styles are **not** scoped to the component. I use the [BEM naming convention](https://getbem.com/) so it's not a big issue at this stage, but I hope to find a full solution for this in the future.

### Block skeleton generator

Using [generate-vue-cli](https://www.npmjs.com/package/generate-vue-cli), 
 - the skeleton of a new block can be generated from the command line using: `npx generate-vue-cli component <block-name>`. 
 - the skeleton of a core block output override can be generated using `npx  generate-vue-cli component <block-name> --type=core`.

Use `kebab-case` in these commands.

This creates the following files for custom blocks:
- `blocks/custom/<block-name>/block.json` (block definition)
- `blocks/custom/<block-name>/index.php` (WP template part)
- `blocks/custom/<block-name>/<block-name>.vue` (Vue single-file component)

And the following files for core block output overrides:
- `blocks/core/<block-name>/index.php` (WP template part)
- `blocks/core/<block-name>/<block-name>.vue` (Vue single-file component)

...essentially they're the same, just no `block.json` for core blocks because they've already been defined. Overriding some custom block features can be done in `theme.json`, which is loaded automatically by WordPress. I have set up a generator script for it in the Gulpfile (`gulp theme-json` to run it on its own) to more easily share things like colours that are defined in `theme-vars.json`.

You will then need to:
- If applicable, manually update the `title` field in `block.json` file to sentence or title case as these allow spaces (doing this automatically is in my mental roadmap but not a top priority)
- For a custom block, update `block.json` with the settings you want your block to have
- Update `index.php` with the relevant output code, including allowed inner blocks, default blocks, etc
- Fill in the props and data in the Vue component as needed
- Test your block.

### Troubleshooting

Some places to go and things to note if you're having trouble with custom blocks following the above process:
- `inc/cms/class-block-editor.php` 
  - The `register_custom_blocks` function is set up to find all folders in `blocks/custom` and register them as blocks. It is expected that the folder will contain `block.json`, `index.php`, and `<block-name>.css` files (the latter generated from an `.scss` file also in the folder)
  - The `allowed_blocks` function is set to find all blocks in `blocks/custom` and add them to the allow list. It is expected that the block's name, declared in its `block.json` file, will start with `custom/` (e.g. `custom/my-block`).

## Code formatting and linting

Scripts are set up in `package.json` for:

- [eslint](https://eslint.org)
- [stylelint](https://stylelint.io/) with [SCSS plugin](https://www.npmjs.com/package/stylelint-scss)

I use PHPStorm which has some built-in formatting and code quality options (inspections) for PHP, so I use those rather
than a separate PHP linting/code quality tool. My preferences are included in this repo (in the `.idea` folder) but you
can easily override them in your own projects using PHPStorm's preferences dialog.

You can see the results of PHPStorm's inspections as you go using the Problems tool window. I configure mine to just
check the theme and/or any custom plugins I'm working on in the project.


## Licensing, plugins, and APIs

To use this kit you will need:
- Your own [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/) licence
- Your own [Hover.css](https://ianlunn.github.io/Hover/) licence if using for a commercial project
- Your own [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key) key (with Maps JavaScript API and Places API enabled) if using any of the map-related stuff (that I have yet to add to this kit but do intend to)
- Your own [Font Awesome Pro](https://fontawesome.com/) licence (or change the icons throughout the theme code to use only free icons or a different icon library of your choice)


Common plugins I use and will include styling for include:
- [Ninja Forms](https://ninjaforms.com/)
- [WooCommerce](https://woocommerce.com/)

...but it's early days. 

Some parts of the code have been pulled from open source libraries and modified to suit my needs, for example the [Bootstrap](https://getbootstrap.com/) grid (though I have modified this) and some Bootstrap functions/mixins. I have included attribution comments where this is the case.
