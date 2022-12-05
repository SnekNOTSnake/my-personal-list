import React, { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { seriesState } from '@/store/series'
import styles from './AnimeEdit.module.css'

type Props = {
	relatedI: Relation[]
	setRelatedI: (related: Relation[]) => any
	data: Series
}

const EditRelations: React.FC<Props> = ({ relatedI, setRelatedI, data }) => {
	const series = useRecoilValue(seriesState)

	const [focused, setFocused] = useState(false)

	const [relatedInput, setRelatedInput] = useState('')
	const onRelatedChange = (e: InputChange) => setRelatedInput(e.target.value)

	const [relatedType, setRelatedType] = useState('sequel')
	const onRelTypeChange = (e: SelectChange) => setRelatedType(e.target.value)

	const localFilteredSeries = useMemo(() => {
		const filtered = series.filter((el) => {
			if (el.path === data.path) return false
			if (relatedI.some((relatedAnime) => relatedAnime.path === el.path))
				return false
			return el.path.toLowerCase().startsWith(relatedInput.toLowerCase())
		})

		filtered.sort((a, b) => a.path.localeCompare(b.path))
		filtered.slice(0, 10)

		return filtered
	}, [series, relatedInput, relatedI])

	const onAddRelation = (path: string) => {
		setRelatedI([...relatedI, { path, type: relatedType as any }])
	}

	const onRemoveRelation = (path: string) => {
		const index = relatedI.findIndex((el) => el.path === path)
		if (index < 0) return relatedI

		const newRelations = [...relatedI]
		newRelations.splice(index, 1)

		setRelatedI(newRelations)
	}

	return (
		<div className={[styles.labeledInput, styles.relations].join(' ')}>
			<div className={styles.label}>Add relations</div>
			<div className={styles.relationInput}>
				<select className={styles.relationType} onChange={onRelTypeChange}>
					<option value='sequel'>Sequel</option>
					<option value='prequel'>Prequel</option>
					<option value='side-story'>Side Story</option>
					<option value='spin-off'>Spin Off</option>
					<option value='parent'>Parent</option>
					<option value='summary'>Summary</option>
					<option value='alternative-version'>Alternative Version</option>
				</select>
				<div className={styles.input}>
					<input
						value={relatedInput}
						onChange={onRelatedChange}
						type='text'
						onFocus={() => setFocused(true)}
						onBlur={() => setTimeout(() => setFocused(false), 100)}
					/>
					<div
						className={[
							styles.seriesPopover,
							focused ? styles.active : '',
						].join(' ')}
					>
						<ul>
							{localFilteredSeries.map((el) => (
								<li onClick={() => onAddRelation(el.path)} key={el.path}>
									{el.path}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<ul className={styles.titles}>
				{relatedI.map((series, i) => (
					<li key={series.path || i}>
						<div onClick={() => onRemoveRelation(series.path)}>
							<div className={styles.relatedType}>{series.type}</div>
							<div className={styles.relatedName}>{series.path}</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default EditRelations
