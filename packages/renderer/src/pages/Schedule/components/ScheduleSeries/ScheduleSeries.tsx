import { useRecoilState } from 'recoil'
import { Link } from 'react-router-dom'
import { MdOutlineDelete } from 'react-icons/md'

import { scheduleState } from '@/store/series'
import styles from './ScheduleSeries.module.css'
import Poster from '@/components/Poster'

type Props = { anime: Series; day: keyof Schedule }
const ScheduleSeries: React.FC<Props> = ({ anime, day }) => {
	const [schedule, setSchedule] = useRecoilState(scheduleState)

	const deleteSeriesFromSchedule = async () => {
		const index = schedule[day].findIndex((el) => el === anime.path)
		const newSeries = [...schedule[day]]
		if (index < 0) return
		newSeries.splice(index, 1)

		const newSchedule = { ...schedule, [day]: newSeries }
		const brandNewSchedule = await window.myAPI.changeSchedule(newSchedule)

		setSchedule(brandNewSchedule)
	}

	return (
		<div className={styles.root}>
			<Poster anime={anime} className={styles.poster} />

			<div className={styles.details}>
				<Link to={`/explore/${anime.path}`}>
					<h3>{anime.path}</h3>
				</Link>
				<div className={styles.episode}>
					EP {anime.epsWatched}/{anime.epsNum}
				</div>
				<div className={styles.actions}>
					<MdOutlineDelete onClick={deleteSeriesFromSchedule} />
				</div>
			</div>
		</div>
	)
}

export default ScheduleSeries
