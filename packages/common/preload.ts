import { contextBridge, ipcRenderer as ipc } from 'electron'
import { IPCKey } from './constants'

contextBridge.exposeInMainWorld('myAPI', {
	changeTheme: (theme: Theme) => ipc.invoke(IPCKey.ChangeTheme, theme),
	changeCWD: () => ipc.invoke(IPCKey.ChangeCWD),
	getSettings: () => ipc.invoke(IPCKey.GetSettings),
})
