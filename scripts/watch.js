const { spawn } = require('child_process')
const { createServer } = require('vite')

const start = async () => {
	// Renderer
	const server = await createServer({ configFile: 'vite.config.ts' })
	server.listen()

	// Main
	spawn('yarn', ['run', 'start:main'], {
		shell: true,
		env: process.env,
		stdio: 'inherit',
	})
		.on('close', (code) => process.exit(code))
		.on('error', (error) => console.error(error))
}

start()
