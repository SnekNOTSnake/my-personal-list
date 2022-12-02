import { BrowserWindow, dialog } from 'electron'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import { getUpdateAvailableMsg } from './util'

export const initializeUpdater = async (
	store: Store<MyStore>,
	window: BrowserWindow,
) => {
	const lastCheck = store.get('lastUpdateCheck')
	const neverCheckUpdate = store.get('neverCheckUpdate')
	const checked = lastCheck + 24 * 60 * 60 * 1000 >= new Date().getTime()
	if (neverCheckUpdate || checked) return

	const res = await autoUpdater.checkForUpdates()
	store.set('lastUpdateCheck', new Date().getTime())
	if (!res) return

	const answer = await dialog.showMessageBox(window, {
		title: 'Update Available',
		message: getUpdateAvailableMsg(res.updateInfo),
		type: 'question',
		buttons: ['Later', 'Never', 'Now'],
	})

	// close = 0, Later = 0, Never = 1, Now = 2
	switch (answer.response) {
		case 2:
			await autoUpdater.downloadUpdate()
			autoUpdater.quitAndInstall()
			break

		case 1:
			store.set('neverCheckUpdate', true)
			break

		default:
			break
	}
}
