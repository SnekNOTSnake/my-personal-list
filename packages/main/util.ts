import path from 'path'

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000

export const resolveHtmlPath = (htmlFileName: string): string => {
	if (isDev) return new URL(`http://localhost:${PORT}`).href
	else return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
}
