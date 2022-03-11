import fs from 'fs'
import path from 'path'
import expect from 'expect'
import { Events } from '../packages/main/ipcEvents'
import { defSeries } from '../packages/main/util'

const defaultStore = { cwd: null, theme: 'light' }

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
const events = new Events(store)

const INITIAL_SAMPLE_CWD = path.join(__dirname, 'sampleCwd')
const SAMPLE_CWD = path.join('sampleCwd_copy')

describe('ipcEvents', () => {
	// Copy sampleCwd to avoid altering it
	before(() => {
		fs.cpSync(INITIAL_SAMPLE_CWD, SAMPLE_CWD, { recursive: true }, () => {})
	})

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
				fullPath: path.join(SAMPLE_CWD, 'Mushishi'),
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
				fullPath: path.join(SAMPLE_CWD, 'Mushishi'),
			})

			expect(mushishi.unnecessaryField).toBeUndefined()
		})

		it('Should remove unnecessary whitespaces', async () => {
			const mushishi = await events.onEditSeries('', {
				...editedSeries,
				title: ' Mushishi       Extra     Spaces ',
				path: 'Mushishi',
				fullPath: path.join(SAMPLE_CWD, 'Mushishi'),
			})

			expect(mushishi.title).toBe('Mushishi Extra Spaces')
		})
	})

	// Dispose of sampleCwd copy
	after(() => {
		fs.rmSync(SAMPLE_CWD, { recursive: true })
	})
})
