import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { settingsState } from '@/store/settings'
import { scheduleState, seriesState } from '@/store/series'
import styles from './Settings.module.css'

const Settings: React.FC = () => {
	const [settings, setSettings] = useRecoilState(settingsState)
	const setSeries = useSetRecoilState(seriesState)
	const setSchedule = useSetRecoilState(scheduleState)

	const [cwd, setCwd] = useState({ name: '', path: '' })
	const [input, setInput] = useState<MyStore>(settings)

	// CWD
	const onCwdNameChange = (e: InputChange) => {
		setCwd((prevVal) => ({ ...prevVal, name: e.target.value }))
	}

	const onCwdPathChange = async () => {
		const path = await window.myAPI.selectDirectory()
		setCwd((prevVal) => ({ ...prevVal, path }))
	}

	const onCwdSubmit = () => {
		if (!cwd.path || !cwd.name) return
		if (input.cwds.findIndex((el) => el.path === cwd.path) > -1) return
		setInput((prevVal) => ({ ...prevVal, cwds: [...prevVal.cwds, cwd] }))
		setCwd({ name: '', path: '' })
	}

	const onCwdRemove = (path: string) => {
		const newCwds = [...input.cwds]
		const index = newCwds.findIndex((el) => el.path === path)
		if (index < 0) return
		newCwds.splice(index, 1)
		setInput((prevVal) => ({ ...prevVal, cwds: newCwds }))
	}

	// General Form
	const onInputChange = (e: InputChange) => {
		setInput((prevVal) => {
			const type = e.target.getAttribute('type')

			let value: any = e.target.value
			if (type === 'checkbox') value = !prevVal.neverCheckUpdate
			if (type === 'number') value = Number(e.target.value)

			return { ...prevVal, [e.target.name]: value }
		})
	}

	const onReset = () => setInput(settings)

	const onSubmit = async (e: FormSubmit) => {
		e.preventDefault()

		const settingsPromise = window.myAPI.setSettings(input)
		const seriesPromise = window.myAPI.getSeries()
		const schedulePromise = window.myAPI.getSchedule()

		const [newSettings, newSeries, newSchedule] = await Promise.all([
			settingsPromise,
			seriesPromise,
			schedulePromise,
		])

		setSettings(newSettings)
		setSeries(newSeries)
		setSchedule(newSchedule)
	}

	return (
		<div className={styles.settings}>
			<h1>Settings</h1>

			<form onSubmit={onSubmit}>
				<div className={styles.labeledInput}>
					<div className={styles.label}>Working directories</div>
					<div className={styles.cwds}>
						{input.cwds.map((el) => (
							<div className={styles.cwd} key={el.path}>
								<div>{el.name}</div>
								<div>{el.path}</div>
								<button type='button' onClick={() => onCwdRemove(el.path)}>
									Delete
								</button>
							</div>
						))}
					</div>
					<div className={styles.input}>
						<input
							type='text'
							placeholder='Working dir name'
							name='cwd'
							onChange={onCwdNameChange}
							value={cwd.name}
						/>
						<button type='button' onClick={onCwdPathChange}>
							{cwd.path || 'Choose Directory'}
						</button>
						<button type='button' onClick={onCwdSubmit}>
							Add
						</button>
					</div>
				</div>
				<div className={styles.labeledInput}>
					<div className={styles.label}>Theme</div>
					<div className={styles.input}>
						<label>
							<input
								type='radio'
								name='theme'
								value='light'
								checked={input.theme === 'light'}
								onChange={onInputChange}
							/>{' '}
							Light
						</label>
						<label>
							<input
								type='radio'
								name='theme'
								value='dark'
								checked={input.theme === 'dark'}
								onChange={onInputChange}
							/>{' '}
							Dark
						</label>
					</div>
				</div>
				<div className={styles.labeledInput}>
					<div className={styles.label}>Never Update</div>
					<div className={styles.input}>
						<input
							type='checkbox'
							name='neverCheckUpdate'
							checked={input.neverCheckUpdate}
							onChange={onInputChange}
						/>
					</div>
				</div>
				<div className={styles.actions}>
					<button type='submit' className={styles.apply}>
						Apply
					</button>
					<button type='button' onClick={onReset}>
						Reset
					</button>
				</div>
			</form>
		</div>
	)
}

export default Settings
