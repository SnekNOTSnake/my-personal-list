import {
	BrowserWindow,
	dialog,
	ipcMain,
	IpcMainInvokeEvent,
	OpenDialogOptions,
} from 'electron'
import { IPCKey } from '../common/constants'

let initialized = false

const onShowOpenDialog = async (
	event: IpcMainInvokeEvent,
	options: OpenDialogOptions,
) => {
	const win = BrowserWindow.fromWebContents(event.sender)
	if (!win) throw new Error('Message sender window does not exist')
	return await dialog.showOpenDialog(win, options)
}

export const initializeIpcEvents = () => {
	ipcMain.handle(IPCKey.ShowOpenDialog, onShowOpenDialog)

	initialized = true
}

export const releaseIpcEvents = () => {
	if (!initialized) return

	ipcMain.removeAllListeners(IPCKey.ShowOpenDialog)

	initialized = false
}
