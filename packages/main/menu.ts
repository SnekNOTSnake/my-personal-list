import { Menu, MenuItemConstructorOptions } from 'electron'
import { IPCKey } from '../common/constants'

const createTemplate = (): MenuItemConstructorOptions[] => [
	{
		label: 'MyPersonalList',
		submenu: [
			{
				label: 'About My Personal List',
				click: (menuItem, browser) => {
					if (!browser) return
					browser.webContents.send(IPCKey.GetAboutMPL)
				},
			},
			{
				label: 'Check For Updates',
				click: (menuItem, browser) => {
					if (!browser) return
					browser.webContents.send(IPCKey.CheckForUpdate)
				},
			},
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

export const createMainMenu = () => {
	const template = Menu.buildFromTemplate(createTemplate())
	Menu.setApplicationMenu(template)
}
