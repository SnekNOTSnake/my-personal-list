const pkg = require('./package.json')

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
	appId: 'com.sneknotsnake.my-personal-list',
	productName: pkg.name,
	copyright: 'Copyright © 2022 ${author}',
	asar: true,
	directories: {
		output: 'release/${version}',
		buildResources: 'assets',
	},
	files: ['dist'],
	win: {
		target: [
			{
				target: 'nsis',
				arch: ['x64'],
			},
		],
		artifactName: '${name}-${version}.${ext}',
	},
	mac: {
		target: ['dmg'],
		artifactName: '${name}-${version}.${ext}',
	},
	linux: {
		target: ['AppImage', 'deb'],
		artifactName: '${name}-${version}.${ext}',
		category: 'Utility',
	},
	extraResources: ['./assets/**'],
}
