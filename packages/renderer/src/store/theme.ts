import { atom } from 'recoil'

export const themeState = atom({
	key: 'theme',
	default: 'dark' as 'dark' | 'light',
})
