import fs from 'fs'
import path from 'path'
import expect from 'expect'
import { Events } from '../packages/main/ipcEvents'
import { defSeries, exists, ensureSchedule } from '../packages/main/util'
import {
	ANIME_DIR,
	POSTER_DIR,
	SCHEDULE_FILE,
} from '../packages/common/constants'

const defaultStore = { cwd: null, theme: 'light', lastPosterPath: '/' }

class Store {
	store = defaultStore

	get(key) {
		return this.store[key]
	}

	set(key, value) {
		this.store[key] = value
		return value
	}
}

const store = new Store()
const events = new Events(store, {})

const SAMPLE_CWD = path.join(__dirname, 'sampleCwd_copy')
const ANIME = path.join(SAMPLE_CWD, ANIME_DIR)
const POSTER = path.join(SAMPLE_CWD, POSTER_DIR)
const SCHEDULE = path.join(SAMPLE_CWD, SCHEDULE_FILE)

describe('ipcEvents', () => {
	describe('onGetSettings', () => {
		it('Should return default settings if not yet set', () => {
			const settings = events.onGetSettings('')

			expect(settings.cwd).toBeNull()
			expect(settings.theme).toBe('light')
		})
	})

	describe('onChangeTheme', () => {
		it('Should be able to change theme', () => {
			expect(events.onGetSettings('').theme).toBe('light')
			events.onChangeTheme('', 'dark')
			expect(events.onGetSettings('').theme).toBe('dark')
		})
	})

	describe('onGetSeries', () => {
		it('Should return empty array when CWD is not set', async () => {
			const series = await events.onGetSeries('')
			expect(series.length).toBe(0)
		})

		it('Should return all dirs series inside cwd, empty or not, but not files', async () => {
			store.set('cwd', SAMPLE_CWD)

			const series = await events.onGetSeries('')
			expect(series.length).toBe(4)
		})

		it('Should sanitize any unnecessary fields from series', async () => {
			const series = await events.onGetSeries('')
			expect(series.every((el) => el.unrelatedField === undefined)).toBe(true)
		})

		it("Should populate all series' default properties, regardless of empty, broken, or present mpl.json", async () => {
			const series = await events.onGetSeries('')
			expect(
				series.every((el) => Object.keys(defSeries).every((key) => key in el)),
			).toBeTruthy()
		})

		it('Should contain all filenames inside each series', async () => {
			const series = await events.onGetSeries('')

			const priconne = series.find((el) => el.path === 'Princess Connect')
			const exp = priconne.files.every(
				(file) => file === 'some_random.file' || file === 'mpl.json',
			)

			const yashahime = series.find((el) => el.path === 'Yashahime')
			const exp2 = yashahime.files.some((file) => file === 'sample.file')

			expect(exp).toBe(true)
			expect(exp2).toBe(true)
		})
	})

	describe('onEditSeries', () => {
		const editedSeries = {
			title: 'Mushishi Edited',
			regular: false,
			tags: ['Adventure', 'Supernatural', 'Mystery'],

			epsNum: 26,
			epsWatched: 0,
			rewatchCount: 0,

			audio: 'AAC Dual 128kbps',
			video: 'HEVC 10-bit',
			quality: 'bd',
			duration: 24,
			encoder: 'dedsec Edited',
			source: 'AnimeKaizoku Edited',
			res: 1080,
			subtitle: 'Subsplease Edited',

			notes: 'Lorem ipsum something cool again',
			related: [],
		}

		it('Should be able to edit every bit of series properties', async () => {
			await events.onEditSeries('', {
				...editedSeries,
				path: 'Mushishi',
				fullPath: path.join(ANIME, 'Mushishi'),
			})

			const series = await events.onGetSeries('')
			const mushishi = series.find((el) => el.path === 'Mushishi')

			expect(
				Object.keys(editedSeries).every((key) => {
					if (key === 'tags')
						return editedSeries[key].every((tag) => mushishi.tags.includes(tag))

					if (key === 'related')
						return editedSeries[key].length === mushishi.related.length

					return editedSeries[key] === mushishi[key]
				}),
			).toBeTruthy()
		})

		it('Should sanitize all unnecessary fields', async () => {
			const mushishi = await events.onEditSeries('', {
				...editedSeries,
				unnecessaryField: 'Something cool',
				path: 'Mushishi',
				fullPath: path.join(ANIME, 'Mushishi'),
			})

			expect(mushishi.unnecessaryField).toBeUndefined()
		})

		it('Should remove unnecessary whitespaces', async () => {
			const mushishi = await events.onEditSeries('', {
				...editedSeries,
				title: ' Mushishi       Extra     Spaces ',
				path: 'Mushishi',
				fullPath: path.join(ANIME, 'Mushishi'),
			})

			expect(mushishi.title).toBe('Mushishi Extra Spaces')
		})
	})

	describe('onRemoveUnusedPosters', () => {
		it('Should remove unused posters', async () => {
			await events.onRemoveUnusedPosters('')

			fs.readdir(POSTER, (err, items) => {
				expect(err).toBeFalsy()
				expect(items.length).toBe(2)
				expect(items.includes('fate-zero.jpg')).toBe(false)
				expect(items.includes('read-or-die.jpg')).toBe(true)
				expect(items.includes('isekai-shokudou.jpg')).toBe(true)
			})
		})
	})

	describe('onChangePoster', () => {
		it('Should generate `attachments` dir if not exists', async () => {
			fs.rmSync(POSTER, { recursive: true })

			const poster = path.join(__dirname, 'assets/urasekai.jpg')
			const events = new Events(store, {
				showOpenDialog: async () => ({ filePaths: [poster], canceled: false }),
			})

			const series = await events.onGetSeries('')
			const mushishi = series.find((el) => el.path === 'Mushishi')
			await events.onChangePoster('', mushishi)

			const posterDirExists = await exists(POSTER)
			expect(posterDirExists).toBe(true)

			fs.rmSync(POSTER, { recursive: true })
		})

		it('Should be able to copy selected poster to `attachments` and then update the series', async () => {
			const poster = path.join(__dirname, 'assets/urasekai.jpg')
			const events = new Events(store, {
				showOpenDialog: async () => ({ filePaths: [poster], canceled: false }),
			})

			const series = await events.onGetSeries('')
			const mushishi = series.find((el) => el.path === 'Mushishi')
			const result = await events.onChangePoster('', mushishi)

			const updatedSeries = await events.onGetSeries('')
			const updatedMushishi = updatedSeries.find((el) => el.path === 'Mushishi')
			const isPosterExists = await exists(
				path.join(POSTER, updatedMushishi.poster),
			)

			expect(updatedMushishi.poster).toBe(result.poster)
			expect(isPosterExists).toBe(true)
		})
	})

	describe('onGetSchedule', () => {
		it('Should return stored schedule', async () => {
			const schedule = await events.onGetSchedule('')

			expect(schedule.sun).toHaveLength(2)
			expect(schedule.wed).toHaveLength(1)
			expect(schedule.sat).toHaveLength(2)
			expect(schedule.sat[1]).toBe('something-different')
		})

		it("Should return default schedule when the file isn't presents", async () => {
			fs.rmSync(SCHEDULE)
			const schedule = await events.onGetSchedule('')

			expect(schedule).toHaveProperty('sun')
			expect(schedule).toHaveProperty('mon')
			expect(schedule).toHaveProperty('tue')
			expect(schedule).toHaveProperty('wed')
			expect(schedule).toHaveProperty('thu')
			expect(schedule).toHaveProperty('fri')
			expect(schedule).toHaveProperty('sat')
		})

		it('Should populate incomplete schedule', async () => {
			fs.writeFileSync(SCHEDULE, JSON.stringify({ mon: ['some-anime'] }))
			const schedule = await events.onGetSchedule('')

			expect(schedule.sun).toHaveLength(0)
			expect(schedule.mon).toHaveLength(1)
			expect(schedule.tue).toHaveLength(0)
		})
	})

	describe('onChangeSchedule', () => {
		it('Should write schedule file when none is present', async () => {
			fs.rmSync(SCHEDULE)
			let isExists = await exists(SCHEDULE)
			expect(isExists).toBe(false)

			await events.onChangeSchedule('', ensureSchedule())
			isExists = await exists(SCHEDULE)
			expect(isExists).toBe(true)
		})

		it('Should be able to store schedules', async () => {
			await events.onChangeSchedule(
				'',
				ensureSchedule({
					sun: ['something-cool'],
					tue: ['something-cool', 'something-different'],
				}),
			)

			const schedule = await events.onGetSchedule('')

			expect(schedule.sun[0]).toBe('something-cool')
			expect(schedule.tue[1]).toBe('something-different')
		})
	})
})
