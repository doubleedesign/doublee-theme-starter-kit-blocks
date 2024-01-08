# Double-E WP Theme Starterkit (Block Editor edition)

**A WordPress theme starterkit for developers of bespoke websites.**

This version is designed for the new block editor (otherwise known as Gutenberg) and is in the early stages of development.

For classic themes using ACF Flexible Content, check out my (more mature) [classic theme starterkit](https://github.com/doubleedesign/doublee-theme-starter-kit).

---

## Returning dev quick reference

| I want to...                                                                   | Where to go                                                                                                                     |
|--------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Register a new custom block                                                    | [Block Skeleton Generator](#block-skeleton-generator)                                                                           |
| Override the front-end output of a core block                                  | blocks/core/block-name/** or [Block Skeleton Generator](#block-skeleton-generator)                                              |
| Edit CSS common to all or many blocks                                          | blocks/custom.scss*                                                                                                             |
| Edit the front-end output or styling of a custom block                         | blocks/custom/block-name/index.php or block-name.vue (styling is SCSS in the Vue component)                                     |
| Add options such as contained/fullwidth styles, colours, etc to a custom block | blocks/custom/block-name/block.json                                                                                             |
| Change the allowed inner blocks of a custom block                              | blocks/custom/block-name/index.php                                                                                              |
| Change the template/default blocks of a custom block                           | blocks/custom/block-name/index.php                                                                                              |
| Change whether default blocks in a custom block are templateLocked             | blocks/custom/block-name/index.php (Add the prop to InnerBlocks)                                                                |
| Change the allowed inner blocks of a core block                                | _Shit outta luck, as far as I'm aware._ You can change the template though by adding a variation and setting it as the default. |
| Edit the global theme options such as allowed background colours               | theme-vars.json and/or theme.json via the `theme-json` and CSS Gulp tasks*                                                      |
| Enable or disable certain block settings by default                            | theme.json*                                                                                                                     |
| Override a core block's defaults with a custom variation                       | js/admin/block-editor.js                                                                                                        |
| Change the allowed parents of a core block                                     | js/admin/block-editor.js                                                                                                        |
| Change the allowed parents of a custom block                                   | blocks/custom/block-name/block.json                                                                                             |
| Change the category a core block appears in                                    | js/admin/block-editor.js                                                                                                        |
| Change the category a custom block appears in                                  | blocks/custom/block-name/block.json                                                                                             |
| Add a new block category                                                       | inc/cms/class-block-editor.php                                                                                                  |
| Add a new block pattern                                                        | inc/cms/class-block-editor.php                                                                                                  |
| Make a cosmetic change to the back-end UI                                      | js/admin/admin-hacks.js, scss/styles-admin.scss*, or scss/styles-editor.scss*                                                   |
| Allow a currently disallowed core block                                        | inc/cms/class-block-editor.php                                                                                                  |

*Indicates tasks that have a compiler step. See [Build tools](#build-tools) for more information.

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

### Key files quick reference
- **inc/cms/class-block-editor.php**
  - Registers blocks placed in the `/blocks/custom` folder
  - Registers block categories
  - Curates allowed blocks and block patterns
  - Disables some features of the block editor such as code editing
  - Disables full screen mode because IMO it's shitty UX to take over the whole screen, making the dashboard menu and admin bar disappear by default
  - Enqueues the `block-editor.js` file and specifies its dependencies
  - Enqueues the `admin-hacks.js` file and adds `type=module` to its script tag. 
- **js/admin/block-editor.js**
  - Registers variations to core blocks (this can't be done in PHP)
  - Registers styles for core blocks (this _can_ be done in PHP, but I thought it made more sense to do it where the variations are defined)
  - Unregisters some core styles and variations
  - Adds parent blocks to some core blocks to enforce a consistent layout workflow
  - Sorts core blocks into custom (or different core) categories. 
- **js/admin/admin-hacks.js**
  - Hacky interface changes that I couldn't find a way to do 'properly'.
- **blocks/custom/<block-name>**
  - Settings and output files for custom blocks.
- **blocks/core/<block-name>**
  - Files to override the front-end output of core blocks.
- **styles-editor.css**
  - Custom editor CSS, generated using SCSS (see [build tools](#build-tools))
- **styles-admin.css**
  - General CSS for the broader admin area, also generated using SCSS
- **theme-vars.json**
  - Theme variables for use in SCSS, JS, and `theme.json` (see [build tools](#build-tools))
- **theme.json**
  - WordPress standard `theme.json` file, generated using Gulp for easy sharing of settings (see [build tools](#build-tools)).

### File structure and approach

My approach is currently geared towards minimising required build/compile steps. Remember when your client had a cPanel account and you could just go into the file manager to make a quick fix? Or when you could just FTP a file from and back up to the server? Pepperidge Farm remembers.

Block rendering is largely done the PHP-based way, using [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/)'s [ACF Blocks](https://www.advancedcustomfields.com/resources/blocks/) feature under the hood to handle using the same files in the editor and on the front end. However, output does differ slightly as I am experimenting with using [Vue](https://vuejs.org/) for output, eliminating the need for an SCSS compile step for block-level styles as well as making other Vue features available. So I guess that's not _so_ PHP-y, but it's "still a lot less buildy than React" according to Copilot's suggested completion of that sentence. 

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

...essentially they're very similar, just no `block.json` for core blocks because they've already been defined, and editor output of core blocks is not overridden (so use this option wisely, lest your front-end output vary wildly from what's shown in the editor). Overriding some core block features can be done in `theme.json`, which is loaded automatically by WordPress. I have set up a generator script for it in the Gulpfile (`gulp theme-json` to run it on its own) to more easily share things like colours that are defined in `theme-vars.json`.

You will then need to:
- Register your Vue component in `blocks/vue-blocks.js` (in the `Vue.createApp({})` function)
- If applicable, manually update the `title` field in `block.json` file to sentence or title case as these allow spaces (doing this automatically is in my mental roadmap but not a top priority)
- For a custom block, update `block.json` with the settings you want your block to have
- Update `index.php` with the relevant output code, including allowed inner blocks, default blocks, etc for custom blocks
- Fill in the props and data in the Vue component as needed
- Test your block.

### Troubleshooting

Some places to go and things to note if you're having trouble with custom blocks following the above process:
- `inc/cms/class-block-editor.php` 
  - The `register_custom_blocks` function is set up to find all folders in `blocks/custom` and register them as blocks. It is expected that the folder will contain `block.json`, `index.php`, and `<block-name>.css` files (the latter generated from an `.scss` file also in the folder)
  - The `allowed_blocks` function is set to find all blocks in `blocks/custom` and add them to the allow list. It is expected that the block's name, declared in its `block.json` file, will start with `custom/` (e.g. `custom/my-block`).
- ACF-supported/rendered blocks (i.e., most of the custom blocks) should not have `attributes` in their `block.json`. It will cause the block registration to fail silently - WordPress will think it's registered if you look at the return value of `register_block_type(), but you won't see the block in the editor and you won't get an error message`. If you need attributes, you'll need to use the `render_callback` method instead of the ACF method for rendering.
- If you initially get an error "_Your site doesn’t include support for the 'undefined' block. You can leave this block intact or remove it entirely"_ when inserting a custom block rendered using the ACF method, it should go away after adding default inner blocks in its `index.php`.

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
