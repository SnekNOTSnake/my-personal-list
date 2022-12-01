import { app } from 'electron'
import Store from 'electron-store'

import { initializeIpcEvents } from './ipcEvents'
import { createMainMenu } from './menu'
import { initializeUpdater } from './updater'
import { createMainWindow, win } from './windowManager'

const store = new Store<MyStore>({
	defaults: {
		cwd: null,
		theme: 'light',
		lastPosterPath: app ? app.getPath('home') : '/',
		lastUpdateCheck: 0,
		neverCheckUpdate: false,
	},
})

app.on('ready', async () => {
	createMainWindow()
	createMainMenu(store)
	initializeIpcEvents(store)
	initializeUpdater(store)

	// Install React Extension if in dev mode
	if (!app.isPackaged) {
		const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import(
			'electron-devtools-installer'
		)
		installExtension(REACT_DEVELOPER_TOOLS)
	}

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win === null) createMainWindow()
	})
})

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') app.quit()
})
