declare module '*.module.css'

type InputChange = React.ChangeEvent<HTMLInputElement>
type TextAreaChange = React.ChangeEvent<HTMLTextAreaElement>
type SelectChange = React.ChangeEvent<HTMLSelectElement>
type InputKeyPress = React.KeyboardEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

interface Settings {
	episodeTreshold: number
	dataDir: string | null
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
	id: string
	title: string
	tags: string[]
	epsNum: number
	epsWatched: number
	rewatchCount: number
	suspended: boolean
	notes: string
	related: Relation[]
}

interface Relation {
	id: string
	type:
		| 'sequel'
		| 'prequel'
		| 'side-story'
		| 'spin-off'
		| 'parent'
		| 'summary'
		| 'alternative-version'
}
