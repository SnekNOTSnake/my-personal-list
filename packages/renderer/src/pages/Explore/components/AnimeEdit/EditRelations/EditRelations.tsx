import React, { useMemo, useState } from 'react'
import { MdOutlineAdd, MdOutlineDelete } from 'react-icons/md'
import { useRecoilValue } from 'recoil'

import TextField from '@/components/TextField'
import { seriesState } from '@/store/series'
import Button from '@/components/Button'
import styles from './EditRelations.module.css'

type Props = {
	relatedI: Relation[]
	setRelatedI: (related: Relation[]) => any
	data: Series
}

const EditRelations: React.FC<Props> = ({ relatedI, setRelatedI, data }) => {
	const series = useRecoilValue(seriesState)
	const [focused, setFocused] = useState(false)
	const [relatedInput, setRelatedInput] = useState('')
	const [relatedType, setRelatedType] = useState('Sequel')
	const onRelatedChange = (e: InputChange) => setRelatedInput(e.target.value)
	const onRelTypeChange = (e: InputChange) => setRelatedType(e.target.value)

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
		<div className={styles.editRelations}>
			<div className={styles.addRelation}>
				<TextField
					label='Rel type'
					onChange={onRelTypeChange}
					value={relatedType}
				/>
				<TextField
					label='Series'
					value={relatedInput}
					onChange={onRelatedChange}
					onFocus={() => setFocused(true)}
					onBlur={() => setTimeout(() => setFocused(false), 100)}
				/>
				<Button Icon={MdOutlineAdd} />

				<div
					className={[styles.popover, focused ? styles.active : ''].join(' ')}
				>
					<ul>
						{localFilteredSeries.map((s) => (
							<li onClick={() => onAddRelation(s.path)} key={s.path}>
								{s.path}
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className={styles.titles}>
				<ul>
					{relatedI.map((r) => (
						<li key={r.path}>
							<div>{r.type}</div>
							<div>{r.path}</div>
							<Button
								onClick={() => onRemoveRelation(r.path)}
								type='button'
								Icon={MdOutlineDelete}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default EditRelations
