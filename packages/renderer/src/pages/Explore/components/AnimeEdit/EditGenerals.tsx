import React from 'react'

import styles from './AnimeEdit.module.css'

type Props = {
	generalInfo: {
		title: string
		epsNum: number
		epsWatched: number
		rewatchCount: number
		regular: boolean
	}
	onInputChange: (e: InputChange | TextAreaChange) => any
}

const EditGenerals: React.FC<Props> = ({
	generalInfo: { epsNum, epsWatched, rewatchCount, title, regular },
	onInputChange,
}) => (
	<div>
		<div className={styles.numberInputs}>
			<div className={styles.labeledInput}>
				<div className={styles.label}>Title</div>
				<input
					type='text'
					name='title'
					onChange={onInputChange}
					value={title}
				/>
			</div>
			<div className={styles.labeledInput}>
				<div className={styles.label}>Regular Series</div>
				<input
					className={styles.regular}
					type='checkbox'
					checked={regular}
					onChange={onInputChange}
					name='regular'
				/>
			</div>
		</div>
		<div className={styles.numberInputs}>
			<div className={styles.labeledInput}>
				<div className={styles.label}>Number of Episodes</div>
				<input
					type='number'
					name='epsNum'
					onChange={onInputChange}
					value={epsNum}
				/>
			</div>
			<div className={styles.labeledInput}>
				<div className={styles.label}>Watched episodes</div>
				<input
					type='number'
					name='epsWatched'
					onChange={onInputChange}
					value={epsWatched}
				/>
			</div>
			<div className={styles.labeledInput}>
				<div className={styles.label}>Rewatch count</div>
				<input
					type='number'
					name='rewatchCount'
					onChange={onInputChange}
					value={rewatchCount}
				/>
			</div>
		</div>
	</div>
)

export default EditGenerals
