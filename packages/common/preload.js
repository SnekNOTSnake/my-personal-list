const { contextBridge, ipcRenderer } = require('electron')
const { IPCKey } = require('./constants')

contextBridge.exposeInMainWorld('myAPI', {
	info: 'OK',
	showOpenDialog: async (options) => {
		return await ipcRenderer.invoke(IPCKey.ShowOpenDialog, options)
	},
})
