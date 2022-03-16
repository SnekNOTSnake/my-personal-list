const pkg = require('./package.json')

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
	appId: 'My-Very-Own-Personal-List-Id',
	productName: pkg.name,
	copyright: 'Copyright © 2022 ${author}',
	asar: true,
	directories: {
		output: 'release/${version}',
		buildResources: 'build',
	},
	files: ['dist'],
	win: {
		target: [
			{
				target: 'nsis',
				arch: ['x64'],
			},
		],
		artifactName: '${name}-${version}.exe',
	},
	mac: {
		target: ['dmg'],
		artifactName: '${name}-${version}.dmg',
	},
	linux: {
		target: ['AppImage'],
		artifactName: '${name}-${version}.AppImage',
	},
}
