const pkg = require('./package.json')

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
	appId: 'YourAppId',
	productName: pkg.name,
	copyright: `Copyright © 2022 ${pkg.author}`,
	asar: true,
	directories: {
		output: `release/${pkg.version}`,
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
		artifactName: `${pkg.name}-${pkg.version}.exe`,
	},
	mac: {
		target: ['dmg'],
		artifactName: `${pkg.name}-${pkg.version}.dmg`,
	},
	linux: {
		target: ['AppImage'],
		artifactName: `${pkg.name}-${pkg.version}.AppImage`,
	},
}
