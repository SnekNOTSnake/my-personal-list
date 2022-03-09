import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import {
	MdOutlineSpaceDashboard,
	MdOutlineExplore,
	MdOutlineEventNote,
	MdOutlineLightMode,
	MdOutlineNightsStay,
} from 'react-icons/md'

import styles from './Navigation.module.css'
import { settingsState } from '@/store/settings'

const Navigation: React.FC = () => {
	const [{ theme }, setSettings] = useRecoilState(settingsState)
	const onChangeTheme = async () => {
		const res = await window.myAPI.changeTheme(
			theme === 'dark' ? 'light' : 'dark',
		)
		setSettings((prevVal) => ({ ...prevVal, theme: res }))
	}

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

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
					<a onClick={onChangeTheme}>
						{theme === 'dark' ? (
							<MdOutlineNightsStay className={styles.icon} />
						) : (
							<MdOutlineLightMode className={styles.icon} />
						)}
					</a>
				</div>
			</div>
		</div>
	)
}

export default Navigation
