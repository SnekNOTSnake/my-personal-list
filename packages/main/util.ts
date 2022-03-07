import path from 'path'
import { app } from 'electron'

const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000

export const resolveHtmlPath = (htmlFileName: string): string => {
	if (isProd || app.isPackaged)
		return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
	else return new URL(`http://localhost:${PORT}`).href
}
