import { Menu, MenuItemConstructorOptions } from 'electron'
import Store from 'electron-store'

import { IPCKey } from '../common/constants'

const createTemplate = (
	store: Store<MyStore>,
): MenuItemConstructorOptions[] => [
	{
		label: 'MyPersonalList',
		submenu: [
			{ label: 'About My Personal List' },
			{
				label: 'Check For Updates',
				click: (menuItem, browser) => {
					if (!browser) return
					browser.webContents.send(IPCKey.CheckForUpdate)
				},
			},
			{ type: 'separator' },
			{
				label: 'Remove Unused Posters',
				click: (menuItem, browser) => {
					if (!browser) return
					browser.webContents.send(IPCKey.RemoveUnusedPosters)
				},
			},
			{ type: 'separator' },
			{ role: 'quit' },
		],
	},
	{
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'pasteAndMatchStyle' },
			{ role: 'delete' },
			{ role: 'selectAll' },
		],
	},
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' },
		],
	},
	{
		role: 'window',
		submenu: [{ role: 'minimize' }, { role: 'close' }],
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click() {
					require('electron').shell.openExternal('https://electronjs.org')
				},
			},
		],
	},
]

export const createMainMenu = (store: Store<MyStore>) => {
	const template = Menu.buildFromTemplate(createTemplate(store))
	Menu.setApplicationMenu(template)
}
