import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

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

	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './tests/globals.ts'
	}
})
