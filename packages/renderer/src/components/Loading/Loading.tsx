import React from 'react'
import icon from '@/assets/128x128.png'
import styles from './Loading.module.css'

const Loading: React.FC = () => (
	<div className={styles.loading}>
		<div className={styles.center}>
			<img src={icon} alt='Loading' />
			<div className={styles.ripple} />
		</div>
	</div>
)

export default Loading
