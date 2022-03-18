import path from 'path'
import expect from 'expect'

import {
	resolveHtmlPath,
	exists,
	read,
	write,
	ensureSeries,
	sanitizeSeries,
	ensureSchedule,
	sanitizeSchedule,
} from '../packages/main/util'
import { ANIME_DIR, DATA_FILE } from '../packages/common/constants'

const SAMPLE_CWD = path.join(__dirname, 'sampleCwd_copy')
const ANIME = path.join(SAMPLE_CWD, ANIME_DIR)

describe('Utils', () => {
	describe('resolveHtmlPath', () => {
		it('Should return localhost when not bundled', () => {
			const path = resolveHtmlPath('index.html', { isPackaged: false })
			expect(path).toBe('http://localhost:3000/')
		})

		it('Should return filepath when bundled', () => {
			const path = resolveHtmlPath('index.html', { isPackaged: true })
			expect(path.startsWith('file://')).toBeTruthy()
		})
	})

	describe('exists', () => {
		it('Should return true if exists', async () => {
			const isExists = await exists(SAMPLE_CWD)
			const isExists2 = await exists(path.join(ANIME, 'Mushishi', DATA_FILE))

			expect(isExists).toBeTruthy()
			expect(isExists2).toBeTruthy()
		})

		it('Should return false if not exists', async () => {
			const isExists = await exists(path.join(SAMPLE_CWD, 'tahu.txt'))
			expect(isExists).toBeFalsy()
		})
	})

	describe('read', () => {
		it("Should be able to read file's content", async () => {
			const buffer = await read(path.join(ANIME, 'Princess Connect', DATA_FILE))
			const priconne = JSON.parse(buffer.toString())

			expect(priconne.title).toBe('Princess Connect')
		})

		it('Should return false when unable to read file', async () => {
			const buffer = await read(path.join(SAMPLE_CWD, 'nonexists.file'))
			expect(buffer).toBeFalsy()
		})
	})

	describe('write', () => {
		it('Should be able to write into files', async () => {
			await write(
				path.join(SAMPLE_CWD, 'sample.json'),
				JSON.stringify({ something: 'cool' }),
			)
			const buffer = await read(path.join(SAMPLE_CWD, 'sample.json'))
			const data = JSON.parse(buffer.toString())

			expect(data.something).toBe('cool')
		})
	})

	describe('ensureSeries', () => {
		it('Should create the default series object structure', () => {
			const series = ensureSeries({ title: 'Mushishi Zoku Shou' })

			expect(series).toHaveProperty('tags')
			expect(series).toHaveProperty('related')
			expect(series).toHaveProperty('regular')
			expect(series).toHaveProperty('epsNum')
			expect(series).toHaveProperty('encoder')
		})
	})

	describe('sanitizeSeries', () => {
		it('Should eliminate unnecessary properties, including path, fullPath, and files', () => {
			const mushishi = ensureSeries({
				title: 'Mushishi Zoku Shou 2',
				unnecessaryField: true,
				path: 'somewhere',
				fullPath: '/media/Alpha/somewhere',
				files: ['something.cool', 'nothing-in.here'],
			})
			const sanitized = sanitizeSeries(mushishi)

			expect(sanitized.unnecessaryField).toBeUndefined()
			expect(sanitized.path).toBeUndefined()
			expect(sanitized.fullPath).toBeUndefined()
			expect(sanitized.files).toBeUndefined()
		})
	})

	describe('ensureSchedule', () => {
		it('Should fill in missing days', () => {
			const schedule = ensureSchedule({ mon: ['tahu'] })

			expect(schedule).toHaveProperty('sun')
			expect(schedule).toHaveProperty('mon')
			expect(schedule).toHaveProperty('tue')
			expect(schedule).toHaveProperty('wed')
		})
	})

	describe('sanitizeSchedul', () => {
		it('Should eliminate unnecessary properties', () => {
			const mySchedule = ensureSchedule({
				tahu: ['kotak'],
				mon: ['semprong'],
				tue: ['tempe'],
			})
			const sanitized = sanitizeSchedule(mySchedule)

			expect(sanitized.tahu).toBeUndefined()
			expect(sanitized.mon[0]).toBe('semprong')
			expect(sanitized.tue[0]).toBe('tempe')
		})
	})
})
