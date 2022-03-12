import path from 'path'
import { dialog, Menu, MenuItemConstructorOptions, shell } from 'electron'
import { IPCKey } from '../common/constants'
import { store } from './ipcEvents'
import { exists } from './util'

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

							store.set('theme', 'light')
							browser.webContents.send(IPCKey.UpdateSettings, store.store)
						},
					},
					{
						label: 'Dark',
						type: 'radio',
						checked: store.get('theme') === 'dark',
						click: (menuItem, browser) => {
							if (!browser) return

							store.set('theme', 'dark')
							browser.webContents.send(IPCKey.UpdateSettings, store.store)
						},
					},
				],
			},
			{
				label: 'Open Data Directory',
				click: () => {
					const cwd = store.get('cwd')
					if (!cwd) return new Notification('Data directory is not set')
					shell.openPath(cwd)
				},
			},
			{
				label: 'Change Data Directory',
				click: async (menuItem, browser) => {
					if (!browser) return
					const res = await dialog.showOpenDialog({
						properties: ['openDirectory'],
					})

					if (!res.canceled) return
					// Make sure the selected has `anime` directory in it
					if (!exists(path.join(res.filePaths[0], 'anime')))
						return new Notification("Data directory must contain 'anime' dir")

					store.set('cwd', res.filePaths[0])

					browser.webContents.send(IPCKey.UpdateSettings, store.store)
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
