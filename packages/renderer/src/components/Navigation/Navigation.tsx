import React from 'react'
import { NavLink } from 'react-router-dom'
import {
	MdOutlineSpaceDashboard,
	MdOutlineExplore,
	MdOutlineAccountCircle,
	MdOutlineEventNote,
} from 'react-icons/md'

import styles from './Navigation.module.css'

const Navigation: React.FC = () => {
	return (
		<div className={styles.root}>
			<div className={styles.menu}>
				<ul>
					<li>
						<NavLink
							className={({ isActive }) => (isActive ? styles.active : '')}
							to='/'
						>
							<MdOutlineSpaceDashboard className={styles.icon} />
						</NavLink>
					</li>
					<li>
						<NavLink
							className={({ isActive }) => (isActive ? styles.active : '')}
							to='/explore'
						>
							<MdOutlineExplore className={styles.icon} />
						</NavLink>
					</li>
					<li>
						<NavLink
							className={({ isActive }) => (isActive ? styles.active : '')}
							to='/schedule'
						>
							<MdOutlineEventNote className={styles.icon} />
						</NavLink>
					</li>
				</ul>

				<div className={styles.settings}>
					<a>
						<MdOutlineAccountCircle className={styles.icon} />
					</a>
				</div>
			</div>
		</div>
	)
}

export default Navigation
