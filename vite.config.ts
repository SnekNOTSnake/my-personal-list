import { join } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	mode: process.env.NODE_ENV,
	root: join(__dirname, 'packages/renderer'),
	plugins: [react()],
	base: './',
	build: {
		sourcemap: process.env.NODE_ENV !== 'production',
		outDir: '../../dist/renderer',
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'@': join(__dirname, 'packages/renderer/src'),
		},
	},
	server: {
		port: Number(process.env.PORT) || 3000,
	},
})
