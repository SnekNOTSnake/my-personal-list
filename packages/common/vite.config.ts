import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import pkg from '../../package.json'

export default defineConfig({
	root: __dirname,
	build: {
		outDir: '../../dist/common',
		emptyOutDir: true,
		lib: {
			entry: 'preload.ts',
			formats: ['cjs'],
			fileName: () => '[name].cjs',
		},
		minify: process.env.NODE_ENV === 'production',
		rollupOptions: {
			external: [
				'electron',
				...builtinModules,
				...Object.keys(pkg.dependencies || {}),
			],
		},
	},
})
