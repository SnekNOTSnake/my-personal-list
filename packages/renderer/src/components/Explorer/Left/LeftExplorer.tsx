import React from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'

import { seriesFilter, seriesStats } from '@/store/series'
import styles from './LeftExplorer.module.css'

const LeftExplorer: React.FC = () => {
	const { tags } = useRecoilValue(seriesStats)
	const [filter, setFilter] = useRecoilState(seriesFilter)

	const onClearClick = () =>
		setFilter((prev) => ({ ...prev, tags: { active: [], deactive: [] } }))

	const onTagClick = (tag: string) =>
		setFilter((prev) => {
			const aIndex = prev.tags.active.indexOf(tag)
			const dIndex = prev.tags.deactive.indexOf(tag)
			const newTags = {
				active: [...prev.tags.active],
				deactive: [...prev.tags.deactive],
			}

			if (aIndex >= 0) {
				newTags.active.splice(aIndex, 1)
				newTags.deactive.push(tag)
			} else if (dIndex >= 0) {
				newTags.deactive.splice(dIndex, 1)
			} else {
				newTags.active.push(tag)
			}

			return { ...prev, tags: newTags }
		})

	return (
		<div className={styles.left}>
			<div className={styles.clear}>
				<button onClick={onClearClick} type='button'>
					<MdDeleteOutline className={styles.icon} /> Clear
				</button>
			</div>
			<div className={styles.genres}>
				<ul>
					{tags.map((tag) => (
						<li
							className={
								filter.tags.active.includes(tag.name)
									? styles.active
									: filter.tags.deactive.includes(tag.name)
									? styles.disabled
									: ''
							}
							onClick={() => onTagClick(tag.name)}
							key={tag.name}
						>
							{tag.name} <div className={styles.grow} />{' '}
							<span>{tag.count}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default LeftExplorer
