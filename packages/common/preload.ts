import { contextBridge, ipcRenderer, OpenDialogOptions } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	info: 'OK',
	showOpenDialog: async (options: OpenDialogOptions) => {
		return await ipcRenderer.invoke(IPCKey.ShowOpenDialog, options)
	},
})
