import { contextBridge, ipcRenderer as ipc } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	changeTheme: (theme: Theme) => ipc.invoke(IPCKey.ChangeTheme, theme),
	getSettings: () => ipc.invoke(IPCKey.GetSettings),
	getSeries: () => ipc.invoke(IPCKey.GetSeries),

	onUpdateSettings: (listener: (newSettings: Settings) => void) =>
		ipc.on(IPCKey.UpdateSettings, (e, settings) => listener(settings)),
})
