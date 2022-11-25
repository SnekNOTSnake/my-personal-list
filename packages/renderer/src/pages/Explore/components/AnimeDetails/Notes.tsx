import React from 'react'
import styles from './AnimeDetails.module.css'

type Props = { data: Series }

const Notes: React.FC<Props> = ({ data }) => (
	<div className={styles.notes}>
		<pre>{data.notes}</pre>
	</div>
)

export default Notes
