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
import { themeState } from '@/recoil-states/theme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labels = [
	'Action',
	'Adventure',
	'Comedy',
	'Ecchi',
	'Gourmet',
	'Music',
	'Psychology',
	'Romance',
	'Supernatural',
	'Music',
	'Psychology',
	'Romance',
	'Supernatural',
]

const Stockpile: React.FC = () => {
	const theme = useRecoilValue(themeState)
	const isDark = theme === 'dark'

	const options = {
		responsive: true,
		scales: {
			x: {
				stacked: true,
				grid: {
					display: false,
					tickColor: 'transparent',
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#777',
				},
			},
			y: {
				stacked: true,
				grid: {
					color: isDark ? 'rgba(255, 255, 255, 0.1)' : '#777',
					borderDash: [4, 4],
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#777',
					tickColor: 'transparent',
				},
				ticks: { stepSize: 200 },
			},
		},
	}

	const data = {
		labels,
		datasets: [
			{
				label: 'Watched',
				data: [210, 245, 130, 210, 250, 100, 175, 210, 75, 100, 175, 210, 75],
				backgroundColor: '#2f80ed',
			},
			{
				label: 'Fresh',
				data: [410, 680, 605, 410, 670, 275, 595, 410, 220, 275, 595, 410, 220],
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
					<div className={styles.number}>620</div>
					<div className={styles.text}>Fresh eps</div>
				</div>
				<div>
					<div className={styles.number}>43</div>
					<div className={styles.text}>Fresh series</div>
				</div>
			</div>
		</div>
	)
}

export default Stockpile
