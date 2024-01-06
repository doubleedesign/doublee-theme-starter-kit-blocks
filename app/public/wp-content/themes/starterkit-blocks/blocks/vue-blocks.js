import * as Vue from '../js/vendor/vue.esm-browser.js';
import * as sass from 'https://jspm.dev/sass';

const siteUrl = window.location.origin;
const themeUrl = '/wp-content/themes/starterkit-blocks';

const sassDepImporter = {
	load: async(url) => {
		const file = await fetch(url.pathname);
		const content = await file.text();
		return {
			contents: content,
			syntax: 'scss',
		};
	},
	canonicalize: (str) => {
		const fileTree = str.split('/').filter((part) => part !== '..');
		const fileName = `_${fileTree.pop()}.scss`;
		return new URL(`${fileTree}/${fileName}`, `${siteUrl}${themeUrl}/`);
	},
};

const vueSfcLoaderOptions = {
	moduleCache: {
		vue: Vue,
		sass,
	},
	async getFile(url) {
		const res = await fetch(url);
		if (!res.ok) {
			throw Object.assign(new Error(res.statusText + ' ' + url), { res });
		}

		return {
			getContentData: () => {
				return res.text().then((content) => {
					// Filter out the <style> tags from the component as they need to be processed separately
					const dom = new DOMParser().parseFromString(content, 'text/html');
					return Array.from(dom.head.children)
						.filter((element) => element.tagName !== 'STYLE')
						.map((element) => element.outerHTML)
						.join('\n');
				});
			},
		};
	},
	async addStyle(fileUrl) {
		const res = await fetch(fileUrl);
		if (!res.ok) {
			throw Object.assign(new Error(res.statusText + ' ' + url), { res });
		}
		const dom = new DOMParser().parseFromString(await res.text(), 'text/html');
		const rawScss = Array.from(dom.head.children).find((element) => element.tagName === 'STYLE');
		const compiled = await sass.compileStringAsync(rawScss.textContent, {
			importers: [sassDepImporter],
		});

		const style = document.createElement('style');
		style.setAttribute('data-vue-component', fileUrl.split('/').pop());
		style.type = 'text/css';
		style.textContent = compiled.css;
		document.body.appendChild(style);
	},
	// eslint-disable-next-line no-shadow
	async handleModule(type, getContentData, path, options) {
		if (type === '.vue') {
			// Get and compile the SCSS from the component file
			options.addStyle(path);
		}

		//throw new Error(`Tried to import a non-vue file at ${path}`);
	},
};

const { loadModule } = window['vue3-sfc-loader'];

Vue.createApp({
	components: {
		CallToAction: Vue.defineAsyncComponent(() => loadModule(`${themeUrl}/blocks/custom/call-to-action/call-to-action.vue`, vueSfcLoaderOptions)),
		// Add more components here
	},
	template: '',
	compilerOptions: {
		isCustomElement: (tag) => tag === 'innerblocks',
	},
}).mount('#app');

