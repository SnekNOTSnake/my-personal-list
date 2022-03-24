<h1 align="center">
	<a href="https://github.com/SnekNOTSnake">
		<img src="https://github.com/SnekNOTSnake/my-personal-list/blob/master/assets/icon.png?raw=true" alt="Markdownify" width="200">
	</a>
	<br>
  	My Personal List
  </br>
</h1>

<h4 align="center">An app to organize and track your downloaded anime.</h4>

<p align="center">
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Renderer-Vite-informational?style=flat&logo=vite&logoColor=white&color=2f80ed" alt="Vite">
  </a>
  <a href="https://electronjs.org/">
  <img src="https://img.shields.io/badge/Framework-Electron-informational?style=flat&logo=electron&logoColor=white&color=2f80ed" alt="Electron">
 </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/Library-React-informational?style=flat&logo=react&logoColor=white&color=2f80ed" alt="React.js">
  </a>
  <a href="https://typescriptlang.org/">
    <img src="https://img.shields.io/badge/Language-TypeScript-informational?style=flat&logo=typescript&logoColor=white&color=2f80ed" alt="TypeScript">
  </a>
</p>

<p align="center">
	<a href="https://github.com/SnekNOTSnake/my-personal-list#%EF%B8%8F-usage-and-conventions">Usage</a> •
  <a href="https://github.com/SnekNOTSnake/my-personal-list#%EF%B8%8F-features">Features</a> •
  <a href="https://github.com/SnekNOTSnake/my-personal-list#%EF%B8%8F-installation-and-running">Installation and Running</a> •
  <a href="https://github.com/SnekNOTSnake/my-personal-list#%EF%B8%8F-building-and-packaging">Building</a>
</p>

![Explore](https://github.com/SnekNOTSnake/my-personal-list/blob/master/assets/screenshots/explore.png?raw=true)

## 🚀️ Usage and Conventions

> **Note**: All of the series are default to be *irregular series*, meaning they will not be included in the statistics. Its purpose is to differentiate short anime (eg 3 mins/eps) with regular anime (eg 24 min/eps). To change this, edit the series' regular checkbox.

1. Install the app

2. Select a directory where the program should work on by pressing `alt` -> `MyPersonalList` -> `Change Data Directory`. It's suggested that the directory contains nothing but `anime` directory.

3. Move all your animated series into the `anime` directory *directly*. The system only recognize directories *directly* inside `anime` to be series, but not recursively.

	Something like this:

	```
	Selected Dir
	├── anime
	│   ├── Haibane Renmei
	│   ├── Mushishi
	│   │   └── Unrecognized Anime
	│   └── Shoujo Shuumatsu Ryokou
	└── Unrecognized Anime
	```

4. Start Using The App!

## 🗡️ Features

Some screenshots are placed inside [`assets`](https://github.com/SnekNOTSnake/bulletproof-architecture/blob/master/assets) directory.

- Filter by Tags
- Filter by [fuzzy](https://en.wikipedia.org/wiki/Approximate_string_matching) search
- Storing Metadata per series
- Stockpile Insight
- Watch Scheduling
- And More!

Roadmap:

- AniDB (Or MyAnimeList) integration, so that you don't have to write everything manually
- Multiple data directories
- English and Japanese title

## ⛷️ Installation and Running

Before installing this project, make sure you're using the newer version of Node. After that you can install it simply by executing `yarn` command.

```bash
yarn
yarn start
```

## ⛰️ Building and Packaging

When you execute below command `electron-builder` will create an executable package for your OS (I think). If that fails, try to play around with `.electron-builder.config.js` file and the `electron-builder` [docs](https://www.electron.build/configuration/configuration.html).

### Building

```bash
yarn build
```

### Packaging

Only available after you execute `yarn build`

```bash
# Windows
yarn package:win

# Mac
yarn package:mac

# Linux
yarn package:linux
```
