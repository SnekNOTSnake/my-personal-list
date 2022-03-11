import path from 'path'
import fs from 'fs/promises'
import Store from 'electron-store'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

import { IPCKey, DATA_FILE_NAME } from '../common/constants'
import { ensureSeries, exists, read, sanitizeSeries, write } from './util'

let initialized = false
export const store = new Store<Settings>({
	defaults: { cwd: null, theme: 'light' },
})

/* Events */

const onChangeTheme = (e: IpcMainInvokeEvent, theme: Theme) => {
	store.set('theme', theme)
	return store.get('theme')
}

const onGetSettings = (e: IpcMainInvokeEvent): Settings => {
	return store.store
}

const onGetSeries = async (e: IpcMainInvokeEvent): Promise<Series[]> => {
	const cwd = store.get('cwd')
	if (!cwd) return []

	const items = await fs.readdir(cwd, { withFileTypes: true })
	const dirs = items.filter((item) => item.isDirectory())
	const series: Series[] = []

	await Promise.all(
		dirs.map(async (dir) => {
			const mplPath = path.join(cwd, dir.name, DATA_FILE_NAME)
			const paths = {
				path: dir.name,
				fullPath: path.join(cwd, dir.name),
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

const onEditSeries = async (
	e: IpcMainInvokeEvent,
	series: Series,
): Promise<Series> => {
	await write(
		path.join(series.fullPath, DATA_FILE_NAME),
		JSON.stringify(sanitizeSeries(series)),
	)

	return series
}

/* End of Events */

export const initializeIpcEvents = () => {
	ipcMain.handle(IPCKey.ChangeTheme, onChangeTheme)
	ipcMain.handle(IPCKey.GetSettings, onGetSettings)
	ipcMain.handle(IPCKey.GetSeries, onGetSeries)
	ipcMain.handle(IPCKey.EditSeries, onEditSeries)

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
