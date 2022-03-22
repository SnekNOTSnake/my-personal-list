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
	<a href="#usage">Usage</a>
  <a href="#features">Features</a> •
  <a href="#installation-and-running">Installation and Running</a> •
  <a href="#building">Building</a>
</p>

![Explore](https://github.com/SnekNOTSnake/my-personal-list/blob/master/assets/screenshots/explore.png?raw=true)

## 🪤 Usage and Conventions

1. Install the app

2. Select a directory where the program should work on by pressing `alt` -> click `MyPersonalList` -> `Change Data Directory`. It's suggested that the directory contains nothing but `anime` directory.

3. Move all your animated series into the `anime` directory *directly*. The system only recognize directories *directly* inside `anime` to be series, and not recursively.

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

## ⛷️ Installation and Running

Before installing this project, make sure you're using the newer version of Node. After that you can install it simply by executing `yarn` command.

```bash
yarn
yarn start
```

## ⛰️ Building and Packaging

When you execute below command `electron-builder` will create an executable package for your OS (I think). If that fails, try to play around with `.electron-builder.config.js` file and the `electron-builder` [docs](https://www.electron.build/configuration/configuration.html).

```bash
yarn build
```
