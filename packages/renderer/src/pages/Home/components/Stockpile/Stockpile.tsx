import React from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js'
import { useRecoilValue } from 'recoil'

import ChartDoughnut from '../ChartDoughnut/ChartDoughnut'
import ChartBar from '../ChartBar'
import styles from './Stockpile.module.css'
import { seriesStats } from '@/store/series'

ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
)

const Stockpile: React.FC = () => {
	const stats = useRecoilValue(seriesStats)

	return (
		<div className={styles.root}>
			<div className={styles.chart}>
				<div className={styles.bar}>
					<ChartBar />
				</div>
				<div className={styles.doughnut}>
					<h2>Anime Stocks</h2>
					<ChartDoughnut />
				</div>
			</div>
			<div className={styles.totals}>
				<div>
					<div className={styles.number}>{stats.avgEpsPerDay}</div>
					<div className={styles.text}>Avg Eps / Day</div>
				</div>
				<div>
					<div className={styles.number}>
						{stats.stockpileLasts[0]} {stats.stockpileLasts[1]}
					</div>
					<div className={styles.text}>Stockpile Lasts</div>
				</div>
			</div>
		</div>
	)
}

export default Stockpile
