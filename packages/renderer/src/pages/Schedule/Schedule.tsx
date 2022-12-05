import React, { useState } from 'react'
import { MdOutlineAdd, MdOutlineEdit } from 'react-icons/md'
import { useRecoilValue } from 'recoil'

import Button from '@/components/Button/Button'
import { populatedSchedule } from '@/store/series'
import ScheduleAddSeries from './components/ScheduleAddSeries'
import ScheduleSeries from './components/ScheduleSeries'
import styles from './Schedule.module.css'

const Schedule: React.FC = () => {
	const schedule = useRecoilValue(populatedSchedule)

	const [isEditing, setIsEditing] = useState(false)
	const toggleEditing = () => setIsEditing((prevVal) => !prevVal)

	const [addSeriesDay, setAddSeriesDay] = useState<keyof Schedule | null>(null)
	const onAddSeriesClick = (day: keyof Schedule) => setAddSeriesDay(day)
	const addSeriesClose = () => setAddSeriesDay(null)

	return (
		<div className={styles.schedule} data-editing={isEditing ? 'on' : 'off'}>
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
									title='Add Series'
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

			<Button
				className={styles.edit}
				type='button'
				Icon={MdOutlineEdit}
				onClick={toggleEditing}
			>
				{isEditing ? 'Done Editing' : 'Edit Schedule'}
			</Button>
		</div>
	)
}

export default Schedule
