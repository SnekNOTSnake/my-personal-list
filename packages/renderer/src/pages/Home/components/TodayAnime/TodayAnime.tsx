import React from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { todaySchedule } from '@/store/series'
import styles from './TodayAnime.module.css'

const TodayAnime: React.FC = () => {
	const series = useRecoilValue(todaySchedule)

	return (
		<div className={styles.root}>
			<h2>TodayAnime</h2>
			<div className={styles.items}>
				{series.length === 0 ? <h1>No anime for today.</h1> : ''}
				{series.map((anime, i) => (
					<Link key={anime.path} to={`explore/${anime.path}`}>
						<div
							className={styles.poster}
							style={{
								backgroundImage: `url(https://picsum.photos/450/630?key=${i})`,
							}}
						/>
					</Link>
				))}
			</div>
		</div>
	)
}

export default TodayAnime
