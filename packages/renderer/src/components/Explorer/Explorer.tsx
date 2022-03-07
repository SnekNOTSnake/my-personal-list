import React from 'react'

import LeftExplorer from './Left/LeftExplorer'
import RightExplorer from './Right/RightExplorer'
import styles from './Explorer.module.css'

const Explorer: React.FC = () => (
	<div className={styles.root}>
		<LeftExplorer />
		<RightExplorer />
	</div>
)

export default Explorer
