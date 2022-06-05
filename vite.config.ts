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
	test: {
		environment: 'jsdom',
		coverage: {
			reporter: ['text-summary', 'clover', 'lcov'],
			all: true,
			include: ['src/**'],
			exclude: ["src/typings/**", "dist/**", "coverage/**", "packages/*/test{,s}/**", "**/*.d.ts", "test{,s}/**", "test{,-*}.{js, cjs, mjs, ts, tsx, jsx}", "**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}", "**/__tests__ /** ", " ** /{ava,babel,nyc}.config.{js,cjs,mjs}", "**/jest.config.{ js, cjs, mjs, ts }", "**/{karma,rollup,webpack}.config.js", "**/.{eslint,mocha}rc.{js,cjs}"]
		}
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
