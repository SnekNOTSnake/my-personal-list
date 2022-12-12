import React from 'react'

import Loading from '../Loading'
import Navigation from '../Navigation'
import styles from './Layout.module.css'

type Props = { children?: React.ReactNode }

const Layout: React.FC<Props> = ({ children }) => (
	<div className={styles.layout}>
		<React.Suspense fallback={<Loading />}>
			<Navigation />
			<main className={styles.main}>{children}</main>
		</React.Suspense>
	</div>
)

export default Layout
