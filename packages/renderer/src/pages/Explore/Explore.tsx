import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Explorer from '@/components/Explorer'
import AnimeDetails from '@/components/AnimeDetails'
import styles from './Explore.module.css'

const Explore: React.FC = () => (
	<div className={styles.root}>
		<Explorer />

		<Routes>
			<Route path=':seriesId' element={<AnimeDetails />} />
		</Routes>
	</div>
)

export default Explore
