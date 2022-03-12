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

interface Settings {
	theme: Theme
	cwd: string | null
}

interface Metadata {
	encoder: string
	source: string
	quality: 'bd' | 'dvd' | 'web'
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

	title: string
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

interface Window {
	myAPI: {
		changeTheme: (theme: Theme) => Promise<Theme>
		getSettings: () => Promise<Settings>
		getSeries: () => Promise<Series[]>
		editSeries: (series: Series) => Promise<Series>
		changePoster: (series: Series) => Promise<Series>
		openItem: (fullPath: string) => Promise<void>

		onUpdateSettings: (listener: (newSettings: Settings) => void) => void
	}
}
