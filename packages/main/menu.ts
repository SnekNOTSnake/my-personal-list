import { Menu, MenuItemConstructorOptions } from 'electron'
import { IPCKey } from '../common/constants'
import { store } from './ipcEvents'

const createTemplate = (): MenuItemConstructorOptions[] => [
	{
		label: 'MyPersonalList',
		submenu: [
			{ label: 'About MyPersonalList' },
			{ type: 'separator' },
			{
				label: 'Theme',
				submenu: [
					{
						label: 'Light',
						type: 'radio',
						checked: store.get('theme') === 'light',
						click: (menuItem, browser) => {
							if (!browser) return
							browser.webContents.send(IPCKey.ChangeTheme, 'light')
						},
					},
					{
						label: 'Dark',
						type: 'radio',
						checked: store.get('theme') === 'dark',
						click: (menuItem, browser) => {
							if (!browser) return
							browser.webContents.send(IPCKey.ChangeTheme, 'dark')
						},
					},
				],
			},
			{
				label: 'Open Data Directory',
				click: (menuItem, browser) => {
					if (!browser) return
					browser.webContents.send(IPCKey.OpenDataDir)
				},
			},
			{
				label: 'Change Data Directory',
				click: async (menuItem, browser) => {
					if (!browser) return
					browser.webContents.send(IPCKey.ChangeDataDir)
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
