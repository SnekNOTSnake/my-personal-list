import path from 'path'
import fs from 'fs/promises'
import Store from 'electron-store'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

import { IPCKey, DATA_FILE, ANIME_DIR } from '../common/constants'
import {
	ensureSeries,
	exists,
	read,
	sanitizeSeries,
	trimSeries,
	write,
} from './util'

/* Events */

export class Events {
	store: Store<Settings>

	constructor(store: Store<Settings>) {
		this.store = store
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

				const isExists = await exists(mplPath)
				if (!isExists) return series.push(ensureSeries({ ...paths }))

				const data = await read(mplPath)
				if (!data) return series.push(ensureSeries({ ...paths }))

				const animeObj: Series = sanitizeSeries(JSON.parse(data.toString()))
				series.push(ensureSeries({ ...paths, ...animeObj }))
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
}

/* End of Events */

let initialized = false
export const store = new Store<Settings>({
	defaults: { cwd: null, theme: 'light' },
})

export const initializeIpcEvents = () => {
	const events = new Events(store)

	ipcMain.handle(IPCKey.ChangeTheme, events.onChangeTheme)
	ipcMain.handle(IPCKey.GetSettings, events.onGetSettings)
	ipcMain.handle(IPCKey.GetSeries, events.onGetSeries)
	ipcMain.handle(IPCKey.EditSeries, events.onEditSeries)

	initialized = true
}

export const releaseIpcEvents = () => {
	if (!initialized) return

	ipcMain.removeAllListeners(IPCKey.ChangeTheme)
	ipcMain.removeAllListeners(IPCKey.GetSettings)
	ipcMain.removeAllListeners(IPCKey.GetSeries)
	ipcMain.removeAllListeners(IPCKey.EditSeries)

	initialized = false
}
