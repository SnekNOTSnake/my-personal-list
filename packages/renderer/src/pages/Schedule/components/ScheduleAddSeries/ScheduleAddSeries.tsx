import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import Modal from '@/components/Modal'
import { scheduleState, seriesState } from '@/store/series'
import styles from './ScheduleAddSeries.module.css'

type Props = { day: keyof Schedule | null; onClose: Function }
const ScheduleAddSeries: React.FC<Props> = ({ day, onClose }) => {
	const series = useRecoilValue(seriesState)
	const [schedule, setSettings] = useRecoilState(scheduleState)

	const [input, setInput] = useState('')
	const onInputChange = (e: InputChange) => setInput(e.target.value)

	if (!day) return <React.Fragment />

	const addSeries = async (seriesPath: string) => {
		const newDaySeries = [...schedule[day], seriesPath]
		const newSchedule = { ...schedule, [day]: newDaySeries }

		const brandNewSchedule = await window.myAPI.changeSchedule(newSchedule)

		setSettings(brandNewSchedule)
		setInput('')
		onClose()
	}

	const localFiltered = series
		.filter((el) =>
			el.path.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()),
		)
		.filter((el) => !schedule[day].includes(el.path))
		.sort((a, b) => a.path.localeCompare(b.path))
		.slice(0, 5)

	return (
		<Modal open={Boolean(day)} onClose={onClose}>
			<div className={styles.addSeries}>
				<input autoFocus type='text' value={input} onChange={onInputChange} />
				<div className={styles.suggestions}>
					<ul>
						{localFiltered.map((el) => (
							<li onClick={() => addSeries(el.path)} key={el.path}>
								{el.path}
							</li>
						))}
					</ul>
				</div>
			</div>
		</Modal>
	)
}

export default ScheduleAddSeries
