import React from 'react'

import Stockpile from './components/Stockpile'
import TodayAnime from './components/TodayAnime'
import styles from './Home.module.css'

const Home: React.FC = () => (
	<div className={styles.home}>
		<TodayAnime />
		<Stockpile />
	</div>
)

export default Home
