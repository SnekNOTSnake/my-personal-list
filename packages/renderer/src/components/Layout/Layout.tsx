import React from 'react'

import Navigation from '../Navigation'
import styles from './Layout.module.css'

const Layout: React.FC = ({ children }) => (
	<div className={styles.root}>
		<React.Suspense fallback={<div>Loading...</div>}>
			<Navigation />
			<main className={styles.main}>{children}</main>
		</React.Suspense>
	</div>
)

export default Layout
