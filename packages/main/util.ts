import path from 'path'
import fs from 'fs/promises'
import { constants } from 'fs'

Object.typedKeys = Object.keys as any

const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000

export const defSeries: Series = {
	path: '',
	fullPath: '',
	title: '',
	poster: '',
	regular: false,
	tags: [],

	epsNum: 0,
	epsWatched: 0,
	rewatchCount: 0,

	audio: '',
	video: '',
	quality: 'bd',
	duration: 0,
	encoder: '',
	res: 0,
	source: '',
	subtitle: '',

	notes: '',
	related: [],
}

const defRelated: Relation = {
	path: '',
	type: 'sequel',
}

export const resolveHtmlPath = (
	htmlFileName: string,
	app: Electron.App,
): string => {
	if (isProd || app.isPackaged)
		return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
	else return new URL(`http://localhost:${PORT}`).href
}

export const exists = async (filePath: string) => {
	try {
		await fs.access(filePath, constants.F_OK)
		return true
	} catch (err) {
		return false
	}
}

export const read = async (filePath: string) => {
	try {
		const result = await fs.readFile(filePath)
		return result
	} catch (err) {
		return false
	}
}

export const write = async (filePath: string, content: string) => {
	try {
		await fs.writeFile(filePath, content)
		return true
	} catch (err) {
		return false
	}
}

export const ensureSeries = (series?: Partial<Series>) => {
	const anime = { ...defSeries, ...series }
	anime.related = anime.related.map((el) => ({ ...defRelated, ...el }))
	return anime
}

export const sanitizeSeries = (series: Series): Series => {
	const newSeries: any = {}
	const blackListProperties = ['path', 'fullPath']

	Object.typedKeys(defSeries).forEach((key) => {
		if (key in series && !blackListProperties.includes(key))
			newSeries[key] = series[key as keyof Series]
	})

	return newSeries
}

export const trimSeries = (series: Series) => {
	const trimmed = {} as any

	Object.typedKeys(series).forEach((key) => {
		if (typeof series[key] === 'string')
			trimmed[key] = (series[key] as string).replace(/\s+/g, ' ').trim()
	})

	return { ...series, ...trimmed }
}
