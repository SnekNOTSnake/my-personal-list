import { Doughnut } from 'react-chartjs-2'
import { useRecoilValue } from 'recoil'

import { seriesStats } from '@/store/series'
import { settingsState } from '@/store/settings'
import styles from './ChartDoughnut.module.css'

/**
 * @see https://github.com/chartjs/Chart.js/issues/6195
 */

const thicknessPlugin = {
	id: 'thickness',
	beforeDraw: function (chart: any, options: any) {
		const thickness = chart.options.plugins.thickness.thickness
		thickness.forEach((item: any, index: any) => {
			chart.getDatasetMeta(0).data[index].innerRadius = item[0]
			chart.getDatasetMeta(0).data[index].outerRadius = item[1]
		})
	},
}

const options = {
	legend: {
		display: false,
	},
	plugins: {
		thickness: {
			thickness: [
				[88, 100],
				[98, 100],
			],
		},
		legend: { display: false },
		tooltip: { enabled: false },
	},
}

const DoughnutChart: React.FC = () => {
	const { theme } = useRecoilValue(settingsState)
	const stats = useRecoilValue(seriesStats)
	const isDark = theme === 'dark'

	const data = {
		datasets: [
			{
				data: [stats.watchedEpisodes, stats.totalEpisodes],
				backgroundColor: ['#2f80ed', isDark ? '#fff' : '#bbb'],
				borderWidth: 0,
			},
		],
	}

	const percentage =
		stats.totalEpisodes > 0
			? Math.ceil((stats.watchedEpisodes / stats.totalEpisodes) * 100)
			: 0

	return (
		<div className={styles.doughnut}>
			<div className={styles.label}>
				<div className={styles.percentage}>{percentage}%</div>
				<div className={styles.episodes}>
					{stats.watchedEpisodes} / {stats.totalEpisodes} Eps
				</div>
			</div>

			<Doughnut options={options} plugins={[thicknessPlugin]} data={data} />
		</div>
	)
}

export default DoughnutChart
