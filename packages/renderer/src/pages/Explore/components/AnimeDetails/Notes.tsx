import React from 'react'
import styles from './AnimeDetails.module.css'

type Props = { data: Series }

const Notes: React.FC<Props> = ({ data }) => (
	<div className={styles.notes}>
		<p>{data.notes}</p>
	</div>
)

export default Notes
