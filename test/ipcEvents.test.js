import fs from 'fs'
import path from 'path'
import expect from 'expect'
import { Events } from '../packages/main/ipcEvents'
import { defSeries, exists, ensureSchedule } from '../packages/main/util'
import { POSTER_DIR, SCHEDULE_FILE } from '../packages/common/constants'

const SAMPLE_CWD1 = path.join(__dirname, 'SAMPLE_CWD1_COPY')
const SAMPLE_CWD2 = path.join(__dirname, 'SAMPLE_CWD2_COPY')
const SAMPLE_USER_DATA_DIR = path.join(__dirname, 'SAMPLE_USER_DATA_DIR_COPY')

const defaultStore = {
	cwds: [],
	theme: 'light',
	lastPosterPath: '/',
	lastUpdateCheck: 0,
	neverCheckUpdate: false,
	userDataDir: SAMPLE_USER_DATA_DIR,
}

class Store {
	store = defaultStore

	get(key) {
		return this.store[key]
	}

	set(key, value) {
		if (typeof key === 'string') {
			this.store[key] = value
			return value
		}
		this.store = key
	}
}

const store = new Store()
const events = new Events(
	store,
	{ showOpenDialog: () => 'test' },
	{ getPath: (name) => (name === 'userData' ? SAMPLE_USER_DATA_DIR : '') },
)

const POSTER = path.join(SAMPLE_USER_DATA_DIR, POSTER_DIR)
const SCHEDULE = path.join(SAMPLE_USER_DATA_DIR, SCHEDULE_FILE)

describe('ipcEvents', () => {
	describe('onSelectDirectory', () => {
		it("Should return empty path when it's cancelled", async () => {
			events.dialog.showOpenDialog = () => ({ canceled: true })
			const result = await events.onSelectDirectory('')
			expect(result).toBe('')
		})

		it('Should return the first selected files', async () => {
			events.dialog.showOpenDialog = () => ({
				canceled: false,
				filePaths: ['somewhere', 'sometime'],
			})
			const result = await events.onSelectDirectory('')
			expect(result).toBe('somewhere')
		})
	})

	describe('onGetUserDataDir', () => {
		it("Should return the user's data directory", () => {
			const result = events.onGetUserDataDir('')
			expect(result).toBe(SAMPLE_USER_DATA_DIR)
		})
	})

	describe('onGetSettings', () => {
		it('Should return a settings object', async () => {
			const result = await events.onGetSettings('')

			expect(result.cwds.length).toBe(0)
			expect(result.theme).toBe('light')
			expect(result.lastPosterPath).toBe('/')
			expect(result.lastUpdateCheck).toBe(0)
			expect(result.neverCheckUpdate).toBe(false)
			expect(result.userDataDir).toBe(SAMPLE_USER_DATA_DIR)
		})
	})

	describe('onSetSettings', () => {
		it('Should be able to change setting values', async () => {
			const settings = await events.onGetSettings('')

			expect(settings.cwds.length).toBe(0)
			expect(settings.theme).toBe('light')

			const newSettings = await events.onSetSettings('', {
				...settings,
				cwds: [{ name: 'Dir1', path: '/somewhere' }],
				theme: 'dark',
			})

			expect(newSettings.cwds.length).toBe(1)
			expect(newSettings.theme).toBe('dark')
		})
	})

	describe('onGetSeries', () => {
		it('Should return empty array when CWDs length is 0', async () => {
			store.set('cwds', [])
			const series = await events.onGetSeries('')
			expect(series.length).toBe(0)
		})

		it('Should return all dirs inside CWDs, empty or not, but not files', async () => {
			store.set('cwds', [
				{ name: 'Dir1', path: SAMPLE_CWD1 },
				{ name: 'Dir2', path: SAMPLE_CWD2 },
			])
			const series = await events.onGetSeries('')
			expect(series.length).toBe(4)
		})

		it('Should sanitize any unnecessary fields from series', async () => {
			const series = await events.onGetSeries('')
			const test1 = series.every((anime) => {
				return (el) => el.unrelatedField === undefined
			})
			expect(test1).toBe(true)
		})

		it("Should populate all series' default properties, regardless of empty, broken, or present mpl.json", async () => {
			const series = await events.onGetSeries('')
			const test1 = series.every((anime) => {
				return Object.keys(defSeries).every((key) => key in anime)
			})

			expect(test1).toBeTruthy()
		})

		it('Should contain all filenames inside each series', async () => {
			const series = await events.onGetSeries('')

			const priconne = series.find((el) => el.path === 'Priconne 2')
			const test1 = priconne.files.every(
				(file) => file === 'some_random.file' || file === 'mpl.json',
			)

			const yashahime = series.find((el) => el.path === 'Yashahime')
			const test2 = yashahime.files.some((file) => file === 'sample.file')

			expect(test1).toBe(true)
			expect(test2).toBe(true)
		})
	})

	describe('onEditSeries', () => {
		const editedSeries = {
			jpTitle: 'Mushishi Edited',
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
				fullPath: path.join(SAMPLE_CWD1, 'Mushishi'),
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

			it('Should sanitize all unnecessary fields', async () => {
				await events.onEditSeries('', {
					...editedSeries,
					unnecessaryField: 'Something cool',
					path: 'Mushishi',
					fullPath: path.join(ANIME, 'Mushishi'),
				})

				const series = await events.onGetSeries('')
				const mushishi = series.find((s) => s.path === 'Mushishi')

				expect(mushishi.unnecessaryField).toBeUndefined()
			})
		})
	})

	describe('onRemoveUnusedPosters', () => {
		it('Should remove unused posters', async () => {
			await events.onRemoveUnusedPosters('')
			const items = fs.readdirSync(POSTER)

			expect(items.length).toBe(2)
			expect(items.includes('fate-zero.jpg')).toBe(false)
			expect(items.includes('read-or-die.jpg')).toBe(true)
			expect(items.includes('isekai-shokudou.jpg')).toBe(true)
		})
	})

	describe('onChangePoster', () => {
		it('Should generate `attachments` dir if not exist', async () => {
			fs.rmSync(POSTER, { recursive: true })

			const poster = path.join(__dirname, 'assets/urasekai.jpg')
			events.dialog.showOpenDialog = async () => ({
				filePaths: [poster],
				cancelled: false,
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
			events.dialog.showOpenDialog = async () => ({
				filePaths: [poster],
				canceled: false,
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
