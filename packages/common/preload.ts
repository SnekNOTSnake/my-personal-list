import { contextBridge, ipcRenderer as ipc } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	changeTheme: (theme: Theme) => ipc.invoke(IPCKey.ChangeTheme, theme),
	getSettings: () => ipc.invoke(IPCKey.GetSettings),
	getSeries: () => ipc.invoke(IPCKey.GetSeries),
	editSeries: (series: Series) => ipc.invoke(IPCKey.EditSeries, series),
	changePoster: (series: Series) => ipc.invoke(IPCKey.ChangePoster, series),
	openItem: (fPath: string) => ipc.invoke(IPCKey.OpenItem, fPath),
	getSchedule: () => ipc.invoke(IPCKey.GetSchedule),
	changeSchedule: (schedule: Partial<Schedule>) =>
		ipc.invoke(IPCKey.ChangeSchedule, schedule),

	// Settings subscription
	onUpdateSettings: (listener: (newSettings: MyStore) => void) => {
		ipc.on(IPCKey.ChangeTheme, async (e, theme) => {
			const settings = await ipc.invoke(IPCKey.ChangeTheme, theme)
			listener(settings)
		})

		ipc.on(IPCKey.ChangeDataDir, async (e) => {
			const settings = await ipc.invoke(IPCKey.ChangeDataDir)
			listener(settings)
		})
	},
})

// Menu-Main communications
ipc.on(IPCKey.RemoveUnusedPosters, () => ipc.invoke(IPCKey.RemoveUnusedPosters))
ipc.on(IPCKey.OpenDataDir, () => ipc.invoke(IPCKey.OpenDataDir))
ipc.on(IPCKey.CheckForUpdate, () => ipc.invoke(IPCKey.CheckForUpdate))
