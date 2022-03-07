import React from 'react'

import Navigation from '../Navigation'
import styles from './Layout.module.css'

const Layout: React.FC = ({ children }) => (
	<div className={styles.root}>
		<Navigation />
		<main className={styles.main}>{children}</main>
	</div>
)

export default Layout
