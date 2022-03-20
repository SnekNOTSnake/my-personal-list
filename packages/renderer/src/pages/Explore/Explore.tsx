import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LeftExplorer from './components/ExplorerLeft'
import RightExplorer from './components/ExplorerRight'
import Anime from './components/Anime'
import styles from './Explore.module.css'

const Explore: React.FC = () => (
	<div className={styles.root}>
		<div className={styles.explorer}>
			<LeftExplorer />
			<RightExplorer />
		</div>

		<Routes>
			<Route path=':path' element={<Anime />} />
		</Routes>
	</div>
)

export default Explore
