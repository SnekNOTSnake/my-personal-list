import { app, BrowserWindow, shell } from 'electron'
import path from 'path'
import { resolveHtmlPath } from './util'

export let win: BrowserWindow | null = null

export const createMainWindow = () => {
	const RESOURCE_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCE_PATH, ...paths)
	}

	win = new BrowserWindow({
		show: false,
		width: 1280,
		height: 720,
		icon: getAssetPath('icon.png'),
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.resolve(__dirname, '../common/preload.js'),
		},
	})

	win.loadURL(resolveHtmlPath('index.html'))

	win.on('ready-to-show', () => {
		if (!win) throw new Error('"mainWindow" is not defined')

		if (process.env.START_MINIMIZED) win.minimize()
		else win.show()
	})

	win.on('closed', () => (win = null))

	// Open URLs in the user's browser
	win.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	return win
}
