import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	plugins: [
		Vue({
			reactivityTransform: true,
		}),
		VueJsx(),
		AutoImport({
			imports: ['vitest'],
			dts: true,
		}),
		Unocss({}),
	],
})
