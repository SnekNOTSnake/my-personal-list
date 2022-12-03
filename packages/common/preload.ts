import { contextBridge, ipcRenderer as ipc } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	selectDirectory: () => ipc.invoke(IPCKey.SelectDirectory),
	getSettings: () => ipc.invoke(IPCKey.GetSettings),
	setSettings: (settings: MyStore) => ipc.invoke(IPCKey.SetSettings, settings),
	getSeries: () => ipc.invoke(IPCKey.GetSeries),
	editSeries: (series: Series) => ipc.invoke(IPCKey.EditSeries, series),
	changePoster: (series: Series) => ipc.invoke(IPCKey.ChangePoster, series),
	openItem: (fPath: string) => ipc.invoke(IPCKey.OpenItem, fPath),
	getSchedule: () => ipc.invoke(IPCKey.GetSchedule),
	changeSchedule: (schedule: Partial<Schedule>) =>
		ipc.invoke(IPCKey.ChangeSchedule, schedule),
})

// Menu-Main communications
ipc.on(IPCKey.RemoveUnusedPosters, () => ipc.invoke(IPCKey.RemoveUnusedPosters))
ipc.on(IPCKey.OpenDataDir, () => ipc.invoke(IPCKey.OpenDataDir))
ipc.on(IPCKey.CheckForUpdate, () => ipc.invoke(IPCKey.CheckForUpdate))
