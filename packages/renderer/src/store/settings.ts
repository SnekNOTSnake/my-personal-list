import { atom } from 'recoil'

export const settingsState = atom({
	key: 'settings',
	default: window.myAPI.getSettings(),
})
