/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
	appId: 'com.sneknotsnake.my-personal-list',
	productName: 'My Personal List',
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
		artifactName: 'v${version}-${name}.${ext}',
	},
	mac: {
		target: ['dmg'],
		artifactName: 'v${version}-${name}.${ext}',
	},
	linux: {
		target: ['AppImage', 'deb'],
		artifactName: 'v${version}-${name}.${ext}',
		category: 'Utility',
	},
	extraResources: ['./assets/**'],
}
