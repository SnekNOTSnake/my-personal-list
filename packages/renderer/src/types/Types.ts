import { OpenDialogOptions, OpenDialogReturnValue } from 'electron'

declare global {
	interface Window {
		myAPI: MyAPI
	}
}

export type MyAPI = {
	info: string
	showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>
}
