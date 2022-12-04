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

## 🎭 Who is this app for?

- People who watch and hoards animations
- People who want easy finding and organizing their downloaded animations
- People who want to keep video's metadata (eg encoder, video/audio encoding, etc)
- People who don't trust external databases
- People who hate automatons but love tools

If you care about trends, automatons (eg automatically increase track count when you open an episode with VLC), online sharing (eg MAL, AniList, AniDB), in-app torrent, or other online stuffs, this app might not suite you. This is offline-friendly software.

## 🗡️ Features

Some screenshots are placed inside [`assets`](https://github.com/SnekNOTSnake/my-personal-list/tree/master/assets) directory.

- Filter by Tags, [Fuzzy Search](https://en.wikipedia.org/wiki/Approximate_string_matching), or Metadata
- Tracking
- Stockpile Insight
- Watch Scheduling
- Batch Update
- Multiple working directories

Roadmap:

- Fetch animation metadata (eg tags and poster) from AniDB
- Manga support
- Series grouping

## 🚀️ Usage and Conventions

1. Install the app
2. Go to settings page
3. Add folders containing your downloaded series as `working directoreis`
4. Start Using The App!

### Example Folder Structure

```bash
# ❌ BAD

Anime
├── Mushishi
│   ├── Season 1
│   │   ├── 01.mkv
│   │   └── 02.mkv
│   └── Season 2
│       ├── 01.mkv
│       └── 02.mkv
└── Sora no Woto
    ├── 01.mkv
    └── 02.mkv

# ✅ Good

Anime
├── Mushishi 1
│   ├── 01.mkv
│   └── 02.mkv
├── Mushishi 2
│   ├── 01.mkv
│   └── 02.mkv
└── Sora no Woto
    ├── 01.mkv
    └── 02.mkv
```

### Migrating From v1 to v2

For example, your current working directory is `E:/Anime`.

```
Anime
├── anime
│   ├── Mushishi 1
│   │   ├── 01.mkv
│   │   └── 02.mkv
│   └── Mushishi 2
│       ├── 01.mkv
│       └── 02.mkv
├── attachments
└── schedule.json
```

1. Open your previous working directory (E:/Anime) in your file explorer
2. Move `attachments` and `schedule.json` to your user data directory

	- `%APPDATA%/my-personal-list` on Windows
	- `~/Library/Application/my-personal-list` on MacOS
	- `~/.config/my-personal-list` on Linux

3. Move your series from `E:/Anime/anime` to `E:/Anime`.
4. Open the app, go to the newly created `Settings` page
5. Add `E:/Anime` as one of your new working directories

### Conventions

1. Irregular Series

	All of the series are default to be *irregular series*, meaning they will not be included in the statistics. Its purpose is to differentiate short anime (eg 3 mins/eps) with regular anime (eg 24 min/eps). To change this, edit the series' regular checkbox.

2. Episodes Naming

	In order for the system to recognize an episode's number (For "current-episode" highlight), the filename should follow the convention: `<number>.<title>.<extension>` OR `<number>.<extension>`. Examples:

	- ✅ `01. Resounding Sound - The City at Dawn.mkv`
	- ✅ `01.mkv`
	- ❌ `01 - Resounding Sound - The City at Dawn.mkv`
	- ❌ `Ep 01.mkv`

## ⛷️ Running for Development

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
