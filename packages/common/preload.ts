import {
	contextBridge,
	ipcRenderer,
	OpenDialogOptions,
	OpenDialogReturnValue,
} from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	info: 'OK',
	showOpenDialog: async (
		options: OpenDialogOptions,
	): Promise<OpenDialogReturnValue> => {
		return await ipcRenderer.invoke(IPCKey.ShowOpenDialog, options)
	},
})
