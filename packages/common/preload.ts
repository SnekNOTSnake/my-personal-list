import { contextBridge, ipcRenderer as ipc } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	changeTheme: (theme: Theme) => ipc.invoke(IPCKey.ChangeTheme, theme),
	getSettings: () => ipc.invoke(IPCKey.GetSettings),
	getSeries: () => ipc.invoke(IPCKey.GetSeries),
	editSeries: (series: Series) => ipc.invoke(IPCKey.EditSeries, series),
	changePoster: (series: Series) => ipc.invoke(IPCKey.ChangePoster, series),
	openItem: (fPath: string) => ipc.invoke(IPCKey.OpenItem, fPath),

	onUpdateSettings: (listener: (newSettings: Settings) => void) => {
		// ipc.invoke(IPCKey.ChangeTheme, theme)
		ipc.on(IPCKey.UpdateSettings, (e, settings) => listener(settings))
	},
})

// Unexposed Menu-Main communications
ipc.on(IPCKey.RemoveUnusedPosters, () => ipc.invoke(IPCKey.RemoveUnusedPosters))
