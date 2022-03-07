import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import esm2cjs from '../../scripts/vite-plugin-esm2cjs'
import pkg from '../../package.json'

export default defineConfig({
	root: __dirname,
	plugins: [esm2cjs([])],
	build: {
		outDir: '../../dist/main',
		emptyOutDir: true,
		lib: {
			entry: 'index.ts',
			formats: ['cjs'],
			fileName: () => '[name].cjs',
		},
		minify: process.env.NODE_ENV === 'production',
		sourcemap: process.env.NODE_ENV !== 'production',
		rollupOptions: {
			external: [
				'electron',
				...builtinModules,
				...Object.keys(pkg.dependencies || {}),
			],
		},
	},
})
