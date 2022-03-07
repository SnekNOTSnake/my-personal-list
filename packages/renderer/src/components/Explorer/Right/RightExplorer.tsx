import React from 'react'
import { MdSearch, MdOutlineExpandMore } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'
import { NavLink } from 'react-router-dom'

import { filteredSeries, seriesFilter } from '../../../recoil-states/series'
import styles from './RightExplorer.module.css'

const RightExplorer: React.FC = () => {
	const series = useRecoilValue(filteredSeries)
	const [filter, setFilter] = useRecoilState(seriesFilter)

	const onSearchChange = (e: InputChange) => {
		setFilter((prevVal) => ({ ...prevVal, query: e.target.value }))
	}

	const onOrderByChange = (e: SelectChange) => {
		setFilter((prevVal) => ({
			...prevVal,
			order: { ...prevVal.order, by: e.target.value as any },
		}))
	}

	const onAscDescClick = () =>
		setFilter((prevVal) => ({
			...prevVal,
			order: { ...prevVal.order, descending: !prevVal.order.descending },
		}))

	return (
		<div className={styles.root}>
			<div className={styles.search}>
				<input
					type='search'
					placeholder='Search'
					value={filter.query}
					onChange={onSearchChange}
				/>
				<MdSearch className={styles.icon} />
			</div>
			<div className={styles.order}>
				<select value={filter.order.by} onChange={onOrderByChange}>
					<option value='title'>Title</option>
					<option value='duration'>Duration</option>
					<option value='resolution'>Resolution</option>
					<option value='epsNum'>Number of Episodes</option>
				</select>
				<MdOutlineExpandMore
					onClick={onAscDescClick}
					className={[
						styles.icon,
						...[filter.order.descending ? styles.descending : ''],
					].join(' ')}
				/>
			</div>
			<div className={styles.titles}>
				<ul>
					{series.map((el) => (
						<li key={el.id}>
							<NavLink
								className={({ isActive }) => (isActive ? styles.active : '')}
								to={`/explore/${el.id}`}
							>
								{el.title}
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.matches}>{series.length} Items</div>
		</div>
	)
}

export default RightExplorer
