import fs from 'fs'
import path from 'path'

const INIT_SAMPLE_CWD1 = path.join(__dirname, 'SAMPLE_CWD1')
const INIT_SAMPLE_CWD2 = path.join(__dirname, 'SAMPLE_CWD2')
const INIT_SAMPLE_USER_DATA_DIR = path.join(__dirname, 'SAMPLE_USER_DATA_DIR')

const SAMPLE_CWD1 = path.join(__dirname, 'SAMPLE_CWD1_COPY')
const SAMPLE_CWD2 = path.join(__dirname, 'SAMPLE_CWD2_COPY')
const SAMPLE_USER_DATA_DIR = path.join(__dirname, 'SAMPLE_USER_DATA_DIR_COPY')

exports.mochaHooks = {
	beforeAll: () => {
		// Copy sampleCwd to avoid altering it
		fs.cpSync(INIT_SAMPLE_CWD1, SAMPLE_CWD1, { recursive: true })
		fs.cpSync(INIT_SAMPLE_CWD2, SAMPLE_CWD2, { recursive: true })
		fs.cpSync(INIT_SAMPLE_USER_DATA_DIR, SAMPLE_USER_DATA_DIR, {
			recursive: true,
		})
	},

	afterAll: () => {
		// Dispose sampleCwd copy
		fs.rmSync(SAMPLE_CWD1, { recursive: true })
		fs.rmSync(SAMPLE_CWD2, { recursive: true })
		fs.rmSync(SAMPLE_USER_DATA_DIR, { recursive: true })
	},
}
