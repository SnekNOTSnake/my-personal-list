import React, { useState } from 'react'
import styles from './EditAnimeDetails.module.css'

type Props = { setTags: (tags: string[]) => any; tagsI: string[] }

const EditTags: React.FC<Props> = ({ setTags, tagsI }) => {
	const [tagInput, setTagInput] = useState('')
	const onTagChange = (e: InputChange) => setTagInput(e.target.value)

	const onTagSubmit = (e: InputKeyPress) => {
		if (e.key === 'Enter') {
			e.preventDefault()

			const newTag = e.currentTarget.value
			if (['untagged'].includes(newTag)) return
			if (tagsI.includes(newTag)) return

			setTags([...tagsI, newTag])
			setTagInput('')
		}
	}

	const onTagRemove = (tag: string) => {
		const index = tagsI.findIndex((el) => el === tag)
		if (index < 0) return

		const newTags = [...tagsI]
		newTags.splice(index, 1)

		setTags(newTags)
	}

	return (
		<div className={[styles.labeledInput, styles.tags].join(' ')}>
			<div className={styles.label}>Add tags</div>
			<input
				type='text'
				onKeyPress={onTagSubmit}
				value={tagInput}
				onChange={onTagChange}
			/>
			<ul>
				{tagsI.map((tag) => (
					<li key={tag} onClick={() => onTagRemove(tag)}>
						{tag}
					</li>
				))}
			</ul>
		</div>
	)
}

export default EditTags
