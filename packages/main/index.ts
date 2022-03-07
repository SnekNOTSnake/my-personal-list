import { app } from 'electron'
import installExtension, {
	REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'

import { initializeIpcEvents } from './ipcEvents'
import { createMainWindow, win } from './windowManager'

app.on('ready', () => {
	createMainWindow()
	initializeIpcEvents()
	installExtension(REACT_DEVELOPER_TOOLS)

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
