import React from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import styles from './Stockpile.module.css'
import { useRecoilValue } from 'recoil'
import { settingsState } from '@/store/settings'
import { seriesStats } from '@/store/series'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Stockpile: React.FC = () => {
	const { theme } = useRecoilValue(settingsState)
	const isDark = theme === 'dark'

	const stats = useRecoilValue(seriesStats)
	const tags = [...stats.tags]
	tags.splice(-1, 1)

	if (!tags.length) {
		tags.push({ name: 'Empty Data', count: 0, epsNum: 0, epsWatched: 0 })
	}

	const options = {
		responsive: true,
		scales: {
			x: {
				stacked: false,
				grid: {
					display: false,
					tickColor: 'transparent',
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#777',
				},
			},
			y: {
				stacked: false,
				grid: {
					color: isDark ? 'rgba(255, 255, 255, 0.1)' : '#777',
					borderDash: [4, 4],
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#777',
					tickColor: 'transparent',
				},
				ticks: {
					stepSize: Math.ceil(Math.max(...tags.map((tag) => tag.epsNum)) / 5),
				},
			},
		},
	}

	const data = {
		labels: tags.map((tag) => tag.name),
		datasets: [
			{
				label: 'Watched',
				data: tags.map((tag) => tag.epsWatched),
				backgroundColor: '#2f80ed',
			},
			{
				label: 'Total',
				data: tags.map((tag) => tag.epsNum),
				backgroundColor: isDark ? '#fff' : '#ccc',
			},
		],
	}

	return (
		<div className={styles.root}>
			<div className={styles.chart}>
				<Bar options={options} data={data} />
			</div>
			<div className={styles.totals}>
				<div>
					<div className={styles.number}>{stats.epsFresh}</div>
					<div className={styles.text}>Fresh eps</div>
				</div>
				<div>
					<div className={styles.number}>{stats.totalSeries}</div>
					<div className={styles.text}>Fresh series</div>
				</div>
			</div>
		</div>
	)
}

export default Stockpile
