import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { scheduleState, seriesState } from '@/store/series'
import styles from './ScheduleAddSeries.module.css'

type Props = { day: keyof Schedule | null; onClose: Function }
const ScheduleAddSeries: React.FC<Props> = ({ day, onClose }) => {
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
		setInput('')
		onClose()
	}

	const localFiltered = series
		.filter((el) =>
			el.title.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()),
		)
		.filter((el) => !schedule[day].includes(el.path))
		.sort((a, b) => a.title.localeCompare(b.title))
		.slice(0, 5)

	return (
		<div ref={rootRef} className={[styles.root, styles.active].join(' ')}>
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

export default ScheduleAddSeries
