import fs from 'fs'
import path from 'path'

const INITIAL_SAMPLE_CWD = path.join(__dirname, 'sampleCwd')
const SAMPLE_CWD = path.join(__dirname, 'sampleCwd_copy')

exports.mochaHooks = {
	beforeAll: () => {
		// Copy sampleCwd to avoid altering it
		fs.cpSync(INITIAL_SAMPLE_CWD, SAMPLE_CWD, { recursive: true }, () => {})
	},

	afterAll: () => {
		// Dispose sampleCwd copy
		fs.rmSync(SAMPLE_CWD, { recursive: true })
	},
}
