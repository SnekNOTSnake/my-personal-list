import React, { useState } from 'react'
import { MdOutlineAdd } from 'react-icons/md'
import { useRecoilValue } from 'recoil'

import { populatedSchedule } from '@/store/series'
import ScheduleAddSeries from '@/components/ScheduleAddSeries/ScheduleAddSeries'
import ScheduleSeries from '@/components/ScheduleSeries'
import styles from './Schedule.module.css'

const Schedule: React.FC = () => {
	const schedule = useRecoilValue(populatedSchedule)

	const [isEditing, setIsEditing] = useState(false)
	const toggleEditing = () => setIsEditing((prevVal) => !prevVal)

	const [addSeriesDay, setAddSeriesDay] = useState<keyof Schedule | null>(null)
	const onAddSeriesClick = (day: keyof Schedule) => setAddSeriesDay(day)
	const addSeriesClose = () => setAddSeriesDay(null)

	return (
		<div className={styles.root} data-editing={isEditing ? 'on' : 'off'}>
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
								<ScheduleSeries
									key={anime.path}
									anime={anime}
									day={day as keyof Schedule}
								/>
							))}
						</div>
					</div>
				))}
			</div>

			<div className={styles.edit}>
				<button type='button' onClick={toggleEditing}>
					{isEditing ? 'Done Editing' : 'Edit Schedule'}
				</button>
			</div>
		</div>
	)
}

export default Schedule
