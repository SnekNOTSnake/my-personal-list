import path from 'path'
import fs from 'fs/promises'
import Store from 'electron-store'
import {
	Dialog,
	dialog,
	ipcMain,
	IpcMainInvokeEvent,
	shell,
	Notification,
} from 'electron'
import { nanoid } from 'nanoid'
import { autoUpdater } from 'electron-updater'

import {
	IPCKey,
	DATA_FILE,
	ANIME_DIR,
	POSTER_DIR,
	SCHEDULE_FILE,
} from '../common/constants'
import {
	ensureSchedule,
	ensureSeries,
	exists,
	getUpdateAvailableMsg,
	read,
	sanitizeSchedule,
	sanitizeSeries,
	write,
} from './util'

/* Events */

export class Events {
	store: Store<MyStore>
	dialog: Dialog

	constructor(store: Store<MyStore>, dialog: Dialog) {
		this.store = store
		this.dialog = dialog
	}

	onChangeTheme = (e: IpcMainInvokeEvent, theme: Theme) => {
		this.store.set('theme', theme)
		return this.store.store
	}

	onGetSettings = (e: IpcMainInvokeEvent): MyStore => {
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
		// const trimmed = trimSeries(sanitized)

		await write(
			path.join(series.fullPath, DATA_FILE),
			JSON.stringify(sanitized),
		)

		return sanitized
	}

	onChangePoster = async (
		e: IpcMainInvokeEvent,
		series: Series,
	): Promise<Series> => {
		const cwd = this.store.get('cwd')
		if (!cwd) return series
		const POSTER = path.join(cwd, POSTER_DIR)
		const posterDirExists = await exists(POSTER)
		if (!posterDirExists) await fs.mkdir(POSTER)

		const isExists = await exists(series.fullPath)
		if (!isExists) return series

		const result = await this.dialog.showOpenDialog({
			properties: ['openFile'],
			filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
			defaultPath: this.store.get('lastPosterPath'),
		})
		if (result.canceled) return series

		const filePath = result.filePaths[0]
		const filenameParts = filePath.split('.')
		const ext = filenameParts[filenameParts.length - 1]
		const filename = `${nanoid()}.${ext}`

		await fs.copyFile(filePath, path.join(POSTER, filename))

		const newSeries = { ...series, poster: filename }
		await this.onEditSeries(e, newSeries)

		this.store.set('lastPosterPath', filePath)
		return newSeries
	}

	onOpenItem = async (
		e: IpcMainInvokeEvent,
		fullPath: string,
	): Promise<void> => {
		shell.openExternal(`file://${fullPath}`)
	}

	onRemoveUnusedPosters = async (e: IpcMainInvokeEvent): Promise<void> => {
		const cwd = this.store.get('cwd')
		if (!cwd) return

		const series = await this.onGetSeries(e)
		const POSTER = path.join(cwd, POSTER_DIR)

		const files = await fs.readdir(POSTER, { withFileTypes: true })
		const filesToDelete = files.filter((file) => {
			if (!file.isFile()) return false
			return series.every((el) => el.poster !== file.name)
		})

		await Promise.all(
			filesToDelete.map(async (file) => {
				const fullPath = path.join(POSTER, file.name)
				await fs.rm(fullPath)
			}),
		)
	}

	onOpenDataDir = () => {
		const cwd = this.store.get('cwd')
		if (!cwd)
			return new Notification({
				title: 'Error Opening Data Directory',
				body: 'Data directory is not set',
			})

		shell.openPath(cwd)
	}

	onChangeDataDir = async (): Promise<MyStore> => {
		const res = await dialog.showOpenDialog({
			properties: ['openDirectory'],
		})

		if (res.canceled) return this.store.store
		// Make sure the selected has `anime` directory in it
		const dirExists = await exists(path.join(res.filePaths[0], 'anime'))
		if (!dirExists) {
			new Notification({
				title: 'Error Changing Data Directory',
				body: "Data directory must contain 'anime' dir",
				urgency: 'critical',
			}).show()
			return this.store.store
		}

		this.store.set('cwd', res.filePaths[0])
		return this.store.store
	}

	onGetSchedule = async (e: IpcMainInvokeEvent): Promise<Schedule> => {
		const defaultSchedule = ensureSchedule()
		const cwd = this.store.get('cwd')
		if (!cwd) return defaultSchedule
		const SCHEDULE = path.join(cwd, SCHEDULE_FILE)

		const result = await read(SCHEDULE)
		if (!result) return defaultSchedule
		const data = ensureSchedule(JSON.parse(result.toString()))

		return sanitizeSchedule(data)
	}

	onChangeSchedule = async (
		e: IpcMainInvokeEvent,
		schedule: Schedule,
	): Promise<Schedule> => {
		const cwd = this.store.get('cwd')
		if (!cwd) return ensureSchedule()

		const SCHEDULE = path.join(cwd, SCHEDULE_FILE)
		const sanitized = sanitizeSchedule(schedule)

		await write(SCHEDULE, JSON.stringify(sanitized))

		return sanitized
	}

	onCheckForUpdate = async (e: IpcMainInvokeEvent) => {
		const res = await autoUpdater.checkForUpdates()
		if (!res) return alert('No new update')

		const update = confirm(getUpdateAvailableMsg(res.updateInfo))
		if (!update) return

		await autoUpdater.downloadUpdate()
		autoUpdater.quitAndInstall()
	}
}

/* End of Events */

let initialized = false

export const initializeIpcEvents = (store: Store<MyStore>) => {
	const events = new Events(store, dialog)

	ipcMain.handle(IPCKey.ChangeTheme, events.onChangeTheme)
	ipcMain.handle(IPCKey.GetSettings, events.onGetSettings)
	ipcMain.handle(IPCKey.GetSeries, events.onGetSeries)
	ipcMain.handle(IPCKey.EditSeries, events.onEditSeries)
	ipcMain.handle(IPCKey.ChangePoster, events.onChangePoster)
	ipcMain.handle(IPCKey.OpenItem, events.onOpenItem)
	ipcMain.handle(IPCKey.RemoveUnusedPosters, events.onRemoveUnusedPosters)
	ipcMain.handle(IPCKey.OpenDataDir, events.onOpenDataDir)
	ipcMain.handle(IPCKey.ChangeDataDir, events.onChangeDataDir)
	ipcMain.handle(IPCKey.GetSchedule, events.onGetSchedule)
	ipcMain.handle(IPCKey.ChangeSchedule, events.onChangeSchedule)
	ipcMain.handle(IPCKey.CheckForUpdate, events.onCheckForUpdate)

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
	ipcMain.removeAllListeners(IPCKey.OpenDataDir)
	ipcMain.removeAllListeners(IPCKey.ChangeDataDir)
	ipcMain.removeAllListeners(IPCKey.GetSchedule)
	ipcMain.removeAllListeners(IPCKey.ChangeSchedule)
	ipcMain.removeAllListeners(IPCKey.CheckForUpdate)

	initialized = false
}
