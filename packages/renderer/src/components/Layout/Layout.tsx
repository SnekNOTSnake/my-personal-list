import React from 'react'

import Navigation from '../Navigation'
import styles from './Layout.module.css'

type Props = { children?: React.ReactNode }

const Layout: React.FC<Props> = ({ children }) => (
	<div className={styles.root}>
		<React.Suspense fallback={<div>Loading...</div>}>
			<Navigation />
			<main className={styles.main}>{children}</main>
		</React.Suspense>
	</div>
)

export default Layout
