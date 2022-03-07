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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
	responsive: true,
	scales: {
		x: {
			stacked: true,
			grid: {
				display: false,
				tickColor: 'transparent',
				borderColor: 'rgba(255, 255, 255, 0.1)',
			},
		},
		y: {
			stacked: true,
			grid: {
				color: 'rgba(255, 255, 255, 0.1)',
				borderDash: [4, 4],
				borderColor: 'rgba(255, 255, 255, 0.1)',
				tickColor: 'transparent',
			},
			ticks: { stepSize: 200 },
		},
	},
}

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

export const data = {
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
			backgroundColor: '#fff',
		},
	],
}

const Stockpile: React.FC = () => {
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
