import { atom, selector } from 'recoil'
import fuzzysort from 'fuzzysort'
import { ensureSeries } from '@/utils/helpers'

Object.typedKeys = Object.keys as any

export const seriesState = atom({
	key: 'series',
	default: window.myAPI.getSeries(),
})

export const scheduleState = atom({
	key: 'schedule',
	default: window.myAPI.getSchedule(),
})

export const seriesFilterState = atom({
	key: 'seriesFilter',
	default: {
		query: '',
		tags: {
			active: [] as string[],
			deactive: [] as string[],
		},
		advFilter: [] as AdvFilter[],
	},
})

export const selectedSeriesState = atom({
	key: 'selectedSeries',
	default: [] as string[],
})

export const seriesStats = selector({
	key: 'seriesStats',
	get: ({ get }) => {
		const series = get(seriesState)
		const schedule = get(scheduleState)

		const tagsSet = new Set<string>()
		series.forEach((el) => el.tags.forEach((tag) => tagsSet.add(tag)))

		const tags: {
			name: string
			count: number
			epsNum: number
			epsWatched: number
		}[] = []

		tagsSet.forEach((tag) => {
			const nonRegularFiltered = series.filter((el) => el.tags.includes(tag))
			const filtered = series
				.filter((el) => el.regular)
				.filter((el) => el.tags.includes(tag))

			tags.push({
				name: tag,
				count: nonRegularFiltered.length,
				epsNum: filtered.map((el) => el.epsNum).reduce((p, c) => p + c, 0),
				epsWatched: filtered
					.map((el) => el.epsWatched)
					.reduce((p, c) => p + c, 0),
			})
		})
		tags.sort((a, b) => a.name.localeCompare(b.name))

		// Untagged series
		const untaggeds = series.filter((el) => !el.tags.length)
		tags.push({
			name: 'Untagged',
			count: untaggeds.length,
			epsNum: untaggeds.map((el) => el.epsNum).reduce((p, c) => p + c, 0),
			epsWatched: untaggeds
				.map((el) => el.epsWatched)
				.reduce((p, c) => p + c, 0),
		})

		const watchedEpisodes = series
			.filter((el) => el.regular)
			.map((el) => el.epsWatched)
			.reduce((p, c) => p + c, 0)

		const totalEpisodes = series
			.filter((el) => el.regular)
			.map((el) => el.epsNum)
			.reduce((p, c) => p + c, 0)

		const avgEpsPerDay =
			Math.ceil(
				(Object.values(schedule).reduce((p, c) => p + c.length, 0) / 7) * 100,
			) / 100

		let stockpileLasts, suffix
		const daysRunsOut = (totalEpisodes - watchedEpisodes) / avgEpsPerDay
		if (totalEpisodes === 0) {
			stockpileLasts = 0
			suffix = 'M'
		} else if (daysRunsOut > 365) {
			stockpileLasts = daysRunsOut / 365
			suffix = 'Y'
		} else if (daysRunsOut > 30) {
			stockpileLasts = daysRunsOut / 30
			suffix = 'M'
		} else {
			stockpileLasts = daysRunsOut
			suffix = 'D'
		}
		stockpileLasts = Math.floor(stockpileLasts * 100) / 100

		return {
			tags,
			watchedEpisodes,
			totalEpisodes,
			avgEpsPerDay,
			stockpileLasts: [stockpileLasts, suffix],
		}
	},
})

export const filteredSeries = selector({
	key: 'filteredSeries',
	get: ({ get }) => {
		const series = get(seriesState)
		const filter = get(seriesFilterState)

		let filtered: Series[]
		if (filter.tags.active.includes('Untagged')) {
			filtered = series.filter((el) => el.tags.length === 0)
		} else if (filter.tags.deactive.includes('Untagged')) {
			filtered = series.filter((el) => el.tags.length > 0)
		} else {
			filtered = series
				.filter((el) =>
					filter.tags.active.length
						? filter.tags.active.every((tag) => el.tags.includes(tag))
						: true,
				)
				.filter((el) =>
					filter.tags.deactive.length
						? filter.tags.deactive.every((tag) => !el.tags.includes(tag))
						: true,
				)
		}

		if (filter.advFilter.length) {
			const f = filter.advFilter[0]

			const strMatch = (
				textBase: string,
				textToFind: string,
				operator: StrOperators = 'normal',
			) => {
				if (operator === 'normal') {
					return textBase.toLowerCase().indexOf(textToFind.toLowerCase()) > -1
				}
				return new RegExp(textToFind.toLowerCase()).test(
					textBase.toLocaleLowerCase(),
				)
			}

			const numMatch = (
				numBase: number,
				numToCompare: number,
				operator: NumOperators = 'gte',
			) => {
				if (operator === 'gte') return numBase >= numToCompare
				return numBase <= numToCompare
			}

			const numFilterers = {
				epsNum: f.epsNum,
				epsWatched: f.epsWatched,
				rewatchCount: f.rewatchCount,
				res: f.res,
			}

			const strFilterers = {
				encoder: f.encoder,
				source: f.source,
				quality: f.quality,
				video: f.video,
				audio: f.audio,
				subtitle: f.subtitle,
				notes: f.notes,
			}

			if (f.regular !== 'any')
				filtered = filtered.filter((s) => {
					return f.regular === 'regular' ? s.regular : !s.regular
				})

			// Numeric Filterers
			Object.typedKeys(numFilterers).forEach((key) => {
				const field = f[key]
				if (!field.value) return
				filtered = filtered.filter((s) => {
					return numMatch(s[key], field.value, field.operator)
				})
			})

			// String Filterers
			Object.typedKeys(strFilterers).forEach((key) => {
				const field = f[key]
				if (!field.value) return
				filtered = filtered.filter((s) => {
					return strMatch(s[key], field.value, field.operator)
				})
			})
		}

		const order: Order = filter.advFilter.length
			? filter.advFilter[0].order
			: { value: 'title', operator: 'asc' }
		let orderBy = order.value
		let searched: Series[] = filtered

		if (filter.query) {
			const results = fuzzysort.go(filter.query, filtered, { keys: ['path'] })
			const sorted = [...results]
			sorted.sort((a, b) => {
				if (a.score !== b.score) return b.score - a.score
				return a.obj.path.localeCompare(b.obj.path)
			})

			orderBy = 'relevance'
			searched = sorted.map((el) => el.obj)
		}

		let ordered = searched
		switch (orderBy) {
			case 'relevance':
				break

			case 'title':
				ordered.sort((a, b) => {
					return order.operator === 'desc'
						? b.path.localeCompare(a.path)
						: a.path.localeCompare(b.path)
				})
				break

			case 'epsNum':
				ordered.sort((a, b) => {
					return order.operator === 'desc'
						? b.epsNum - a.epsNum
						: a.epsNum - b.epsNum
				})
				break

			case 'resolution':
				ordered.sort((a, b) => {
					return order.operator === 'desc' ? b.res - a.res : a.res - b.res
				})
				break

			default:
				break
		}

		return ordered
	},
})

export const populatedSelectedSeries = selector({
	key: 'populatedSelectedSeries',
	get: ({ get }) => {
		const series = get(seriesState)
		const selectedSeries = get(selectedSeriesState)
		const filtered = selectedSeries
			.map((path) => series.find((s) => s.path === path))
			.filter((s) => s) as Series[]

		return filtered
	},
})

export const populatedSchedule = selector({
	key: 'populatedSchedule',
	get: ({ get }) => {
		const schedule = get(scheduleState)
		const series = get(seriesState)

		const populated: any = {}

		Object.typedKeys(schedule).forEach((day) => {
			populated[day] = schedule[day].map((path) => {
				const anime = series.find((el) => el.path === path)
				return ensureSeries({ ...anime, path })
			})
		})

		return populated as PopulatedSchedule
	},
})

export const todaySchedule = selector({
	key: 'todaySchedule',
	get: ({ get }) => {
		const schedule = get(scheduleState)
		const series = get(seriesState)

		const today = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
			new Date().getDay()
		] as keyof Schedule
		const todaySchedule = schedule[today]

		const populated = todaySchedule.map((path) => {
			const anime = series.find((el) => el.path === path)
			return ensureSeries({ ...anime, path })
		})

		return populated
	},
})
