import { contextBridge, ipcRenderer as ipc } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	changeTheme: (theme: Theme) => ipc.invoke(IPCKey.ChangeTheme, theme),
	getSettings: () => ipc.invoke(IPCKey.GetSettings),
	getSeries: () => ipc.invoke(IPCKey.GetSeries),
	editSeries: (series: Series) => ipc.invoke(IPCKey.EditSeries, series),
	changePoster: (series: Series) => ipc.invoke(IPCKey.ChangePoster, series),
	openInExplorer: (fPath: string) => ipc.invoke(IPCKey.OpenInExplorer, fPath),

	onUpdateSettings: (listener: (newSettings: Settings) => void) =>
		ipc.on(IPCKey.UpdateSettings, (e, settings) => listener(settings)),
})
