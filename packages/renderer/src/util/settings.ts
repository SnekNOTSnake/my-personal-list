const STORAGE_KEY = 'settings'

const defaultSettings: Settings = { dataDir: null, episodeTreshold: 10 }

export const getSettings = (): Settings => {
	const data = localStorage.getItem(STORAGE_KEY)
	return data ? JSON.parse(data) : defaultSettings
}

export const setSettings = (newSettings: Settings) => {
	const current = getSettings()
	const updated = { ...current, ...newSettings }

	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

	return updated
}

export const initializeSettings = (): Settings => {
	const current = getSettings()
	if (!current) {
		console.log('Initiated default settings')
		setSettings(current)
	}

	return current
}
