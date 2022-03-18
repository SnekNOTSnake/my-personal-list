import React, { useEffect, useRef, useState } from 'react'
import {
	MdOutlineSettings,
	MdOutlineDelete,
	MdOutlineAdd,
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

import { seriesState, scheduleState, populatedSchedule } from '@/store/series'
import styles from './Schedule.module.css'

const Schedule: React.FC = () => {
	const schedule = useRecoilValue(populatedSchedule)

	const [addSeriesDay, setAddSeriesDay] = useState<keyof Schedule | null>(null)
	const onAddSeriesClick = (day: keyof Schedule) => setAddSeriesDay(day)

	const addSeriesClose = () => setAddSeriesDay(null)

	return (
		<div className={styles.root}>
			<ScheduleAddSeries day={addSeriesDay} onClose={addSeriesClose} />

			<div className={styles.days}>
				{['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day, i) => (
					<div key={day} className={styles.day}>
						<div
							className={[
								styles.container,
								i === new Date().getDay() ? styles.active : '',
							].join(' ')}
						>
							<div className={styles.header}>
								<h1>{day}</h1>
								<button
									type='button'
									onClick={() => onAddSeriesClick(day as keyof Schedule)}
								>
									<MdOutlineAdd />
								</button>
							</div>

							{schedule[day as keyof Schedule].map((anime) => (
								<ScheduleItem
									key={anime.path}
									anime={anime}
									day={day as keyof Schedule}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

type AddSeriesProps = { day: keyof Schedule | null; onClose: Function }
const ScheduleAddSeries: React.FC<AddSeriesProps> = ({ day, onClose }) => {
	const series = useRecoilValue(seriesState)
	const [schedule, setSettings] = useRecoilState(scheduleState)

	const rootRef = useRef(null)
	const [input, setInput] = useState('')
	const onInputChange = (e: InputChange) => setInput(e.target.value)

	useEffect(() => {
		const listener = (e: MouseEvent) => {
			if (e.target === rootRef.current) onClose()
		}

		window.addEventListener('click', listener)
		return () => window.removeEventListener('click', listener)
	}, [])

	if (!day) return <React.Fragment />

	const addSeries = async (seriesPath: string) => {
		const newDaySeries = [...schedule[day], seriesPath]
		const newSchedule = { ...schedule, [day]: newDaySeries }

		const brandNewSchedule = await window.myAPI.changeSchedule(newSchedule)
		setSettings(brandNewSchedule)
	}

	const localFiltered = series
		.filter((el) =>
			el.title.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()),
		)
		.filter((el) => !schedule[day].includes(el.path))
		.sort((a, b) => a.title.localeCompare(b.title))
		.slice(0, 5)

	return (
		<div
			ref={rootRef}
			className={[styles.addSeries, day ? styles.asActive : ''].join(' ')}
		>
			<div className={styles.content}>
				<input type='text' value={input} onChange={onInputChange} />
				<div className={styles.suggestions}>
					<ul>
						{localFiltered.map((el) => (
							<li onClick={() => addSeries(el.path)} key={el.path}>
								{el.title}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

type Props = { anime: Series; day: keyof Schedule }
const ScheduleItem: React.FC<Props> = ({ anime, day }) => {
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
		<div className={styles.series}>
			<div
				className={styles.poster}
				style={{
					backgroundImage: `url(https://picsum.photos/50/75?key=${day})`,
				}}
			></div>
			<div className={styles.details}>
				<Link to={`/explore/${anime.path}`}>
					<h3>{anime.title}</h3>
				</Link>
				<div className={styles.episode}>
					EP {anime.epsWatched}/{anime.epsNum}
				</div>
				<div className={styles.actions}>
					<MdOutlineSettings />
					<MdOutlineDelete onClick={deleteSeriesFromSchedule} />
				</div>
			</div>
		</div>
	)
}

export default Schedule
