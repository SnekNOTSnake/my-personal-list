import React from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { todaySchedule } from '@/store/series'
import styles from './TodayAnime.module.css'
import Poster from '@/components/Poster'

const TodayAnime: React.FC = () => {
	const series = useRecoilValue(todaySchedule)

	return (
		<div className={styles.root}>
			<h2>TodayAnime</h2>
			<div className={styles.items}>
				{series.length === 0 ? <h1>No anime for today.</h1> : ''}
				{series.map((anime) => (
					<Link key={anime.path} to={`explore/${anime.path}`}>
						<Poster anime={anime} className={styles.poster} />
					</Link>
				))}
			</div>
		</div>
	)
}

export default TodayAnime
