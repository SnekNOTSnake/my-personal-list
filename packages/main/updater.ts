import { BrowserWindow, dialog } from 'electron'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import { getUpdateAvailableMsg } from './util'

export const initializeUpdater = async (
	store: Store<MyStore>,
	window: BrowserWindow,
) => {
	// Make all of the below listeners only apply in here
	autoUpdater.removeAllListeners()

	autoUpdater.on('update-available', async (info) => {
		const answer = await dialog.showMessageBox(window, {
			title: 'Update Available',
			message: getUpdateAvailableMsg(info),
			type: 'question',
			buttons: ['Tomorrow', 'Never', 'Update'],
		})

		// close = 0, Tomorrow = 0, Never = 1, Update = 2
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
	})

	autoUpdater.autoDownload = false

	const lastCheck = store.get('lastUpdateCheck')
	const neverCheckUpdate = store.get('neverCheckUpdate')
	const checked = lastCheck + 24 * 60 * 60 * 1000 >= new Date().getTime()
	if (neverCheckUpdate || checked) return

	await autoUpdater.checkForUpdates()
	store.set('lastUpdateCheck', new Date().getTime())
}
