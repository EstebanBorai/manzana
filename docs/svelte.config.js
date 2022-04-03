import adapter from '@sveltejs/adapter-cloudflare-workers';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [
		preprocess({
			postcss: true
		}),
		mdsvex({
			layout: './src/lib/components/Layout.svelte'
		})
	],
	kit: {
		adapter: adapter()
	}
};

export default config;
