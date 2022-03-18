export const defSeries: Series = {
	path: '[Not Found]',
	fullPath: '',
	files: [],

	title: '[Not Found]',
	poster: '',
	regular: false,
	tags: [],

	epsNum: 0,
	epsWatched: 0,
	rewatchCount: 0,

	audio: '',
	video: '',
	quality: 'unknown',
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

export const ensureSeries = (series?: Partial<Series>) => {
	const anime = { ...defSeries, ...series }
	anime.related = anime.related.map((el) => ({ ...defRelated, ...el }))
	return anime
}
