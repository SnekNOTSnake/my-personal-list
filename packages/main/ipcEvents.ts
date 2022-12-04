import path from 'path'
import fs from 'fs/promises'
import Store from 'electron-store'
import {
	Dialog,
	dialog,
	ipcMain,
	IpcMainInvokeEvent,
	shell,
	BrowserWindow,
	app,
	App,
} from 'electron'
import { nanoid } from 'nanoid'
import { autoUpdater } from 'electron-updater'

import {
	IPCKey,
	DATA_FILE,
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
	app: App

	constructor(store: Store<MyStore>, dialog: Dialog, app: App) {
		this.store = store
		this.dialog = dialog
		this.app = app
	}

	onSelectDirectory = async (e: IpcMainInvokeEvent): Promise<string> => {
		const res = await this.dialog.showOpenDialog({
			properties: ['openDirectory'],
		})

		if (res.canceled) return ''
		return res.filePaths[0]
	}

	onGetUserDataDir = (): string => this.app.getPath('userData')

	onGetSettings = (e: IpcMainInvokeEvent): MyStore => {
		return this.store.store
	}

	onSetSettings = (e: IpcMainInvokeEvent, settings: MyStore) => {
		this.store.set(settings)
		return this.store.store
	}

	onGetSeries = async (e: IpcMainInvokeEvent): Promise<Series[]> => {
		const cwds = this.store.get('cwds')
		const series: Series[] = []

		await Promise.all(
			cwds.map(async (cwd) => {
				const items = await fs.readdir(cwd.path, { withFileTypes: true })
				const dirs = items.filter((item) => item.isDirectory())

				await Promise.all(
					dirs.map(async (dir) => {
						const mplPath = path.join(cwd.path, dir.name, DATA_FILE)
						const paths = {
							path: dir.name,
							fullPath: path.join(cwd.path, dir.name),
						}

						const items = await fs.readdir(paths.fullPath, {
							withFileTypes: true,
						})
						const files = items.filter((el) => el.isFile()).map((el) => el.name)

						const isExists = await exists(mplPath)
						if (!isExists) return series.push(ensureSeries({ ...paths, files }))

						const data = await read(mplPath)
						if (!data) return series.push(ensureSeries({ ...paths, files }))

						const animeObj: Series = sanitizeSeries(JSON.parse(data.toString()))
						series.push(ensureSeries({ ...paths, ...animeObj, files }))
					}),
				)
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
		const POSTER = path.join(this.app.getPath('userData'), POSTER_DIR)
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
		const series = await this.onGetSeries(e)
		const POSTER = path.join(this.app.getPath('userData'), POSTER_DIR)

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

	onGetSchedule = async (e: IpcMainInvokeEvent): Promise<Schedule> => {
		const defaultSchedule = ensureSchedule()
		const SCHEDULE = path.join(this.app.getPath('userData'), SCHEDULE_FILE)

		const result = await read(SCHEDULE)
		if (!result) return defaultSchedule
		const data = ensureSchedule(JSON.parse(result.toString()))

		return sanitizeSchedule(data)
	}

	onChangeSchedule = async (
		e: IpcMainInvokeEvent,
		schedule: Schedule,
	): Promise<Schedule> => {
		const SCHEDULE = path.join(this.app.getPath('userData'), SCHEDULE_FILE)
		const sanitized = sanitizeSchedule(schedule)

		await write(SCHEDULE, JSON.stringify(sanitized))

		return sanitized
	}

	onCheckForUpdate = async (e: IpcMainInvokeEvent) => {
		// Make all of the below listeners only apply in here
		autoUpdater.removeAllListeners()

		const browser = BrowserWindow.fromWebContents(e.sender)
		if (!browser) return

		autoUpdater.on('update-available', async (info) => {
			const answer = await this.dialog.showMessageBox(browser, {
				title: 'Update Available',
				message: getUpdateAvailableMsg(info),
				type: 'question',
				buttons: ['Not Now', 'Update'],
			})

			// close = 0, Not Now = 0, Update = 1
			switch (answer.response) {
				case 1:
					await autoUpdater.downloadUpdate()
					autoUpdater.quitAndInstall()
					break

				default:
					break
			}
		})

		autoUpdater.on('update-not-available', () => {
			this.dialog.showMessageBox(browser, { message: 'No new update' })
		})

		await autoUpdater.checkForUpdates()
	}
}

/* End of Events */

let initialized = false

export const initializeIpcEvents = (store: Store<MyStore>) => {
	const events = new Events(store, dialog, app)

	ipcMain.handle(IPCKey.SelectDirectory, events.onSelectDirectory)
	ipcMain.handle(IPCKey.GetUserDataDir, events.onGetUserDataDir)
	ipcMain.handle(IPCKey.GetSettings, events.onGetSettings)
	ipcMain.handle(IPCKey.SetSettings, events.onSetSettings)
	ipcMain.handle(IPCKey.GetSeries, events.onGetSeries)
	ipcMain.handle(IPCKey.EditSeries, events.onEditSeries)
	ipcMain.handle(IPCKey.ChangePoster, events.onChangePoster)
	ipcMain.handle(IPCKey.OpenItem, events.onOpenItem)
	ipcMain.handle(IPCKey.RemoveUnusedPosters, events.onRemoveUnusedPosters)
	ipcMain.handle(IPCKey.GetSchedule, events.onGetSchedule)
	ipcMain.handle(IPCKey.ChangeSchedule, events.onChangeSchedule)
	ipcMain.handle(IPCKey.CheckForUpdate, events.onCheckForUpdate)

	initialized = true
}

export const releaseIpcEvents = () => {
	if (!initialized) return

	ipcMain.removeAllListeners(IPCKey.SelectDirectory)
	ipcMain.removeAllListeners(IPCKey.GetUserDataDir)
	ipcMain.removeAllListeners(IPCKey.GetSettings)
	ipcMain.removeAllListeners(IPCKey.SetSettings)
	ipcMain.removeAllListeners(IPCKey.GetSeries)
	ipcMain.removeAllListeners(IPCKey.EditSeries)
	ipcMain.removeAllListeners(IPCKey.ChangePoster)
	ipcMain.removeAllListeners(IPCKey.OpenItem)
	ipcMain.removeAllListeners(IPCKey.GetSchedule)
	ipcMain.removeAllListeners(IPCKey.ChangeSchedule)
	ipcMain.removeAllListeners(IPCKey.CheckForUpdate)

	initialized = false
}
