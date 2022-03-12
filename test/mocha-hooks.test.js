import fs from 'fs'
import path from 'path'

const INITIAL_SAMPLE_CWD = path.join(__dirname, 'sampleCwd')
const SAMPLE_CWD = path.join('sampleCwd_copy')

console.log('INSIDE HOOKS')

exports.mochaHooks = {
	beforeAll: () => {
		// Copy sampleCwd to avoid altering it
		fs.cpSync(INITIAL_SAMPLE_CWD, SAMPLE_CWD, { recursive: true }, () => {})
	},

	afterAll: () => {
		fs.rmSync(SAMPLE_CWD, { recursive: true })
	},
}
