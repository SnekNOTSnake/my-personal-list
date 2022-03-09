import { atom } from 'recoil'

export const settingsState = atom({
	key: 'settings',
	default: (await window.myAPI.getSettings()) as Settings,
})
