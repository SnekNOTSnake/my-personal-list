import React from 'react'
import { useRecoilValue } from 'recoil'
import { Bar } from 'react-chartjs-2'
import { settingsState } from '@/store/settings'
import { seriesStats } from '@/store/series'

const ChartBar: React.FC = () => {
	const { theme } = useRecoilValue(settingsState)
	const isDark = theme === 'dark'

	const stats = useRecoilValue(seriesStats)
	const tags = [...stats.tags]
	tags.splice(-1, 1)

	const textColor = isDark ? 'rgba(255, 255, 255, 0.65)' : '#1b262c'
	const borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : '#777'

	const options = {
		maxBarThickness: 30,
		responsive: true,
		plugins: {
			legend: {
				labels: {
					color: textColor,
				},
			},
		},
		scales: {
			x: {
				stacked: true,
				grid: {
					display: false,
					tickColor: 'transparent',
					borderColor: borderColor,
				},
				ticks: {
					color: textColor,
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					color: borderColor,
					borderDash: [2, 2],
					borderColor: borderColor,
					tickColor: 'transparent',
				},
				ticks: {
					stepSize: Math.ceil(Math.max(...tags.map((tag) => tag.epsNum)) / 5),
					color: textColor,
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
				backgroundColor: isDark ? '#fff' : '#bbb',
			},
		],
	}

	if (!tags.length) {
		tags.push({ name: 'Empty Data', count: 0, epsNum: 0, epsWatched: 0 })
	}

	return <Bar options={options} data={data} />
}

export default ChartBar
