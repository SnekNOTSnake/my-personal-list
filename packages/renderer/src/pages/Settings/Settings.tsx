import React, { useState } from 'react'
import { useRecoilState } from 'recoil'

import { settingsState } from '@/store/settings'
import styles from './Settings.module.css'

const Settings: React.FC = () => {
	const [settings, setSettings] = useRecoilState(settingsState)
	const [input, setInput] = useState(settings)

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

	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		console.log(input)
	}

	return (
		<div className={styles.root}>
			<form onSubmit={onSubmit}>
				<div className={styles.labeledInput}>
					<div className={styles.label}>Working directories</div>
					<div className={styles.input}>
						<input
							type='text'
							placeholder='Name'
							name='cwd'
							value={input.cwd || ''}
							onChange={onInputChange}
						/>
						<button type='button'>Choose directory</button>
						<button type='button'>Delete</button>
					</div>
					<div className={styles.actions}>
						<button type='button'>Add</button>
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
					<button type='submit'>Apply</button>
					<button type='button' onClick={onReset}>
						Reset
					</button>
				</div>
			</form>
		</div>
	)
}

export default Settings
