import React from 'react'
import TextField from '@/components/TextField/TextField'
import styles from './EditGenerals.module.css'

type Props = {
	generalInfo: {
		jpTitle: string
		rewatchCount: number
		regular: boolean
		romanjiTitle: string
		epsNum: number
		epsWatched: number
	}
	onInputChange: (e: InputChange | TextAreaChange) => any
}

const EditGenerals: React.FC<Props> = ({
	generalInfo: {
		jpTitle,
		rewatchCount,
		regular,
		romanjiTitle,
		epsNum,
		epsWatched,
	},
	onInputChange,
}) => (
	<div className={styles.editGenerals}>
		<div className={styles.row}>
			<TextField
				label='Japanese Title'
				name='jpTitle'
				onChange={onInputChange}
				value={jpTitle}
			/>
			<TextField
				label='Re-watch Count'
				type='number'
				name='rewatchCount'
				onChange={onInputChange}
				value={rewatchCount}
			/>
			<div className={styles.regular}>
				<input
					type='checkbox'
					name='regular'
					id='regular'
					onChange={onInputChange}
					checked={regular}
				/>
				<label htmlFor='regular'>Regular</label>
			</div>
		</div>
		<div className={styles.row}>
			<TextField
				label='Romanji Title'
				name='romanjiTitle'
				onChange={onInputChange}
				value={romanjiTitle}
			/>
			<TextField
				label='Eps Num'
				type='number'
				name='epsNum'
				onChange={onInputChange}
				value={epsNum}
			/>
			<TextField
				label='Eps Watched'
				type='number'
				name='epsWatched'
				onChange={onInputChange}
				value={epsWatched}
			/>
		</div>
	</div>
)

export default EditGenerals
