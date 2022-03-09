import Store from 'electron-store'
import { dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import { IPCKey } from '../common/constants'

let initialized = false
const store = new Store<Settings>({
	defaults: { cwd: null, theme: 'light' },
})

/* Events */

const onChangeTheme = (e: IpcMainInvokeEvent, theme: Theme) => {
	store.set('theme', theme)
	return store.get('theme')
}

const onChangeCWD = async (e: IpcMainInvokeEvent) => {
	const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })
	if (!res.canceled) store.set('cwd', res.filePaths[0])

	return res
}

const onGetSettings = (e: IpcMainInvokeEvent): Settings => {
	return store.store
}

/* End of Events */

export const initializeIpcEvents = () => {
	ipcMain.handle(IPCKey.ChangeTheme, onChangeTheme)
	ipcMain.handle(IPCKey.ChangeCWD, onChangeCWD)
	ipcMain.handle(IPCKey.GetSettings, onGetSettings)

	initialized = true
}

export const releaseIpcEvents = () => {
	if (!initialized) return

	ipcMain.removeAllListeners(IPCKey.ChangeTheme)
	ipcMain.removeAllListeners(IPCKey.ChangeCWD)
	ipcMain.removeAllListeners(IPCKey.GetSettings)

	initialized = false
}
