declare module '*.module.css'

interface ObjectConstructor {
	typedKeys<T>(obj: T): Array<keyof T>
}

type InputChange = React.ChangeEvent<HTMLInputElement>
type TextAreaChange = React.ChangeEvent<HTMLTextAreaElement>
type SelectChange = React.ChangeEvent<HTMLSelectElement>
type InputKeyPress = React.KeyboardEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

type Theme = 'light' | 'dark'

interface Schedule {
	sun: string[]
	mon: string[]
	tue: string[]
	wed: string[]
	thu: string[]
	fri: string[]
	sat: string[]
}

interface PopulatedSchedule {
	sun: Series[]
	mon: Series[]
	tue: Series[]
	wed: Series[]
	thu: Series[]
	fri: Series[]
	sat: Series[]
}

interface Settings {
	theme: Theme
	cwd: string | null
	lastPosterPath: string
}

interface Metadata {
	encoder: string
	source: string
	quality: 'unknown' | 'bd' | 'dvd' | 'web'
	res: number
	duration: number
	video: string
	audio: string
	subtitle: string
}

interface Series extends Metadata {
	path: string
	fullPath: string
	files: string[]

	jpTitle: string
	poster: string
	regular: boolean
	tags: string[]

	epsNum: number
	epsWatched: number
	rewatchCount: number

	notes: string
	related: Relation[]
}

interface Relation {
	path: string
	type:
		| 'sequel'
		| 'prequel'
		| 'side-story'
		| 'spin-off'
		| 'parent'
		| 'summary'
		| 'alternative-version'
}

type NumOperators = 'gte' | 'lte'
type NumFilter = {
	value: number
	operator: NumOperators
}

type StrOperators = 'normal' | 'regexp'
type StrFilter = {
	value: string
	operator: StrOperators
}

type OrderOperators = 'asc' | 'desc'
type Order = {
	value: 'relevance' | 'title' | 'resolution' | 'epsNum'
	operator: OrderOperators
}

interface AdvFilter {
	regular: 'any' | 'regular' | 'irregular'
	epsNum: NumFilter
	epsWatched: NumFilter
	rewatchCount: NumFilter
	encoder: StrFilter
	source: StrFilter
	quality: StrFilter
	res: NumFilter
	video: StrFilter
	audio: StrFilter
	subtitle: StrFilter
	notes: StrFilter
	order: Order
}

interface Window {
	myAPI: {
		changeTheme: (theme: Theme) => Promise<Settings>
		getSettings: () => Promise<Settings>
		getSeries: () => Promise<Series[]>
		editSeries: (series: Series) => Promise<Series>
		changePoster: (series: Series) => Promise<Series>
		openItem: (fullPath: string) => Promise<void>
		getSchedule: () => Schedule
		changeSchedule: (schedule: Schedule) => Promise<Schedule>

		onUpdateSettings: (listener: (newSettings: Settings) => void) => void
	}
}
