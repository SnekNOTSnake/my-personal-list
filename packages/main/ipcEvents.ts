import path from 'path'
import fs from 'fs/promises'
import Store from 'electron-store'
import { Dialog, dialog, ipcMain, IpcMainInvokeEvent, shell } from 'electron'

import { IPCKey, DATA_FILE, ANIME_DIR, POSTER_DIR } from '../common/constants'
import {
	ensureSeries,
	exists,
	read,
	sanitizeSeries,
	trimSeries,
	write,
} from './util'
import { nanoid } from 'nanoid'

/* Events */

export class Events {
	store: Store<Settings>
	dialog: Dialog

	constructor(store: Store<Settings>, dialog: Dialog) {
		this.store = store
		this.dialog = dialog
	}

	onChangeTheme = (e: IpcMainInvokeEvent, theme: Theme) => {
		this.store.set('theme', theme)
		return this.store.get('theme')
	}

	onGetSettings = (e: IpcMainInvokeEvent): Settings => {
		return this.store.store
	}

	onGetSeries = async (e: IpcMainInvokeEvent): Promise<Series[]> => {
		const cwd = this.store.get('cwd')
		if (!cwd) return []
		const ANIME = path.join(cwd, ANIME_DIR)

		const items = await fs.readdir(ANIME, { withFileTypes: true })
		const dirs = items.filter((item) => item.isDirectory())
		const series: Series[] = []

		await Promise.all(
			dirs.map(async (dir) => {
				const mplPath = path.join(ANIME, dir.name, DATA_FILE)
				const paths = {
					path: dir.name,
					fullPath: path.join(ANIME, dir.name),
				}

				const items = await fs.readdir(paths.fullPath, { withFileTypes: true })
				const files = items.filter((el) => el.isFile()).map((el) => el.name)

				const isExists = await exists(mplPath)
				if (!isExists) return series.push(ensureSeries({ ...paths, files }))

				const data = await read(mplPath)
				if (!data) return series.push(ensureSeries({ ...paths, files }))

				const animeObj: Series = sanitizeSeries(JSON.parse(data.toString()))
				series.push(ensureSeries({ ...paths, ...animeObj, files }))
			}),
		)

		return series
	}

	onEditSeries = async (
		e: IpcMainInvokeEvent,
		series: Series,
	): Promise<Series> => {
		const sanitized = sanitizeSeries(series)
		const trimmed = trimSeries(sanitized)

		await write(path.join(series.fullPath, DATA_FILE), JSON.stringify(trimmed))

		return trimmed
	}

	onChangePoster = async (
		e: IpcMainInvokeEvent,
		series: Series,
	): Promise<Series> => {
		const cwd = this.store.get('cwd')
		if (!cwd) return series
		const POSTER = path.join(cwd, POSTER_DIR)
		const posterDirExists = await exists(POSTER)
		if (!posterDirExists) fs.mkdir(POSTER)

		const isExists = await exists(series.fullPath)
		if (!isExists) return series

		const result = await this.dialog.showOpenDialog({
			properties: ['openFile'],
			filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
		})
		if (result.canceled) return series

		const filenameParts = result.filePaths[0].split('.')
		const ext = filenameParts[filenameParts.length - 1]
		const filename = `${nanoid()}.${ext}`
		fs.copyFile(result.filePaths[0], path.join(POSTER, filename))

		const newSeries = { ...series, poster: filename }
		await this.onEditSeries(e, newSeries)

		return newSeries
	}

	onOpenItem = async (
		e: IpcMainInvokeEvent,
		fullPath: string,
	): Promise<void> => {
		shell.openExternal(`file://${fullPath}`)
	}
}

/* End of Events */

let initialized = false
export const store = new Store<Settings>({
	defaults: { cwd: null, theme: 'light' },
})

export const initializeIpcEvents = () => {
	const events = new Events(store, dialog)

	ipcMain.handle(IPCKey.ChangeTheme, events.onChangeTheme)
	ipcMain.handle(IPCKey.GetSettings, events.onGetSettings)
	ipcMain.handle(IPCKey.GetSeries, events.onGetSeries)
	ipcMain.handle(IPCKey.EditSeries, events.onEditSeries)
	ipcMain.handle(IPCKey.ChangePoster, events.onChangePoster)
	ipcMain.handle(IPCKey.OpenItem, events.onOpenItem)

	initialized = true
}

export const releaseIpcEvents = () => {
	if (!initialized) return

	ipcMain.removeAllListeners(IPCKey.ChangeTheme)
	ipcMain.removeAllListeners(IPCKey.GetSettings)
	ipcMain.removeAllListeners(IPCKey.GetSeries)
	ipcMain.removeAllListeners(IPCKey.EditSeries)
	ipcMain.removeAllListeners(IPCKey.ChangePoster)
	ipcMain.removeAllListeners(IPCKey.OpenItem)

	initialized = false
}
