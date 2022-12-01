import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import { getUpdateAvailableMsg } from './util'

export const initializeUpdater = async (store: Store<MyStore>) => {
	const lastCheck = store.get('lastUpdateCheck')
	const neverCheckUpdate = store.get('neverCheckUpdate')
	const checked = lastCheck <= new Date().getTime() + 24 * 60 * 60 * 1000
	if (neverCheckUpdate || checked) return

	const res = await autoUpdater.checkForUpdates()
	store.set('lastUpdateCheck', new Date().getTime())
	if (!res) return

	const answer = prompt(
		getUpdateAvailableMsg(res.updateInfo),
		'Answer with "now" for update now, "never" for never, or ignore it for ask again tomorrow.',
	)

	switch (answer) {
		case 'now':
			await autoUpdater.downloadUpdate()
			autoUpdater.quitAndInstall()
			break

		case 'never':
			store.set('neverCheckUpdate', true)
			break

		default:
			break
	}
}
