import { atom, selector } from 'recoil'
import fuzzysort from 'fuzzysort'

Object.typedKeys = Object.keys as any

window.myAPI.getSeries().then((val) => console.log(val))
type OrderBy = 'relevance' | 'title' | 'duration' | 'resolution' | 'epsNum'

export const seriesState = atom({
	key: 'series',
	default: window.myAPI.getSeries(),
})

export const scheduleState = atom({
	key: 'schedule',
	default: window.myAPI.getSchedule(),
})

export const seriesFilter = atom({
	key: 'seriesFilter',
	default: {
		query: '',
		order: {
			descending: false,
			by: 'title' as OrderBy,
		},
		tags: {
			active: [] as string[],
			deactive: [] as string[],
		},
	},
})

export const seriesStats = selector({
	key: 'seriesStats',
	get: ({ get }) => {
		const series = get(seriesState)
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
			name: 'untagged',
			count: untaggeds.length,
			epsNum: untaggeds.map((el) => el.epsNum).reduce((p, c) => p + c, 0),
			epsWatched: untaggeds
				.map((el) => el.epsWatched)
				.reduce((p, c) => p + c, 0),
		})

		const stats = {
			tags,
			watchedEpisodes: series
				.filter((el) => el.regular)
				.map((el) => el.epsWatched)
				.reduce((p, c) => p + c, 0),
			totalEpisodes: series
				.filter((el) => el.regular)
				.map((el) => el.epsNum)
				.reduce((p, c) => p + c, 0),
		}

		return stats
	},
})

export const filteredSeries = selector({
	key: 'filteredSeries',
	get: ({ get }) => {
		const series = get(seriesState)
		const filter = get(seriesFilter)

		let filtered
		if (filter.tags.active.includes('untagged')) {
			filtered = series.filter((el) => el.tags.length === 0)
		} else if (filter.tags.deactive.includes('untagged')) {
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

		let orderBy = filter.order.by as OrderBy
		let searched: Series[] = filtered
		if (filter.query) {
			const results = fuzzysort.go(filter.query, filtered, { keys: ['title'] })
			const sorted = [...results]
			sorted.sort((a, b) => {
				if (a.score !== b.score) return b.score - a.score
				return b.obj.title.localeCompare(a.obj.title)
			})

			orderBy = 'relevance'
			searched = sorted.map((el) => el.obj)
		}

		let ordered = searched
		switch (orderBy) {
			case 'relevance':
				break

			case 'title':
				ordered.sort((a, b) =>
					filter.order.descending
						? b.title
							? b.title.localeCompare(a.title)
							: b.path.localeCompare(a.path)
						: a.title
						? a.title.localeCompare(b.title)
						: a.path.localeCompare(b.path),
				)
				break

			case 'duration':
				ordered.sort((a, b) =>
					filter.order.descending
						? b.duration - a.duration
						: a.duration - b.duration,
				)
				break

			case 'epsNum':
				ordered.sort((a, b) =>
					filter.order.descending ? b.epsNum - a.epsNum : a.epsNum - b.epsNum,
				)
				break

			case 'resolution':
				ordered.sort((a, b) =>
					filter.order.descending ? b.res - a.res : a.res - b.res,
				)
				break

			default:
				break
		}

		return ordered
	},
})

export const populatedSchedule = selector({
	key: 'populatedSchedule',
	get: ({ get }) => {
		const schedule = get(scheduleState)
		const series = get(seriesState)

		const populated: any = {}

		Object.typedKeys(schedule).forEach((day) => {
			populated[day] = schedule[day].map((path) =>
				series.find((el) => el.path === path),
			)
		})

		return populated as {
			sun: Series[]
			mon: Series[]
			tue: Series[]
			wed: Series[]
			thu: Series[]
			fri: Series[]
			sat: Series[]
		}
	},
})
