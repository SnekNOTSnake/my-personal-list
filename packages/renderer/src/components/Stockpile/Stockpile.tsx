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

import ChartDoughnut from '../ChartDoughnut/ChartDoughnut'
import ChartBar from '../ChartBar'
import styles from './Stockpile.module.css'

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
					<div className={styles.number}>2.75</div>
					<div className={styles.text}>Avg Eps / Day</div>
				</div>
				<div>
					<div className={styles.number}>7.5 M</div>
					<div className={styles.text}>Stockpile Lasts</div>
				</div>
			</div>
		</div>
	)
}

export default Stockpile
