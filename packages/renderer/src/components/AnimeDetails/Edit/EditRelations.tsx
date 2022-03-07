import React, { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { seriesState } from '../../../recoil-states/series'
import styles from './EditAnimeDetails.module.css'

type Props = {
	relatedI: Relation[]
	setRelatedI: (related: Relation[]) => any
	data: Series
}

const EditRelations: React.FC<Props> = ({ relatedI, setRelatedI, data }) => {
	const series = useRecoilValue(seriesState)

	const [relatedInput, setRelatedInput] = useState('')
	const onRelatedChange = (e: InputChange) => setRelatedInput(e.target.value)

	const [relatedType, setRelatedType] = useState('sequel')
	const onRelTypeChange = (e: SelectChange) => setRelatedType(e.target.value)

	const localFilteredSeries = useMemo(() => {
		const filtered = series.filter((el) => {
			if (el.id === data.id) return false
			if (relatedI.some((relatedAnime) => relatedAnime.id === el.id))
				return false
			return el.title.toLowerCase().startsWith(relatedInput.toLowerCase())
		})

		filtered.sort((a, b) => a.title.localeCompare(b.title))
		filtered.slice(0, 10)

		return filtered
	}, [series, relatedInput, relatedI])

	const onAddRelation = (id: string) => {
		setRelatedI([...relatedI, { id, type: relatedType as any }])
	}

	const onRemoveRelation = (id: string) => {
		const index = relatedI.findIndex((el) => el.id === id)
		if (index < 0) return relatedI

		const newRelations = [...relatedI]
		newRelations.splice(index, 1)

		setRelatedI(newRelations)
	}

	return (
		<div className={[styles.labeledInput, styles.relations].join(' ')}>
			<div className={styles.label}>Add relations</div>
			<div className={styles.relationInput}>
				<input value={relatedInput} onChange={onRelatedChange} type='text' />
				<div className={styles.relationType}>
					<select onChange={onRelTypeChange}>
						<option value='sequel'>Sequel</option>
						<option value='prequel'>Prequel</option>
						<option value='side-story'>Side Story</option>
						<option value='spin-off'>Spin Off</option>
						<option value='parent'>Parent</option>
						<option value='summary'>Summary</option>
						<option value='alternative-version'>Alternative Version</option>
					</select>
				</div>
				<div
					tabIndex={0 /* Allow div focus */}
					className={styles.seriesPopover}
				>
					<ul>
						{localFilteredSeries.map((el) => (
							<li onClick={() => onAddRelation(el.id)} key={el.id}>
								{el.title}
							</li>
						))}
					</ul>
				</div>
			</div>
			<ul className={styles.titles}>
				{relatedI.map((series) => (
					<li key={series.id}>
						<div onClick={() => onRemoveRelation(series.id)}>
							<div className={styles.relatedType}>{series.type}</div>
							<div className={styles.relatedName}>{series.id}</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default EditRelations
